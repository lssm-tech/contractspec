/**
 * Typed message keys for the lifecycle-core i18n system.
 *
 * All translatable strings in the module are referenced by these keys.
 * Organized by domain: milestone (titles, descriptions, action items).
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// Milestone Titles & Descriptions
// ─────────────────────────────────────────────────────────────────────────────

export const MILESTONE_KEYS = {
  'milestone.stage0ProblemStatement.title':
    'milestone.stage0ProblemStatement.title',
  'milestone.stage0ProblemStatement.description':
    'milestone.stage0ProblemStatement.description',
  'milestone.stage0ProblemStatement.action.0':
    'milestone.stage0ProblemStatement.action.0',
  'milestone.stage0ProblemStatement.action.1':
    'milestone.stage0ProblemStatement.action.1',

  'milestone.stage1PrototypeLoop.title': 'milestone.stage1PrototypeLoop.title',
  'milestone.stage1PrototypeLoop.description':
    'milestone.stage1PrototypeLoop.description',
  'milestone.stage1PrototypeLoop.action.0':
    'milestone.stage1PrototypeLoop.action.0',
  'milestone.stage1PrototypeLoop.action.1':
    'milestone.stage1PrototypeLoop.action.1',

  'milestone.stage2Activation.title': 'milestone.stage2Activation.title',
  'milestone.stage2Activation.description':
    'milestone.stage2Activation.description',
  'milestone.stage2Activation.action.0': 'milestone.stage2Activation.action.0',
  'milestone.stage2Activation.action.1': 'milestone.stage2Activation.action.1',

  'milestone.stage3RetentionNarrative.title':
    'milestone.stage3RetentionNarrative.title',
  'milestone.stage3RetentionNarrative.description':
    'milestone.stage3RetentionNarrative.description',
  'milestone.stage3RetentionNarrative.action.0':
    'milestone.stage3RetentionNarrative.action.0',
  'milestone.stage3RetentionNarrative.action.1':
    'milestone.stage3RetentionNarrative.action.1',

  'milestone.stage4GrowthLoop.title': 'milestone.stage4GrowthLoop.title',
  'milestone.stage4GrowthLoop.description':
    'milestone.stage4GrowthLoop.description',
  'milestone.stage4GrowthLoop.action.0': 'milestone.stage4GrowthLoop.action.0',
  'milestone.stage4GrowthLoop.action.1': 'milestone.stage4GrowthLoop.action.1',
  'milestone.stage4GrowthLoop.action.2': 'milestone.stage4GrowthLoop.action.2',

  'milestone.stage5PlatformBlueprint.title':
    'milestone.stage5PlatformBlueprint.title',
  'milestone.stage5PlatformBlueprint.description':
    'milestone.stage5PlatformBlueprint.description',
  'milestone.stage5PlatformBlueprint.action.0':
    'milestone.stage5PlatformBlueprint.action.0',
  'milestone.stage5PlatformBlueprint.action.1':
    'milestone.stage5PlatformBlueprint.action.1',

  'milestone.stage6RenewalOps.title': 'milestone.stage6RenewalOps.title',
  'milestone.stage6RenewalOps.description':
    'milestone.stage6RenewalOps.description',
  'milestone.stage6RenewalOps.action.0': 'milestone.stage6RenewalOps.action.0',
  'milestone.stage6RenewalOps.action.1': 'milestone.stage6RenewalOps.action.1',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...MILESTONE_KEYS,
} as const;

/** Union type of all valid lifecycle-core i18n keys */
export type LifecycleCoreMessageKey = keyof typeof I18N_KEYS;
