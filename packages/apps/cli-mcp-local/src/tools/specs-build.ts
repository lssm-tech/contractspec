/**
 * specs.build tool, exposed as a ContractSpec command.
 *
 * Generates implementation files from a spec using bundle services.
 */

import { defineCommand, defineSchemaModel, installOp, type SpecRegistry } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import { buildSpec, loadWorkspaceConfig } from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';

const SpecsBuildInput = defineSchemaModel({
  name: 'SpecsBuildInput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    outputDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    overwrite: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    targets: { type: ScalarTypeEnum.String_unsecure(), isOptional: true, isArray: true },
  },
});

const SpecsBuildOutput = defineSchemaModel({
  name: 'SpecsBuildOutput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    specInfo: { type: ScalarTypeEnum.JSON(), isOptional: false },
    results: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

export function registerSpecsBuildTool(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  const cmd = defineCommand({
    meta: {
      name: 'contractspecLocal.specsBuild',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'specs', 'build'],
      description: 'Generate implementation artifacts from a spec (handlers/components/tests).',
      goal: 'Let agents bootstrap implementation scaffolding deterministically.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: SpecsBuildInput, output: SpecsBuildOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'specs.build' } },
  });

  installOp(reg, cmd, async (args) => {
    const cfg = await loadWorkspaceConfig(adapters.fs);
    const targets = (args.targets ?? []).filter(isBuildTarget);

    const result = await buildSpec(args.specPath, adapters, cfg, {
      targets: targets.length > 0 ? targets : undefined,
      outputDir: args.outputDir,
      overwrite: args.overwrite ?? false,
      dryRun: args.dryRun ?? false,
    });

    return {
      specPath: result.specPath,
      specInfo: {
        name: result.specInfo.name,
        version: result.specInfo.version,
        type: result.specInfo.specType,
        kind: result.specInfo.kind,
      },
      results: result.results,
    };
  });
}

type BuildTarget = 'handler' | 'component' | 'test';

function isBuildTarget(value: string): value is BuildTarget {
  return value === 'handler' || value === 'component' || value === 'test';
}


