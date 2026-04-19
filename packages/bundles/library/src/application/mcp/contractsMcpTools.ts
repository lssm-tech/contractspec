/**
 * Contract management MCP tool definitions.
 *
 * Each tool delegates to an injected service so the bundle stays
 * decoupled from bundle.workspace (apps layer does the wiring).
 */

import {
	defineCommand,
	installOp,
	OperationSpecRegistry,
} from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { registerAdoptionOps } from './contractsMcpAdoptionTools';
import type { ContractsMcpServices } from './contractsMcpTypes';

const OWNERS = ['@contractspec'];
const TAGS = ['contracts', 'mcp'];

export function buildContractsOps(services: ContractsMcpServices) {
	const registry = new OperationSpecRegistry();

	// -- contracts.list --
	const ListInput = defineSchemaModel({
		name: 'ContractsListInput',
		fields: {
			pattern: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
			type: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		},
	});
	const ListOutput = defineSchemaModel({
		name: 'ContractsListOutput',
		fields: {
			specs: { type: ScalarTypeEnum.JSON(), isOptional: false },
			total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'contracts.list',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'List contract specs in the workspace.',
				goal: 'Discover available contracts by type, pattern, or owner.',
				context: 'Contracts MCP server.',
			},
			io: { input: ListInput, output: ListOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ pattern, type }) => {
			const specs = await services.listSpecs({ pattern, type });
			return { specs, total: specs.length };
		}
	);

	// -- contracts.get --
	const GetInput = defineSchemaModel({
		name: 'ContractsGetInput',
		fields: {
			path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		},
	});
	const GetOutput = defineSchemaModel({
		name: 'ContractsGetOutput',
		fields: {
			content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			info: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'contracts.get',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Read a single contract spec file.',
				goal: 'Fetch spec content and parsed metadata.',
				context: 'Contracts MCP server.',
			},
			io: { input: GetInput, output: GetOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ path }) => {
			const result = await services.getSpec(path);
			if (!result) throw new Error(`Spec not found: ${path}`);
			return result;
		}
	);

	// -- contracts.validate --
	const ValidateInput = defineSchemaModel({
		name: 'ContractsValidateInput',
		fields: {
			path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		},
	});
	const ValidateOutput = defineSchemaModel({
		name: 'ContractsValidateOutput',
		fields: {
			valid: { type: ScalarTypeEnum.Boolean(), isOptional: false },
			errors: { type: ScalarTypeEnum.JSON(), isOptional: false },
			warnings: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'contracts.validate',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Validate a contract spec structure.',
				goal: 'Check spec for structural or policy issues.',
				context: 'Contracts MCP server.',
			},
			io: { input: ValidateInput, output: ValidateOutput },
			policy: { auth: 'anonymous' },
		}),
		async ({ path }) => services.validateSpec(path)
	);

	// -- contracts.build --
	const BuildInput = defineSchemaModel({
		name: 'ContractsBuildInput',
		fields: {
			path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		},
	});
	const BuildOutput = defineSchemaModel({
		name: 'ContractsBuildOutput',
		fields: {
			results: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'contracts.build',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Generate implementation code from a contract spec.',
				goal: 'Produce handler, component, or test skeletons.',
				context: 'Contracts MCP server.',
			},
			io: { input: BuildInput, output: BuildOutput },
			policy: { auth: 'user' },
		}),
		async ({ path, dryRun }) => services.buildSpec(path, { dryRun })
	);

	registerMutationTools(registry, services);
	registerAdoptionOps(registry, services);

	return registry;
}

function registerMutationTools(
	registry: OperationSpecRegistry,
	services: ContractsMcpServices
) {
	// -- contracts.update --
	const UpdateInput = defineSchemaModel({
		name: 'ContractsUpdateInput',
		fields: {
			path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			content: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
			fields: { type: ScalarTypeEnum.JSON(), isOptional: true },
		},
	});
	const UpdateOutput = defineSchemaModel({
		name: 'ContractsUpdateOutput',
		fields: {
			updated: { type: ScalarTypeEnum.Boolean(), isOptional: false },
			errors: { type: ScalarTypeEnum.JSON(), isOptional: false },
			warnings: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'contracts.update',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Update an existing contract spec.',
				goal: 'Modify spec content or individual fields with validation.',
				context: 'Contracts MCP server.',
			},
			io: { input: UpdateInput, output: UpdateOutput },
			policy: { auth: 'user' },
		}),
		async ({ path, content, fields }) =>
			services.updateSpec(path, {
				content,
				fields: Array.isArray(fields) ? (fields as unknown[]) : undefined,
			})
	);

	// -- contracts.delete --
	const DeleteInput = defineSchemaModel({
		name: 'ContractsDeleteInput',
		fields: {
			path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			clean: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		},
	});
	const DeleteOutput = defineSchemaModel({
		name: 'ContractsDeleteOutput',
		fields: {
			deleted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
			cleanedFiles: { type: ScalarTypeEnum.JSON(), isOptional: false },
			errors: { type: ScalarTypeEnum.JSON(), isOptional: false },
		},
	});
	installOp(
		registry,
		defineCommand({
			meta: {
				key: 'contracts.delete',
				version: '1.0.0',
				stability: 'beta',
				owners: OWNERS,
				tags: TAGS,
				description: 'Delete a contract spec and optionally its artifacts.',
				goal: 'Remove a spec file and clean generated handlers/tests.',
				context: 'Contracts MCP server.',
			},
			io: { input: DeleteInput, output: DeleteOutput },
			policy: { auth: 'user' },
		}),
		async ({ path, clean }) => services.deleteSpec(path, { clean })
	);
}
