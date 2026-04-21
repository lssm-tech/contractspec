import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningPatternsExample = defineExample({
	meta: {
		key: 'examples.learning-patterns',
		version: '1.0.0',
		title: 'Learning Patterns',
		description:
			'Example: drills + ambient coach + quests learning patterns, powered by Learning Journey (event-driven, deterministic).',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-patterns'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-patterns',
	},
});

export default ExamplesLearningPatternsExample;
export { ExamplesLearningPatternsExample };
