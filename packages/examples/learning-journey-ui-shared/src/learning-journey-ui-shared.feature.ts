import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LearningJourneyUiSharedFeature = defineFeature({
	meta: {
		key: 'learning-journey-ui-shared',
		version: '1.0.0',
		title: 'Learning Journey UI: Shared',
		description:
			'Shared learning-journey UI components including XpBar, StreakCounter, and BadgeDisplay',
		domain: 'learning-journey',
		owners: ['@examples'],
		tags: ['learning', 'ui', 'shared', 'components'],
		stability: 'experimental',
	},

	docs: ['docs.examples.learning-journey-ui-shared'],
});
