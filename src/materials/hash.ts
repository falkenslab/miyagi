import { createHash } from "node:crypto";
import type { Material } from "./model.js";

/**
 * A material's fingerprint: SHA-256 over what it says, not how it's written (line numbers,
 * spacing and key order don't change it). Recorded with each publication, so a material edited
 * after it was published shows as changed (ADR-015).
 */
export function materialHash(material: Material): string {
  return createHash("sha256").update(JSON.stringify(canonical(material))).digest("hex").slice(0, 16);
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key, entry]) => key !== "line" && entry !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, canonical(entry)]),
    );
  }
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value;
}
