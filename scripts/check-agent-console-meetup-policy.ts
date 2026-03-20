#!/usr/bin/env bun

import { join, relative } from "node:path";
import { createNodeFsAdapter } from "../packages/bundles/workspace/src/adapters/fs.node";
import { createNoopLoggerAdapter } from "../packages/bundles/workspace/src/adapters/logger";
import { runPolicyChecks } from "../packages/bundles/workspace/src/services/ci-check/checks/policy";

const ROOT = join(import.meta.dirname, "..");
const SLICE_PATHS = [
	join(ROOT, "packages/examples/agent-console"),
	join(ROOT, "packages/modules/examples/src/runtime"),
	join(ROOT, "packages/apps/web-landing/src/app/(sandbox)/sandbox"),
];

async function main() {
	const fs = createNodeFsAdapter(ROOT);
	const logger = createNoopLoggerAdapter();
	const issues = await runPolicyChecks({ fs, logger }, {});
	const sliceIssues = issues.filter((issue) =>
		SLICE_PATHS.some((prefix) => issue.file.startsWith(prefix))
	);

	if (sliceIssues.length > 0) {
		console.error("Meetup slice policy violations:");
		for (const issue of sliceIssues) {
			console.error(`- ${relative(ROOT, issue.file)}: ${issue.message}`);
		}
		process.exit(1);
	}

	console.log(
		`Meetup slice policy passed for agent-console, sandbox runtime, and web sandbox (${issues.length} unrelated repo issue(s) ignored).`
	);
}

main().catch((error) => {
	console.error(
		"Failed to run the meetup slice policy check:",
		error instanceof Error ? error.message : String(error)
	);
	process.exit(2);
});
