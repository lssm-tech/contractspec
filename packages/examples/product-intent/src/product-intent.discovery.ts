import {
	OwnersEnum,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { defineProductIntentSpec } from '@contractspec/lib.contracts-spec/product-intent/spec';

export const ProductIntentDiscoverySpec = defineProductIntentSpec({
	id: 'product-intent.discovery.activation',
	meta: {
		key: 'product-intent.discovery.activation',
		version: '1.0.0',
		title: 'Product Intent Discovery',
		description:
			'Discovery contract for activation friction using transcripts, analytics signals, and generated tasks.',
		domain: 'product',
		owners: [OwnersEnum.PlatformCore],
		tags: ['product-intent', 'discovery', 'activation', 'analytics'],
		stability: StabilityEnum.Experimental,
		goal: 'Prioritize the next activation improvement with grounded evidence.',
		context:
			'Evidence is collected from interview transcripts, support tickets, and PostHog funnels before turning into task-ready outputs.',
	},
	question:
		'Which activation and onboarding friction should we prioritize next?',
	runtimeContext: {
		evidenceRoot: 'packages/examples/product-intent/evidence',
		analyticsProvider: 'posthog',
	},
	tickets: {
		tickets: [
			{
				ticketId: 'PI-101',
				title: 'Add a guided onboarding checklist',
				summary:
					'Give new users an explicit checklist after signup so they can see the next activation milestone.',
				evidenceIds: ['INT-002', 'INT-014', 'PH-dropoff-checkout'],
				acceptanceCriteria: [
					'Users see a checklist within the first session.',
					'Checklist completion is tracked in analytics.',
				],
				priority: 'high',
				tags: ['activation', 'onboarding'],
			},
		],
	},
	tasks: {
		packId: 'product-intent.discovery.activation.tasks',
		patchId: 'product-intent.discovery.activation.patch',
		overview:
			'Introduce a checklist-driven onboarding path and instrument it for activation measurement.',
		tasks: [
			{
				id: 'task-ui-checklist',
				title: 'Model the onboarding checklist surface',
				surface: ['ui', 'docs'],
				why: 'The product intent needs a visible activation guide and matching contract docs.',
				acceptance: [
					'A checklist surface is defined in contracts.',
					'Documentation explains the activation milestone mapping.',
				],
				agentPrompt:
					'Add the onboarding checklist contract surface and document the milestone states.',
			},
			{
				id: 'task-analytics-checklist',
				title: 'Track checklist completion events',
				surface: ['api', 'tests'],
				why: 'Success must be measurable after rollout.',
				acceptance: [
					'Checklist completion emits analytics events.',
					'Tests cover the event contract and payload shape.',
				],
				agentPrompt:
					'Emit activation checklist events and add test coverage for the telemetry payloads.',
				dependsOn: ['task-ui-checklist'],
			},
		],
	},
});
