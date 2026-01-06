import path from 'path';
import type { WorkspaceAdapters } from '../ports/logger';
import { listSpecs } from './list';
import { generateDocsFromSpecs } from './docs/index';

export interface GenerateArtifactsResult {
  specsCount: number;
  docsCount: number;
}

export async function generateArtifacts(
  adapters: WorkspaceAdapters,
  contractsDir: string,
  generatedDir: string
): Promise<GenerateArtifactsResult> {
  // Check if contracts directory exists
  if (!(await adapters.fs.exists(contractsDir))) {
    // Fallback logic
  }

  const searchPattern = (await adapters.fs.exists(contractsDir))
    ? 'contracts/**/*.ts'
    : '**/*.ts';

  const specs = await listSpecs(adapters, { pattern: searchPattern });

  if (specs.length === 0) {
    return { specsCount: 0, docsCount: 0 };
  }

  const specFiles = specs.map((s) => s.filePath);
  const docsDir = path.join(generatedDir, 'docs');

  // We assume adapters passed are compatible with what gen docs needs
  const docsResult = await generateDocsFromSpecs(
    specFiles,
    { outputDir: docsDir, format: 'markdown' },
    adapters
  );

  return {
    specsCount: specs.length,
    docsCount: docsResult.count,
  };
}
