/**
 * Doctor checks (skipping AI in CI).
 */

import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { runDoctor } from '../../doctor/doctor-service';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run doctor checks (skipping AI in CI).
 */
export async function runDoctorChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  const workspaceRoot = options.workspaceRoot ?? process.cwd();

  const result = await runDoctor(adapters, {
    workspaceRoot,
    skipAi: true, // Always skip AI in CI
    categories: ['cli', 'config', 'deps', 'workspace'], // Skip AI and MCP
  });

  for (const check of result.checks) {
    if (check.status === 'fail') {
      issues.push({
        ruleId: `doctor-${check.category}-${check.name.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'error',
        message: `${check.name}: ${check.message}`,
        category: 'doctor',
        context: { details: check.details },
      });
    } else if (check.status === 'warn') {
      issues.push({
        ruleId: `doctor-${check.category}-${check.name.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'warning',
        message: `${check.name}: ${check.message}`,
        category: 'doctor',
        context: { details: check.details },
      });
    }
  }

  return issues;
}
