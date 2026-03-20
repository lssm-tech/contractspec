import { defineHarnessSuite } from '@contractspec/lib.contracts-spec';
import { AGENT_CONSOLE_MEETUP_PROOF_SCENARIO } from './meetup-proof.scenario';

export const AgentConsoleMeetupProofSuite = defineHarnessSuite({
	meta: {
		key: 'agent-console.meetup.proof-suite',
		version: '1.0.0',
		title: 'Agent console meetup proof suite',
		description:
			'Bundles the deterministic meetup walkthrough into a reusable harness suite.',
		domain: 'agent-console',
		owners: ['@agent-console-team'],
		tags: ['meetup', 'proof', 'harness-suite'],
		stability: 'experimental',
	},
	summary:
		'Runs the canonical agent-console meetup scenario and validates the final dashboard evidence.',
	tags: ['agent-console', 'meetup', 'proof'],
	scenarios: [
		{
			scenario: {
				key: AGENT_CONSOLE_MEETUP_PROOF_SCENARIO.meta.key,
				version: AGENT_CONSOLE_MEETUP_PROOF_SCENARIO.meta.version,
			},
			required: true,
			weight: 1,
		},
	],
});
