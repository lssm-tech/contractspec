import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesKbUpdatePipelineExample = defineExample({
	meta: {
		key: 'examples.kb-update-pipeline',
		version: '1.0.0',
		title: 'Kb Update Pipeline',
		description:
			'Example: KB update automation pipeline with HITL review and auditability.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'kb-update-pipeline'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.kb-update-pipeline',
	},
});

export default ExamplesKbUpdatePipelineExample;
export { ExamplesKbUpdatePipelineExample };
