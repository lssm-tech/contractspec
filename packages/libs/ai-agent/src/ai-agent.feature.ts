import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AiAgentFeature = defineFeature({
	meta: {
		key: 'libs.ai-agent',
		version: '1.0.0',
		title: 'Ai Agent',
		description: 'AI agent orchestration with MCP and tool support',
		domain: 'ai-agent',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'ai-agent'],
		stability: 'experimental',
	},
});
