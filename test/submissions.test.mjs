// Unit tests of students' submitted files (#95), on the built code in dist/. Run with `npm test`
// after `npm run build`.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { clearSubmissions, submissionsDirFor } from "../dist/submissions.js";

test("clearing removes the saved files and this subject's labs' copies, and nothing else", async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "miyagi-submissions-"));
  try {
    const ws = path.join(root, "sql");
    const labs = path.join(root, "labs");
    const put = (...parts) => {
      mkdirSync(path.dirname(path.join(...parts)), { recursive: true });
      writeFileSync(path.join(...parts), "SELECT 1;");
    };
    put(submissionsDirFor(ws), "practica-final", "A-6KTXW8", "file-1.sql");
    put(labs, "sql-practica-final", "submissions", "A-6KTXW8", "consultas.sql");
    put(labs, "sql-practica-final", "compose.yaml");
    put(labs, "otra-practica", "submissions", "A-1", "x.sql");
    await clearSubmissions(ws, { dir: labs, prefix: "sql" });
    assert.equal(existsSync(submissionsDirFor(ws)), false);
    assert.equal(existsSync(path.join(labs, "sql-practica-final", "submissions")), false);
    assert.equal(existsSync(path.join(labs, "sql-practica-final", "compose.yaml")), true, "the lab itself stays");
    assert.equal(existsSync(path.join(labs, "otra-practica", "submissions")), true, "another subject's lab isn't touched");
    await clearSubmissions(ws, { dir: path.join(root, "no-labs"), prefix: "sql" });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
