// The text of a PDF copied into sources/ (#64): the hook after the kit's tools that add a file
// writes its markdown next to it, a "## Page N" heading per page, and tells the model to read
// that one. A tiny two-page PDF is written by hand; nothing calls Claude. Reads dist/.
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { installPdfText, pdfInReply } from "../../../dist/pdfText.js";

let failed = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !detail ? "" : `: ${detail}`}`);
  if (!ok) failed++;
};

/** A PDF with one line of text per page, its xref offsets computed. */
function tinyPdf(lines) {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${lines.map((_, i) => `${4 + 2 * i} 0 R`).join(" ")}] /Count ${lines.length} >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  lines.forEach((line, i) => {
    const stream = `BT /F1 12 Tf 72 720 Td (${line}) Tj ET`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + 2 * i} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  let body = "%PDF-1.4\n";
  const offsets = objects.map((object, i) => {
    const at = body.length;
    body += `${i + 1} 0 obj\n${object}\nendobj\n`;
    return at;
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  return `${body}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
}

check("the PDF in a reply", pdfInReply({ content: [{ type: "text", text: "Saved to sources/normativa/anexo 6.pdf." }] }) === "normativa/anexo 6.pdf");
check("a duplicate's PDF", pdfInReply("An identical file is already in sources/a.pdf: nothing was copied. Use that one.") === "a.pdf");
check("no PDF in a web page's reply", pdfInReply("Saved to sources/web/rules.html. Its main content is in sources/web/rules.md: read that one.") === undefined);

const sources = await mkdtemp(path.join(os.tmpdir(), "miyagi-pdftext-"));
try {
  await writeFile(path.join(sources, "anexo.pdf"), tinyPdf(["0483 Sistemas informaticos 170 5", "Segunda pagina"]), "latin1");
  const options = {};
  installPdfText(options, sources);
  const hook = options.hooks.PostToolUse[0].hooks[0];
  const call = (tool_name, text) => hook({ tool_name, tool_input: { url: "https://example.org/anexo.pdf" }, tool_response: { content: [{ type: "text", text }] } });

  const other = await call("mcp__sourceFiles__list_sources", "Saved to sources/anexo.pdf.");
  check("other tools pass untouched", JSON.stringify(other) === "{}");

  const first = await call("mcp__sourceFiles__download_to_sources", "Saved to sources/anexo.pdf.");
  const md = await readFile(path.join(sources, "anexo.md"), "utf8").catch(() => "");
  check("its markdown next to it", md.includes("## Page 1") && md.includes("## Page 2") && md.includes("0483 Sistemas informaticos 170 5"), md.slice(0, 200));
  check("with its URL", md.includes("Source: https://example.org/anexo.pdf"));
  check("the model told to read it", /sources\/anexo\.md/.test(first.hookSpecificOutput?.additionalContext ?? ""), JSON.stringify(first));

  await writeFile(path.join(sources, "anexo.md"), "kept");
  const again = await call("mcp__sourceFiles__save_to_sources", "An identical file is already in sources/anexo.pdf: nothing was copied. Use that one.");
  check("an existing markdown never overwritten", (await readFile(path.join(sources, "anexo.md"), "utf8")) === "kept" && /anexo\.md/.test(again.hookSpecificOutput?.additionalContext ?? ""));

  await writeFile(path.join(sources, "scan.pdf"), tinyPdf([""]), "latin1");
  const scan = await call("mcp__sourceFiles__request_file", "Saved to sources/scan.pdf.");
  check("a PDF without text: read it with Read", /no text/.test(scan.hookSpecificOutput?.additionalContext ?? ""), JSON.stringify(scan));

  await writeFile(path.join(sources, "broken.pdf"), "not a pdf");
  const broken = await call("mcp__sourceFiles__download_to_sources", "Saved to sources/broken.pdf.");
  check("a broken PDF doesn't break the tool", /couldn't be extracted/.test(broken.hookSpecificOutput?.additionalContext ?? ""), JSON.stringify(broken));
} finally {
  await rm(sources, { recursive: true, force: true });
}

if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("pdf text: all checks passed");
