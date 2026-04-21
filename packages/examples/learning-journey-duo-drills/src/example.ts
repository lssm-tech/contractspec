import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyDuoDrillsExample = defineExample({
	meta: {
		key: 'examples.learning-journey-duo-drills',
		version: '1.0.0',
		title: 'Learning Journey Duo Drills',
		description:
			'Drill-based learning journey example with SRS, XP, and streak hooks.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-duo-drills'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-duo-drills',
	},
});

export default ExamplesLearningJourneyDuoDrillsExample;
export { ExamplesLearningJourneyDuoDrillsExample };
