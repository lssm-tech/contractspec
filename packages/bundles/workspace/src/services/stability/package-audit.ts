import type { FsAdapter } from '../../ports/fs';
import type { StabilityPolicy, StabilityTier } from './policy';
import { getPackageTier } from './policy';

export type PackageAuditFindingCode =
  | 'critical-missing-build-script'
  | 'critical-missing-typecheck-script'
  | 'critical-missing-lint-script'
  | 'critical-missing-test-script'
  | 'critical-missing-test-files'
  | 'critical-pass-with-no-tests'
  | 'tests-without-test-script'
  | 'build-without-tests';

export interface PackageAuditFinding {
  code: PackageAuditFindingCode;
  tier: StabilityTier;
  packageName: string;
  packagePath: string;
  message: string;
}

export interface CriticalPackageStatus {
  packageName: string;
  packagePath: string;
  hasBuildScript: boolean;
  hasTypecheckScript: boolean;
  hasLintScript: boolean;
  hasTestScript: boolean;
  usesPassWithNoTests: boolean;
  testFileCount: number;
}

export interface PackageAuditReport {
  findings: PackageAuditFinding[];
  criticalPackages: CriticalPackageStatus[];
}

interface PackageDescriptor {
  packageName: string;
  packagePath: string;
  hasBuildScript: boolean;
  hasTypecheckScript: boolean;
  hasLintScript: boolean;
  hasTestScript: boolean;
  usesPassWithNoTests: boolean;
  testFileCount: number;
  tier: StabilityTier;
}

const TEST_FILE_PATTERNS = ['**/*.{test,spec}.{ts,tsx,js,jsx,mts,cts}'];
const TEST_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.next/**',
  '**/.turbo/**',
  '**/coverage/**',
];

function toRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value).reduce<Record<string, string>>(
    (acc, [key, entry]) => {
      if (typeof entry === 'string') {
        acc[key] = entry;
      }
      return acc;
    },
    {}
  );
}

function usesPassWithNoTests(scripts: Record<string, string>): boolean {
  return Object.entries(scripts).some(([name, command]) => {
    return name.startsWith('test') && /pass[- ]with[- ]no[- ]tests/i.test(command);
  });
}

async function discoverPackages(
  fs: FsAdapter,
  workspaceRoot: string,
  policy: StabilityPolicy
): Promise<PackageDescriptor[]> {
  const packageJsonFiles = await fs.glob({
    pattern: 'packages/**/package.json',
    cwd: workspaceRoot,
    ignore: TEST_IGNORES,
  });

  const descriptors: PackageDescriptor[] = [];

  for (const packageJsonFile of packageJsonFiles) {
    const packagePath = fs.dirname(packageJsonFile);
    const relativePackagePath = fs.relative(workspaceRoot, packagePath);

    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonFile)) as {
        name?: string;
        scripts?: Record<string, unknown>;
      };
      const scripts = toRecord(packageJson.scripts);
      const testFiles = await fs.glob({
        patterns: TEST_FILE_PATTERNS,
        cwd: packagePath,
        ignore: TEST_IGNORES,
      });

      descriptors.push({
        packageName: packageJson.name ?? relativePackagePath,
        packagePath: relativePackagePath.replace(/\\/g, '/'),
        hasBuildScript: typeof scripts.build === 'string',
        hasTypecheckScript: typeof scripts.typecheck === 'string',
        hasLintScript:
          typeof scripts.lint === 'string' || typeof scripts['lint:check'] === 'string',
        hasTestScript: typeof scripts.test === 'string',
        usesPassWithNoTests: usesPassWithNoTests(scripts),
        testFileCount: testFiles.length,
        tier: getPackageTier(relativePackagePath, policy),
      });
    } catch {
      continue;
    }
  }

  return descriptors;
}

function createCriticalFindings(
  descriptor: PackageDescriptor
): PackageAuditFinding[] {
  const findings: PackageAuditFinding[] = [];

  if (!descriptor.hasBuildScript) {
    findings.push({
      code: 'critical-missing-build-script',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Missing build script',
    });
  }

  if (!descriptor.hasTypecheckScript) {
    findings.push({
      code: 'critical-missing-typecheck-script',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Missing typecheck script',
    });
  }

  if (!descriptor.hasLintScript) {
    findings.push({
      code: 'critical-missing-lint-script',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Missing lint or lint:check script',
    });
  }

  if (!descriptor.hasTestScript) {
    findings.push({
      code: 'critical-missing-test-script',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Missing test script',
    });
  }

  if (descriptor.testFileCount === 0) {
    findings.push({
      code: 'critical-missing-test-files',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'No real test files found',
    });
  }

  if (descriptor.usesPassWithNoTests) {
    findings.push({
      code: 'critical-pass-with-no-tests',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Uses pass-with-no-tests in a critical package',
    });
  }

  return findings;
}

function createGeneralFindings(
  descriptor: PackageDescriptor
): PackageAuditFinding[] {
  const findings: PackageAuditFinding[] = [];

  if (descriptor.testFileCount > 0 && !descriptor.hasTestScript) {
    findings.push({
      code: 'tests-without-test-script',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Has test files on disk but no test script',
    });
  }

  if (
    descriptor.hasBuildScript &&
    descriptor.testFileCount === 0 &&
    !descriptor.hasTestScript
  ) {
    findings.push({
      code: 'build-without-tests',
      tier: descriptor.tier,
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      message: 'Has a build script but no test script or test files',
    });
  }

  return findings;
}

export async function auditWorkspacePackages(
  fs: FsAdapter,
  workspaceRoot: string,
  policy: StabilityPolicy
): Promise<PackageAuditReport> {
  const packages = await discoverPackages(fs, workspaceRoot, policy);
  const findings: PackageAuditFinding[] = [];

  for (const descriptor of packages) {
    if (descriptor.tier === 'critical') {
      findings.push(...createCriticalFindings(descriptor));
    }

    findings.push(...createGeneralFindings(descriptor));
  }

  const criticalPackages = packages
    .filter((descriptor) => descriptor.tier === 'critical')
    .map((descriptor) => ({
      packageName: descriptor.packageName,
      packagePath: descriptor.packagePath,
      hasBuildScript: descriptor.hasBuildScript,
      hasTypecheckScript: descriptor.hasTypecheckScript,
      hasLintScript: descriptor.hasLintScript,
      hasTestScript: descriptor.hasTestScript,
      usesPassWithNoTests: descriptor.usesPassWithNoTests,
      testFileCount: descriptor.testFileCount,
    }));

  return { findings, criticalPackages };
}
