import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyCrmOnboardingExample = defineExample({
	meta: {
		key: 'examples.learning-journey-crm-onboarding',
		version: '1.0.0',
		title: 'Learning Journey Crm Onboarding',
		description:
			'Learning journey track that onboards users to the CRM pipeline example.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-crm-onboarding'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-crm-onboarding',
	},
});

export default ExamplesLearningJourneyCrmOnboardingExample;
export { ExamplesLearningJourneyCrmOnboardingExample };
