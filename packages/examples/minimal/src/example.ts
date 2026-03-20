import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
	meta: {
		key: 'minimal',
		version: '1.0.0',
		title: 'Minimal Example',
		description:
			'Smallest end-to-end ContractSpec example with one command and one feature.',
		kind: 'template',
		visibility: 'public',
		stability: 'experimental',
		owners: ['@platform.core'],
		tags: ['minimal', 'quickstart', 'example'],
		summary: 'Single-command starter for validating the ContractSpec basics.',
	},
	docs: {
		rootDocId: 'docs.examples.minimal',
		usageDocId: 'docs.examples.minimal.usage',
	},
	entrypoints: {
		packageName: '@contractspec/example.minimal',
		feature: './minimal.feature',
		contracts: './contracts/user',
		docs: './docs',
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['specs', 'markdown'] },
		studio: { enabled: true, installable: true },
		mcp: { enabled: false },
	},
});

export default example;
