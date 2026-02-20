/**
 * Typed message keys for the learning-journey i18n system.
 *
 * Keys cover XP breakdown source labels shown in UIs.
 *
 * @module i18n/keys
 */

export const XP_SOURCE_KEYS = {
  'xp.source.base': 'xp.source.base',
  'xp.source.scoreBonus': 'xp.source.scoreBonus',
  'xp.source.perfectScore': 'xp.source.perfectScore',
  'xp.source.firstAttempt': 'xp.source.firstAttempt',
  'xp.source.retryPenalty': 'xp.source.retryPenalty',
  'xp.source.streakBonus': 'xp.source.streakBonus',
} as const;

export const I18N_KEYS = {
  ...XP_SOURCE_KEYS,
} as const;

/** Union type of all valid learning-journey i18n keys */
export type LearningJourneyMessageKey = keyof typeof I18N_KEYS;
