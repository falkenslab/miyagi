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
// The scope as agent-kit builds it for a session with its sources and knowledge extensions
// (session.ts): Read and Glob only in the agent's folders, plus the run folder and the plugins.
const searchableDirs = [config.sourcesDir, ...config.extraWritableDirs, ...(config.extraReadableDirs ?? [])];
const pluginDir = path.join(root, "plugin");
const scope = {
  projectDir: config.projectDir,
  writableDirs: config.extraWritableDirs,
  readOnlyDirs: [config.sourcesDir],
  searchableDirs,
  deniedPaths: config.deniedPaths,
  readableDirs: searchableDirs,
  alsoReadable: [path.join(ws, "sessions", "run"), pluginDir],
  toolOnlyDirs: [{ dir: config.knowledgeDir, instead: "the knowledge_* tools" }],
};

const home = os.homedir();
const denied = [
  path.join(home, ".miyagi", "config.json"),
  path.join(home, ".teacher-agent", "config.json"),
  path.join(home, ".claude", ".credentials.json"),
  path.join(ws, "config.json"),
  path.join(ws, ".env"),
  // sensitivePaths(): denied too, on top of the kit's allow-list for Read and Glob.
  path.join(home, ".ssh", "id_ed25519"),
  path.join(home, ".aws", "credentials"),
  path.join(home, ".git-credentials"),
  path.join(process.env.LOCALAPPDATA ?? path.join(home, "AppData", "Local"), "Google", "Chrome", "User Data", "Default", "Cookies"),
];
// Outside the agent's folders (falkenslab/miyagi#42): a sibling of the workspace, the home's
// keys and documents, the workspace's own root.
const outside = [
  ["Read", { file_path: path.join(path.dirname(ws), "otra-asignatura", "notas.md") }],
  ["Read", { file_path: path.join(home, ".ssh", "config") }],
  ["Read", { file_path: path.join(ws, "instructions.md") }],
  ["Glob", { path: path.join(home, "Documents"), pattern: "**/*" }],
  ["Glob", { path: path.dirname(ws), pattern: "*" }],
];
const allowed = [
  ["Read", { file_path: path.join(ws, "sources", "temario.pdf") }],
  ["Read", { file_path: path.join(ws, "drafts", "tarea-1", "enunciado.html") }],
  ["Read", { file_path: path.join(pluginDir, "skills", "quiz-design", "SKILL.md") }],
  ["Glob", { path: path.join(ws, "sources"), pattern: "*.pdf" }],
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
for (const [tool, input] of outside) {
  if (!checkFileScope(scope, tool, input)) fail(`${tool} ${input.file_path ?? input.path} is allowed`);
}
for (const [tool, input] of allowed) {
  const denial = checkFileScope(scope, tool, input);
  if (denial) fail(`${tool} ${input.file_path ?? input.path} is denied: ${denial}`);
}
if (failures > 0) {
  console.log(`\n${failures} file-scope check(s) failed`);
  process.exit(1);
}
console.log(`ok   ${denied.length} files with secrets can't be read, searched or written, ${outside.length} reads outside the course are refused; sources/, drafts/ and plugin/ still work`);
