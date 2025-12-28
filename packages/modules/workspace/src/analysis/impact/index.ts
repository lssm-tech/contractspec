/**
 * Impact analysis module.
 *
 * Provides classification of contract changes as breaking or non-breaking.
 */

export * from './types';
export {
  DEFAULT_RULES,
  BREAKING_RULES,
  NON_BREAKING_RULES,
  INFO_RULES,
  findMatchingRule,
  getRulesBySeverity,
} from './rules';
export { classifyImpact } from './classifier';
