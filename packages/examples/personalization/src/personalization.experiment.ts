import type { ExperimentSpec } from '@contractspec/lib.contracts-spec/experiments/spec';
import {
	OwnersEnum,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec/ownership';

export const PersonalizationExperiment: ExperimentSpec = {
	meta: {
		key: 'personalization.experiment.overlay-copy',
		version: '1.0.0',
		title: 'Personalization Overlay Copy Experiment',
		description:
			'Tests a control onboarding copy against a personalized overlay variant.',
		domain: 'personalization',
		owners: [OwnersEnum.PlatformCore],
		tags: ['personalization', 'experiment', 'overlay'],
		stability: StabilityEnum.Experimental,
	},
	controlVariant: 'control',
	variants: [
		{
			id: 'control',
			key: 'control',
			description: 'Default onboarding copy and standard workflow.',
		},
		{
			id: 'personalized-overlay',
			key: 'personalized-overlay',
			description: 'Personalized copy with a branded theme override.',
			overrides: [
				{
					type: 'theme',
					target: 'personalization.theme.guided-onboarding',
					version: '1.0.0',
				},
				{
					type: 'workflow',
					target: 'billing.invoiceApproval',
					version: '1.0.0',
				},
			],
		},
	],
	allocation: {
		type: 'sticky',
		attribute: 'userId',
		salt: 'personalization-overlay-copy',
	},
	successMetrics: [
		{
			key: 'checklist-completion-rate',
			telemetryEvent: {
				key: 'personalization.assignment.completed',
				version: '1.0.0',
			},
			aggregation: 'count',
			target: 1,
		},
	],
	tags: ['personalization', 'experiment'],
};
