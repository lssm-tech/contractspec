/**
 * OpenAPI tools for MCP: import, export, sync, validate.
 */

import {
  defineCommand,
  defineSchemaModel,
  installOp,
  type SpecRegistry,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';
import {
  parseOpenApi,
  importFromOpenApi,
  openApiForRegistry,
} from '@lssm/lib.contracts-transformers/openapi';
import type { WorkspaceAdapters } from '../server';

// ============================================================================
// OpenAPI Import Tool
// ============================================================================

const OpenApiImportInput = defineSchemaModel({
  name: 'OpenApiImportInput',
  fields: {
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    outputDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    prefix: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tags: { type: ScalarTypeEnum.JSON(), isOptional: true },
    exclude: { type: ScalarTypeEnum.JSON(), isOptional: true },
    dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const OpenApiImportOutput = defineSchemaModel({
  name: 'OpenApiImportOutput',
  fields: {
    imported: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    skipped: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    errors: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    files: { type: ScalarTypeEnum.JSON(), isOptional: false },
    skippedOperations: { type: ScalarTypeEnum.JSON(), isOptional: false },
    errorMessages: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

// ============================================================================
// OpenAPI Validate Tool
// ============================================================================

const OpenApiValidateInput = defineSchemaModel({
  name: 'OpenApiValidateInput',
  fields: {
    specPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    openApiSource: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    ignoreDescriptions: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    ignoreTags: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    ignoreTransport: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const OpenApiValidateOutput = defineSchemaModel({
  name: 'OpenApiValidateOutput',
  fields: {
    valid: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    specsValidated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    specsWithDiffs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    results: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

// ============================================================================
// OpenAPI Diff Tool
// ============================================================================

const OpenApiDiffInput = defineSchemaModel({
  name: 'OpenApiDiffInput',
  fields: {
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    specDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const OpenApiDiffOutput = defineSchemaModel({
  name: 'OpenApiDiffOutput',
  fields: {
    totalOperations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    newOperations: { type: ScalarTypeEnum.JSON(), isOptional: false },
    existingOperations: { type: ScalarTypeEnum.JSON(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export function registerOpenApiTools(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  // ============================================================================
  // openapi.import
  // ============================================================================
  const importCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.openapiImport',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'openapi'],
      description: 'Import ContractSpec specs from an OpenAPI document.',
      goal: 'Convert OpenAPI operations to ContractSpec definitions.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: OpenApiImportInput, output: OpenApiImportOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'openapi.import' } },
  });

  installOp(reg, importCmd, async (args) => {
    const outputDir = args.outputDir ?? './src/specs';
    const dryRun = args.dryRun ?? false;

    // Parse the OpenAPI document
    const parseResult = await parseOpenApi(args.source, {
      fetch: globalThis.fetch,
      readFile: (path) => adapters.fs.readFile(path),
    });

    // Import operations
    const importResult = importFromOpenApi(parseResult, {
      prefix: args.prefix,
      tags: args.tags as string[] | undefined,
      exclude: args.exclude as string[] | undefined,
    });

    const files: { path: string; operationId: string }[] = [];

    // Write files if not dry run
    if (!dryRun) {
      for (const spec of importResult.specs) {
        const filePath = `${outputDir}/${spec.fileName}`;
        await adapters.fs.mkdir(outputDir);
        await adapters.fs.writeFile(filePath, spec.code);
        files.push({ path: filePath, operationId: spec.source.sourceId });
      }
    } else {
      for (const spec of importResult.specs) {
        files.push({
          path: `${outputDir}/${spec.fileName}`,
          operationId: spec.source.sourceId,
        });
      }
    }

    return {
      imported: importResult.summary.imported,
      skipped: importResult.summary.skipped,
      errors: importResult.summary.errors,
      files,
      skippedOperations: importResult.skipped,
      errorMessages: importResult.errors,
    };
  });

  // ============================================================================
  // openapi.validate
  // ============================================================================
  const validateCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.openapiValidate',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'openapi'],
      description: 'Validate ContractSpec specs against an OpenAPI source.',
      goal: 'Ensure specs are in sync with OpenAPI definitions.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: OpenApiValidateInput, output: OpenApiValidateOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'openapi.validate' } },
  });

  installOp(reg, validateCmd, async (args) => {
    // Parse the OpenAPI document
    const parseResult = await parseOpenApi(args.openApiSource, {
      fetch: globalThis.fetch,
      readFile: (path) => adapters.fs.readFile(path),
    });

    // Build operations map
    const operationsMap = new Map<string, (typeof parseResult.operations)[0]>();
    for (const op of parseResult.operations) {
      operationsMap.set(op.operationId, op);
    }

    // Find spec files
    const specFiles = await adapters.fs.glob({
      pattern: '**/*.ts',
      cwd: args.specPath,
      ignore: ['node_modules/**', 'dist/**'],
      absolute: true,
    });

    let specsValidated = 0;
    let specsWithDiffs = 0;
    const results: {
      file: string;
      valid: boolean;
      diffs: string[];
    }[] = [];

    for (const file of specFiles) {
      const content = await adapters.fs.readFile(file);

      const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
      if (!nameMatch?.[1]) continue;

      specsValidated++;
      const specName = nameMatch[1];
      const matchingOp = operationsMap.get(specName);
      const diffs: string[] = [];

      if (!matchingOp) {
        diffs.push(`No matching OpenAPI operation for: ${specName}`);
      }

      const valid = diffs.length === 0;
      if (!valid) specsWithDiffs++;

      results.push({ file, valid, diffs });
    }

    return {
      valid: specsWithDiffs === 0,
      specsValidated,
      specsWithDiffs,
      results,
    };
  });

  // ============================================================================
  // openapi.diff
  // ============================================================================
  const diffCmd = defineCommand({
    meta: {
      name: 'contractspecLocal.openapiDiff',
      version: 1,
      stability: 'stable',
      owners: ['@contractspec'],
      tags: ['mcp-local', 'openapi'],
      description: 'Show diff between OpenAPI operations and existing specs.',
      goal: 'Help agents understand what needs to be synced.',
      context: 'Local MCP tool (stdio).',
    },
    io: { input: OpenApiDiffInput, output: OpenApiDiffOutput },
    policy: { auth: 'anonymous' },
    transport: { mcp: { toolName: 'openapi.diff' } },
  });

  installOp(reg, diffCmd, async (args) => {
    const specDir = args.specDir ?? './src/specs';

    // Parse the OpenAPI document
    const parseResult = await parseOpenApi(args.source, {
      fetch: globalThis.fetch,
      readFile: (path) => adapters.fs.readFile(path),
    });

    // Find existing specs
    const existingSpecs = new Set<string>();
    try {
      const specFiles = await adapters.fs.glob({
        pattern: '**/*.ts',
        cwd: specDir,
        ignore: ['node_modules/**', 'dist/**'],
        absolute: true,
      });

      for (const file of specFiles) {
        const content = await adapters.fs.readFile(file);
        const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
        if (nameMatch?.[1]) {
          existingSpecs.add(nameMatch[1]);
        }
      }
    } catch {
      // Directory might not exist yet
    }

    const newOperations: string[] = [];
    const existingOperations: string[] = [];

    for (const op of parseResult.operations) {
      if (existingSpecs.has(op.operationId)) {
        existingOperations.push(op.operationId);
      } else {
        newOperations.push(op.operationId);
      }
    }

    return {
      totalOperations: parseResult.operations.length,
      newOperations,
      existingOperations,
      summary: `${newOperations.length} new, ${existingOperations.length} existing out of ${parseResult.operations.length} total`,
    };
  });
}
