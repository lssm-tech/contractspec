/**
 * Diff service.
 */

import {
  computeSemanticDiff,
  type SemanticDiffItem,
  type SemanticDiffOptions,
} from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';
import type { GitAdapter } from '../ports/git';

/**
 * Options for comparing specs.
 */
export interface CompareSpecsOptions extends SemanticDiffOptions {
  /**
   * Git ref to compare against (branch, tag, commit).
   * If provided, spec2 is loaded from this ref instead of filesystem.
   */
  baseline?: string;
}

/**
 * Result of spec comparison.
 */
export interface CompareSpecsResult {
  spec1: string;
  spec2: string;
  differences: SemanticDiffItem[];
}

/**
 * Compare two spec files semantically.
 */
export async function compareSpecs(
  spec1Path: string,
  spec2Path: string,
  adapters: { fs: FsAdapter; git: GitAdapter },
  options: CompareSpecsOptions = {}
): Promise<CompareSpecsResult> {
  const { fs, git } = adapters;

  // Load first spec from filesystem
  const exists1 = await fs.exists(spec1Path);
  if (!exists1) {
    throw new Error(`Spec file not found: ${spec1Path}`);
  }
  const spec1Code = await fs.readFile(spec1Path);

  // Load second spec either from git baseline or filesystem
  let spec2Code: string;
  let spec2Label: string;

  if (options.baseline) {
    spec2Code = await git.showFile(options.baseline, spec1Path);
    spec2Label = `${options.baseline}:${spec1Path}`;
  } else {
    const exists2 = await fs.exists(spec2Path);
    if (!exists2) {
      throw new Error(`Spec file not found: ${spec2Path}`);
    }
    spec2Code = await fs.readFile(spec2Path);
    spec2Label = spec2Path;
  }

  // Compute semantic diff
  const differences = computeSemanticDiff(
    spec1Code,
    spec1Path,
    spec2Code,
    spec2Label,
    { breakingOnly: options.breakingOnly }
  );

  return {
    spec1: spec1Path,
    spec2: spec2Label,
    differences,
  };
}
