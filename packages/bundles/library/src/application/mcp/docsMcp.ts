import { defaultDocRegistry } from '@contractspec/lib.contracts-spec/docs';
import { appLogger } from '../../infrastructure/elysia/logger';
import { createMcpElysiaHandler } from './common';
import { buildDocPrompts } from './docsMcp.prompts';
import { buildDocResources } from './docsMcp.resources';
import { buildDocOps } from './docsMcp.tools';

interface DocsMcpHandlerOptions {
	includePresentations?: boolean;
}

export function createDocsMcpHandler(
	path = '/api/mcp/docs',
	options: DocsMcpHandlerOptions = {}
) {
	const routes = defaultDocRegistry.list();

	return createMcpElysiaHandler({
		logger: appLogger,
		path,
		serverName: 'contractspec-docs-mcp',
		ops: buildDocOps(routes),
		resources: buildDocResources(routes),
		prompts: buildDocPrompts(routes),
		presentations: options.includePresentations
			? routes.map(({ descriptor }) => descriptor)
			: undefined,
	});
}
