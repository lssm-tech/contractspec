/**
 * Spec validation and listing tools, exposed as ContractSpec commands.
 */

import {
  defineCommand,
  defineSchemaModel,
  installOp,
  type SpecRegistry,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import { listSpecs, validateSpec } from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';

const SpecsValidateInput = defineSchemaModel({
  name: 'SpecsValidateInput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    checkImplementation: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const SpecsValidateOutput = defineSchemaModel({
  name: 'SpecsValidateOutput',
  fields: {
    valid: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    warnings: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
  },
});

const SpecsListInput = defineSchemaModel({
  name: 'SpecsListInput',
  fields: {
    pattern: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    includeUnknown: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const SpecsListOutput = defineSchemaModel({
  name: 'SpecsListOutput',
  fields: {
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    byType: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    specs: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

export function registerSpecsTools(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  const validateSpecCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.specsValidate',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'specs', 'validate'],
      description: 'Validate a ContractSpec file (structure validation).',
      goal: 'Give agents a deterministic, local validation signal.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: SpecsValidateInput, output: SpecsValidateOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'specs-validate' } },
  });

  installOp(reg, validateSpecCmd, async (args) => {
    const result = await validateSpec(args.specPath, adapters, {});
    return {
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
    };
  });

  const listSpecsCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.specsList',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'specs', 'list'],
      description: 'List ContractSpec files in the workspace.',
      goal: 'Provide an inventory agents can reason over.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: SpecsListInput, output: SpecsListOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'specs-list' } },
  });

  installOp(reg, listSpecsCmd, async (args) => {
    const includeUnknown = args.includeUnknown ?? false;
    const specs = await listSpecs(
      { fs: adapters.fs },
      { pattern: args.pattern, type: args.type }
    );
    const filtered = includeUnknown
      ? specs
      : specs.filter((s) => s.specType !== 'unknown');

    const byType: Record<string, number> = {};
    for (const s of filtered)
      byType[s.specType] = (byType[s.specType] ?? 0) + 1;

    const items = filtered.map((s) => ({
      name: s.name,
      version: s.version,
      type: s.specType,
      file: s.filePath,
      stability: s.stability,
    }));

    return {
      total: items.length,
      byType,
      specs: items,
    };
  });
}
