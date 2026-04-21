import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesWealthSnapshotExample = defineExample({
	meta: {
		key: 'examples.wealth-snapshot',
		version: '1.0.0',
		title: 'Wealth Snapshot',
		description:
			'Wealth Snapshot mini-app for accounts, assets, liabilities, and goals',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'wealth-snapshot'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.wealth-snapshot',
	},
});

export default ExamplesWealthSnapshotExample;
export { ExamplesWealthSnapshotExample };
