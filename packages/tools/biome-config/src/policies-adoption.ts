import type { ContractSpecPolicyRule } from './types';

export const adoptionPolicyManifest: ContractSpecPolicyRule[] = [
	{
		id: 'repo/no-deprecated-contracts-monolith',
		audience: 'repo',
		engine: 'biome-native',
		severity: 'error',
		files: ['packages/**/*.{js,jsx,ts,tsx}'],
		message:
			'Use split ContractSpec packages instead of the deprecated monolith.',
		options: {
			paths: {
				'@contractspec/lib.contracts':
					'Use @contractspec/lib.contracts-spec and the split runtime packages instead of @contractspec/lib.contracts.',
			},
		},
		docsSource: 'packs/contractspec-rules/rules/contracts-first.md',
	},
	{
		id: 'repo/prefer-runtime-package-entrypoints',
		audience: 'repo',
		engine: 'biome-grit',
		severity: 'error',
		files: ['packages/**/*.{js,jsx,ts,tsx}'],
		message:
			'Prefer package-level ContractSpec runtime entrypoints over leaf runtime imports when the root package already exposes the needed surface.',
		options: {
			replacements: {
				'@contractspec/lib.contracts-runtime-server-mcp/provider-mcp':
					'@contractspec/lib.contracts-runtime-server-mcp',
				'@contractspec/lib.contracts-runtime-server-rest/rest-next-app':
					'@contractspec/lib.contracts-runtime-server-rest',
				'@contractspec/lib.contracts-runtime-server-graphql/graphql-pothos':
					'@contractspec/lib.contracts-runtime-server-graphql',
			},
		},
		docsSource: 'packs/workspace-specific/rules/package-architecture.md',
	},
	{
		id: 'consumer/no-deprecated-contracts-monolith',
		audience: 'consumer',
		engine: 'biome-native',
		severity: 'error',
		files: [
			'src/**/*.{js,jsx,ts,tsx}',
			'app/**/*.{js,jsx,ts,tsx}',
			'components/**/*.{js,jsx,ts,tsx}',
		],
		message:
			'Use split ContractSpec packages instead of the deprecated monolith.',
		options: {
			paths: {
				'@contractspec/lib.contracts':
					'Use @contractspec/lib.contracts-spec and the appropriate split runtime package instead of @contractspec/lib.contracts.',
			},
		},
		docsSource: 'packs/contractspec-rules/rules/contracts-first.md',
	},
	{
		id: 'consumer/prefer-contractspec-runtime-entrypoints',
		audience: 'consumer',
		engine: 'biome-grit',
		severity: 'error',
		files: [
			'src/**/*.{js,jsx,ts,tsx}',
			'app/**/*.{js,jsx,ts,tsx}',
			'components/**/*.{js,jsx,ts,tsx}',
		],
		message:
			'Prefer package-level ContractSpec runtime entrypoints before using deeper runtime leaf imports.',
		options: {
			replacements: {
				'@contractspec/lib.contracts-runtime-server-mcp/provider-mcp':
					'@contractspec/lib.contracts-runtime-server-mcp',
				'@contractspec/lib.contracts-runtime-server-rest/rest-next-app':
					'@contractspec/lib.contracts-runtime-server-rest',
				'@contractspec/lib.contracts-runtime-server-graphql/graphql-pothos':
					'@contractspec/lib.contracts-runtime-server-graphql',
			},
		},
		docsSource: 'packs/workspace-specific/rules/package-architecture.md',
	},
];
