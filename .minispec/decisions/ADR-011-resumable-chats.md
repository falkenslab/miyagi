# ADR-011: Chats are agent-kit runs, resumable from the workspace

## Decision

`teacher-agent chat` uses agent-kit's runs (its ADR-020): each chat is a run folder `sessions/<timestamp>/` in the workspace holding its session log, its transcript and the whole conversation (`conversation.jsonl`, `subagents/`, `session.json`). `--continue` resumes the latest one and `/resume` picks another from inside the chat. The session is built by an opener, run by run: the Playwright config, the MCP servers, the hooks and the publish gate (ADR-008) are bound to the run's folder.

## Motivation

Each chat started with no memory of the previous one, and the conversation was only kept by the SDK in `~/.claude/projects/`, out of the course's folder. Something agreed in one session was lost in the next unless the agent wrote it down. agent-kit 0.11 keeps the conversation in the run folder through the SDK's `SessionStore` and resumes from there, which is what this agent needed (and what the feature `conversation-resume` asked for).

## Consequences

- `run`, `ingest` and `explore` stay one-shot, in `sessions/<timestamp>-<kind>/`; only chats (folders with a `session.json`) are listed by `/resume`.
- A resumed chat reuses its run's browser profile, and never its approvals: the publish gate starts empty in every process.
- The SDK still writes its own copy under `~/.claude/projects/` (it can't be turned off while a store is in use), and the conversation in the run folder isn't redacted: `sessions/` stays in the workspace's `.gitignore`.
- `SessionStore` is `@alpha` in the SDK: an agent-kit upgrade that changes it is checked with a real `--continue` and `/resume`.
