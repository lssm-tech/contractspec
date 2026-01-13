/**
 * Fix Service.
 *
 * Orchestrates the application of fixes for integrity issues.
 */

import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type { IntegrityIssue } from '../integrity';
import {
  type BatchFixRequest,
  type BatchFixResult,
  type FixableIssue,
  type FixResult,
  type FixStrategy,
  type FixStrategyType,
  type FixOptions,
} from './types';
import {
  removeReferenceStrategy,
  implementSkeletonStrategy,
  implementAiStrategy,
} from './strategies';
import { analyzeIntegrity } from '../integrity';

/**
 * Service for fixing integrity issues.
 */
export class FixService {
  private strategies: Map<FixStrategyType, FixStrategy>;

  constructor(
    private readonly adapters: { fs: FsAdapter; logger: LoggerAdapter }
  ) {
    this.strategies = new Map();
    this.registerStrategy({
      type: 'remove-reference',
      fix: (issue, opts) =>
        removeReferenceStrategy(issue, opts, { fs: this.adapters.fs }),
    });
    this.registerStrategy({
      type: 'implement-skeleton',
      fix: (issue, opts) =>
        implementSkeletonStrategy(issue, opts, { fs: this.adapters.fs }),
    });
    this.registerStrategy({
      type: 'implement-ai',
      fix: (issue, opts) => implementAiStrategy(issue, opts, this.adapters),
    });
  }

  /**
   * Register a fix strategy.
   */
  private registerStrategy(strategy: FixStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  /**
   * Get available strategies for an issue.
   */
  getStrategiesForIssue(issue: IntegrityIssue): FixStrategyType[] {
    const strategies: FixStrategyType[] = [];

    if (issue.type === 'unresolved-ref') {
      strategies.push('remove-reference');
      strategies.push('implement-skeleton');
      strategies.push('implement-ai');
    } else if (issue.type === 'broken-link') {
      // Can usually only remove the link or implement the missng target
      strategies.push('remove-reference'); // Assuming generic removal works for links too
      strategies.push('implement-skeleton');
    }

    return strategies;
  }

  /**
   * Parse CI issue into a fixable issue context.
   */
  parseFixableIssue(
    issue: IntegrityIssue
  ): Omit<FixableIssue, 'availableStrategies' | 'strategies'> | undefined {
    if (!issue.ref || !issue.featureKey || !issue.specType) {
      return undefined;
    }

    return {
      issue,
      ref: issue.ref,
      specType: issue.specType,
      featureFile: issue.file,
      featureKey: issue.featureKey,
    };
  }

  /**
   * Fix a single issue.
   */
  async fixIssue(issue: FixableIssue, options: FixOptions): Promise<FixResult> {
    const strategy = this.strategies.get(options.strategy);

    if (!strategy) {
      return {
        success: false,
        strategy: options.strategy,
        issue,
        filesChanged: [],
        error: `Strategy ${options.strategy} not found`,
      };
    }

    this.adapters.logger.info(
      `Applying fix ${options.strategy} for ${issue.ref.key}`,
      {
        dryRun: options.dryRun,
      }
    );

    return strategy.fix(issue, options);
  }

  /**
   * Batch fix multiple issues.
   */
  async batchFix(request: BatchFixRequest): Promise<BatchFixResult> {
    const results: FixResult[] = [];
    let succeeded = 0;
    let failed = 0;

    for (const issue of request.issues) {
      try {
        const result = await this.fixIssue(issue, request.options);
        results.push(result);
        if (result.success) {
          succeeded++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        results.push({
          success: false,
          strategy: request.options.strategy,
          issue,
          filesChanged: [],
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      total: request.issues.length,
      succeeded,
      failed,
      results,
    };
  }

  /**
   * Scan for integrity issues and return fixable ones.
   */
  async scanAndGetFixables(
    options: { pattern?: string; cwd?: string } = {}
  ): Promise<FixableIssue[]> {
    const scanResult = await analyzeIntegrity(this.adapters, {
      pattern: options.pattern,
      cwd: options.cwd,
    });

    return scanResult.issues
      .map((issue) => this.getToFix(issue))
      .filter((item): item is FixableIssue => item !== null);
  }

  /**
   * Convert an integrity issue into a FixableIssue with strategies.
   */
  getToFix(issue: IntegrityIssue): FixableIssue | null {
    const strategies = this.getStrategiesForIssue(issue);
    if (strategies.length === 0) {
      return null;
    }

    const fixable = this.parseFixableIssue(issue);
    if (!fixable) {
      return null;
    }

    return {
      ...fixable,
      availableStrategies: strategies,
      strategies: [], // Strategies are managed by service, not attached to issue object in this implementation
    } as FixableIssue;
  }

  /**
   * Determine the best strategy for an issue.
   *
   * Logic moved from CLI to be shared.
   */
  resolveStrategy(
    issue: FixableIssue,
    options: {
      forceStrategy?: FixStrategyType;
      preferAi?: boolean;
      interactive?: boolean;
      // Optional callback for interactive selection if environment supports it
      select?: (
        issue: FixableIssue,
        strategies: FixStrategyType[]
      ) => Promise<FixStrategyType | undefined>;
    }
  ): Promise<FixStrategyType | undefined> {
    const { forceStrategy, preferAi, select } = options;

    // 1. Forced strategy
    if (forceStrategy) {
      // Validate it's available? Or trust caller?
      // For now, trust caller or checks downstream
      return Promise.resolve(forceStrategy);
    }

    // 2. AI Preference
    if (preferAi && issue.availableStrategies.includes('implement-ai')) {
      return Promise.resolve('implement-ai');
    }

    // 3. Single strategy available
    if (issue.availableStrategies.length === 1) {
      return Promise.resolve(issue.availableStrategies[0]);
    }

    // 4. Multiple strategies
    if (issue.availableStrategies.length > 1) {
      if (typeof select === 'function') {
        return select(issue, issue.availableStrategies);
      }
      // Default to first if non-interactive or no selector provided
      // Usually the most standard compliant/safest one is first
      return Promise.resolve(issue.availableStrategies[0]);
    }

    return Promise.resolve(undefined);
  }

  /**
   * Determine scan options based on input target.
   */
  async determineScanOptions(
    target: string
  ): Promise<{ pattern?: string; cwd?: string }> {
    try {
      const stats = await this.adapters.fs.stat(target);
      if (stats.isDirectory) {
        return { cwd: target };
      } else {
        return { pattern: target };
      }
    } catch {
      // Likely a glob pattern or non-existent path (treated as pattern)
      return { pattern: target };
    }
  }

  /**
   * Parse CI output JSON into FixableIssues.
   */
  parseIssuesFromCIResult(ciIssues: unknown[]): FixableIssue[] {
    // Check if input is array
    if (!Array.isArray(ciIssues)) return [];

    return ciIssues
      .map((issue) => {
        // CI issues might be wrapped or have different shape.
        // Assuming they are serialized IntegrityIssues.
        return this.getToFix(issue as IntegrityIssue);
      })
      .filter((item): item is FixableIssue => item !== null);
  }
}
