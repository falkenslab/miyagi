# ADR-003: The practice runner is opt-in and Docker-only

## Decision

The only shell in the agent is the `practice-runner` subagent: off by default (`agent.allowPracticeRunner`), `run`/`chat` only, Bash for Docker inside `practice/`. The main agent never gets Bash.

## Motivation

Testing a practice (a statement, a solution, a student's submission) by running it beats trusting that it works. But Bash reaches any path, and agent-kit's file-scope hook doesn't cover it, so the risk must be contained by the teacher's opt-in and a narrow prompt.

## Consequences

Its prompt forbids installing anything, sudo, mounting beyond the practice folder or the Docker socket, and touching containers it didn't create. agent-kit's three subagent gates keep Bash away from the main agent. Don't give the main agent Bash to "simplify" it, and don't let external plugins register subagents with Bash.
