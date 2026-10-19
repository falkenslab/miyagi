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
- Playwright MCP, `request_manual_login`, `publishGate.ts`'s button patterns and the `browser_*` labels go with the browser path; the publish gate is the kit's, by tool name.
- What moodle-teacher can't do is fixed there, not worked around here with a browser.
- `workspace.json`, `classrooms[]` and `groups[]` are dropped: the sites are moodle-teacher's options, the workspace keeps its lock.
- Delivered by the features `extensions` (adoption) and `moodle-teacher-extension`; a Google Classroom extension, if any, lives in agent-extensions.
