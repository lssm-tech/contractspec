import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const AlpicMcpBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.alpic-mcp',
			version: '1.0.0',
			title: 'Alpic Mcp',
			description:
				'ContractSpec package declaration for @contractspec/app.alpic-mcp.',
			domain: 'alpic-mcp',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'alpic-mcp'],
			stability: 'experimental',
		},
		appId: 'alpic-mcp',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
