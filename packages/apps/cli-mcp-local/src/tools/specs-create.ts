/**
 * specs.create tool, exposed as a ContractSpec command.
 */

import {
  defineCommand,
  defineSchemaModel,
  installOp,
  type SpecRegistry,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import type { WorkspaceAdapters } from '../server';
import { createSpecFile } from './specs-create/create-spec-file';

const SpecsCreateInput = defineSchemaModel({
  name: 'SpecsCreateInput',
  fields: {
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    outputDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    domain: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    owners: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    stability: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    overwrite: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const SpecsCreateOutput = defineSchemaModel({
  name: 'SpecsCreateOutput',
  fields: {
    filePath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    wrote: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    code: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export function registerSpecsCreateTool(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  const cmd = defineCommand({
    meta: {
      name: 'contractspecLocal.specsCreate',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'specs', 'create'],
      description:
        'Scaffold a new spec file (operation/event/presentation/feature).',
      goal: 'Create deterministic spec skeletons that agents can refine.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: SpecsCreateInput, output: SpecsCreateOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'specs.create' } },
  });

  installOp(reg, cmd, async (args) => {
    return await createSpecFile(adapters, args);
  });
}
