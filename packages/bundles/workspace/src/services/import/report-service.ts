/**
 * Report service for imported contracts.
 *
 * Generates markdown and CLI reports from IR and verification results.
 */

import type { ImportIR } from '@contractspec/lib.source-extractors';
import type { VerifyResult } from './verify-service';

/**
 * Options for report generation.
 */
export interface ReportOptions {
  /** Include endpoint details */
  includeEndpoints?: boolean;
  /** Include schema details */
  includeSchemas?: boolean;
  /** Include verification issues */
  includeIssues?: boolean;
  /** Include ambiguities */
  includeAmbiguities?: boolean;
  /** Include statistics */
  includeStats?: boolean;
}

/**
 * Generate a markdown report from IR and optional verification.
 */
export function generateMarkdownReport(
  ir: ImportIR,
  verification?: VerifyResult,
  options: ReportOptions = {}
): string {
  const lines: string[] = [];

  lines.push('# Import Report');
  lines.push('');
  lines.push(`**Generated**: ${new Date().toISOString()}`);
  lines.push('');

  // Summary section
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Files Scanned | ${ir.stats.filesScanned} |`);
  lines.push(`| Endpoints Found | ${ir.stats.endpointsFound} |`);
  lines.push(`| Schemas Found | ${ir.stats.schemasFound} |`);
  lines.push(`| Errors Found | ${ir.stats.errorsFound} |`);
  lines.push(`| Events Found | ${ir.stats.eventsFound} |`);
  lines.push('');

  // Confidence breakdown
  if (options.includeStats !== false) {
    lines.push('### Confidence');
    lines.push('');
    lines.push(`| Level | Count |`);
    lines.push(`|-------|-------|`);
    lines.push(`| High | ${ir.stats.highConfidence} |`);
    lines.push(`| Medium | ${ir.stats.mediumConfidence} |`);
    lines.push(`| Low/Ambiguous | ${ir.stats.lowConfidence} |`);
    lines.push('');
  }

  // Frameworks detected
  lines.push('### Frameworks Detected');
  lines.push('');
  for (const fw of ir.project.frameworks) {
    lines.push(`- **${fw.name}** (${fw.confidence})`);
  }
  lines.push('');

  // Endpoints section
  if (options.includeEndpoints !== false && ir.endpoints.length > 0) {
    lines.push('## Endpoints');
    lines.push('');
    lines.push('| Method | Path | Kind | Confidence |');
    lines.push('|--------|------|------|------------|');
    for (const ep of ir.endpoints) {
      lines.push(
        `| ${ep.method} | \`${ep.path}\` | ${ep.kind} | ${ep.confidence.level} |`
      );
    }
    lines.push('');
  }

  // Schemas section
  if (options.includeSchemas !== false && ir.schemas.length > 0) {
    lines.push('## Schemas');
    lines.push('');
    lines.push('| Name | Type | Confidence |');
    lines.push('|------|------|------------|');
    for (const schema of ir.schemas) {
      lines.push(
        `| ${schema.name} | ${schema.schemaType} | ${schema.confidence.level} |`
      );
    }
    lines.push('');
  }

  // Verification results
  if (verification && options.includeIssues !== false) {
    lines.push('## Verification');
    lines.push('');
    lines.push(`| Status | Count |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Valid | ${verification.summary.validEndpoints} |`);
    lines.push(`| Warnings | ${verification.summary.warningEndpoints} |`);
    lines.push(`| Errors | ${verification.summary.errorEndpoints} |`);
    lines.push('');

    const issueEndpoints = verification.endpointResults.filter(
      (r) => r.issues.length > 0
    );
    if (issueEndpoints.length > 0) {
      lines.push('### Issues');
      lines.push('');
      for (const result of issueEndpoints) {
        lines.push(`#### ${result.endpoint.method} ${result.endpoint.path}`);
        for (const issue of result.issues) {
          const icon =
            issue.severity === 'error'
              ? '❌'
              : issue.severity === 'warning'
                ? '⚠️'
                : 'ℹ️';
          lines.push(`- ${icon} **${issue.code}**: ${issue.message}`);
          if (issue.suggestion) {
            lines.push(`  - *Suggestion*: ${issue.suggestion}`);
          }
        }
        lines.push('');
      }
    }
  }

  // Ambiguities section
  if (options.includeAmbiguities !== false && ir.ambiguities.length > 0) {
    lines.push('## Ambiguities (Require Review)');
    lines.push('');
    for (const amb of ir.ambiguities) {
      lines.push(`- **${amb.type}** (${amb.itemId}): ${amb.description}`);
      if (amb.suggestion) {
        lines.push(`  - *Suggestion*: ${amb.suggestion}`);
      }
    }
    lines.push('');
  }

  // Next steps
  lines.push('## Next Steps');
  lines.push('');
  lines.push('1. Review generated contracts in the output directory');
  lines.push('2. Fill in TODO placeholders with business context');
  lines.push('3. Run `contractspec validate` to verify contracts');
  lines.push('4. Move stable contracts from `generated/` to `curated/`');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate CLI-friendly report output.
 */
export function generateCliReport(
  ir: ImportIR,
  verification?: VerifyResult
): string {
  const lines: string[] = [];

  // Summary
  lines.push('');
  lines.push('📊 Summary');
  lines.push(`   Files scanned: ${ir.stats.filesScanned}`);
  lines.push(`   Endpoints:     ${ir.stats.endpointsFound}`);
  lines.push(`   Schemas:       ${ir.stats.schemasFound}`);
  lines.push('');

  // Confidence
  lines.push('📈 Confidence');
  lines.push(`   High:   ${ir.stats.highConfidence}`);
  lines.push(`   Medium: ${ir.stats.mediumConfidence}`);
  lines.push(`   Low:    ${ir.stats.lowConfidence}`);
  lines.push('');

  // Frameworks
  lines.push('🔧 Frameworks');
  for (const fw of ir.project.frameworks) {
    lines.push(`   • ${fw.name}`);
  }
  lines.push('');

  // Verification
  if (verification) {
    lines.push('✅ Verification');
    lines.push(`   Valid:    ${verification.summary.validEndpoints}`);
    lines.push(`   Warnings: ${verification.summary.warningEndpoints}`);
    lines.push(`   Errors:   ${verification.summary.errorEndpoints}`);
    lines.push('');
  }

  return lines.join('\n');
}
