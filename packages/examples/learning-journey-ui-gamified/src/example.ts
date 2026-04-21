import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyUiGamifiedExample = defineExample({
	meta: {
		key: 'examples.learning-journey-ui-gamified',
		version: '1.0.0',
		title: 'Learning Journey Ui Gamified',
		description: 'Duolingo-style gamified learning UI for drills and quests.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-ui-gamified'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-ui-gamified',
	},
});

export default ExamplesLearningJourneyUiGamifiedExample;
export { ExamplesLearningJourneyUiGamifiedExample };
