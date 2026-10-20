# ADR-021: Extensions are agent-kit's; Moodle comes with moodle-teacher

## Decision

- **The mechanism is agent-kit's** (its ADR-025, from 0.25): an extension is a Claude Code plugin, a repository is a Claude Code marketplace, installed in the agent's scope (`~/.miyagi/extensions/`) or the workspace's (`<workspace>/extensions/`), each with its lock; options are `userConfig`, secrets apart; the command is `miyagi extension …` from `runExtensionCommand()`. miyagi builds none of it and keeps only the policy: its official marketplace, its catalog topic, which capabilities its skills require.
- **The official repository is `falkenslab/agent-extensions`**, shared with the other agents on the kit; miyagi's catalog shows its extensions tagged `miyagi`. Other marketplaces are added by hand, after the kit's warning.
- **Moodle is the external extension `moodle-teacher@falkenslab`**: moodle-mcp (run with npx at an exact version), its sites, access and student-data options, and its `moodle-teacher:*` skills for doing each thing well in Moodle. miyagi has no Moodle code, no Moodle tools of its own and no `classroom_*` contract.
- **miyagi knows teaching, never a platform.** Its skills say the teaching act ("publish it hidden and ask the teacher to try it", "read the submissions") and `requires:` neutral capabilities (`lms-grading`…); the installed classroom extension's skills say how. Without one, miyagi works in `drafts/` (ADR-013).

## Motivation

- miyagi's ADR-020 designed the same mechanism; built here, padawan would copy it and security would live in two places. The kit built it on Claude Code's formats, with the probes behind it.
- moodle-mcp and moodle-teacher already exist and cover the fixed, no-click tools ADR-019 asked for, with sign-in and pseudonymised student data; a second Moodle implementation inside miyagi would mean two sets of instructions for the same thing.
- Rejected: Moodle in-process behind core `classroom_*` tools (ADR-019, ADR-014): a contract of miyagi's own to keep, for one platform, when capabilities already decouple skills from extensions; a miyagi-only repository (`falkenslab/miyagi-extensions`): the extensions serve any agent on the kit.

## Consequences

- Supersedes ADR-019 entirely, and ADR-014, ADR-016 and ADR-020 on everything the kit now does (manifest, store, lock, repositories, trust, levels, the loader's refusals, conformance tests per capability). Still miyagi's: extension and capability as words for the teacher, no community catalog or hub, and the guarantees the kit keeps for every extension (approvals, every MCP tool publishing unless read-only, secrets only to their extension, nothing about individual students in the knowledge base).
- Playwright MCP, `request_manual_login`, `--headless` and the saved Moodle password go with the browser path. `classroom.connector` says how a workspace reaches Moodle; a classroom from before is moved to moodle-teacher when it's opened in a chat, or the session works without it (there's no browser to fall back on).
- The publish gate stays miyagi's (`src/publishGate.ts`), by tool verb: moodle-teacher's `get_`/`list_` and session tools read, anything else asks in guided unless `request_human_approval` was approved just before, and `delete_`/`remove_`/`reset_`/`restore_` always ask. The kit doesn't ask for an extension's writing tools in guided (falkenslab/agent-kit#74); if it comes to, miyagi keeps only its stricter rules. The upload gate checks the GIFT of `import_questions`.
- moodle-mcp's tools that are never miyagi's (enrolments and roles, groups and their members, private messages, resetting or copying the course) are in `disallowedTools`, whatever the mode.
- miyagi's skills never name the platform (`check-neutral-skills.mjs`); the classroom prompts pair each teaching act with miyagi's skill first and moodle-teacher's after: loading only the extension's gets the job done without the criterion (e2e, `tests/2026-10-19T22-54-aula-moodle-teacher/`).
- What moodle-teacher can't do is fixed there, not worked around here with a browser.
- `workspace.json`, `classrooms[]` and `groups[]` are dropped: the sites are moodle-teacher's options, the workspace keeps its lock.
- Delivered by the features `extensions` (adoption) and `moodle-teacher-extension` (#33, #43); a Google Classroom extension, if any, lives in agent-extensions.
