# ADR-004: Secrets never reach the model

## Decision

The Moodle password and the Claude token are kept out of the model's reach: `config.json` (plaintext password) and `.env` (token) are in `deniedPaths`, Playwright's `secrets` map replaces the password in browser tool calls, and `browser_run_code_unsafe` is in `disallowedTools`.

## Motivation

The agent reads untrusted content (Moodle pages, student submissions, forum posts). A prompt injection must not be able to read or exfiltrate credentials, or run arbitrary code (`browser_run_code_unsafe` is RCE-equivalent, per Playwright's own description).

## Consequences

Any new file holding a secret goes into `deniedPaths`. Any new browser tool is checked against this before being allowed.
