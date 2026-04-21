import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LearningJourneyDuoDrillsFeature = defineFeature({
	meta: {
		key: 'learning-journey-duo-drills',
		version: '1.0.0',
		title: 'Learning Journey: Duo Drills',
		description: 'Drill-based learning with spaced repetition, XP, and streaks',
		domain: 'learning-journey',
		owners: ['@examples'],
		tags: ['learning', 'drills', 'srs', 'gamification'],
		stability: 'experimental',
	},

	docs: ['docs.learning-journey.duo-drills'],
});
