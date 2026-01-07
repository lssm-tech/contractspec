/**
 * CI check utilities.
 */

import type { FsAdapter } from '../../ports/fs';
import type { CICheckCategory, CICheckCategorySummary, CIIssue } from './types';

/**
 * Create a category summary from issues.
 */
export function createCategorySummary(
  category: CICheckCategory,
  issues: CIIssue[],
  durationMs: number
): CICheckCategorySummary {
  const categoryLabels: Record<CICheckCategory, string> = {
    structure: 'Spec Structure Validation',
    integrity: 'Contract Integrity Analysis',
    deps: 'Dependency Analysis',
    doctor: 'Installation Health',
    handlers: 'Handler Implementation',
    tests: 'Test Coverage',
    'test-refs': 'Test Reference Validation',
    coverage: 'Coverage Verification',
    implementation: 'Implementation Verification',
    layers: 'Contract Layers Validation',
    drift: 'Drift Detection',
  };

  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const notes = issues.filter((i) => i.severity === 'note').length;

  return {
    category,
    label: categoryLabels[category],
    errors,
    warnings,
    notes,
    passed: errors === 0,
    durationMs,
  };
}

/**
 * Get git information if available.
 */
export async function getGitInfo(
  fs: FsAdapter
): Promise<{ commitSha?: string; branch?: string }> {
  try {
    // Try to read from .git/HEAD and refs
    const gitHeadPath = '.git/HEAD';
    if (!(await fs.exists(gitHeadPath))) {
      return {};
    }

    const headContent = await fs.readFile(gitHeadPath);
    const refMatch = headContent.match(/^ref: (.+)$/m);

    if (refMatch) {
      const branch = refMatch[1]?.replace('refs/heads/', '');
      const refPath = `.git/${refMatch[1]}`;

      if (await fs.exists(refPath)) {
        const commitSha = (await fs.readFile(refPath)).trim();
        return { commitSha, branch };
      }

      return { branch };
    }

    // Detached HEAD - content is the SHA
    const commitSha = headContent.trim();
    return { commitSha };
  } catch {
    return {};
  }
}

/**
 * Determine which checks to run based on options.
 */
export function getChecksToRun(options: {
  checkHandlers?: boolean;
  checkTests?: boolean;
  implementation?: unknown;
  checkDrift?: boolean;
  checks?: CICheckCategory[];
  skip?: CICheckCategory[];
}): CICheckCategory[] {
  const allCategories: CICheckCategory[] = [
    'structure',
    'integrity',
    'deps',
    'doctor',
  ];

  // Add optional checks if explicitly requested
  if (options.checkHandlers) {
    allCategories.push('handlers');
  }
  if (options.checkTests) {
    allCategories.push('tests');
  }
  if (options.implementation) {
    allCategories.push('implementation');
  }
  if (options.checkDrift) {
    allCategories.push('drift');
  }

  // If specific checks are requested, use those
  if (options.checks && options.checks.length > 0) {
    return options.checks;
  }

  // Otherwise, use all minus skipped
  if (options.skip && options.skip.length > 0) {
    return allCategories.filter((c) => !options.skip?.includes(c));
  }

  return allCategories;
}
