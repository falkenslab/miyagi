# ADR-026: The teacher signs in to Claude through Claude Code; miyagi keeps no token

## Decision

- With a Claude subscription, the teacher signs in through Anthropic's own flow, run by the unmodified Claude Code binary the Agent SDK ships inside miyagi (`claude auth login`, through agent-kit's `ensureClaudeAuth()` in the terminal and `startClaudeSignIn()` in the GUI). Claude Code keeps the session in `~/.claude/`; miyagi only asks it whether it's signed in (`claude auth status`, the kit's `claudeSignedIn()`).
- miyagi never asks for, captures, stores or passes a subscription token: no `claude setup-token`, no `sk-ant-oat…` pasted in the page, no `claudeCodeOAuthToken` in `~/.miyagi/config.json` (a saved one is removed on start, and the teacher told once), no `CLAUDE_CODE_OAUTH_TOKEN` taken from a workspace's `.env`.
- An API key (`sk-ant-api…`, billed per use) can still be pasted in the GUI or set as `ANTHROPIC_API_KEY`: the terms allow it.
- Claude Code stays inside miyagi: the teacher installs nothing else.

## Motivation

- Anthropic's terms for products built on the Agent SDK ([Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance), "Authentication and credential use"): developers "may not collect, store, or intermediate Claude.ai credentials or session tokens — sign-in to a Claude account must complete through Anthropic's own flow". They don't prevent "an end user from signing in to the unmodified Claude Code binary with their own Claude subscription". miyagi broke the first rule: it ran `setup-token` through the kit, captured the token and saved it, and its page asked to paste one.
- The desktop app made it urgent: a teacher who installs it has no terminal for `claude setup-token` (#48, #58).
- `claude auth login` works with plain pipes (no terminal needed): it prints Anthropic's address, opens the browser and waits for the code the page may give. A teacher already signed in to Claude Code needs nothing more: the session is shared.
- Rejected: a "get my token" button capturing `setup-token`'s output (collecting the token is what the terms forbid); asking teachers to install Claude Code separately and sign in there (a terminal install, the binary's version drifting from the SDK's, and no difference for the terms); API keys only (it would leave out the teachers whose subscription is what they have).

## Consequences

- The same terms say products built on the Agent SDK "should use API key authentication": whether a subscription signed in through Claude Code is fine for miyagi is for Anthropic to confirm. The API key path is always there.
- Tests that need Claude read the developer's own Claude Code session where it is (`CLAUDE_CONFIG_DIR` at their `~/.claude`) or an API key in their environment, never a copied token.
- Requires agent-kit with `claudeSignedIn()`, `startClaudeSignIn()` and the new `ensureClaudeAuth()`.
