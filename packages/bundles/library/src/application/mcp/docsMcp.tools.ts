import {
	defineCommand,
	defineSchemaModel,
	installOp,
	OperationSpecRegistry,
} from '@contractspec/lib.contracts-spec';
import type { DocPresentationRoute } from '@contractspec/lib.contracts-spec/docs';
import {
	ContractReferenceInput,
	ContractReferenceOutput,
	DocsIndexInput,
	DocsIndexOutput,
} from '@contractspec/lib.contracts-spec/docs';
import { ScalarTypeEnum } from '@contractspec/lib.schema';
import {
	getDocById,
	getDocByRoute,
	listDocFacets,
	searchDocs,
} from './docsMcp.data';
import { resolveContractReference } from './docsMcp.reference';

const DOC_OWNERS = ['@contractspec'];
const DOC_TAGS = ['docs', 'mcp'];

const DocsGetInput = defineSchemaModel({
	name: 'DocsGetInput',
	fields: {
		id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const DocsGetOutput = defineSchemaModel({
	name: 'DocsGetOutput',
	fields: {
		doc: { type: ScalarTypeEnum.JSON(), isOptional: false },
		content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const DocsResolveRouteInput = defineSchemaModel({
	name: 'DocsResolveRouteInput',
	fields: {
		route: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const DocsResolveRouteOutput = defineSchemaModel({
	name: 'DocsResolveRouteOutput',
	fields: {
		doc: { type: ScalarTypeEnum.JSON(), isOptional: false },
		content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const DocsFacetsInput = defineSchemaModel({
	name: 'DocsFacetsInput',
	fields: {},
});

const DocsFacetsOutput = defineSchemaModel({
	name: 'DocsFacetsOutput',
	fields: {
		facets: { type: ScalarTypeEnum.JSON(), isOptional: false },
	},
});

export function buildDocOps(routes: DocPresentationRoute[]) {
	const registry = new OperationSpecRegistry();

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'docs.search',
				version: '1.0.0',
				stability: 'beta',
				owners: DOC_OWNERS,
				tags: DOC_TAGS,
				description:
					'Search ContractSpec docs by query, tag, kind, or visibility.',
				goal: 'Find the most relevant DocBlocks without browsing the full corpus.',
				context: 'Read-only docs MCP search surface.',
			},
			io: { input: DocsIndexInput, output: DocsIndexOutput },
			policy: { auth: 'anonymous' },
			transport: { mcp: { toolName: 'docs_search-v1_0_0' } },
		}),
		async (args) => searchDocs(routes, args)
	);

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'docs.get',
				version: '1.0.0',
				stability: 'beta',
				owners: DOC_OWNERS,
				tags: DOC_TAGS,
				description: 'Read a single DocBlock by id.',
				goal: 'Fetch the exact markdown content and metadata for a known doc id.',
				context: 'Read-only docs MCP surface.',
			},
			io: { input: DocsGetInput, output: DocsGetOutput },
			policy: { auth: 'anonymous' },
			transport: { mcp: { toolName: 'docs_get-v1_0_0' } },
		}),
		async ({ id }) => {
			const found = getDocById(id);
			if (!found) throw new Error(`DocBlock not found: ${id}`);
			return found;
		}
	);

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'docs.resolveRoute',
				version: '1.0.0',
				stability: 'beta',
				owners: DOC_OWNERS,
				tags: DOC_TAGS,
				description: 'Resolve a docs route to the matching DocBlock.',
				goal: 'Turn a route or URL path into a canonical doc id and markdown body.',
				context: 'Read-only docs MCP surface.',
			},
			io: { input: DocsResolveRouteInput, output: DocsResolveRouteOutput },
			policy: { auth: 'anonymous' },
			transport: { mcp: { toolName: 'docs_resolve_route-v1_0_0' } },
		}),
		async ({ route }) => {
			const found = getDocByRoute(routes, route);
			if (!found) throw new Error(`Doc route not found: ${route}`);
			return found;
		}
	);

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'docs.contract.lookup',
				version: '1.0.0',
				stability: 'beta',
				owners: DOC_OWNERS,
				tags: DOC_TAGS,
				description:
					'Resolve a ContractSpec surface into a docs-ready reference payload.',
				goal: 'Get canonical docs metadata, route, and optional schema for a spec key.',
				context: 'Read-only docs MCP surface.',
			},
			io: { input: ContractReferenceInput, output: ContractReferenceOutput },
			policy: { auth: 'anonymous' },
			transport: { mcp: { toolName: 'docs_contract_reference-v1_0_0' } },
		}),
		async (args) => resolveContractReference(args)
	);

	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'docs.list.facets',
				version: '1.0.0',
				stability: 'beta',
				owners: DOC_OWNERS,
				tags: DOC_TAGS,
				description:
					'List docs taxonomy facets such as tags, kinds, and visibilities.',
				goal: 'Help agents browse the docs corpus before making targeted reads.',
				context: 'Read-only docs MCP surface.',
			},
			io: { input: DocsFacetsInput, output: DocsFacetsOutput },
			policy: { auth: 'anonymous' },
			transport: { mcp: { toolName: 'docs_list_facets-v1_0_0' } },
		}),
		async () => ({ facets: listDocFacets(routes) })
	);

	return registry;
}
