/**
 * Impact analysis module.
 *
 * Provides classification of contract changes as breaking or non-breaking.
 */

export { classifyImpact } from './classifier';
export {
	BREAKING_RULES,
	DEFAULT_RULES,
	findMatchingRule,
	getRulesBySeverity,
	INFO_RULES,
	NON_BREAKING_RULES,
} from './rules';
export * from './types';
