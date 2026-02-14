/**
 * Import service for source-extractors.
 *
 * Integrates source extraction into the workspace bundle.
 */

import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import {
  detectFramework,
  extractFromProject,
  type ExtractOptions,
  type ImportIR,
} from '@contractspec/lib.source-extractors';
import {
  type ExtractorFsAdapter,
  registerAllExtractors,
} from '@contractspec/lib.source-extractors/extractors';
import {
  generateOperations,
  generateRegistry,
  generateSchemas,
  type GenerationOptions,
  type GenerationResult,
} from '@contractspec/lib.source-extractors/codegen';
import { dirname, join } from 'path';

/**
 * Options for the import service.
 */
export interface ImportServiceOptions {
  /** Limit extraction to specific paths */
  scope?: string[];
  /** Force specific framework */
  framework?: string;
  /** Dry run mode - don't write files */
  dryRun?: boolean;
  /** Analysis only - extract IR without generating code */
  analyzeOnly?: boolean;
  /** Output directory for generated contracts */
  outputDir?: string;
}

/**
 * Result of the import service.
 */
export interface ImportServiceResult {
  success: boolean;
  ir?: ImportIR;
  generation?: GenerationResult;
  report: string;
  errors?: string[];
}

/**
 * Adapters needed by the import service.
 */
export interface ImportServiceAdapters {
  fs: FsAdapter;
  logger: LoggerAdapter;
}

/**
 * Import contracts from source code.
 */
export async function importFromSourceService(
  config: ResolvedContractsrcConfig,
  options: ImportServiceOptions,
  adapters: ImportServiceAdapters,
  cwd?: string
): Promise<ImportServiceResult> {
  const { fs, logger } = adapters;
  const rootPath = cwd ?? process.cwd();

  // Register all extractors
  registerAllExtractors();

  logger.info(`Scanning source code in ${rootPath}...`);

  // Create adapter bridge
  const extractorFs: ExtractorFsAdapter = {
    readFile: (path) => fs.readFile(path),
    glob: (pattern, opts) => fs.glob({ pattern, cwd: opts?.cwd }),
    exists: (path) => fs.exists(path),
  };

  // Detect frameworks
  const project = await detectFramework(rootPath, {
    readFile: (path) => fs.readFile(path),
    glob: (pattern) => fs.glob({ pattern }),
  });

  if (project.frameworks.length === 0) {
    logger.warn('No supported frameworks detected');
    return {
      success: false,
      report: generateNoFrameworkReport(),
      errors: ['No supported frameworks detected in project'],
    };
  }

  logger.info(
    `Detected frameworks: ${project.frameworks.map((f) => f.name).join(', ')}`
  );

  // Set up extractors with fs adapter
  const { extractorRegistry } =
    await import('@contractspec/lib.source-extractors');
  for (const extractor of extractorRegistry.getAll()) {
    if ('setFs' in extractor && typeof extractor.setFs === 'function') {
      extractor.setFs(extractorFs);
    }
  }

  // Extract contracts
  const extractOptions: ExtractOptions = {
    scope: options.scope,
    framework: options.framework,
  };

  const extractResult = await extractFromProject(project, extractOptions);

  if (!extractResult.success || !extractResult.ir) {
    return {
      success: false,
      report: generateErrorReport(extractResult.errors ?? []),
      errors: extractResult.errors?.map((e) => e.message),
    };
  }

  const ir = extractResult.ir;

  logger.info(
    `Extracted ${ir.endpoints.length} endpoints, ${ir.schemas.length} schemas`
  );

  // If analyze-only mode, just return the IR
  if (options.analyzeOnly) {
    return {
      success: true,
      ir,
      report: generateAnalysisReport(ir),
    };
  }

  // Generate code
  const outputDir = options.outputDir ?? join(config.outputDir, 'generated');
  const generationOptions: GenerationOptions = {
    outputDir,
    defaultAuth: 'user',
  };

  const operationFiles = generateOperations(ir, generationOptions);
  const schemaFiles = generateSchemas(ir, generationOptions);
  const registryFile = generateRegistry(operationFiles);

  const allFiles = [...operationFiles, ...schemaFiles, registryFile];

  // Write files if not dry-run
  if (!options.dryRun) {
    for (const file of allFiles) {
      const fullPath = join(outputDir, file.path);
      const dir = dirname(fullPath);

      if (!(await fs.exists(dir))) {
        await fs.mkdir(dir);
      }

      await fs.writeFile(fullPath, file.content);
      logger.info(`Created: ${fullPath}`);
    }
  } else {
    for (const file of allFiles) {
      logger.info(`[DRY RUN] Would create: ${join(outputDir, file.path)}`);
    }
  }

  const generationResult: GenerationResult = {
    files: allFiles,
    operationsGenerated: operationFiles.length,
    schemasGenerated: schemaFiles.length,
    warnings: [],
  };

  return {
    success: true,
    ir,
    generation: generationResult,
    report: generateSuccessReport(ir, generationResult, options),
  };
}

/**
 * Generate report when no frameworks are detected.
 */
function generateNoFrameworkReport(): string {
  return `# Import Report

## ❌ No Supported Frameworks Detected

No supported frameworks were detected in the project.

### Supported Frameworks

- NestJS
- Express
- Fastify
- Hono
- Elysia
- tRPC
- Next.js API Routes

Please ensure your project uses one of these frameworks and has the appropriate dependencies installed.
`;
}

/**
 * Generate error report.
 */
function generateErrorReport(errors: { message: string }[]): string {
  return `# Import Report

## ❌ Extraction Failed

${errors.map((e) => `- ${e.message}`).join('\n')}
`;
}

/**
 * Generate analysis-only report.
 */
function generateAnalysisReport(ir: ImportIR): string {
  return `# Import Analysis Report

## Summary

- **Files Scanned**: ${ir.stats.filesScanned}
- **Endpoints Found**: ${ir.stats.endpointsFound}
- **Schemas Found**: ${ir.stats.schemasFound}
- **Errors Found**: ${ir.stats.errorsFound}
- **Events Found**: ${ir.stats.eventsFound}

## Confidence Breakdown

| Level | Count |
|-------|-------|
| High | ${ir.stats.highConfidence} |
| Medium | ${ir.stats.mediumConfidence} |
| Low/Ambiguous | ${ir.stats.lowConfidence} |

## Detected Frameworks

${ir.project.frameworks.map((f) => `- ${f.name} (${f.confidence})`).join('\n')}

## Endpoints

${ir.endpoints.map((e) => `- \`${e.method} ${e.path}\` - ${e.confidence.level}`).join('\n')}

## Ambiguities (Require Review)

${ir.ambiguities.length > 0 ? ir.ambiguities.map((a) => `- ${a.description}`).join('\n') : 'None'}
`;
}

/**
 * Generate success report.
 */
function generateSuccessReport(
  ir: ImportIR,
  gen: GenerationResult,
  options: ImportServiceOptions
): string {
  const mode = options.dryRun ? ' (Dry Run)' : '';
  return `# Import Report${mode}

## ✅ Import Successful

### Extraction Summary

- **Files Scanned**: ${ir.stats.filesScanned}
- **Endpoints Found**: ${ir.stats.endpointsFound}
- **Schemas Found**: ${ir.stats.schemasFound}

### Generation Summary

- **Operations Generated**: ${gen.operationsGenerated}
- **Schemas Generated**: ${gen.schemasGenerated}
- **Total Files**: ${gen.files.length}

### Confidence Breakdown

| Level | Count |
|-------|-------|
| High | ${ir.stats.highConfidence} |
| Medium | ${ir.stats.mediumConfidence} |
| Low/Ambiguous | ${ir.stats.lowConfidence} |

### Next Steps

1. Review generated contracts in \`${options.outputDir ?? 'generated/'}\`
2. Fill in TODO placeholders with business context
3. Run \`contractspec validate\` to verify contracts
4. Move stable contracts from \`generated/\` to \`curated/\`
`;
}
