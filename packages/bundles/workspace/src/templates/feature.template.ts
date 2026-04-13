/**
 * Template for generating Feature specs
 */

function toPascalCase(str: string): string {
	return str
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}

export interface FeatureSpecParams {
	key: string;
	version: string;
	title: string;
	domain: string;
	description?: string;
	stability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
	owners: string[];
	tags: string[];
	operations: { key: string; version: string }[];
	events: { key: string; version: string }[];
	presentations: { key: string; version: string }[];
	experiments: { key: string; version: string }[];
}

export function generateFeatureSpec(params: FeatureSpecParams): string {
	const formatRefs = (refs: { key: string; version: string }[]) =>
		refs
			.map((r) => `    { key: '${r.key}', version: '${r.version}' },`)
			.join('\n');

	return `/**
 * ${params.title} Feature
 * 
 * Auto-generated feature spec.
 */

import { defineFeature } from '@contractspec/lib.contracts-spec';

export const ${toPascalCase(params.key)}Feature = defineFeature({
  meta: {
    key: '${params.key}',
    version: '${params.version}',
    title: '${params.title}',
    description: '${params.description || 'TODO: Add description'}',
    domain: '${params.domain}',
    owners: [${params.owners.map((o) => `'${o}'`).join(', ')}],
    tags: [${params.tags.map((t) => `'${t}'`).join(', ')}],
    stability: '${params.stability || 'beta'}',
  },

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
});
`;
}
