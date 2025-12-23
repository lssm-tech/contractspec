/**
 * Impact detection service types.
 */

import type { ImpactResult } from '@lssm/module.contractspec-workspace';

// Re-export ImpactResult for convenience
export type { ImpactResult };

/** Options for impact detection */
export interface ImpactDetectionOptions {
  /** Git ref to compare against (branch, tag, commit) */
  baseline?: string;
  /** Glob pattern for spec discovery */
  pattern?: string;
  /** Workspace root directory */
  workspaceRoot?: string;
}

/** Impact detection result with additional context */
export interface ImpactDetectionResult extends ImpactResult {
  /** Working directory */
  workspaceRoot: string;
  /** Number of specs analyzed */
  specsAnalyzed: number;
}

/** PR comment options */
export interface PrCommentOptions {
  /** Template style */
  template: 'minimal' | 'detailed';
  /** Include links to files */
  includeLinks?: boolean;
  /** Repository URL for links */
  repositoryUrl?: string;
  /** Commit SHA for links */
  commitSha?: string;
}

/** GitHub check run payload */
export interface CheckRunPayload {
  /** Check run name */
  name: string;
  /** Head SHA */
  headSha: string;
  /** Conclusion */
  conclusion: 'success' | 'failure' | 'neutral';
  /** Output title */
  title: string;
  /** Output summary */
  summary: string;
  /** Annotations */
  annotations?: CheckRunAnnotation[];
}

/** Check run annotation */
export interface CheckRunAnnotation {
  path: string;
  startLine: number;
  endLine: number;
  annotationLevel: 'notice' | 'warning' | 'failure';
  message: string;
  title?: string;
}
