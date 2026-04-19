/**
 * Dependency analysis checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { loadWorkspaceConfig } from '../../config';
import { analyzeDeps } from '../../deps';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run dependency analysis checks.
 */
export async function runDepsChecks(
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	options: CICheckOptions
): Promise<CIIssue[]> {
	const issues: CIIssue[] = [];
	const config = await loadWorkspaceConfig(adapters.fs);

	const result = await analyzeDeps(adapters, {
		config,
		pattern: options.pattern,
	});

	// Report circular dependencies as errors
	for (const cycle of result.cycles) {
		issues.push({
			ruleId: 'deps-circular',
			severity: 'error',
			message: `Circular dependency detected: ${cycle.join(' → ')}`,
			category: 'deps',
			context: { cycle },
		});
	}

	// Report missing dependencies as errors
	for (const item of result.missing) {
		for (const missing of item.missing) {
			issues.push({
				ruleId: 'deps-missing',
				severity: 'error',
				message: `Missing dependency: ${item.contract} requires ${missing}`,
				category: 'deps',
				context: { contract: item.contract, missing },
			});
		}
	}

	return issues;
}
