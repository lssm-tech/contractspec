import { defineHarnessScenario } from "@contractspec/lib.contracts-spec";

export const HARNESS_LAB_BROWSER_PARTICIPANT_NAME = "Grace Hopper";
export const HARNESS_LAB_BROWSER_RESULT_TEXT = `Welcome, ${HARNESS_LAB_BROWSER_PARTICIPANT_NAME}.`;
export const HARNESS_LAB_BROWSER_READY_TITLE = `Harness Lab | Ready for ${HARNESS_LAB_BROWSER_PARTICIPANT_NAME}`;

export const HarnessLabBrowserScenario = defineHarnessScenario({
	meta: {
		key: "harness-lab.browser.scenario",
		version: "1.0.0",
		title: "Harness lab browser scenario",
		description:
			"Exercises the deterministic browser lane against a tiny local fixture with screenshot and DOM evidence.",
		domain: "harness-lab",
		owners: ["@examples"],
		tags: ["harness", "browser", "playwright"],
		stability: "experimental",
	},
	target: {
		isolation: "preview",
		allowlistedDomains: ["127.0.0.1"],
		preferredTargets: ["preview"],
	},
	allowedModes: ["deterministic-browser"],
	requiredEvidence: ["screenshot", "dom-snapshot"],
	steps: [
		{
			key: "open-home",
			description: "Load the local browser fixture",
			mode: "deterministic-browser",
			actionClass: "navigate",
			intent:
				"Confirm the preview target loads and produces baseline screenshot and DOM evidence.",
			expectedEvidence: ["screenshot", "dom-snapshot"],
		},
		{
			key: "submit-name",
			description: "Fill the participant name and confirm the result",
			mode: "deterministic-browser",
			actionClass: "form-submit",
			intent:
				"Perform one fill action and one click action to produce a deterministic DOM transition.",
			mutatesState: true,
			input: {
				actions: [
					{
						type: "fill",
						selector: "#participant-name",
						value: HARNESS_LAB_BROWSER_PARTICIPANT_NAME,
					},
					{
						type: "click",
						selector: "#confirm",
					},
				],
			},
			expectedEvidence: ["screenshot", "dom-snapshot"],
		},
	],
	assertions: [
		{
			key: "captured-screenshot-evidence",
			type: "artifact",
			source: "screenshot",
		},
		{
			key: "captured-dom-snapshot-evidence",
			type: "artifact",
			source: "dom-snapshot",
		},
		{
			key: "captured-two-screenshots",
			type: "count",
			source: "screenshot",
			match: 2,
		},
		{
			key: "captured-two-dom-snapshots",
			type: "count",
			source: "dom-snapshot",
			match: 2,
		},
		{
			key: "submit-step-completed",
			type: "step-status",
			source: "submit-name",
			match: "completed",
		},
		{
			key: "final-title-matches",
			type: "text-match",
			source: "submit-name",
			match: `Ready for ${HARNESS_LAB_BROWSER_PARTICIPANT_NAME}`,
		},
	],
});
