import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { unzipSync, zipSync, type Zippable } from "fflate";
import { DraftsPathError } from "./paths.js";

/** Size and count limits of the toolbox (workspace config.json, `agent.draftsLimits`). */
export interface DraftsLimits {
  /** One download (drafts_download, each file of drafts_fetch_site), in MB. */
  downloadMB: number;
  /** Everything an unzip writes, in MB. */
  unzipMB: number;
  /** Files an unzip writes. */
  unzipFiles: number;
}

export const DEFAULT_DRAFTS_LIMITS: DraftsLimits = { downloadMB: 50, unzipMB: 200, unzipFiles: 2000 };

const MB = 1024 * 1024;

export async function listEntries(dir: string, recursive: boolean, max = 2000): Promise<{ path: string; size: number; modified: string; dir: boolean }[]> {
  const out: { path: string; size: number; modified: string; dir: boolean }[] = [];
  const walk = async (current: string): Promise<void> => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (out.length >= max) return;
      const full = path.join(current, entry.name);
      const info = await stat(full);
      out.push({ path: path.relative(dir, full).split(path.sep).join("/"), size: info.size, modified: info.mtime.toISOString().slice(0, 16), dir: entry.isDirectory() });
      if (recursive && entry.isDirectory()) await walk(full);
    }
  };
  await walk(dir);
  return out;
}

export async function copyEntry(from: string, to: string): Promise<void> {
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, errorOnExist: false, force: true });
}

export async function moveEntry(from: string, to: string): Promise<void> {
  await mkdir(path.dirname(to), { recursive: true });
  try {
    await rename(from, to);
  } catch {
    await cp(from, to, { recursive: true, force: true });
    await rm(from, { recursive: true, force: true });
  }
}

export async function deleteEntry(target: string): Promise<void> {
  await rm(target, { recursive: true, force: false });
}

/** A URL the toolbox may fetch: http or https only (never file://, data:, ftp:...). */
export function checkUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new DraftsPathError(`"${raw}" isn't a URL`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new DraftsPathError(`only http and https URLs can be downloaded (not ${url.protocol})`);
  }
  return url;
}

/** Downloads `url` to `target`, streaming, refusing past `limitMB`. */
export async function download(url: URL, target: string, limitMB: number, timeoutMs = 60_000): Promise<{ bytes: number; type: string; finalUrl: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok || !res.body) throw new Error(`the server answered ${res.status} ${res.statusText}`);
    checkUrl(res.url || url.href);
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > limitMB * MB) throw new DraftsPathError(`the file is ${(declared / MB).toFixed(1)} MB, over the ${limitMB} MB limit`);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
      bytes += chunk.length;
      if (bytes > limitMB * MB) throw new DraftsPathError(`the download passed the ${limitMB} MB limit`);
      chunks.push(chunk);
    }
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.concat(chunks));
    return { bytes, type: res.headers.get("content-type") ?? "unknown", finalUrl: res.url || url.href };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Unzips `archive` into `targetDir`. Every entry must land inside `targetDir` (zip slip),
 * and the declared sizes and the number of files are checked before anything is inflated
 * (zip bombs). Nothing is executed.
 */
export async function unzip(archive: string, targetDir: string, limits: DraftsLimits): Promise<{ files: number; bytes: number }> {
  const data = new Uint8Array(await readFile(archive));
  let files = 0;
  let bytes = 0;
  // A first pass with the filter only: it sees each entry's declared size without inflating it.
  unzipSync(data, {
    filter: (entry) => {
      const dest = path.resolve(targetDir, entry.name);
      const rel = path.relative(targetDir, dest);
      if (rel.startsWith("..") || path.isAbsolute(rel) || /^[\\/]/.test(entry.name) || /(^|[\\/])\.\.([\\/]|$)/.test(entry.name)) {
        throw new DraftsPathError(`the archive has an entry that would land outside its folder: "${entry.name}"`);
      }
      if (!entry.name.endsWith("/")) {
        files++;
        bytes += entry.originalSize;
      }
      return false;
    },
  });
  if (files > limits.unzipFiles) throw new DraftsPathError(`the archive has ${files} files, over the ${limits.unzipFiles} limit`);
  if (bytes > limits.unzipMB * MB) throw new DraftsPathError(`the archive expands to ${(bytes / MB).toFixed(1)} MB, over the ${limits.unzipMB} MB limit`);
  const entries = unzipSync(data);
  let written = 0;
  for (const [name, content] of Object.entries(entries)) {
    if (name.endsWith("/")) continue;
    written += content.length;
    if (written > limits.unzipMB * MB) throw new DraftsPathError(`the archive expands past the ${limits.unzipMB} MB limit (its sizes were wrong)`);
    const dest = path.resolve(targetDir, name);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, content);
  }
  return { files, bytes: written };
}

/** Zips the contents of `sourceDir` (its files at the archive's root) into `archive`. */
export async function zip(sourceDir: string, archive: string): Promise<{ files: number; bytes: number }> {
  const tree: Zippable = {};
  let files = 0;
  const walk = async (dir: string): Promise<void> => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (path.resolve(full) === path.resolve(archive)) continue;
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile()) {
        tree[path.relative(sourceDir, full).split(path.sep).join("/")] = new Uint8Array(await readFile(full));
        files++;
      }
    }
  };
  await walk(sourceDir);
  const out = zipSync(tree, { level: 6 });
  await mkdir(path.dirname(archive), { recursive: true });
  await writeFile(archive, out);
  return { files, bytes: out.length };
}

/** A file's real type (from its first bytes), size, image dimensions and SHA-256. */
export async function fileInfo(file: string): Promise<Record<string, string | number>> {
  const buf = await readFile(file);
  const head = buf.subarray(0, 16);
  const hex = head.toString("hex");
  const text = buf.subarray(0, 512).toString("utf8").trimStart().toLowerCase();
  let type = "binary";
  let width: number | undefined;
  let height: number | undefined;
  if (hex.startsWith("89504e47")) {
    type = "image/png";
    width = buf.readUInt32BE(16);
    height = buf.readUInt32BE(20);
  } else if (hex.startsWith("ffd8ff")) {
    type = "image/jpeg";
    for (let i = 2; i < buf.length - 9; ) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xc3) { height = buf.readUInt16BE(i + 5); width = buf.readUInt16BE(i + 7); break; }
      i += 2 + len;
    }
  } else if (hex.startsWith("47494638")) {
    type = "image/gif";
    width = buf.readUInt16LE(6);
    height = buf.readUInt16LE(8);
  } else if (hex.startsWith("52494646") && buf.subarray(8, 12).toString() === "WEBP") type = "image/webp";
  else if (hex.startsWith("25504446")) type = "application/pdf";
  else if (hex.startsWith("504b0304")) type = "application/zip";
  else if (text.startsWith("<svg") || (text.startsWith("<?xml") && text.includes("<svg"))) type = "image/svg+xml";
  else if (text.startsWith("<!doctype html") || text.startsWith("<html")) type = "text/html";
  else if (text.startsWith("<?xml")) type = "application/xml";
  else if (!buf.subarray(0, 4096).includes(0)) type = "text/plain";
  return {
    type,
    bytes: buf.length,
    ...(width !== undefined && height !== undefined ? { width, height } : {}),
    sha256: createHash("sha256").update(buf).digest("hex"),
  };
}
