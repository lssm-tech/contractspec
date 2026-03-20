import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LearningJourneyUiCoachingFeature = defineFeature({
	meta: {
		key: 'learning-journey-ui-coaching',
		version: '1.0.0',
		title: 'Learning Journey UI: Coaching',
		description:
			'Coaching UI with tip cards, engagement tracking, and multi-view navigation',
		domain: 'learning-journey',
		owners: ['@examples'],
		tags: ['learning', 'ui', 'coaching', 'tips'],
		stability: 'experimental',
	},

	docs: ['docs.examples.learning-journey-ui-coaching'],
});
