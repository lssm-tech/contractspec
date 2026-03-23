import { Buffer } from 'node:buffer';
import type { ResourceRegistry } from '@contractspec/lib.contracts-spec/resources';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpCtxFactories } from './mcpTypes';

function mcpResourceMeta(resource: {
	meta: {
		title: string;
		description?: string;
		mimeType: string;
		tags?: string[];
	};
}) {
	return {
		title: resource.meta.title,
		description: resource.meta.description,
		mimeType: resource.meta.mimeType,
		_meta: { tags: resource.meta.tags ?? [] },
	};
}

function hasUriVariables(uriTemplate: string) {
	return uriTemplate.includes('{') && uriTemplate.includes('}');
}

export function registerMcpResources(
	server: McpServer,
	resources: ResourceRegistry,
	ctx: Pick<McpCtxFactories, 'logger' | 'resourceCtx'>
) {
	for (const resource of resources.listTemplates()) {
		ctx.logger.debug('Registering resource: ' + resource.meta.uriTemplate);

		const resolveResource = async (variables: unknown) => {
			const parsedArgs = resource.input.parse(variables ?? {});
			const out = await resource.resolve(parsedArgs, ctx.resourceCtx());

			if (typeof out.data === 'string') {
				return {
					contents: [
						{
							uri: out.uri,
							mimeType: out.mimeType ?? resource.meta.mimeType,
							text: out.data,
						},
					],
				};
			}

			return {
				contents: [
					{
						uri: out.uri,
						mimeType: out.mimeType ?? resource.meta.mimeType,
						blob: Buffer.from(out.data).toString('base64'),
					},
				],
			};
		};

		const templateHandler = async (_uri: URL, variables: unknown) =>
			resolveResource(variables);

		const staticHandler = async () => resolveResource({});

		if (hasUriVariables(resource.meta.uriTemplate)) {
			server.registerResource(
				resource.meta.uriTemplate,
				new ResourceTemplate(resource.meta.uriTemplate, { list: undefined }),
				mcpResourceMeta(resource),
				templateHandler
			);
		} else {
			server.registerResource(
				resource.meta.uriTemplate,
				resource.meta.uriTemplate,
				mcpResourceMeta(resource),
				staticHandler
			);
		}

		ctx.logger.debug('Registered resource: ' + resource.meta.uriTemplate);
	}
}
