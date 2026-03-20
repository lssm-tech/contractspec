import type { FsAdapter } from '../../ports/fs';

export type StabilityTier = 'critical' | 'non-critical';

export interface StabilityPolicy {
  version: number;
  criticalPackages: string[];
  criticalFeatureKeys: string[];
  smokePackages: string[];
}

interface StabilityPolicyFile {
  version?: number;
  criticalPackages?: string[];
  criticalFeatureKeys?: string[];
  smokePackages?: string[];
}

const STABILITY_POLICY_PATH = 'config/stability-policy.json';

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+$/, '');
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function loadStabilityPolicy(
  fs: FsAdapter,
  workspaceRoot: string
): Promise<StabilityPolicy | undefined> {
  const policyPath = fs.join(workspaceRoot, STABILITY_POLICY_PATH);
  if (!(await fs.exists(policyPath))) {
    return undefined;
  }

  try {
    const content = await fs.readFile(policyPath);
    const parsed = JSON.parse(content) as StabilityPolicyFile;

    return {
      version:
        typeof parsed.version === 'number' && Number.isFinite(parsed.version)
          ? parsed.version
          : 1,
      criticalPackages: toStringArray(parsed.criticalPackages).map(
        normalizePath
      ),
      criticalFeatureKeys: toStringArray(parsed.criticalFeatureKeys),
      smokePackages: toStringArray(parsed.smokePackages),
    };
  } catch {
    return undefined;
  }
}

export function getPackageTier(
  relativePackagePath: string,
  policy?: StabilityPolicy
): StabilityTier {
  const normalizedPath = normalizePath(relativePackagePath);
  if (policy?.criticalPackages.includes(normalizedPath)) {
    return 'critical';
  }

  return 'non-critical';
}

export function isCriticalFeatureKey(
  featureKey: string,
  policy?: StabilityPolicy
): boolean {
  return Boolean(
    featureKey && policy?.criticalFeatureKeys.includes(featureKey)
  );
}

export function getStabilityPolicyPath(workspaceRoot: string): string {
  return normalizePath(
    `${normalizePath(workspaceRoot)}/${STABILITY_POLICY_PATH}`
  );
}
