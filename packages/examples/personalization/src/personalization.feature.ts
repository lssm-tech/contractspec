import { defineFeature } from '@contractspec/lib.contracts-spec';

export const PersonalizationFeature = defineFeature({
	meta: {
		key: 'personalization',
		version: '1.0.0',
		title: 'Personalization Patterns',
		description:
			'Behavior tracking, overlay customization, and workflow extension patterns',
		domain: 'personalization',
		owners: ['@examples'],
		tags: ['personalization', 'behavior', 'overlay', 'workflow'],
		stability: 'experimental',
	},

	telemetry: [{ key: 'personalization.telemetry', version: '1.0.0' }],

	docs: [
		'docs.examples.personalization',
		'docs.examples.personalization.usage',
	],
});
