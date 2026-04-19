import { describe, expect, it } from 'bun:test';
import type { AgentSpec } from '@contractspec/lib.contracts-spec/agent';
import { createSupportBotI18n } from './i18n';
import { defineSupportBot } from './spec';

function makeBaseSpec(overrides: Partial<AgentSpec> = {}): AgentSpec {
	return {
		meta: {
			key: 'support-bot.spec.test',
			version: '1.0.0',
			description: 'Support bot spec test',
			owners: ['platform'],
			tags: [],
			stability: 'experimental',
		},
		instructions: 'Handle support tickets safely.',
		tools: [{ name: 'support.resolve' }],
		...overrides,
	};
}

describe('defineSupportBot', () => {
	it('maps explicit thresholds and review config', () => {
		const spec = defineSupportBot({
			base: makeBaseSpec(),
			thresholds: {
				autoResolveMinConfidence: 0.82,
				escalationConfidenceThreshold: 0.91,
				maxIterations: 9,
			},
			review: {
				queueName: 'human-review',
				approvalWorkflow: 'support-approval',
			},
		});

		expect(spec.thresholds).toEqual({
			autoResolveMinConfidence: 0.82,
			maxIterations: 9,
		});
		expect(spec.review).toEqual({
			queueName: 'human-review',
			approvalWorkflow: 'support-approval',
		});
		expect(spec.policy?.escalation?.confidenceThreshold).toBe(0.91);
	});

	it('keeps default threshold behavior unless explicitly overridden', () => {
		const spec = defineSupportBot({
			base: makeBaseSpec({
				policy: {
					confidence: {
						min: 0.84,
					},
				},
			}),
		});

		expect(spec.thresholds).toEqual({
			autoResolveMinConfidence: 0.75,
			maxIterations: 6,
		});
		expect(spec.policy?.confidence?.min).toBe(0.84);
		expect(spec.policy?.confidence?.default).toBe(0.6);
		expect(spec.policy?.escalation?.confidenceThreshold).toBe(0.84);
	});

	it('appends localized support instructions', () => {
		const spec = defineSupportBot({
			base: makeBaseSpec({
				locale: 'fr',
			}),
		});

		expect(spec.instructions).toContain('Handle support tickets safely.');
		expect(spec.instructions).toContain(
			createSupportBotI18n('fr').t('spec.instructionsAppendix')
		);
	});
});
