import { defineHarnessScenario } from '@contractspec/lib.contracts-spec';

export const HarnessLabAgentBrowserScenario = defineHarnessScenario({
	meta: {
		key: 'harness-lab.agent-browser.scenario',
		version: '1.0.0',
		title: 'Harness lab agent-browser scenario',
		description:
			'Exercises the visual computer-use lane through the optional agent-browser CLI.',
		domain: 'harness-lab',
		owners: ['@examples'],
		tags: ['harness', 'browser', 'agent-browser'],
		stability: 'experimental',
	},
	target: {
		isolation: 'preview',
		allowlistedDomains: ['127.0.0.1'],
		preferredTargets: ['preview'],
	},
	allowedModes: ['visual-computer-use'],
	requiredEvidence: ['screenshot', 'accessibility-snapshot'],
	steps: [
		{
			key: 'inspect-home',
			description: 'Inspect the local browser fixture with agent-browser',
			mode: 'visual-computer-use',
			actionClass: 'navigate',
			intent:
				'Capture visual and accessibility evidence through agent-browser.',
			expectedEvidence: ['screenshot', 'accessibility-snapshot'],
		},
	],
	assertions: [
		{
			key: 'agent-browser-step-completed',
			type: 'step-status',
			source: 'inspect-home',
			match: 'completed',
		},
		{
			key: 'agent-browser-screenshot',
			type: 'artifact',
			source: 'screenshot',
		},
		{
			key: 'agent-browser-snapshot',
			type: 'artifact',
			source: 'accessibility-snapshot',
		},
	],
});
