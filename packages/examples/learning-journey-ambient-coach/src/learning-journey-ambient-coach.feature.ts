import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LearningJourneyAmbientCoachFeature = defineFeature({
	meta: {
		key: 'learning-journey-ambient-coach',
		version: '1.0.0',
		title: 'Learning Journey: Ambient Coach',
		description:
			'Contextual coaching track with ambient tips and follow-up actions',
		domain: 'learning-journey',
		owners: ['@examples'],
		tags: ['learning', 'coaching', 'ambient', 'journey'],
		stability: 'experimental',
	},

	docs: ['docs.learning-journey.ambient-coach'],
});
