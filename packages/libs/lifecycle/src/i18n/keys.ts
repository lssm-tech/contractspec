/**
 * Typed message keys for the lifecycle i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: stage (names, questions, signals, traps, focusAreas), formatter.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// Stage Display Names
// ─────────────────────────────────────────────────────────────────────────────

export const STAGE_NAME_KEYS = {
  'stage.exploration.name': 'stage.exploration.name',
  'stage.problemSolutionFit.name': 'stage.problemSolutionFit.name',
  'stage.mvpEarlyTraction.name': 'stage.mvpEarlyTraction.name',
  'stage.productMarketFit.name': 'stage.productMarketFit.name',
  'stage.growthScaleUp.name': 'stage.growthScaleUp.name',
  'stage.expansionPlatform.name': 'stage.expansionPlatform.name',
  'stage.maturityRenewal.name': 'stage.maturityRenewal.name',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Stage Questions
// ─────────────────────────────────────────────────────────────────────────────

export const STAGE_QUESTION_KEYS = {
  'stage.exploration.question': 'stage.exploration.question',
  'stage.problemSolutionFit.question': 'stage.problemSolutionFit.question',
  'stage.mvpEarlyTraction.question': 'stage.mvpEarlyTraction.question',
  'stage.productMarketFit.question': 'stage.productMarketFit.question',
  'stage.growthScaleUp.question': 'stage.growthScaleUp.question',
  'stage.expansionPlatform.question': 'stage.expansionPlatform.question',
  'stage.maturityRenewal.question': 'stage.maturityRenewal.question',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Stage Signals
// ─────────────────────────────────────────────────────────────────────────────

export const STAGE_SIGNAL_KEYS = {
  'stage.exploration.signal.0': 'stage.exploration.signal.0',
  'stage.exploration.signal.1': 'stage.exploration.signal.1',
  'stage.exploration.signal.2': 'stage.exploration.signal.2',
  'stage.problemSolutionFit.signal.0': 'stage.problemSolutionFit.signal.0',
  'stage.problemSolutionFit.signal.1': 'stage.problemSolutionFit.signal.1',
  'stage.problemSolutionFit.signal.2': 'stage.problemSolutionFit.signal.2',
  'stage.mvpEarlyTraction.signal.0': 'stage.mvpEarlyTraction.signal.0',
  'stage.mvpEarlyTraction.signal.1': 'stage.mvpEarlyTraction.signal.1',
  'stage.mvpEarlyTraction.signal.2': 'stage.mvpEarlyTraction.signal.2',
  'stage.productMarketFit.signal.0': 'stage.productMarketFit.signal.0',
  'stage.productMarketFit.signal.1': 'stage.productMarketFit.signal.1',
  'stage.productMarketFit.signal.2': 'stage.productMarketFit.signal.2',
  'stage.growthScaleUp.signal.0': 'stage.growthScaleUp.signal.0',
  'stage.growthScaleUp.signal.1': 'stage.growthScaleUp.signal.1',
  'stage.growthScaleUp.signal.2': 'stage.growthScaleUp.signal.2',
  'stage.expansionPlatform.signal.0': 'stage.expansionPlatform.signal.0',
  'stage.expansionPlatform.signal.1': 'stage.expansionPlatform.signal.1',
  'stage.expansionPlatform.signal.2': 'stage.expansionPlatform.signal.2',
  'stage.maturityRenewal.signal.0': 'stage.maturityRenewal.signal.0',
  'stage.maturityRenewal.signal.1': 'stage.maturityRenewal.signal.1',
  'stage.maturityRenewal.signal.2': 'stage.maturityRenewal.signal.2',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Stage Traps
// ─────────────────────────────────────────────────────────────────────────────

export const STAGE_TRAP_KEYS = {
  'stage.exploration.trap.0': 'stage.exploration.trap.0',
  'stage.exploration.trap.1': 'stage.exploration.trap.1',
  'stage.problemSolutionFit.trap.0': 'stage.problemSolutionFit.trap.0',
  'stage.problemSolutionFit.trap.1': 'stage.problemSolutionFit.trap.1',
  'stage.mvpEarlyTraction.trap.0': 'stage.mvpEarlyTraction.trap.0',
  'stage.mvpEarlyTraction.trap.1': 'stage.mvpEarlyTraction.trap.1',
  'stage.productMarketFit.trap.0': 'stage.productMarketFit.trap.0',
  'stage.productMarketFit.trap.1': 'stage.productMarketFit.trap.1',
  'stage.growthScaleUp.trap.0': 'stage.growthScaleUp.trap.0',
  'stage.growthScaleUp.trap.1': 'stage.growthScaleUp.trap.1',
  'stage.expansionPlatform.trap.0': 'stage.expansionPlatform.trap.0',
  'stage.maturityRenewal.trap.0': 'stage.maturityRenewal.trap.0',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Stage Focus Areas
// ─────────────────────────────────────────────────────────────────────────────

export const STAGE_FOCUS_KEYS = {
  'stage.exploration.focus.0': 'stage.exploration.focus.0',
  'stage.exploration.focus.1': 'stage.exploration.focus.1',
  'stage.exploration.focus.2': 'stage.exploration.focus.2',
  'stage.problemSolutionFit.focus.0': 'stage.problemSolutionFit.focus.0',
  'stage.problemSolutionFit.focus.1': 'stage.problemSolutionFit.focus.1',
  'stage.problemSolutionFit.focus.2': 'stage.problemSolutionFit.focus.2',
  'stage.mvpEarlyTraction.focus.0': 'stage.mvpEarlyTraction.focus.0',
  'stage.mvpEarlyTraction.focus.1': 'stage.mvpEarlyTraction.focus.1',
  'stage.mvpEarlyTraction.focus.2': 'stage.mvpEarlyTraction.focus.2',
  'stage.productMarketFit.focus.0': 'stage.productMarketFit.focus.0',
  'stage.productMarketFit.focus.1': 'stage.productMarketFit.focus.1',
  'stage.productMarketFit.focus.2': 'stage.productMarketFit.focus.2',
  'stage.growthScaleUp.focus.0': 'stage.growthScaleUp.focus.0',
  'stage.growthScaleUp.focus.1': 'stage.growthScaleUp.focus.1',
  'stage.growthScaleUp.focus.2': 'stage.growthScaleUp.focus.2',
  'stage.expansionPlatform.focus.0': 'stage.expansionPlatform.focus.0',
  'stage.expansionPlatform.focus.1': 'stage.expansionPlatform.focus.1',
  'stage.expansionPlatform.focus.2': 'stage.expansionPlatform.focus.2',
  'stage.maturityRenewal.focus.0': 'stage.maturityRenewal.focus.0',
  'stage.maturityRenewal.focus.1': 'stage.maturityRenewal.focus.1',
  'stage.maturityRenewal.focus.2': 'stage.maturityRenewal.focus.2',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Formatter Strings
// ─────────────────────────────────────────────────────────────────────────────

export const FORMATTER_KEYS = {
  /** "Stage {order} · {name}" */
  'formatter.stageTitle': 'formatter.stageTitle',
  /** "Product: {phase}" */
  'formatter.axis.product': 'formatter.axis.product',
  /** "Company: {phase}" */
  'formatter.axis.company': 'formatter.axis.company',
  /** "Capital: {phase}" */
  'formatter.axis.capital': 'formatter.axis.capital',
  /** "Focus on upcoming milestones." */
  'formatter.action.fallback': 'formatter.action.fallback',
  /** "Next up for {name}: {actionCopy}" */
  'formatter.digest': 'formatter.digest',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...STAGE_NAME_KEYS,
  ...STAGE_QUESTION_KEYS,
  ...STAGE_SIGNAL_KEYS,
  ...STAGE_TRAP_KEYS,
  ...STAGE_FOCUS_KEYS,
  ...FORMATTER_KEYS,
} as const;

/** Union type of all valid lifecycle i18n keys */
export type LifecycleMessageKey = keyof typeof I18N_KEYS;
