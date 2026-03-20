import { defineHarnessScenario } from '@contractspec/lib.contracts-spec';
import { MOCK_AGENTS } from '../shared/mock-agents';
import { MOCK_RUNS } from '../shared/mock-runs';
import { MOCK_TOOLS } from '../shared/mock-tools';

export const MEETUP_AGENT_NAME = 'Paris Meetup Demo Agent';
const SEEDED_COMPLETED_RUNS = MOCK_RUNS.filter(
	(run) => run.status === 'COMPLETED'
).length;
const SUCCESS_RATE_AFTER_MEETUP_EXECUTION =
	(SEEDED_COMPLETED_RUNS + 1) / (MOCK_RUNS.length + 1);

export const AGENT_CONSOLE_MEETUP_PROOF_SCENARIO = defineHarnessScenario({
	meta: {
		key: 'agent-console.meetup.proof',
		version: '1.0.0',
		title: 'Agent console meetup proof',
		description:
			'Verifies the deterministic autonomous-agent walkthrough end-to-end.',
		domain: 'agent-console',
		owners: ['@agent-console-team'],
		tags: ['meetup', 'proof', 'autonomous-agents'],
		stability: 'experimental',
	},
	target: {
		allowlistedDomains: ['sandbox.contractspec.local'],
		isolation: 'sandbox',
	},
	allowedModes: ['code-execution'],
	steps: [
		{
			key: 'open-dashboard',
			description: 'Inspect seeded dashboard state',
			actionClass: 'code-exec-read',
			intent:
				'Confirm the local demo starts with seeded agents, tools, and runs.',
		},
		{
			key: 'create-agent',
			description: 'Create the meetup demo agent',
			actionClass: 'code-exec-mutate',
			intent: 'Add a new agent for the walkthrough.',
			mutatesState: true,
		},
		{
			key: 'activate-agent',
			description: 'Activate the meetup demo agent',
			actionClass: 'code-exec-mutate',
			intent: 'Move the new agent into an executable state.',
			mutatesState: true,
		},
		{
			key: 'execute-agent',
			description: 'Run the meetup demo agent',
			actionClass: 'code-exec-mutate',
			intent: 'Create a deterministic completed run.',
			mutatesState: true,
		},
		{
			key: 'inspect-dashboard',
			description: 'Confirm dashboard totals after execution',
			actionClass: 'code-exec-read',
			intent: 'Verify the new agent and run are visible in the demo state.',
		},
	],
	assertions: [
		{
			key: 'captured-step-summaries',
			type: 'count',
			source: 'step-summary',
			match: 5,
		},
		{
			key: 'execution-completed',
			type: 'step-status',
			source: 'execute-agent',
			match: 'completed',
		},
		{
			key: 'final-summary-mentions-meetup-agent',
			type: 'text-match',
			source: 'inspect-dashboard',
			match: MEETUP_AGENT_NAME,
		},
		{
			key: 'final-dashboard-shape',
			type: 'json-match',
			source: 'inspect-dashboard',
			match: {
				agentCount: MOCK_AGENTS.length + 1,
				runCount: MOCK_RUNS.length + 1,
				toolCount: MOCK_TOOLS.length,
				latestAgentName: MEETUP_AGENT_NAME,
				latestRunId: 'run-meetup-1',
				successRate: SUCCESS_RATE_AFTER_MEETUP_EXECUTION,
			},
		},
	],
});
