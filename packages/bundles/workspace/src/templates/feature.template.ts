/**
 * Template for generating Feature specs
 */

// Basic helper for camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export interface FeatureSpecParams {
  key: string;
  title: string;
  description?: string;
  stability?: 'experimental' | 'alpha' | 'beta' | 'stable' | 'deprecated';
  owners: string[];
  tags: string[];
  display?: string;
  operations: { name: string; version: string }[];
  events: { name: string; version: string }[];
  presentations: { name: string; version: string }[];
  experiments: { name: string; version: string }[];
}

export function generateFeatureSpec(params: FeatureSpecParams): string {
  const formatRefs = (refs: { name: string; version: string }[]) =>
    refs
      .map((r) => `    { name: '${r.name}', version: '${r.version}' },`)
      .join('\n');

  return `/**
 * ${params.title} Feature
 * 
 * Auto-generated feature spec.
 */

import { defineFeature } from '@contractspec/lib.contracts-spec';

export const ${toCamelCase(params.key)}Feature = defineFeature({
  key: '${params.key}',
  title: '${params.title}',
  description: '${params.description || 'TODO: Add description'}',
  stability: '${params.stability || 'alpha'}',
  owners: [${params.owners.map((o) => `'${o}'`).join(', ')}],
  tags: [${params.tags.map((t) => `'${t}'`).join(', ')}],

  operations: [
${formatRefs(params.operations) || '    // Add operations here'}
  ],

  events: [
${formatRefs(params.events) || '    // Add events here'}
  ],

  presentations: [
${formatRefs(params.presentations) || '    // Add presentations here'}
  ],

  experiments: [
${formatRefs(params.experiments) || '    // Add experiments here'}
  ],

  capabilities: {
    provides: [],
    requires: [],
  },
});
`;
}
