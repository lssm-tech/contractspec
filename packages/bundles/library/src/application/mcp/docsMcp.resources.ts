import {
	defineResourceTemplate,
	ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import type { DocPresentationRoute } from '@contractspec/lib.contracts-spec/docs';
import z from 'zod';
import {
	getDocById,
	getDocByRoute,
	listDocFacets,
	searchDocs,
} from './docsMcp.data';
import { resolveContractReference } from './docsMcp.reference';

const DOC_TAGS = ['docs', 'mcp'];

export function buildDocResources(routes: DocPresentationRoute[]) {
	const resources = new ResourceRegistry();
	const readDocIndex = (input: {
		query?: string;
		tag?: string;
		kind?: string;
		visibility?: string;
		limit?: number;
		offset?: number;
	}) => searchDocs(routes, input);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'docs://index{?query,tag,kind,visibility,limit,offset}',
				title: 'DocBlocks index',
				description:
					'Search and paginate ContractSpec docs by query, tag, kind, or visibility.',
				mimeType: 'application/json',
				tags: DOC_TAGS,
			},
			input: z.object({
				query: z.string().optional(),
				tag: z.string().optional(),
				kind: z.string().optional(),
				visibility: z.string().optional(),
				limit: z.coerce.number().optional(),
				offset: z.coerce.number().optional(),
			}),
			resolve: async (input) => ({
				uri: 'docs://index',
				mimeType: 'application/json',
				data: JSON.stringify(readDocIndex(input), null, 2),
			}),
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'docs://list',
				title: 'DocBlocks index (legacy alias)',
				description: 'Compatibility alias for the docs index resource.',
				mimeType: 'application/json',
				tags: DOC_TAGS,
			},
			input: z.object({}),
			resolve: async () => ({
				uri: 'docs://list',
				mimeType: 'application/json',
				data: JSON.stringify(readDocIndex({}), null, 2),
			}),
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'docs://doc/{id}',
				title: 'Doc markdown',
				description: 'Fetch a single DocBlock body by id as markdown.',
				mimeType: 'text/markdown',
				tags: DOC_TAGS,
			},
			input: z.object({ id: z.string() }),
			resolve: async ({ id }) => {
				const found = getDocById(id);
				if (!found) {
					return {
						uri: `docs://doc/${encodeURIComponent(id)}`,
						mimeType: 'text/plain',
						data: `DocBlock not found: ${id}`,
					};
				}

				return {
					uri: `docs://doc/${encodeURIComponent(id)}`,
					mimeType: 'text/markdown',
					data: found.content,
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'docs://route/{routePath}',
				title: 'Doc by route',
				description:
					'Resolve a docs route to the matching DocBlock summary and body.',
				mimeType: 'application/json',
				tags: DOC_TAGS,
			},
			input: z.object({ routePath: z.string() }),
			resolve: async ({ routePath }) => ({
				uri: `docs://route/${encodeURIComponent(routePath)}`,
				mimeType: 'application/json',
				data: JSON.stringify(
					getDocByRoute(routes, routePath) ?? {
						error: 'not_found',
						route: routePath,
					},
					null,
					2
				),
			}),
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'docs://facets',
				title: 'Docs facets',
				description:
					'Counts of available tags, kinds, and visibilities across docs.',
				mimeType: 'application/json',
				tags: DOC_TAGS,
			},
			input: z.object({}),
			resolve: async () => ({
				uri: 'docs://facets',
				mimeType: 'application/json',
				data: JSON.stringify(listDocFacets(routes), null, 2),
			}),
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate:
					'docs://contract-reference/{key}{?version,type,includeSchema}',
				title: 'Contract reference',
				description:
					'Resolve a ContractSpec surface into a docs-ready reference payload.',
				mimeType: 'application/json',
				tags: DOC_TAGS,
			},
			input: z.object({
				key: z.string(),
				version: z.string().optional(),
				type: z.string().optional(),
				includeSchema: z.coerce.boolean().optional(),
			}),
			resolve: async ({ key, version, type, includeSchema }) => ({
				uri: `docs://contract-reference/${encodeURIComponent(key)}`,
				mimeType: 'application/json',
				data: JSON.stringify(
					resolveContractReference({ key, version, type, includeSchema }),
					null,
					2
				),
			}),
		})
	);

	return resources;
}
