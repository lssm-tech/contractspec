/**
 * Types for verification snapshots (14_verification_matrix.md).
 * Captures surface + preference combination for regression coverage.
 */

import type { PreferenceDimensions } from './types';

/** Input for a verification snapshot: preferences + human-readable label. */
export interface VerificationSnapshotInput {
  /** Short label for the snapshot (e.g. "density=minimal"). */
  label: string;
  /** Preference overrides for this snapshot. */
  preferences: Partial<PreferenceDimensions>;
  /** Optional description of what this combination tests. */
  description?: string;
}

/** Minimal serializable summary of a resolved plan for snapshot comparison. */
export interface VerificationSnapshotSummary {
  bundleKey: string;
  surfaceId: string;
  layoutId: string;
  layoutRootType: string;
  preferences: PreferenceDimensions;
  slotCount: number;
}
