/**
 * Impact classification rules.
 *
 * Defines rules for classifying changes as breaking or non-breaking.
 */

import type { ImpactRule, ImpactSeverity } from './types';

/**
 * Default breaking change rules.
 */
export const BREAKING_RULES: ImpactRule[] = [
  {
    id: 'endpoint-removed',
    description: 'Endpoint/operation was removed',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('spec.') && delta.type === 'removed',
  },
  {
    id: 'field-removed',
    description: 'Field was removed from response',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.output.') && delta.description.includes('removed'),
  },
  {
    id: 'field-type-changed',
    description: 'Field type was changed',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.type') &&
      delta.description.includes('type changed'),
  },
  {
    id: 'field-made-required',
    description: 'Optional field became required',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.required') &&
      delta.description.includes('optional to required'),
  },
  {
    id: 'enum-value-removed',
    description: 'Enum value was removed',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.enumValues') &&
      delta.description.includes('removed'),
  },
  {
    id: 'nullable-removed',
    description: 'Field is no longer nullable',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.nullable') &&
      delta.description.includes('no longer nullable'),
  },
  {
    id: 'method-changed',
    description: 'HTTP method was changed',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.http.method') || delta.path.includes('.method'),
  },
  {
    id: 'path-changed',
    description: 'HTTP path was changed',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.http.path') || delta.path.includes('.path'),
  },
  {
    id: 'required-field-added-to-input',
    description: 'Required field was added to input',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.input.') &&
      delta.description.includes('Required field'),
  },
  {
    id: 'event-payload-field-removed',
    description: 'Event payload field was removed',
    severity: 'breaking',
    matches: (delta) =>
      delta.path.includes('.payload.') && delta.description.includes('removed'),
  },
];

/**
 * Non-breaking change rules.
 */
export const NON_BREAKING_RULES: ImpactRule[] = [
  {
    id: 'optional-field-added',
    description: 'Optional field was added',
    severity: 'non_breaking',
    matches: (delta) =>
      delta.description.includes('Optional field') &&
      delta.description.includes('added'),
  },
  {
    id: 'endpoint-added',
    description: 'New endpoint/operation was added',
    severity: 'non_breaking',
    matches: (delta) => delta.path.includes('spec.') && delta.type === 'added',
  },
  {
    id: 'enum-value-added',
    description: 'Enum value was added',
    severity: 'non_breaking',
    matches: (delta) =>
      delta.path.includes('.enumValues') && delta.description.includes('added'),
  },
  {
    id: 'field-made-optional',
    description: 'Required field became optional',
    severity: 'non_breaking',
    matches: (delta) =>
      delta.path.includes('.required') &&
      delta.description.includes('required to optional'),
  },
  {
    id: 'nullable-added',
    description: 'Field is now nullable',
    severity: 'non_breaking',
    matches: (delta) =>
      delta.path.includes('.nullable') &&
      delta.description.includes('now nullable'),
  },
];

/**
 * Info-level change rules.
 */
export const INFO_RULES: ImpactRule[] = [
  {
    id: 'stability-changed',
    description: 'Stability level was changed',
    severity: 'info',
    matches: (delta) => delta.path.includes('.stability'),
  },
  {
    id: 'description-changed',
    description: 'Description was changed',
    severity: 'info',
    matches: (delta) => delta.path.includes('.description'),
  },
  {
    id: 'owners-changed',
    description: 'Owners were changed',
    severity: 'info',
    matches: (delta) => delta.path.includes('.owners'),
  },
  {
    id: 'tags-changed',
    description: 'Tags were changed',
    severity: 'info',
    matches: (delta) => delta.path.includes('.tags'),
  },
];

/**
 * All default rules in priority order (breaking > non_breaking > info).
 */
export const DEFAULT_RULES: ImpactRule[] = [
  ...BREAKING_RULES,
  ...NON_BREAKING_RULES,
  ...INFO_RULES,
];

/**
 * Get rules by severity.
 */
export function getRulesBySeverity(severity: ImpactSeverity): ImpactRule[] {
  return DEFAULT_RULES.filter((rule) => rule.severity === severity);
}

/**
 * Find matching rule for a delta.
 */
export function findMatchingRule(
  delta: { path: string; description: string; type: string },
  rules: ImpactRule[] = DEFAULT_RULES
): ImpactRule | undefined {
  return rules.find((rule) => rule.matches(delta));
}
