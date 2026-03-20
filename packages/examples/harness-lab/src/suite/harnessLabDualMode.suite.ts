import { defineHarnessSuite } from "@contractspec/lib.contracts-spec";
import {
	HarnessLabBrowserScenario,
	HarnessLabSandboxScenario,
} from "../scenarios";

export const HarnessLabDualModeSuite = defineHarnessSuite({
	meta: {
		key: "harness-lab.dual-mode.suite",
		version: "1.0.0",
		title: "Harness lab dual-mode suite",
		description:
			"Runs the focused sandbox and browser scenarios through one reusable harness suite.",
		domain: "harness-lab",
		owners: ["@examples"],
		tags: ["harness", "suite", "browser", "sandbox"],
		stability: "experimental",
	},
	summary:
		"Runs both the deterministic sandbox scenario and the local Playwright browser scenario.",
	tags: ["harness", "dual-mode", "example"],
	scenarios: [
		{
			scenario: {
				key: HarnessLabSandboxScenario.meta.key,
				version: HarnessLabSandboxScenario.meta.version,
			},
			required: true,
			weight: 1,
		},
		{
			scenario: {
				key: HarnessLabBrowserScenario.meta.key,
				version: HarnessLabBrowserScenario.meta.version,
			},
			required: true,
			weight: 1,
		},
	],
});
