import { describe, expect, it } from 'bun:test';
import { type Owner, StabilityEnum, type Tag } from './ownership';
import {
	assertThemeSpecValid,
	defineTheme,
	makeThemeRef,
	ThemeRegistry,
	type ThemeSpec,
	ThemeValidationError,
	validateThemeSpec,
} from './themes';

const baseMeta = {
	title: 'Pastel Theme' as const,
	description: 'Soft pastel colors for marketing sites' as const,
	domain: 'design-system' as const,
	owners: ['@team.design'] as Owner[],
	tags: ['theme', 'marketing'] as Tag[],
	stability: StabilityEnum.Experimental,
} as const;

const pastelTheme: ThemeSpec = {
	meta: {
		...baseMeta,
		key: 'design.pastel',
		version: '1.0.0',
		scopes: ['tenant'],
	},
	tokens: {
		colors: {
			background: { value: '#fdf2f8' },
			foreground: { value: '#1f2937' },
		},
		radii: {
			card: { value: 12 },
		},
	},
	components: [
		{
			component: 'Button',
			variants: {
				pastel: {
					props: { variant: 'pastel' },
					tokens: {
						colors: {
							primary: { value: '#fab1a0' },
							primaryForeground: { value: '#1f2937' },
						},
					},
				},
			},
		},
	],
	overrides: [
		{
			scope: 'tenant',
			target: 'tenant:artisanos',
			tokens: {
				colors: {
					primary: { value: '#38bdf8' },
				},
			},
		},
	],
};

describe('ThemeRegistry', () => {
	it('defines a theme via helper', () => {
		expect(defineTheme(pastelTheme)).toBe(pastelTheme);
	});

	it('registers and retrieves themes by name/version', () => {
		const registry = new ThemeRegistry();
		registry.register(pastelTheme);
		const stored = registry.get('design.pastel', '1.0.0');
		expect(stored?.meta.key).toBe('design.pastel');
		expect(stored?.tokens.colors?.background?.value).toBe('#fdf2f8');
	});

	it('returns latest version when version omitted', () => {
		const registry = new ThemeRegistry();
		registry.register(pastelTheme);
		registry.register({
			...pastelTheme,
			meta: { ...pastelTheme.meta, version: '2.0.0' },
		});
		const latest = registry.get('design.pastel');
		expect(latest?.meta.version).toBe('2.0.0');
	});

	it('creates stable theme references', () => {
		const ref = makeThemeRef(pastelTheme);
		expect(ref).toEqual({ key: 'design.pastel', version: '1.0.0' });
	});

	it('validates a well-formed theme', () => {
		const result = validateThemeSpec(pastelTheme);
		expect(result.valid).toBe(true);
		expect(result.issues).toHaveLength(0);
	});

	it('accepts light and dark mode tokens with OKLCH color values', () => {
		const result = validateThemeSpec({
			...pastelTheme,
			tokens: {},
			modes: {
				light: {
					tokens: {
						colors: {
							primary: {
								value: 'oklch(0.72 0.11 221.19)',
								format: 'oklch',
								usage: 'semantic',
							},
						},
					},
				},
				dark: {
					tokens: {
						colors: {
							primary: {
								value: 'oklch(0.62 0.13 221.19)',
								format: 'oklch',
								usage: 'semantic',
							},
						},
					},
				},
			},
		});

		expect(result.valid).toBe(true);
		expect(result.issues).toHaveLength(0);
	});

	it('reports empty mode keys and warns on unknown color formats', () => {
		const result = validateThemeSpec({
			...pastelTheme,
			modes: {
				'': {
					tokens: {
						colors: {
							primary: { value: '#2563eb', format: 'lab-ish' },
						},
					},
				},
				light: {
					tokens: {
						colors: {
							accent: { value: '#38bdf8', format: 'lab-ish' },
						},
					},
				},
			},
		});

		expect(result.valid).toBe(false);
		expect(result.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: 'modes',
					level: 'error',
				}),
				expect.objectContaining({
					path: 'modes.light.tokens.colors.accent.format',
					level: 'warning',
				}),
			])
		);
	});

	it('reports missing metadata and material configuration', () => {
		const result = validateThemeSpec({
			meta: {
				...baseMeta,
				key: 'design.empty',
				version: '1.0.0',
				title: '',
				description: '',
				domain: '',
				owners: [],
				tags: [],
			},
			tokens: {},
		});

		expect(result.valid).toBe(false);
		expect(result.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ path: 'meta.title', level: 'error' }),
				expect.objectContaining({ path: 'meta.description', level: 'error' }),
				expect.objectContaining({ path: 'meta.domain', level: 'error' }),
				expect.objectContaining({ path: 'meta.owners', level: 'error' }),
				expect.objectContaining({ path: 'meta.tags', level: 'error' }),
				expect.objectContaining({ path: 'tokens', level: 'error' }),
			])
		);
	});

	it('reports duplicate overrides and suspicious tenant targets', () => {
		const result = validateThemeSpec({
			...pastelTheme,
			overrides: [
				{
					scope: 'tenant',
					target: 'tenant:artisanos',
				},
				{
					scope: 'tenant',
					target: 'tenant:artisanos',
				},
				{
					scope: 'tenant',
					target: 'artisanos',
				},
			],
		});

		expect(result.valid).toBe(false);
		expect(result.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: 'overrides[1]',
					level: 'error',
				}),
				expect.objectContaining({
					path: 'overrides[2].target',
					level: 'warning',
				}),
			])
		);
	});

	it('throws ThemeValidationError for invalid themes', () => {
		expect(() =>
			assertThemeSpecValid({
				...pastelTheme,
				meta: {
					...pastelTheme.meta,
					extends: {
						key: pastelTheme.meta.key,
						version: pastelTheme.meta.version,
					},
				},
			})
		).toThrow(ThemeValidationError);
	});
});
