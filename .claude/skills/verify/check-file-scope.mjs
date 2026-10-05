// Builds a session's file scope from dist/ (as agent-kit's gate gets it) and checks that the
// files holding secrets can't be read, searched or written by the agent (ADR-004), and that
// the workspace's own folders still work.
// Usage (from the repo root, after `npm run build`): node .claude/skills/verify/check-file-scope.mjs
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { toSessionConfig } = await import(pathToFileURL(path.join(root, "dist/workspace.js")).href);
const { checkFileScope } = await import(pathToFileURL(path.join(root, "node_modules/@falkenslab/agent-kit/dist/index.js")).href);

const ws = path.join(os.tmpdir(), "miyagi-check-file-scope");
const workspace = { label: "check", agent: { role: "teacher", language: "español", allowPracticeRunner: false } };
const config = toSessionConfig(ws, workspace, { mode: "guided", kind: "chat", headless: false, migrationPending: false, language: "español" });
// The scope as agent-kit builds it for a session with the knowledge_* tools (ADR-024).
const scope = {
  projectDir: config.projectDir,
  writableDirs: config.extraWritableDirs,
  readOnlyDirs: [config.sourcesDir],
  searchableDirs: [config.sourcesDir, ...config.extraWritableDirs],
  deniedPaths: config.deniedPaths,
  toolOnlyDirs: [{ dir: config.knowledgeDir, instead: "the knowledge_* tools" }],
};

const home = os.homedir();
const denied = [
  path.join(home, ".miyagi", "config.json"),
  path.join(home, ".teacher-agent", "config.json"),
  path.join(home, ".claude", ".credentials.json"),
  path.join(ws, "config.json"),
  path.join(ws, ".env"),
  // sensitivePaths(): a stopgap until agent-kit allow-lists Read and Glob (falkenslab/agent-kit#28;
  // until then Glob ignores deniedPaths, so only Read/Write/Edit/Grep are checked here).
  path.join(home, ".ssh", "id_ed25519"),
  path.join(home, ".aws", "credentials"),
  path.join(home, ".git-credentials"),
  path.join(process.env.LOCALAPPDATA ?? path.join(home, "AppData", "Local"), "Google", "Chrome", "User Data", "Default", "Cookies"),
];
const allowed = [
  ["Read", { file_path: path.join(ws, "sources", "temario.pdf") }],
  ["Write", { file_path: path.join(ws, "drafts", "tarea-1", "enunciado.html") }],
  ["Grep", { path: path.join(ws, "sources"), pattern: "RA1" }],
];

let failures = 0;
const fail = (message) => {
  failures++;
  console.log(`FAIL ${message}`);
};
for (const file of denied) {
  for (const [tool, input] of [["Read", { file_path: file }], ["Write", { file_path: file }], ["Edit", { file_path: file }]]) {
    if (!checkFileScope(scope, tool, input)) fail(`${tool} ${file} is allowed`);
  }
  if (!checkFileScope(scope, "Grep", { path: path.dirname(file), pattern: "Token" })) fail(`Grep over ${path.dirname(file)} reaches ${path.basename(file)}`);
}
for (const [tool, input] of allowed) {
  const denial = checkFileScope(scope, tool, input);
  if (denial) fail(`${tool} ${input.file_path ?? input.path} is denied: ${denial}`);
}
if (failures > 0) {
  console.log(`\n${failures} file-scope check(s) failed`);
  process.exit(1);
}
console.log(`ok   ${denied.length} files with secrets can't be read, searched or written; sources/ and drafts/ still work`);
