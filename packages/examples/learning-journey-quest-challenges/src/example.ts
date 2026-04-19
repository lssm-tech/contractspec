import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyQuestChallengesExample = defineExample({
	meta: {
		key: 'examples.learning-journey-quest-challenges',
		version: '1.0.0',
		title: 'Learning Journey Quest Challenges',
		description: 'Time-bound quest/challenge learning journey example.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-quest-challenges'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-quest-challenges',
	},
});

export default ExamplesLearningJourneyQuestChallengesExample;
export { ExamplesLearningJourneyQuestChallengesExample };
