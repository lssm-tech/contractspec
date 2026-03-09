/**
 * Motion adapter stub. Maps pace preference to motion tokens.
 * Aligns with 01_preference_dimensions.md animation mapping.
 * No direct Motion imports in Phase 2 — tokens drive CSS or future Motion usage.
 */

import type { MotionBundleAdapter, MotionTokens } from './interfaces';
import type { PreferenceDimensions } from '../spec/types';

const PACE_TOKENS: Record<PreferenceDimensions['pace'], MotionTokens> = {
  deliberate: {
    durationMs: 300,
    enableEntrance: true,
    layout: true,
  },
  balanced: {
    durationMs: 150,
    enableEntrance: true,
    layout: true,
  },
  rapid: {
    durationMs: 50,
    enableEntrance: false,
    layout: false,
  },
};

export const motionAdapterStub: MotionBundleAdapter = {
  getTokens(pace: PreferenceDimensions['pace']): MotionTokens {
    return PACE_TOKENS[pace] ?? PACE_TOKENS.balanced;
  },
};
