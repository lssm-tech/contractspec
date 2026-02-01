/**
 * Implementation verification checks.
 */

import type { SpecScanResult } from '@contractspec/module.workspace';
import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { loadWorkspaceConfig } from '../../config';
import { resolveAllImplementations } from '../../implementation/resolver';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run implementation verification checks.
 */
export async function runImplementationChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: SpecScanResult[],
  options: CICheckOptions
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  const config = await loadWorkspaceConfig(fs);
  const implOptions = options.implementation ?? {};

  // Only check operation specs by default
  const operationSpecs = specFiles.filter((f) => f.specType === 'operation');

  // Resolve implementations for all specs
  const results = await resolveAllImplementations(
    operationSpecs,
    { fs },
    config,
    {
      computeHashes: implOptions.useCache ?? true,
    }
  );

  for (const result of results) {
    // Check if implementation is required
    if (implOptions.requireImplemented && result.status === 'missing') {
      issues.push({
        ruleId: 'impl-missing',
        severity: 'error',
        message: `Spec ${result.specKey} has no implementation`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          specVersion: result.specVersion,
          status: result.status,
        },
      });
    } else if (result.status === 'missing') {
      issues.push({
        ruleId: 'impl-missing',
        severity: 'warning',
        message: `Spec ${result.specKey} has no implementation`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          specVersion: result.specVersion,
          status: result.status,
        },
      });
    }

    // Check for partial implementations
    if (!implOptions.allowPartial && result.status === 'partial') {
      const missingImpls = result.implementations
        .filter((i) => !i.exists && i.type !== 'test')
        .map((i) => i.path);

      issues.push({
        ruleId: 'impl-partial',
        severity: 'warning',
        message: `Spec ${result.specKey} has partial implementation: missing ${missingImpls.join(', ')}`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          specVersion: result.specVersion,
          status: result.status,
          missingFiles: missingImpls,
        },
      });
    }

    // Report missing tests
    const missingTests = result.implementations.filter(
      (i) => !i.exists && i.type === 'test'
    );
    if (missingTests.length > 0) {
      issues.push({
        ruleId: 'impl-missing-tests',
        severity: 'note',
        message: `Spec ${result.specKey} missing test files: ${missingTests.map((t) => t.path).join(', ')}`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          missingTests: missingTests.map((t) => t.path),
        },
      });
    }
  }

  return issues;
}
