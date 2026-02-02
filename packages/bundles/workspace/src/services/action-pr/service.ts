import type {
  FinalizeResult,
  ImpactJson,
  ReportData,
  ReportInputs,
} from './types';

const MAX_DETAIL_CHARS = 60000;
const MAX_LIST_ITEMS = 20;

function formatAge(dateStr?: string): string {
  if (!dateStr) return '\u2014';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'today';
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
}

export class PrActionService {
  collectChanges(
    contractsDir: string,
    contractsGlob: string,
    changedFiles: string[]
  ): string[] {
    if (contractsDir) {
      const prefix = contractsDir.endsWith('/')
        ? contractsDir
        : `${contractsDir}/`;
      return changedFiles.filter((path) => path.startsWith(prefix));
    }

    if (contractsGlob) {
      // Simple glob to regex conversion
      const re = new RegExp(
        '^' +
          contractsGlob
            .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex chars
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.') +
          '$'
      );
      return changedFiles.filter((path) => re.test(path));
    }

    return changedFiles;
  }

  detectDrift(statusLines: string[]): {
    files: string[];
    status: 'pass' | 'fail';
  } {
    // lines are like " M packages/..." or "?? packages/..."
    // Python code: files = [line[3:] for line in status_lines if line.strip()]
    // and filter out .contractspec-ci
    const files = statusLines
      .map((line) => line.slice(3))
      .filter((path) => path && path.trim().length > 0)
      .filter(
        (path) =>
          path !== '.contractspec-ci' && !path.startsWith('.contractspec-ci/')
      );

    return {
      files,
      status: files.length > 0 ? 'fail' : 'pass',
    };
  }

  private deriveImpactStatus(impactJson: ImpactJson | undefined): {
    status: string;
    breaking: boolean;
    breakingCount: number;
    nonBreakingCount: number;
    total: number;
  } {
    const summary = impactJson?.summary || {};
    const breakingCount = summary.breaking || 0;
    const nonBreakingCount = summary.nonBreaking || 0;
    let totalCount = summary.total;
    if (totalCount === undefined) {
      totalCount = breakingCount + nonBreakingCount;
    }

    let breaking = impactJson?.breaking || false;
    let impactStatus = 'unknown';

    if (impactJson) {
      if (breaking || breakingCount > 0) {
        impactStatus = 'breaking';
        breaking = true;
      } else if (nonBreakingCount > 0) {
        impactStatus = 'non-breaking';
      } else if (totalCount === 0) {
        impactStatus = 'no-impact';
      }
    }

    return {
      status: impactStatus,
      breaking,
      breakingCount,
      nonBreakingCount,
      total: totalCount || 0,
    };
  }

  buildReportData(inputs: ReportInputs): ReportData {
    const changesSummary =
      inputs.contractChanges.length === 0
        ? 'No contract files changed.'
        : `${inputs.contractChanges.length} contract file(s) changed.`;

    const impactDerived = this.deriveImpactStatus(inputs.impactJson);

    const reportData: ReportData = {
      contracts: inputs.contractsJson,
      whatChanged: {
        summary: changesSummary,
        detailsPath: '.contractspec-ci/product-view.md',
      },
      risk: {
        status: impactDerived.status,
        breaking: impactDerived.breakingCount,
        nonBreaking: impactDerived.nonBreakingCount,
      },
      validation: {
        status: inputs.validationStatus,
        outputPath: '.contractspec-ci/validation.txt',
      },
      drift: {
        status: inputs.driftStatus,
        files: inputs.driftFiles,
      },
      nextSteps: [],
    };

    if (reportData.validation?.status === 'fail') {
      reportData.nextSteps?.push(
        'Fix validation errors and rerun the workflow.'
      );
    }
    if (reportData.risk?.status === 'breaking') {
      reportData.nextSteps?.push(
        'Review breaking changes and plan a migration.'
      );
    }
    if (reportData.risk?.status === 'unknown') {
      reportData.nextSteps?.push(
        'Re-run impact detection or check contractspec impact output.'
      );
    }
    if (reportData.drift?.status === 'fail') {
      reportData.nextSteps?.push(
        'Run the generate command locally and commit drift fixes.'
      );
    }

    // Add CI failure reasons logic here for "nextSteps" prepend?
    // In Python it was done separately. Here is fine too.
    const failureCheck = this.finalizeResults(reportData, inputs.failOn);
    if (failureCheck.shouldFail) {
      reportData.nextSteps?.unshift(
        `CI failed: ${failureCheck.failReasons.join(', ')} (fail_on=${inputs.failOn}).`
      );
    }

    return reportData;
  }

  finalizeResults(data: ReportData, failOn: string): FinalizeResult {
    const breakingDetected =
      data.risk?.status === 'breaking' || (data.risk?.breaking || 0) > 0;
    const driftFailed = data.drift?.status === 'fail';
    const validationFailed = data.validation?.status === 'fail';
    const impactUnknown = data.risk?.status === 'unknown';

    const reasons: string[] = [];
    let shouldFail = false;

    if (failOn !== 'never') {
      if (failOn === 'breaking') {
        if (breakingDetected) reasons.push('breaking changes detected');
        if (impactUnknown) reasons.push('impact status unknown');
      } else if (failOn === 'drift') {
        if (driftFailed) reasons.push('drift detected');
        if (impactUnknown) reasons.push('impact status unknown');
      } else if (failOn === 'any') {
        if (breakingDetected) reasons.push('breaking changes detected');
        if (driftFailed) reasons.push('drift detected');
        if (validationFailed) reasons.push('validation failed');
        if (impactUnknown) reasons.push('impact status unknown');
      } else {
        reasons.push(`invalid fail_on value (${failOn})`);
      }

      if (reasons.length > 0) {
        shouldFail = true;
      }
    }

    return {
      driftDetected: driftFailed,
      breakingChangeDetected: breakingDetected,
      validationFailed: validationFailed,
      shouldFail,
      failReasons: reasons,
    };
  }

  generateReportMarkdown(
    data: ReportData,
    fileContentProvider: (path: string) => string
  ): string {
    const truncate = (value: string, maxChars = MAX_DETAIL_CHARS): string => {
      if (value.length <= maxChars) return value;
      return `${value.slice(0, maxChars)}\n\n*(output truncated)*`;
    };

    const formatList = (items?: string[]): string => {
      if (!items || items.length === 0) return '- None';
      return items
        .slice(0, MAX_LIST_ITEMS)
        .map((item) => `- ${item}`)
        .join('\n');
    };

    const viewContent = truncate(
      data.whatChanged?.detailsPath
        ? fileContentProvider(data.whatChanged.detailsPath)
        : ''
    );
    const validationOutput = truncate(
      data.validation?.outputPath
        ? fileContentProvider(data.validation.outputPath)
        : ''
    );
    const driftFiles = data.drift?.files ?? [];

    const lines: string[] = [];

    lines.push('## ContractSpec Report');
    lines.push('');

    if (data.contracts && data.contracts.length > 0) {
      lines.push('### Overall verification status');
      lines.push('');
      lines.push(
        '| Contract / Endpoint / Event | Time since verified | Drift debt | Surfaces covered | Last verified commit |'
      );
      lines.push('| --- | --- | --- | --- | --- |');
      for (const c of data.contracts) {
        const sha = c.lastVerifiedSha ?? '\u2014';
        const time = formatAge(c.lastVerifiedDate);
        const surfaces = c.surfaces.join(', ');
        lines.push(
          `| ${c.name} | ${time} | ${c.driftMismatches} | ${surfaces} | ${sha} |`
        );
      }
      lines.push('');
    }

    lines.push('### 1) What changed');
    if (data.whatChanged?.summary) {
      lines.push(data.whatChanged.summary);
    } else {
      lines.push('No contract changes detected.');
    }
    if (viewContent.trim().length > 0) {
      lines.push('');
      lines.push('<details>');
      lines.push('<summary>Contract view (product)</summary>');
      lines.push('');
      lines.push(viewContent);
      lines.push('');
      lines.push('</details>');
    }

    lines.push('');
    lines.push('### 2) Risk classification');
    if (data.risk?.status) {
      const riskSummary = [
        `Status: ${data.risk.status}`,
        data.risk.breaking !== undefined
          ? `Breaking: ${data.risk.breaking}`
          : null,
        data.risk.nonBreaking !== undefined
          ? `Non-breaking: ${data.risk.nonBreaking}`
          : null,
      ].filter(Boolean);
      lines.push(riskSummary.join(' | '));
    } else {
      lines.push('Impact analysis unavailable.');
    }

    lines.push('');
    lines.push('### 3) Validation results');
    if (data.validation?.status) {
      lines.push(`Status: ${data.validation.status}`);
      if (validationOutput.trim().length > 0) {
        lines.push('');
        lines.push('<details>');
        lines.push('<summary>Validation output</summary>');
        lines.push('');
        lines.push(validationOutput);
        lines.push('');
        lines.push('</details>');
      }
    } else {
      lines.push('Validation step not run.');
    }

    lines.push('');
    lines.push('### 4) Drift results');
    if (data.drift?.status) {
      lines.push(`Status: ${data.drift.status}`);
      if (driftFiles.length > 0) {
        lines.push('');
        lines.push('<details>');
        lines.push('<summary>Drifted files</summary>');
        lines.push('');
        lines.push(formatList(driftFiles));
        lines.push('');
        lines.push('</details>');
      }
    } else {
      lines.push('Drift check not run.');
    }

    lines.push('');
    lines.push('### 5) Next steps');
    if (data.nextSteps && data.nextSteps.length > 0) {
      lines.push(formatList(data.nextSteps));
    } else {
      lines.push('- No action required.');
    }

    return `${lines.join('\n')}\n`;
  }
}
