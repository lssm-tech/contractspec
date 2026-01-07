/**
 * Drift detection checks.
 *
 * Detects when generated artifacts are out of sync with specs.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { loadWorkspaceConfig } from '../../config';
import { detectDrift } from '../../drift';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run drift detection checks.
 */
export async function runDriftChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  _options: CICheckOptions
): Promise<CIIssue[]> {
  const { fs, logger } = adapters;
  const issues: CIIssue[] = [];

  const config = await loadWorkspaceConfig(fs);

  // Check if we have the required config
  if (!config.outputDir) {
    logger.info('No outputDir configured, skipping drift checks');
    return issues;
  }

  const contractsDir = './contracts';
  const generatedDir = config.outputDir;

  // Check if generated dir exists
  if (!(await fs.exists(generatedDir))) {
    logger.info('Generated directory does not exist, skipping drift checks');
    return issues;
  }

  try {
    const result = await detectDrift(
      adapters as Parameters<typeof detectDrift>[0],
      contractsDir,
      generatedDir
    );

    if (result.hasDrift) {
      for (const file of result.files) {
        issues.push({
          ruleId: 'drift-detected',
          severity: 'error',
          message: `Drift detected: generated file is out of sync with spec: ${file}`,
          category: 'drift',
          file: `${generatedDir}/${file}`,
          context: { file },
        });
      }
    }
  } catch (error) {
    logger.warn('Drift detection failed', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return issues;
}
