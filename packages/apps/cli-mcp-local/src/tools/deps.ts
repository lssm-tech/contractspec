/**
 * deps.analyze tool, exposed as a ContractSpec command.
 */

import { defineCommand, defineSchemaModel, installOp, type SpecRegistry } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import { analyzeDeps, exportGraphAsDot, getGraphStats } from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';

const DepsAnalyzeInput = defineSchemaModel({
  name: 'DepsAnalyzeInput',
  fields: {
    pattern: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    showCycles: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const DepsAnalyzeOutput = defineSchemaModel({
  name: 'DepsAnalyzeOutput',
  fields: {
    stats: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    cycles: { type: ScalarTypeEnum.JSON(), isOptional: false },
    missing: { type: ScalarTypeEnum.JSON(), isOptional: false },
    graph: { type: ScalarTypeEnum.JSON(), isOptional: false },
    dot: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export function registerDepsTools(reg: SpecRegistry, adapters: WorkspaceAdapters): void {
  const cmd = defineCommand({
    meta: {
      name: 'contractspecLocal.depsAnalyze',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'deps'],
      description: 'Analyze ContractSpec dependencies (graph, cycles, missing deps).',
      goal: 'Help agents understand contract coupling and missing links.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: DepsAnalyzeInput, output: DepsAnalyzeOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'deps.analyze' } },
  });

  installOp(reg, cmd, async (args) => {
    const result = await analyzeDeps({ fs: adapters.fs }, { pattern: args.pattern });
    const stats = getGraphStats(result.graph);
    const showCycles = args.showCycles ?? true;
    const format = args.format ?? 'json';
    const dot = format === 'dot' ? exportGraphAsDot(result.graph) : undefined;

    return {
      stats,
      cycles: showCycles ? result.cycles : [],
      missing: result.missing,
      graph: Array.from(result.graph.values()),
      dot,
    };
  });
}


