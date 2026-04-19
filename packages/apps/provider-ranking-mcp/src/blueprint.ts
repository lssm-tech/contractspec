import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ProviderRankingMcpBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.provider-ranking-mcp',
			version: '1.0.0',
			title: 'Provider Ranking Mcp',
			description:
				'ContractSpec package declaration for @contractspec/app.provider-ranking-mcp.',
			domain: 'provider-ranking-mcp',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'provider-ranking-mcp'],
			stability: 'experimental',
		},
		appId: 'provider-ranking-mcp',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
