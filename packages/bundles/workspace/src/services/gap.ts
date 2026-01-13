import path from 'path';
import type { FsAdapter } from '../ports/fs';
import { listSpecs } from './list';

export interface GapAnalysisResult {
  hasContracts: boolean;
  hasGenerated: boolean;
  missingDocs: string[];
  missingIndex: boolean;
  missingRegistry: boolean;
  totalSpecs: number;
}

export async function analyzeGap(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapters: { fs: FsAdapter; scan?: any },
  cwd: string
): Promise<GapAnalysisResult> {
  const contractsDir = path.join(cwd, 'contracts');
  const generatedDir = path.join(cwd, 'generated');
  const docsDir = path.join(generatedDir, 'docs');

  const hasContracts = await adapters.fs.exists(contractsDir);
  const hasGenerated = await adapters.fs.exists(generatedDir);

  if (!hasContracts) {
    return {
      hasContracts: false,
      hasGenerated,
      missingDocs: [],
      missingIndex: false,
      missingRegistry: false,
      totalSpecs: 0,
    };
  }

  const specs = await listSpecs(adapters, { pattern: 'contracts/**/*.ts' });
  const missingDocs: string[] = [];

  if (hasGenerated) {
    for (const spec of specs) {
      // Logic from CLI: ID is usually file name relative or spec key.
      const id = spec.key || path.basename(spec.filePath, '.ts');
      const docFile = path.join(docsDir, `${id}.md`);

      if (!(await adapters.fs.exists(docFile))) {
        missingDocs.push(id);
      }
    }
  } else if (specs.length > 0) {
    // If generated dir missing, all docs are missing
    for (const spec of specs) {
      const id = spec.key || path.basename(spec.filePath, '.ts');
      missingDocs.push(id);
    }
  }

  const indexFile = path.join(contractsDir, 'index.ts');
  const registryFile = path.join(contractsDir, 'registry.ts');

  const missingIndex =
    specs.length > 0 && !(await adapters.fs.exists(indexFile));
  const missingRegistry =
    specs.length > 0 && !(await adapters.fs.exists(registryFile));

  return {
    hasContracts: true,
    hasGenerated,
    missingDocs,
    missingIndex,
    missingRegistry,
    totalSpecs: specs.length,
  };
}
