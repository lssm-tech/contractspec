/**
 * Verification Service
 *
 * Orchestrates tiered verification of implementations against specs.
 * Supports three tiers: structure, behavior, and AI review.
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import type {
  VerificationTier,
  VerificationReport,
  VerificationIssue,
} from '@lssm/lib.contracts/llm';
import { verifyStructure } from './structure-verifier';
import { verifyBehavior } from './behavior-verifier';
import { verifyWithAI, createQuickAIReview } from './ai-verifier';
import type {
  VerifyConfig,
  VerifyOptions,
  VerifyInput,
  VerifyResult,
} from './types';

const DEFAULT_CONFIG: VerifyConfig = {
  verbose: false,
};

const TIER_ORDER: VerificationTier[] = ['structure', 'behavior', 'ai_review'];

/**
 * Verification Service
 *
 * Main service for verifying implementations against specs.
 */
export class VerifyService {
  private config: VerifyConfig;

  constructor(config: Partial<VerifyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Run verification on an implementation.
   */
  async verify(
    spec: AnyContractSpec,
    implementationCode: string,
    options: VerifyOptions = {}
  ): Promise<VerifyResult> {
    const startTime = Date.now();
    const reports = new Map<VerificationTier, VerificationReport>();
    const allIssues: VerificationIssue[] = [];

    const input: VerifyInput = {
      spec,
      implementationCode,
    };

    // Determine which tiers to run
    const tiersToRun = options.tiers ?? ['structure', 'behavior'];

    for (const tier of TIER_ORDER) {
      if (!tiersToRun.includes(tier)) continue;

      let report: VerificationReport;

      switch (tier) {
        case 'structure':
          report = verifyStructure(input);
          break;
        case 'behavior':
          report = verifyBehavior(input);
          break;
        case 'ai_review':
          if (this.config.aiApiKey) {
            report = await verifyWithAI(input, this.config);
          } else {
            report = createQuickAIReview(input);
          }
          break;
        default:
          continue;
      }

      reports.set(tier, report);
      allIssues.push(...report.issues);

      // Stop on first failure if failFast is enabled
      if (options.failFast && !report.passed) {
        break;
      }
    }

    // Calculate combined results
    const reportsArray = Array.from(reports.values());
    const passed = reportsArray.every((r) => r.passed);
    const score =
      reportsArray.length > 0
        ? Math.round(
            reportsArray.reduce((sum, r) => sum + r.score, 0) /
              reportsArray.length
          )
        : 100;

    // Generate summary
    const summary = this.generateSummary(reportsArray, allIssues);

    return {
      passed,
      score,
      reports,
      allIssues,
      summary,
      duration: Date.now() - startTime,
    };
  }

  /**
   * Run only structure verification (Tier 1).
   */
  verifyStructure(
    spec: AnyContractSpec,
    implementationCode: string,
    implementationPath?: string
  ): VerificationReport {
    return verifyStructure({
      spec,
      implementationCode,
      implementationPath,
    });
  }

  /**
   * Run only behavior verification (Tier 2).
   */
  verifyBehavior(
    spec: AnyContractSpec,
    implementationCode: string,
    implementationPath?: string
  ): VerificationReport {
    return verifyBehavior({
      spec,
      implementationCode,
      implementationPath,
    });
  }

  /**
   * Run only AI verification (Tier 3).
   */
  async verifyAI(
    spec: AnyContractSpec,
    implementationCode: string,
    implementationPath?: string
  ): Promise<VerificationReport> {
    const input: VerifyInput = {
      spec,
      implementationCode,
      implementationPath,
    };

    if (this.config.aiApiKey) {
      return verifyWithAI(input, this.config);
    }
    return createQuickAIReview(input);
  }

  /**
   * Quick verification (structure only, fast).
   */
  quickVerify(
    spec: AnyContractSpec,
    implementationCode: string
  ): VerificationReport {
    return verifyStructure({ spec, implementationCode });
  }

  /**
   * Generate a human-readable summary of verification results.
   */
  private generateSummary(
    reports: VerificationReport[],
    allIssues: VerificationIssue[]
  ): string {
    const parts: string[] = [];

    // Overall status
    const passed = reports.every((r) => r.passed);
    const avgScore =
      reports.length > 0
        ? Math.round(
            reports.reduce((sum, r) => sum + r.score, 0) / reports.length
          )
        : 100;

    parts.push(passed ? '✓ Verification passed' : '✗ Verification failed');
    parts.push(`Score: ${avgScore}/100`);
    parts.push('');

    // Per-tier summary
    for (const report of reports) {
      const icon = report.passed ? '✓' : '✗';
      parts.push(`${icon} ${report.tier}: ${report.score}/100`);
    }
    parts.push('');

    // Issue summary
    const errors = allIssues.filter((i) => i.severity === 'error');
    const warnings = allIssues.filter((i) => i.severity === 'warning');
    const infos = allIssues.filter((i) => i.severity === 'info');

    if (errors.length > 0) {
      parts.push(`Errors: ${errors.length}`);
    }
    if (warnings.length > 0) {
      parts.push(`Warnings: ${warnings.length}`);
    }
    if (infos.length > 0) {
      parts.push(`Info: ${infos.length}`);
    }

    return parts.join('\n');
  }

  /**
   * Format verification result as markdown.
   */
  formatAsMarkdown(result: VerifyResult): string {
    const lines: string[] = [];

    // Header
    lines.push(`# Verification Report`);
    lines.push('');
    lines.push(`**Status:** ${result.passed ? '✓ Passed' : '✗ Failed'}`);
    lines.push(`**Score:** ${result.score}/100`);
    lines.push(`**Duration:** ${result.duration}ms`);
    lines.push('');

    // Per-tier details
    for (const [tier, report] of result.reports) {
      lines.push(`## ${this.formatTierName(tier)}`);
      lines.push('');
      lines.push(`**Status:** ${report.passed ? '✓ Passed' : '✗ Failed'}`);
      lines.push(`**Score:** ${report.score}/100`);
      lines.push('');

      if (report.issues.length > 0) {
        lines.push('### Issues');
        lines.push('');
        for (const issue of report.issues) {
          const icon =
            issue.severity === 'error'
              ? '❌'
              : issue.severity === 'warning'
                ? '⚠️'
                : 'ℹ️';
          lines.push(`${icon} **${issue.category}**: ${issue.message}`);
          if (issue.suggestion) {
            lines.push(`  - Suggestion: ${issue.suggestion}`);
          }
        }
        lines.push('');
      }

      if (report.coverage.scenarios.total > 0) {
        lines.push(
          `**Scenarios:** ${report.coverage.scenarios.covered}/${report.coverage.scenarios.total}`
        );
      }
      if (report.coverage.errors.total > 0) {
        lines.push(
          `**Errors handled:** ${report.coverage.errors.handled}/${report.coverage.errors.total}`
        );
      }
      lines.push('');
    }

    // Suggestions
    const allSuggestions = Array.from(result.reports.values()).flatMap(
      (r) => r.suggestions
    );

    if (allSuggestions.length > 0) {
      lines.push('## Suggestions');
      lines.push('');
      for (const suggestion of allSuggestions.slice(0, 10)) {
        lines.push(`- ${suggestion}`);
      }
      if (allSuggestions.length > 10) {
        lines.push(`- ... and ${allSuggestions.length - 10} more`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Format tier name for display.
   */
  private formatTierName(tier: VerificationTier): string {
    switch (tier) {
      case 'structure':
        return 'Tier 1: Structure';
      case 'behavior':
        return 'Tier 2: Behavior';
      case 'ai_review':
        return 'Tier 3: AI Review';
      default:
        return tier;
    }
  }

  /**
   * Update configuration.
   */
  configure(config: Partial<VerifyConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Create a new VerifyService instance.
 */
export function createVerifyService(
  config?: Partial<VerifyConfig>
): VerifyService {
  return new VerifyService(config);
}

/** Default singleton instance */
export const verifyService = new VerifyService();
