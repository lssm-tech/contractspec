import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsRuntimeServerMcpFeature = defineFeature({
	meta: {
		key: 'libs.contracts-runtime-server-mcp',
		version: '1.0.0',
		title: 'Contracts Runtime Server Mcp',
		description: 'MCP server runtime adapters for ContractSpec contracts',
		domain: 'contracts-runtime-server-mcp',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts-runtime-server-mcp'],
		stability: 'experimental',
	},
});
