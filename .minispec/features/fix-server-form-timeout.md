# A server's confirmation form expires unanswered

Issue: [#92](https://github.com/falkenslab/miyagi/issues/92)

## Problem

Stopping a lab asks for confirmation through a form. In two attempts the tool came back with `The person couldn't be asked (MCP error -32001: Request timed out)` and refused the action, so a teacher who takes a while to answer gets a refusal they didn't give.

## Cause

Not confirmed. The timeout is on the request docker-mcp sends to ask the person; how long the form had been open wasn't measured, and the limit that applies still has to be found (MCP's client default, agent-kit's handler or the server). Separately, the runs where the tool reported «said no» were the test script's fault: it submitted the form without ticking the box.

## Solution

Pending, tracked in https://github.com/falkenslab/docker-mcp/issues/10. A form the teacher can see must not expire while it's waiting; if it has a limit, the panel must close and say so.

## Verification

Pending. Open a lab-stop form, wait several minutes, confirm it, and check that the lab stops.
