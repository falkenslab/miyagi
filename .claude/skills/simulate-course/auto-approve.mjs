// Answers teacher-agent's approval requests during a sandbox simulation, and logs each one.
// ONLY for moodle-sandbox: it approves everything, so the review happens afterwards, in the
// report, from the log this writes. Runs until the session's console log says it closed.
//   node .claude/skills/simulate-course/auto-approve.mjs <workspaceDir> <consoleLog> <approvalsJsonl>
//
// A `guided` session asks through agent-kit's file channel: without a terminal it polls
// <runDir>/approval-response.txt. Each request shows up first as a pre_tool_use line for
// request_human_approval in <runDir>/transcript.jsonl.
import fs from "node:fs";
import path from "node:path";

const [workspaceDir, consoleLog, approvalsOut] = process.argv.slice(2);
if (!workspaceDir || !consoleLog || !approvalsOut) {
  throw new Error("usage: auto-approve.mjs <workspaceDir> <consoleLog> <approvalsJsonl>");
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const startedAt = Date.now();

// The session folder created after this watcher started (sessions/<timestamp>-run).
async function findRunDir() {
  const sessions = path.join(workspaceDir, "sessions");
  for (;;) {
    const dirs = fs.existsSync(sessions)
      ? fs.readdirSync(sessions).filter((d) => d.endsWith("-run")).map((d) => path.join(sessions, d))
        .filter((d) => fs.statSync(d).birthtimeMs >= startedAt - 5000)
      : [];
    if (dirs.length > 0) return dirs.sort().at(-1);
    await sleep(1000);
  }
}

const closed = () => fs.existsSync(consoleLog) && /Sesión (cerrada|interrumpida)/.test(fs.readFileSync(consoleLog, "utf-8"));

const runDir = await findRunDir();
const transcript = path.join(runDir, "transcript.jsonl");
console.log(`watching ${runDir}`);
const response = path.join(runDir, "approval-response.txt");
let logged = 0;

while (!closed()) {
  await sleep(1500);
  if (!fs.existsSync(transcript)) continue;
  const lines = fs.readFileSync(transcript, "utf-8").split("\n").filter((l) => l.includes("request_human_approval"));
  const requests = lines.filter((l) => l.includes('"pre_tool_use"')).map((l) => JSON.parse(l));
  const done = lines.filter((l) => l.includes('"post_tool_use"')).length;

  for (; logged < requests.length; logged++) {
    const request = requests[logged];
    fs.appendFileSync(approvalsOut, `${JSON.stringify({ n: logged + 1, ts: request.ts, summary: request.input?.summary })}\n`);
    console.log(`approving #${logged + 1}: ${String(request.input?.summary ?? "").slice(0, 120)}`);
  }
  // A request is pending until its post_tool_use appears. agent-kit deletes the response file
  // when it starts asking, so an answer written just before that is lost: keep (re)writing it
  // while something is pending and the file isn't there.
  if (requests.length > done && !fs.existsSync(response)) fs.writeFileSync(response, "y");
}
console.log(`session closed; ${logged} approvals answered`);
