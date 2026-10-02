# The agent can read the Claude token in ~/.miyagi/config.json

Issue: [#24](https://github.com/falkenslab/miyagi/issues/24)

## Problem

The main agent and its subagents can open `~/.miyagi/config.json` with Read, and that file holds `claudeCodeOAuthToken`. ADR-004 says secrets never reach the model; the Moodle password is protected (Playwright `secrets` and a denied `config.json`), the Claude token is not. Found while writing the docs (`docs/content/avanzado/seguridad-y-privacidad.md` avoids claiming it is protected).

## Cause

`toSessionConfig()` (`src/workspace.ts`) passes `deniedPaths: [<workspace>/config.json, <workspace>/.env]` to agent-kit's file-scope gate, which only blocks those for Read/Write/Edit/Grep. Read is allowed anywhere else, the global config included. The legacy `~/.teacher-agent/config.json` (migrated, but it may still exist) has the same token.

## Solution

- Add `globalConfigPath()` and the legacy path (`legacyGlobalConfigPath()` in `src/globalConfig.ts`) to `deniedPaths`.
- Check whether the SDK's own credentials (`~/.claude/.credentials.json` or the platform keychain) are reachable with Read too, and deny that path if it's a file.
- `docs/content/avanzado/seguridad-y-privacidad.md`: say the token is protected only once it is.

## Verification

- A check script (or a case in `verify`) that builds the session's file scope and asserts Read on `~/.miyagi/config.json` is denied.
- In a sandbox chat, ask the agent to read `~/.miyagi/config.json`: it must refuse with the gate's message.
