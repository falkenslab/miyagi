#!/usr/bin/env node
// The teacher-agent command, after the project was renamed miyagi (v0.10.0): it runs miyagi,
// installed as this bridge package's dependency, and miyagi says the command has a new name.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

process.env.MIYAGI_LEGACY_COMMAND = "teacher-agent";
const cli = createRequire(import.meta.url).resolve("miyagi/dist/cli.js");
await import(pathToFileURL(cli).href);
