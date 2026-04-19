/**
 * Contract management MCP resource and prompt definitions.
 */

import {
	definePrompt,
	defineResourceTemplate,
	PromptRegistry,
	ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import z from 'zod';
import type { ContractsMcpServices } from './contractsMcpTypes';

const OWNERS = ['@contractspec'];
const TAGS = ['contracts', 'mcp'];

export function buildContractsResources(services: ContractsMcpServices) {
	const resources = new ResourceRegistry();

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'contracts://list',
				title: 'Contract specs list',
				description: 'JSON list of all contract specs in the workspace.',
				mimeType: 'application/json',
				tags: TAGS,
			},
			input: z.object({}),
			resolve: async () => {
				const specs = await services.listSpecs();
				return {
					uri: 'contracts://list',
					mimeType: 'application/json',
					data: JSON.stringify(specs, null, 2),
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'contracts://spec/{path}',
				title: 'Contract spec content',
				description: 'Read a single contract spec file by path.',
				mimeType: 'text/plain',
				tags: TAGS,
			},
			input: z.object({ path: z.string() }),
			resolve: async ({ path }) => {
				const result = await services.getSpec(path);
				if (!result) {
					return {
						uri: `contracts://spec/${encodeURIComponent(path)}`,
						mimeType: 'text/plain',
						data: `Spec not found: ${path}`,
					};
				}
				return {
					uri: `contracts://spec/${encodeURIComponent(path)}`,
					mimeType: 'text/plain',
					data: result.content,
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'contracts://registry/manifest',
				title: 'Remote registry manifest',
				description: 'Contract registry manifest from the remote server.',
				mimeType: 'application/json',
				tags: TAGS,
			},
			input: z.object({}),
			resolve: async () => {
				const manifest = await services.fetchRegistryManifest();
				return {
					uri: 'contracts://registry/manifest',
					mimeType: 'application/json',
					data: JSON.stringify(manifest, null, 2),
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'adoption://catalog',
				title: 'ContractSpec adoption catalog',
				description:
					'Bundled ContractSpec adoption catalog used by Connect and MCP.',
				mimeType: 'application/json',
				tags: TAGS,
			},
			input: z.object({}),
			resolve: async () => {
				const results = await services.searchAdoptionCatalog({
					query: 'contractspec',
				});
				return {
					uri: 'adoption://catalog',
					mimeType: 'application/json',
					data: JSON.stringify(results, null, 2),
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'adoption://policy/{family}',
				title: 'ContractSpec adoption policy',
				description: 'Family-aware adoption recommendation and verdict policy.',
				mimeType: 'application/json',
				tags: TAGS,
			},
			input: z.object({ family: z.string() }),
			resolve: async ({ family }) => {
				const resolution = await services.resolveAdoption({
					family,
					query: family,
				});
				return {
					uri: `adoption://policy/${encodeURIComponent(family)}`,
					mimeType: 'application/json',
					data: JSON.stringify(resolution, null, 2),
				};
			},
		})
	);

	return resources;
}

export function buildContractsPrompts() {
	const prompts = new PromptRegistry();

	prompts.register(
		definePrompt({
			meta: {
				key: 'contracts.editor',
				version: '1.0.0',
				title: 'Contract editing guide',
				description:
					'Guide AI agents through reading, editing, and validating contracts.',
				tags: TAGS,
				stability: 'beta',
				owners: OWNERS,
			},
			args: [
				{
					name: 'goal',
					description: 'What the agent wants to achieve with the contract.',
					required: false,
					schema: z.string().optional(),
				},
			],
			input: z.object({ goal: z.string().optional() }),
			render: async ({ goal }) => [
				{
					type: 'text' as const,
					text: [
						'Contract editing workflow:',
						'1. Use contracts.list to discover specs',
						'2. Use contracts.get to read a spec',
						'3. Edit content and call contracts.update',
						'4. Run contracts.validate to verify changes',
						'5. Run contracts.build to regenerate artifacts',
						'6. Use adoption.resolve to prefer existing workspace or ContractSpec surfaces before inventing new ones',
						goal ? `Agent goal: ${goal}` : '',
					]
						.filter(Boolean)
						.join('\n'),
				},
				{
					type: 'resource' as const,
					uri: 'contracts://list',
					title: 'Available contracts',
				},
			],
		})
	);

	return prompts;
}
