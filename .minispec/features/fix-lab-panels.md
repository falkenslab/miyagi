# Checking a practice asks at every lab command

Issue: [#56](https://github.com/falkenslab/miyagi/issues/56)

## Problem

Since agent-kit 0.27 asks in guided mode before any extension tool that changes something, checking a practice in a docker-lab lab (`practice-testing`) shows a "¿Dejas que docker-lab haga esto?" panel before every `lab_up`, `lab_exec` and `lab_check`: seven in a single check of the MariaDB practice (2026-10-25, the screenshot of the tutorial). The teacher can answer "Sí, en esta sesión", but the first time it looks like miyagi asks permission for every keystroke, and the docs say running a check needs no approval.

## Cause

`practice-testing` runs the lab without asking first, so no approved batch covers the calls, and docker-lab's lab tools aren't read-only (they start containers), so the kit asks for each one.

## Solution

`practice-testing` asks once, with `request_human_approval`, before running a check: which lab, what it starts (image, services, no internet unless allowed), what it will run, and that it's stopped at the end. The approved batch then covers the lab's calls until the teacher's next message; stopping a lab is still confirmed by docker-mcp itself. The docs (`avanzado/practicas-docker.md`) say a check asks once.

## Verification

In guided mode, checking a practice in a lab shows one approval and no kit panel for `lab_up`, `lab_exec` or `lab_check`; the lab is stopped at the end.
