/**
 * Handler implementation checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { loadWorkspaceConfig } from '../../config';
import { validateImplementationFiles } from '../../validate/implementation-validator';
import type { CIIssue } from '../types';

/**
 * Run handler implementation checks.
 */
export async function runHandlerChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  const config = await loadWorkspaceConfig(fs);

  for (const specFile of specFiles) {
    // Only check operation specs
    if (!specFile.includes('.operation.')) continue;

    const result = await validateImplementationFiles(specFile, { fs }, config, {
      checkHandlers: true,
      outputDir: config.outputDir,
    });

    for (const error of result.errors) {
      issues.push({
        ruleId: 'handler-missing',
        severity: 'warning', // Handler missing is a warning, not error
        message: error,
        category: 'handlers',
        file: specFile,
      });
    }

    for (const warning of result.warnings) {
      issues.push({
        ruleId: 'handler-warning',
        severity: 'warning',
        message: warning,
        category: 'handlers',
        file: specFile,
      });
    }
  }

  return issues;
}
