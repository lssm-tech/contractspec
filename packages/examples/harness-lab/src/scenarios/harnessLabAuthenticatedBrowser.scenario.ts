import { defineHarnessScenario } from '@contractspec/lib.contracts-spec';

export const HARNESS_LAB_AUTH_PROFILE_KEY = 'operator';
export const HARNESS_LAB_AUTH_TEXT = 'Auth profile: operator';

export const HarnessLabAuthenticatedBrowserScenario = defineHarnessScenario({
	meta: {
		key: 'harness-lab.authenticated-browser.scenario',
		version: '1.0.0',
		title: 'Harness lab authenticated browser scenario',
		description:
			'Exercises the deterministic browser lane with a named auth storage-state profile.',
		domain: 'harness-lab',
		owners: ['@examples'],
		tags: ['harness', 'browser', 'auth', 'playwright'],
		stability: 'experimental',
	},
	target: {
		isolation: 'preview',
		allowlistedDomains: ['127.0.0.1'],
		preferredTargets: ['preview'],
	},
	allowedModes: ['deterministic-browser'],
	requiredEvidence: ['screenshot', 'dom-snapshot'],
	steps: [
		{
			key: 'open-authenticated-home',
			description: 'Load the local browser fixture with auth state',
			mode: 'deterministic-browser',
			actionClass: 'login',
			intent:
				'Confirm a named auth profile can be applied without embedding credentials in the scenario.',
			input: {
				authProfile: HARNESS_LAB_AUTH_PROFILE_KEY,
			},
			expectedEvidence: ['screenshot', 'dom-snapshot'],
		},
	],
	assertions: [
		{
			key: 'authenticated-step-completed',
			type: 'step-status',
			source: 'open-authenticated-home',
			match: 'completed',
		},
		{
			key: 'captured-authenticated-dom',
			type: 'artifact',
			source: 'dom-snapshot',
		},
	],
});
