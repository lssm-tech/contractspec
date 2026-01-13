import type { WorkspaceAdapters } from '../ports/logger';
import { loadWorkspaceConfig } from './config';
import { importFromOpenApiService } from './openapi/index';
import type { OpenApiImportServiceResult } from './openapi/types';

export interface ExtractOptions {
  source: string;
  outputDir: string;
}

export async function extractContracts(
  adapters: WorkspaceAdapters,
  options: ExtractOptions,
  cwd?: string
): Promise<OpenApiImportServiceResult> {
  const { fs, logger } = adapters;
  const { source, outputDir } = options;

  // Verify source existence
  // We resolve source relative to CWD if checking locally, or absolute
  const sourcePath = fs.resolve(cwd ?? process.cwd(), source);
  if (!(await fs.exists(sourcePath))) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  // Load Base Config
  const config = await loadWorkspaceConfig(fs, cwd);

  // Override config if needed or pass as options to import service
  // importFromOpenApiService takes (contractsrcConfig, importOptions, adapters)
  // We need to merge outputDir override if present.
  const conventions = {
    models: 'models',
    groupByFeature: false,
    ...config.conventions,
  };

  const runConfig = {
    ...config,
    outputDir: outputDir, // CLI/Option override
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaFormat: (config as any).schemaFormat ?? 'zod',
    conventions,
  };

  logger.info(`Extracting contracts from ${sourcePath} to ${outputDir}`);

  return importFromOpenApiService(
    runConfig,
    {
      source: sourcePath,
      outputDir: outputDir,
      dryRun: false,
    },
    adapters
  );
}
