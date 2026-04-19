import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLocaleJurisdictionGateExample = defineExample({
	meta: {
		key: 'examples.locale-jurisdiction-gate',
		version: '1.0.0',
		title: 'Locale Jurisdiction Gate',
		description:
			'Example: enforce locale + jurisdiction + kbSnapshotId + allowed scope for assistant calls (fail-closed).',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'locale-jurisdiction-gate'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.locale-jurisdiction-gate',
	},
});

export default ExamplesLocaleJurisdictionGateExample;
export { ExamplesLocaleJurisdictionGateExample };
