import {
	defineCommand,
	installOp,
	type OperationSpecRegistry,
} from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import type { ContractsMcpServices } from './contractsMcpTypes';

const OWNERS = ['@contractspec'];
const TAGS = ['contracts', 'mcp', 'adoption'];

export function registerAdoptionOps(
	registry: OperationSpecRegistry,
	services: ContractsMcpServices
) {
	const SearchInput = defineSchemaModel({
		name: 'AdoptionCatalogSearchInput',
		fields: {
			query: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			family: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
			platform: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		},
	});
	const SearchOutput = defineSchemaModel({
		name: 'AdoptionCatalogSearchOutput',
		fields: {
			results: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'adoption.catalog_search',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Search the local ContractSpec adoption catalog.',
				goal: 'Find relevant ContractSpec reuse candidates for a query.',
				context: 'Contracts MCP server.',
			},
			io: { input: SearchInput, output: SearchOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ family, platform, query }) => ({
			results: await services.searchAdoptionCatalog({
				family,
				platform,
				query,
			}),
		})
	);

	const ResolveInput = defineSchemaModel({
		name: 'AdoptionResolveInput',
		fields: {
			family: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			query: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			paths: { type: ScalarTypeEnum.JSON(), isOptional: true },
			platform: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
			runtime: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		},
	});
	const ResolveOutput = defineSchemaModel({
		name: 'AdoptionResolveOutput',
		fields: {
			resolution: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'adoption.resolve',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Resolve the best adoption candidate for one family.',
				goal: 'Provide one ordered recommendation that matches Connect.',
				context: 'Contracts MCP server.',
			},
			io: { input: ResolveInput, output: ResolveOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ family, paths, platform, query, runtime }) => ({
			resolution: await services.resolveAdoption({
				family,
				paths: Array.isArray(paths) ? (paths as string[]) : undefined,
				platform,
				query,
				runtime,
			}),
		})
	);

	const SyncInput = defineSchemaModel({
		name: 'AdoptionSyncInput',
		fields: {},
	});
	const SyncOutput = defineSchemaModel({
		name: 'AdoptionSyncOutput',
		fields: {
			catalogPath: {
				type: ScalarTypeEnum.String_unsecure(),
				isOptional: false,
			},
			total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'adoption.sync',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description:
					'Mirror the bundled ContractSpec adoption catalog locally.',
				goal: 'Refresh the local adoption catalog used by Connect and MCP.',
				context: 'Contracts MCP server.',
			},
			io: { input: SyncInput, output: SyncOutput },
			policy: { auth: 'user' },
		}),
		async () => services.syncAdoptionCatalog()
	);
}
