/**
 * Coverage goal enforcement checks.
 *
 * Validates that TestSpec.coverage requirements are met by actual coverage data.
 * Requires a coverage report file to exist (from a previous test run).
 */

import { scanAllSpecsFromSource } from '@contractspec/module.workspace';
import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { createParser, detectFormat, validateCoverage } from '../../coverage';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run coverage goal enforcement checks.
 */
export async function runCoverageChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[],
  options: CICheckOptions
): Promise<CIIssue[]> {
  const { fs, logger } = adapters;
  const issues: CIIssue[] = [];

  // Try to find coverage report
  const coverageDir = options.workspaceRoot
    ? `${options.workspaceRoot}/coverage`
    : './coverage';

  const possiblePaths = [
    `${coverageDir}/coverage-final.json`,
    `${coverageDir}/coverage.json`,
    `${coverageDir}/coverage-summary.json`,
  ];

  let coverageContent: string | undefined;
  let coveragePath: string | undefined;

  for (const path of possiblePaths) {
    const exists = await fs.exists(path);
    if (exists) {
      coverageContent = await fs.readFile(path);
      coveragePath = path;
      break;
    }
  }

  if (!coverageContent) {
    logger.info('No coverage report found, skipping coverage checks');
    return issues;
  }

  // Parse coverage report
  const format = detectFormat(coveragePath ?? 'coverage.json');
  const parser = createParser(format);
  const coverageReport = parser.parse(coverageContent);

  // Scan for test specs with coverage requirements
  for (const specFile of specFiles) {
    if (!specFile.includes('.test-spec.')) continue;

    const content = await fs.readFile(specFile);
    const scans = scanAllSpecsFromSource(content, specFile);

    for (const scan of scans) {
      if (scan.specType !== 'test-spec' || !scan.key || !scan.version) continue;

      // Extract coverage requirements (simplified - actual extraction would need more parsing)
      const coverageMatch = content.match(/coverage\s*:\s*\{([^}]+)\}/);
      if (!coverageMatch || !coverageMatch[1]) continue;

      // Parse coverage requirements
      const coverageBlock = coverageMatch[1];
      const requirements: Record<string, number> = {};

      const statementsMatch = coverageBlock.match(/statements\s*:\s*(\d+)/);
      if (statementsMatch && statementsMatch[1])
        requirements.statements = parseInt(statementsMatch[1], 10);

      const branchesMatch = coverageBlock.match(/branches\s*:\s*(\d+)/);
      if (branchesMatch && branchesMatch[1])
        requirements.branches = parseInt(branchesMatch[1], 10);

      const functionsMatch = coverageBlock.match(/functions\s*:\s*(\d+)/);
      if (functionsMatch && functionsMatch[1])
        requirements.functions = parseInt(functionsMatch[1], 10);

      const linesMatch = coverageBlock.match(/lines\s*:\s*(\d+)/);
      if (linesMatch && linesMatch[1])
        requirements.lines = parseInt(linesMatch[1], 10);

      if (Object.keys(requirements).length === 0) continue;

      // Validate coverage against requirements
      const result = validateCoverage(
        scan.key,
        scan.version,
        requirements,
        coverageReport.total
      );

      // Report failures as errors
      for (const failure of result.failures) {
        issues.push({
          ruleId: 'coverage-below-threshold',
          severity: 'error',
          message: failure.message,
          category: 'coverage',
          file: specFile,
          context: {
            specKey: scan.key,
            specVersion: scan.version,
            metric: failure.metric,
            required: failure.required,
            actual: failure.actual,
          },
        });
      }
    }
  }

  return issues;
}
