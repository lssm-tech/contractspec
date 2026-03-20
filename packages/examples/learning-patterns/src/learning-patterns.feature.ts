import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LearningPatternsFeature = defineFeature({
	meta: {
		key: 'learning-patterns',
		version: '1.0.0',
		title: 'Learning Patterns',
		description:
			'Learning archetypes (drills, ambient-coach, quests) via event-driven track specs',
		domain: 'learning-journey',
		owners: ['@examples'],
		tags: ['learning', 'patterns', 'archetypes', 'tracks'],
		stability: 'experimental',
	},

	telemetry: [{ key: 'learning-patterns.telemetry', version: '1.0.0' }],

	docs: [
		'docs.examples.learning-patterns.goal',
		'docs.examples.learning-patterns.reference',
	],
});
