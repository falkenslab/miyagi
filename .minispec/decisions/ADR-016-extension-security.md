# ADR-016: Extension security

## Decision

An extension can't weaken the core's guarantees. The core always enforces:

- the approval of what students see (ADR-008), with every MCP tool of an extension treated as publishing unless the teacher confirmed it in `readOnlyTools`;
- no publishing tool of a third-party extension in autonomous mode unless enabled for it;
- secrets passed only to the extension that declares them, and a clean environment for its processes (never the whole `process.env`, which may hold `CLAUDE_CODE_OAUTH_TOKEN`);
- nothing about individual students in the knowledge base (ADR-005);
- extension skills and tool results never override the core's rules.

The loader refuses SDK hooks, `settings`, subagents with `Bash` (ADR-003), RCE-equivalent browser tools, file-scope changes, and MCP commands that fetch code at start (`npx`, `uvx`). Extensions have one of two levels: `content` (skills, commands and prompts only) or `code` (the same plus MCP servers), set by what they declare and confirmed at install with what they declare, pinned in a lock with the tree's hash, and re-confirmed when an update changes what they declare.

## Motivation

A local MCP server is a process with the teacher's permissions: miyagi can't stop it reading a file or calling a server. What it can guarantee is everything that goes through the agent, and that the code that runs is the code that was confirmed. Most teachers' extensions will be text (a region's plan template, a methodology), so that level must stay simple. Rejected: SDK hooks in extensions (shell commands on every tool call), trusting MCP `readOnlyHint` annotations, signing before there's a community.

## Consequences

- Built-in connectors may run in-process code; third-party extensions only through MCP, `node` or `python` with an entry point inside the extension and dependencies bundled.
- The catalog (`falkenslab/miyagi-extensions`) pins commit and tree hash, since tags can move; "verified" is bound to that commit.
- Network limits are declared, not enforced, until third-party MCP servers run in Docker; the confirmation says so.
- `check-extensions.mjs` keeps a malicious toy extension that tries each attack.
- Delivered by the features `extensions` (content level) and `third-party-extensions` (code level and catalog).
- Partly superseded by ADR-020: no catalog or trust tiers; the user adds non-official repositories by hand after a warning, and their extensions may bring code and run it on the host once accepted. The guarantees above still hold.
