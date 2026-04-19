function toPascalCase(str: string): string {
	return str
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}

export interface ThemeSpecParams {
	key: string;
	version: string;
	title: string;
	description: string;
	domain: string;
	owners: string[];
	tags: string[];
	stability: 'experimental' | 'beta' | 'stable' | 'deprecated';
	scopes: Array<'global' | 'tenant' | 'user'>;
}

export function generateThemeSpec(params: ThemeSpecParams): string {
	return `/**
 * ${params.title} Theme
 *
 * Auto-generated theme spec.
 */

import { defineTheme } from '@contractspec/lib.contracts-spec/themes';

export const ${toPascalCase(params.key)}Theme = defineTheme({
  meta: {
    key: '${params.key}',
    version: '${params.version}',
    title: '${params.title}',
    description: '${params.description}',
    domain: '${params.domain}',
    owners: [${params.owners.map((owner) => `'${owner}'`).join(', ')}],
    tags: [${params.tags.map((tag) => `'${tag}'`).join(', ')}],
    stability: '${params.stability}',
    scopes: [${params.scopes.map((scope) => `'${scope}'`).join(', ')}],
  },
  tokens: {
    colors: {
      primary: { value: '#2563eb' },
      background: { value: '#ffffff' },
      foreground: { value: '#111827' },
    },
  },
});
`;
}
