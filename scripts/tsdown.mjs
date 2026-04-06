#!/usr/bin/env bun

import { fileURLToPath } from "node:url";

const tsdownCliPath = fileURLToPath(
	new URL("../node_modules/tsdown/dist/run.mjs", import.meta.url)
);

const processHandle = Bun.spawn(["bun", tsdownCliPath, ...process.argv.slice(2)], {
	cwd: process.cwd(),
	env: process.env,
	stdio: ["inherit", "inherit", "inherit"],
});

process.exit(await processHandle.exited);
