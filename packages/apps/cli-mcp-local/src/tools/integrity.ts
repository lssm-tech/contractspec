/**
 * Integrity analysis tools, exposed as ContractSpec commands.
 */

import {
  defineCommand,
  defineSchemaModel,
  installOp,
  type SpecRegistry,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import {
  analyzeIntegrity,
  generateMermaidDiagram,
} from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';

const IntegrityAnalyzeInput = defineSchemaModel({
  name: 'IntegrityAnalyzeInput',
  fields: {
    pattern: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    featureKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    all: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const IntegrityAnalyzeOutput = defineSchemaModel({
  name: 'IntegrityAnalyzeOutput',
  fields: {
    healthy: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    coverage: { type: ScalarTypeEnum.JSON(), isOptional: false },
    issues: { type: ScalarTypeEnum.JSON(), isOptional: false },
    orphanedSpecs: { type: ScalarTypeEnum.JSON(), isOptional: false },
    featureCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const IntegrityDiagramInput = defineSchemaModel({
  name: 'IntegrityDiagramInput',
  fields: {
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    featureKeys: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    showVersions: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    direction: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    maxNodes: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const IntegrityDiagramOutput = defineSchemaModel({
  name: 'IntegrityDiagramOutput',
  fields: {
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mermaid: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export function registerIntegrityTools(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  const integrityAnalyzeSpec = defineCommand({
    meta: {
      name: 'contractspecLocal.integrityAnalyze',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'integrity'],
      description:
        'Analyze contract integrity (orphans, unresolved refs, coverage).',
      goal: 'Help agents understand contract health and enforce invariants.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: IntegrityAnalyzeInput, output: IntegrityAnalyzeOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'integrity.analyze' } },
  });

  installOp(reg, integrityAnalyzeSpec, async (args) => {
    const result = await analyzeIntegrity(adapters, {
      pattern: args.pattern,
      featureKey: args.featureKey,
      all: args.all,
    });

    return {
      healthy: result.healthy,
      coverage: result.coverage,
      issues: result.issues,
      orphanedSpecs: result.orphanedSpecs,
      featureCount: result.features.length,
    };
  });

  const integrityDiagramSpec = defineCommand({
    meta: {
      name: 'contractspecLocal.integrityDiagram',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'integrity', 'diagram'],
      description: 'Generate Mermaid diagrams from integrity analysis results.',
      goal: 'Provide visual graphs for features/specs and integrity issues.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: IntegrityDiagramInput, output: IntegrityDiagramOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'integrity.diagram' } },
  });

  installOp(reg, integrityDiagramSpec, async (args) => {
    const diagramType =
      args.type === 'orphans' ||
      args.type === 'dependencies' ||
      args.type === 'full'
        ? args.type
        : 'feature-map';

    const result = await analyzeIntegrity(adapters, {});
    const mermaid = generateMermaidDiagram(result, diagramType, {
      featureKeys: args.featureKeys,
      showVersions: args.showVersions ?? true,
      direction:
        (args.direction as 'LR' | 'TB' | 'RL' | 'BT' | undefined) ?? 'LR',
      maxNodes: args.maxNodes ?? 50,
    });

    return { type: diagramType, mermaid };
  });
}
