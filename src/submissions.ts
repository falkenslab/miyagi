import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { createSdkMcpServer, tool } from "@falkenslab/agent-kit";

/**
 * Students' submitted files (#95): the classroom extension saves an activity's files here, a
 * folder per student under their alias, so the agent can read them while grading, and copies of
 * those it runs go into a `submissions/` folder of the activity's lab. They're students' work, so
 * they don't stay: the agent clears them all with `submissions_clear` when the grading ends, and
 * whatever a session left behind is cleared when the subject opens again.
 */
export function submissionsDirFor(workspaceDir: string): string {
  return path.join(workspaceDir, "submissions");
}

/** This subject's labs (`<prefix>-…`) hold their copies of students' files in `submissions/`. */
export const LAB_SUBMISSIONS = "submissions";

export async function clearSubmissions(workspaceDir: string, labs?: { dir: string; prefix: string }): Promise<void> {
  await rm(submissionsDirFor(workspaceDir), { recursive: true, force: true });
  if (!labs) return;
  const entries = await readdir(labs.dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith(`${labs.prefix}-`)) await rm(path.join(labs.dir, entry.name, LAB_SUBMISSIONS), { recursive: true, force: true });
  }
}

export const SUBMISSIONS_SERVER = "submissions";

export function createSubmissionsServer(workspaceDir: string, labs: () => { dir: string; prefix: string } | undefined) {
  return createSdkMcpServer({
    name: SUBMISSIONS_SERVER,
    version: "1.0.0",
    tools: [
      tool("submissions_clear", `Delete every student file saved to grade, permanently: the submissions folder and the \`${LAB_SUBMISSIONS}/\` folder of this subject's labs. Call it once the grading is done or the teacher stops it.`, {}, async () => {
        await clearSubmissions(workspaceDir, labs());
        return { content: [{ type: "text" as const, text: "No student file is left on this computer: the submissions folder and the labs' copies are gone." }] };
      }),
    ],
  });
}
