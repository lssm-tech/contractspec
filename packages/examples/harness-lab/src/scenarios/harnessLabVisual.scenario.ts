import { defineHarnessScenario } from '@contractspec/lib.contracts-spec';

export const HARNESS_LAB_VISUAL_BASELINE_PATH =
	'./.contractspec/harness-lab/home.baseline.png';

export const HarnessLabVisualScenario = defineHarnessScenario({
	meta: {
		key: 'harness-lab.visual.scenario',
		version: '1.0.0',
		title: 'Harness lab visual baseline scenario',
		description:
			'Exercises screenshot baseline evidence for the deterministic browser lane.',
		domain: 'harness-lab',
		owners: ['@examples'],
		tags: ['harness', 'browser', 'visual'],
		stability: 'experimental',
	},
	target: {
		isolation: 'preview',
		allowlistedDomains: ['127.0.0.1'],
		preferredTargets: ['preview'],
	},
	allowedModes: ['deterministic-browser'],
	requiredEvidence: ['screenshot', 'dom-snapshot', 'visual-diff'],
	steps: [
		{
			key: 'compare-home',
			description: 'Compare the local browser fixture against a baseline',
			mode: 'deterministic-browser',
			actionClass: 'navigate',
			intent: 'Capture screenshot diff evidence for a stable local fixture.',
			input: {
				visual: {
					baselinePath: HARNESS_LAB_VISUAL_BASELINE_PATH,
					maxDiffBytes: 0,
					maxDiffRatio: 0,
					updateBaseline: true,
				},
			},
			expectedEvidence: ['screenshot', 'dom-snapshot', 'visual-diff'],
		},
	],
	assertions: [
		{
			key: 'visual-step-completed',
			type: 'step-status',
			source: 'compare-home',
			match: 'completed',
		},
		{
			key: 'visual-diff-passed',
			type: 'visual-diff',
			match: { maxDiffBytes: 0, maxDiffRatio: 0 },
		},
	],
});
