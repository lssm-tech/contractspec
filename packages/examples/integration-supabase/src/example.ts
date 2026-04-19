import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesIntegrationSupabaseExample = defineExample({
	meta: {
		key: 'examples.integration-supabase',
		version: '1.0.0',
		title: 'Integration Supabase',
		description:
			'Integration example - Supabase vector store + Postgres database wiring.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'integration-supabase'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.integration-supabase',
	},
});

export default ExamplesIntegrationSupabaseExample;
export { ExamplesIntegrationSupabaseExample };
