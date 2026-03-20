import type { HarnessScenarioSpec } from '@contractspec/lib.contracts-spec';
import type { HarnessPolicyDecision } from '../types';

const APPROVAL_REQUIRED_ACTIONS = new Set([
	'login',
	'secret-input',
	'form-submit',
	'upload',
	'download',
	'payment',
	'destructive',
	'code-exec-mutate',
]);

function isUnknownDomain(
	step: HarnessScenarioSpec['steps'][number],
	allowlistedDomains: string[] | undefined
) {
	const url = step.input?.url;
	if (typeof url !== 'string' || allowlistedDomains == null) return false;
	try {
		const hostname = new URL(url).hostname;
		return !allowlistedDomains.some((domain) => hostname === domain);
	} catch {
		return true;
	}
}

export function classifyHarnessStep(input: {
	scenario: HarnessScenarioSpec;
	step: HarnessScenarioSpec['steps'][number];
}): HarnessPolicyDecision {
	const { scenario, step } = input;

	if (step.actionClass === 'unknown') {
		return {
			verdict: 'blocked',
			requiresApproval: true,
			reasons: ['undeclared_action_class'],
		};
	}

	if (isUnknownDomain(step, scenario.target.allowlistedDomains)) {
		return {
			verdict: 'blocked',
			requiresApproval: true,
			reasons: ['unknown_domain_navigation'],
		};
	}

	if (step.mutatesState || APPROVAL_REQUIRED_ACTIONS.has(step.actionClass)) {
		return {
			verdict: 'assist',
			requiresApproval: true,
			reasons: ['mutating_or_high_impact_action'],
		};
	}

	if (
		step.actionClass === 'read' ||
		step.actionClass === 'navigate' ||
		step.actionClass === 'code-exec-read'
	) {
		return {
			verdict: 'autonomous',
			requiresApproval: false,
			reasons: ['read_only_action'],
		};
	}

	return {
		verdict: 'blocked',
		requiresApproval: true,
		reasons: ['unsupported_policy_combination'],
	};
}

export function canFallbackToVisual(input: {
	scenario: HarnessScenarioSpec;
	currentMode: string;
}) {
	return (
		input.currentMode === 'deterministic-browser' &&
		input.scenario.allowedModes.includes('visual-computer-use')
	);
}

export const HARNESS_POLICY_REPLAY_FIXTURES = [
	{
		name: 'read-only page inspection',
		scenario: {
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			steps: [
				{
					key: 'open',
					description: 'Open dashboard',
					actionClass: 'read',
					intent: 'Inspect dashboard',
					input: { url: 'https://example.test/dashboard' },
				},
			],
		},
		expected: { verdict: 'autonomous', requiresApproval: false },
	},
	{
		name: 'login requires approval',
		scenario: {
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			steps: [
				{
					key: 'login',
					description: 'Log in',
					actionClass: 'login',
					intent: 'Authenticate',
					input: { url: 'https://example.test/login' },
				},
			],
		},
		expected: { verdict: 'assist', requiresApproval: true },
	},
	{
		name: 'unknown domain navigation is blocked',
		scenario: {
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			steps: [
				{
					key: 'open',
					description: 'Open page',
					actionClass: 'navigate',
					intent: 'Navigate away',
					input: { url: 'https://evil.test/phish' },
				},
			],
		},
		expected: { verdict: 'blocked', requiresApproval: true },
	},
] satisfies Array<{
	name: string;
	scenario: Pick<HarnessScenarioSpec, 'target' | 'allowedModes' | 'steps'>;
	expected: Pick<HarnessPolicyDecision, 'verdict' | 'requiresApproval'>;
}>;
