/**
 * LLM integration tools for MCP.
 *
 * Provides tools for:
 * - llm.export: Export specs to markdown
 * - llm.guide: Generate implementation guides
 * - llm.verify: Verify implementations
 */

import {
  defineCommand,
  defineSchemaModel,
  installOp,
  type SpecRegistry,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import {
  type AgentType,
  type LLMExportFormat,
  specToAgentPrompt,
  specToContextMarkdown,
  specToFullMarkdown,
  type VerificationTier,
} from '@lssm/lib.contracts/llm';
import {
  createAgentGuideService,
  createVerifyService,
} from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';

// ============================================================================
// LLM Export Tool
// ============================================================================

const LLMExportInput = defineSchemaModel({
  name: 'LLMExportInput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    taskType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const LLMExportOutput = defineSchemaModel({
  name: 'LLMExportOutput',
  fields: {
    markdown: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    specName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    specVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    wordCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============================================================================
// LLM Guide Tool
// ============================================================================

const LLMGuideInput = defineSchemaModel({
  name: 'LLMGuideInput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agent: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    targetPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const LLMGuideOutput = defineSchemaModel({
  name: 'LLMGuideOutput',
  fields: {
    systemPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    taskPrompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agent: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    steps: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    files: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============================================================================
// LLM Verify Tool
// ============================================================================

const LLMVerifyInput = defineSchemaModel({
  name: 'LLMVerifyInput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    implementationPath: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    tier: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const LLMVerifyOutput = defineSchemaModel({
  name: 'LLMVerifyOutput',
  fields: {
    passed: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    score: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    errors: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    warnings: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    issues: { type: ScalarTypeEnum.JSON(), isOptional: false },
    suggestions: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
  },
});

const loadSpecFromPath = async (
  specPath: string,
  adapters: WorkspaceAdapters
) => {
  const path = await import('path');
  const fullPath = path.resolve(process.cwd(), specPath);

  const exists = await adapters.fs.exists(fullPath);
  if (!exists) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  try {
    const module = await import(fullPath);
    for (const [_, value] of Object.entries(module)) {
      if (
        value &&
        typeof value === 'object' &&
        'meta' in value &&
        'io' in value
      ) {
        return value;
      }
    }
    throw new Error('No spec found in module');
  } catch (error) {
    throw new Error(
      `Failed to load spec: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export function registerLLMTools(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  // ============================================================================
  // llm.export
  // ============================================================================
  const llmExportCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.llmExport',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'llm', 'export'],
      description: 'Export a ContractSpec to markdown for LLM consumption.',
      goal: 'Provide specs in a format optimized for LLM understanding.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: LLMExportInput, output: LLMExportOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'llm.export' } },
  });

  installOp(reg, llmExportCmd, async (args) => {
    const spec = await loadSpecFromPath(args.specPath, adapters);
    const format = (args.format ?? 'full') as LLMExportFormat;
    const taskType = (args.taskType ?? 'implement') as
      | 'implement'
      | 'test'
      | 'refactor'
      | 'review';

    let markdown: string;

    switch (format) {
      case 'context':
        markdown = specToContextMarkdown(spec);
        break;
      case 'prompt':
        markdown = specToAgentPrompt(spec, { taskType });
        break;
      case 'full':
      default:
        markdown = specToFullMarkdown(spec);
        break;
    }

    return {
      markdown,
      specName: spec.meta.name,
      specVersion: spec.meta.version,
      format,
      wordCount: markdown.split(/\s+/).length,
    };
  });

  // ============================================================================
  // llm.guide
  // ============================================================================
  const llmGuideCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.llmGuide',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'llm', 'guide'],
      description: 'Generate an implementation guide for an AI coding agent.',
      goal: 'Help AI agents implement specs correctly.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: LLMGuideInput, output: LLMGuideOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'llm.guide' } },
  });

  installOp(reg, llmGuideCmd, async (args) => {
    const spec = await loadSpecFromPath(args.specPath, adapters);
    const agent = (args.agent ?? 'generic-mcp') as AgentType;

    const guideService = createAgentGuideService({
      defaultAgent: agent,
      projectRoot: process.cwd(),
    });

    const result = guideService.generateGuide(spec, {
      agent,
      targetPath: args.targetPath,
    });

    return {
      systemPrompt: result.prompt.systemPrompt,
      taskPrompt: result.prompt.taskPrompt,
      agent,
      steps: result.plan.steps.length,
      files: result.plan.fileStructure.length,
    };
  });

  // ============================================================================
  // llm.verify
  // ============================================================================
  const llmVerifyCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.llmVerify',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'llm', 'verify'],
      description: 'Verify an implementation against its ContractSpec.',
      goal: 'Validate implementation compliance with spec.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: LLMVerifyInput, output: LLMVerifyOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'llm.verify' } },
  });

  installOp(reg, llmVerifyCmd, async (args) => {
    const spec = await loadSpecFromPath(args.specPath, adapters);

    const path = await import('path');
    const implPath = path.resolve(process.cwd(), args.implementationPath);

    const implExists = await adapters.fs.exists(implPath);
    if (!implExists) {
      throw new Error(
        `Implementation file not found: ${args.implementationPath}`
      );
    }

    const implementationCode = await adapters.fs.readFile(implPath);
    // const implementationCode = await adapters.fs.readFile(implPath, 'utf-8');

    // Determine tiers
    let tiers: VerificationTier[];
    switch (args.tier) {
      case '1':
      case 'structure':
        tiers = ['structure'];
        break;
      case '2':
      case 'behavior':
        tiers = ['structure', 'behavior'];
        break;
      case '3':
      case 'ai':
        tiers = ['structure', 'behavior', 'ai_review'];
        break;
      default:
        tiers = ['structure', 'behavior'];
        break;
    }

    const verifyService = createVerifyService();
    const result = await verifyService.verify(spec, implementationCode, {
      tiers,
    });

    return {
      passed: result.passed,
      score: result.score,
      summary: result.summary,
      errors: result.allIssues.filter((i) => i.severity === 'error').length,
      warnings: result.allIssues.filter((i) => i.severity === 'warning').length,
      issues: result.allIssues,
      suggestions: Array.from(result.reports.values()).flatMap(
        (r) => r.suggestions
      ),
    };
  });
}
