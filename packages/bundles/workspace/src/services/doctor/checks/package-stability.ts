import type { FsAdapter } from '../../../ports/fs';
import type { CheckContext, CheckResult } from '../types';
import {
  auditWorkspacePackages,
  type PackageAuditFinding,
} from '../../stability/package-audit';
import {
  getStabilityPolicyPath,
  loadStabilityPolicy,
} from '../../stability/policy';

function summarizeFindings(findings: PackageAuditFinding[]): string {
  return findings
    .slice(0, 5)
    .map((finding) => `${finding.packagePath}: ${finding.message}`)
    .join('; ');
}

function createCheckResult(
  name: string,
  findings: PackageAuditFinding[],
  failureCodes: ReadonlySet<string>,
  successMessage: string
): CheckResult {
  if (findings.length === 0) {
    return {
      category: 'workspace',
      name,
      status: 'pass',
      message: successMessage,
      context: { findings: [] },
    };
  }

  const failingFindings = findings.filter((finding) => {
    return finding.tier === 'critical' || failureCodes.has(finding.code);
  });

  return {
    category: 'workspace',
    name,
    status: failingFindings.length > 0 ? 'fail' : 'warn',
    message: `${findings.length} package issue(s) found`,
    details: summarizeFindings(findings),
    context: { findings },
  };
}

export async function runPackageStabilityChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const policy = await loadStabilityPolicy(fs, ctx.workspaceRoot);
  if (!policy) {
    return [];
  }

  const report = await auditWorkspacePackages(fs, ctx.workspaceRoot, policy);
  const criticalPackageCodes = new Set([
    'critical-missing-build-script',
    'critical-missing-typecheck-script',
    'critical-missing-lint-script',
    'critical-missing-test-script',
    'critical-missing-test-files',
    'critical-pass-with-no-tests',
  ]);

  const qualityGateFindings = report.findings.filter((finding) =>
    criticalPackageCodes.has(finding.code)
  );
  const testsWithoutScript = report.findings.filter(
    (finding) => finding.code === 'tests-without-test-script'
  );
  const buildWithoutTests = report.findings.filter(
    (finding) => finding.code === 'build-without-tests'
  );

  return [
    {
      category: 'workspace',
      name: 'Critical Package Gates',
      status: qualityGateFindings.length > 0 ? 'fail' : 'pass',
      message:
        qualityGateFindings.length > 0
          ? `${qualityGateFindings.length} critical package gate failure(s)`
          : `All ${report.criticalPackages.length} critical packages meet build, lint, typecheck, and test requirements`,
      details:
        qualityGateFindings.length > 0
          ? summarizeFindings(qualityGateFindings)
          : ctx.verbose
            ? `Policy: ${getStabilityPolicyPath(ctx.workspaceRoot)}`
            : undefined,
      context: {
        policyPath: getStabilityPolicyPath(ctx.workspaceRoot),
        criticalPackages: report.criticalPackages,
        findings: qualityGateFindings,
      },
    },
    createCheckResult(
      'Package Test Scripts',
      testsWithoutScript,
      new Set<string>(),
      'All tested packages expose a test script'
    ),
    createCheckResult(
      'Buildable Packages Without Tests',
      buildWithoutTests,
      new Set<string>(),
      'All buildable packages have tests or explicit test scripts'
    ),
  ];
}
