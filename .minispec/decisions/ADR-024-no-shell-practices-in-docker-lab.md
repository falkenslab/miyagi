# ADR-024: miyagi has no shell; practices run in docker-lab's labs

## Decision

- miyagi has no shell at all: no `Bash` for the main agent nor for any subagent. The `practice-runner` subagent, `agent.allowPracticeRunner` and the workspace's `practice/` folder are gone.
- A practical activity is checked by running it in a **lab** of the docker-lab extension (docker-mcp): a folder with its `compose.yaml` and its `lab.json` check, which docker-mcp starts under a policy its server enforces (no internet unless allowed, nothing mounted outside the lab, never the Docker socket, CPU and memory limits, no new privileges) and refuses when it isn't met.
- miyagi's `practice-testing` says what to check and how to use the result, and `requires:` docker-lab's capabilities (`sandbox`, `run-and-verify`), so it's only offered when docker-lab is on; docker-lab's skills say how to build and run a lab.
- docker-mcp's tools on the computer's whole Docker (containers, images, volumes, networks, Compose projects, prune) are in `disallowedTools`, whatever the extension's mode: only labs are a teaching assistant's.
- The session makes docker-lab's labs folder writable (docker-mcp has no tool to write files); a subject's labs are named `<subject slug>-<activity>` so subjects don't share one.

## Motivation

- The practice-runner's limits were a prompt: a subagent with `Bash` told not to install, not to mount beyond its folder, not to touch the socket. A policy enforced by the program that starts the containers can't be talked out of.
- It's the same split as Moodle (ADR-021): miyagi keeps the teaching judgement, the extension the mechanics.
- Rejected: keeping the practice-runner as a fallback (a shell in the agent, however narrow); docker-lab's `full` mode for miyagi (the whole Docker of the teacher's computer is never a teaching assistant's).

## Consequences

- Supersedes ADR-003 (and the parts of ADR-016 and ADR-020 that allowed a shell for non-official extensions' code stay the kit's business, not miyagi's).
- A single container can't be limited or isolated yet in docker-mcp (`run_container`, falkenslab/docker-mcp#6): everything isolated goes through a lab, and `run_container` is blocked anyway.
- Without Docker or docker-lab, miyagi can't run anything and says so; `init` no longer asks about Docker.
- Delivered by the feature `docker-lab-practices` (#45).
