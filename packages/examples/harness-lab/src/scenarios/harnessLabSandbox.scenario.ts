import { defineHarnessScenario } from "@contractspec/lib.contracts-spec";

export const HarnessLabSandboxScenario = defineHarnessScenario({
	meta: {
		key: "harness-lab.sandbox.scenario",
		version: "1.0.0",
		title: "Harness lab sandbox scenario",
		description:
			"Exercises the code-execution harness lane with inline scripts and deterministic JSON outputs.",
		domain: "harness-lab",
		owners: ["@examples"],
		tags: ["harness", "sandbox", "code-execution"],
		stability: "experimental",
	},
	target: {
		isolation: "sandbox",
		allowlistedDomains: ["sandbox.contractspec.local"],
		preferredTargets: ["sandbox"],
	},
	allowedModes: ["code-execution"],
	requiredEvidence: ["step-summary"],
	steps: [
		{
			key: "inspect-fixture",
			description: "Inspect deterministic sandbox inputs",
			mode: "code-execution",
			actionClass: "code-exec-read",
			intent:
				"Confirm the sandbox lane resolves the expected target metadata before mutation.",
			input: {
				lane: "sandbox",
				script: `
const counters = [1, 2, 3];
return {
  baseUrl: target.baseUrl,
  domainCount: (target.allowlistedDomains ?? []).length,
  counters,
  lane: input.lane,
};
				`.trim(),
			},
			expectedEvidence: ["step-summary"],
		},
		{
			key: "mutate-fixture",
			description: "Produce a deterministic mutation summary",
			mode: "code-execution",
			actionClass: "code-exec-mutate",
			intent:
				"Run a focused mutation step and validate the structured output contract.",
			mutatesState: true,
			input: {
				label: "sandbox-lab",
				numbers: [4, 6, 8],
				script: `
const numbers = Array.isArray(input.numbers) ? input.numbers : [];
const total = numbers.reduce((sum, value) => sum + Number(value), 0);
return {
  label: input.label,
  total,
  average: numbers.length === 0 ? 0 : total / numbers.length,
  updated: true,
};
				`.trim(),
			},
			expectedEvidence: ["step-summary"],
		},
	],
	assertions: [
		{
			key: "captured-step-summaries",
			type: "count",
			source: "step-summary",
			match: 2,
		},
		{
			key: "inspect-step-completed",
			type: "step-status",
			source: "inspect-fixture",
			match: "completed",
		},
		{
			key: "mutate-step-completed",
			type: "step-status",
			source: "mutate-fixture",
			match: "completed",
		},
		{
			key: "inspect-output-matches",
			type: "json-match",
			source: "inspect-fixture",
			match: {
				baseUrl: "https://sandbox.contractspec.local/harness-lab",
				domainCount: 1,
				counters: [1, 2, 3],
				lane: "sandbox",
			},
		},
		{
			key: "mutation-output-matches",
			type: "json-match",
			source: "mutate-fixture",
			match: {
				label: "sandbox-lab",
				total: 18,
				average: 6,
				updated: true,
			},
		},
	],
});
