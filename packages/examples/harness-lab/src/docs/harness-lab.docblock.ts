import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
import { registerDocBlocks } from "@contractspec/lib.contracts-spec/docs";

const blocks: DocBlock[] = [
	{
		id: "docs.examples.harness-lab",
		title: "Harness Lab",
		summary:
			"Focused harness reference package for scenario contracts, suites, orchestration, and runtime adapters.",
		kind: "reference",
		visibility: "public",
		route: "/docs/examples/harness-lab",
		tags: ["harness", "scenario", "suite", "example"],
		body: `## Included assets
- Sandbox scenario using inline scripts through the sandboxed code-execution adapter.
- Browser scenario using a local HTTP fixture and the Playwright browser adapter.
- Dual-mode suite covering both scenarios through the evaluation runner.

## Why this package exists
- Keep the harness stack discoverable without business-domain noise.
- Show how contracts, orchestration, replay, and runtime adapters fit together.`,
	},
	{
		id: "docs.examples.harness-lab.usage",
		title: "Harness Lab Usage",
		summary:
			"How to import the focused harness contracts and run sandbox or browser evaluations.",
		kind: "usage",
		visibility: "public",
		route: "/docs/examples/harness-lab/usage",
		tags: ["harness", "usage"],
		body: `## Usage
1) Import \`HarnessLabSandboxScenario\`, \`HarnessLabBrowserScenario\`, or \`HarnessLabDualModeSuite\`.
2) Run \`runHarnessLabSandboxEvaluation()\` for the offline code-execution lane.
3) Run \`runHarnessLabBrowserEvaluation()\` for the local Playwright lane.
4) Use the replay bundle to inspect captured evidence and assertion outcomes.

## Local prerequisite
- Install Chromium with \`bunx playwright install chromium\` before running browser tests.`,
	},
	{
		id: "docs.examples.harness-lab.reference",
		title: "Harness Lab Reference",
		summary:
			"Package surfaces for the focused harness example, including scenarios, suite, and runtime helpers.",
		kind: "reference",
		visibility: "public",
		route: "/docs/examples/harness-lab/reference",
		tags: ["harness", "reference"],
		body: `## Public exports
- \`./scenarios\` exposes the sandbox and browser harness scenarios.
- \`./suite\` exposes the dual-mode harness suite.
- \`./runtime\` exposes the runnable sandbox and browser evaluation helpers.

## Runtime stack
- \`HarnessRunner\` executes steps against resolved targets.
- \`HarnessEvaluationRunner\` evaluates assertions and emits replay bundles.
- Runtime adapters come from \`@contractspec/integration.harness-runtime\`.`,
	},
];

registerDocBlocks(blocks);
