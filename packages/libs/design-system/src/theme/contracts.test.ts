import { describe, expect, it } from 'bun:test';
import {
	makeThemeRef,
	ThemeRegistry,
	type ThemeSpec,
} from '@contractspec/lib.contracts-spec/themes';
import {
	resolvePlatformTheme,
	resolveThemeModeTokens,
	resolveThemeRefTokens,
} from './contracts';
import {
	themeSpecToCssVariables,
	themeSpecToTailwindCss,
	themeSpecToTailwindPreset,
	themeSpecToTailwindTheme,
} from './tailwind';

const baseTheme: ThemeSpec = {
	meta: {
		key: 'design.base',
		version: '1.0.0',
		title: 'Base',
		domain: 'design-system',
		owners: ['@team.design'],
	},
	tokens: {
		colors: {
			background: { value: '#fafafa' },
			primary: { value: '#111827' },
		},
		space: {
			md: { value: 18 },
		},
	},
	modes: {
		dark: {
			tokens: {
				colors: {
					background: { value: 'oklch(0.24 0.03 255)' },
					primary: { value: 'oklch(0.72 0.11 221.19)' },
				},
			},
		},
	},
};

const tenantTheme: ThemeSpec = {
	meta: {
		key: 'design.tenant',
		version: '1.0.0',
		title: 'Tenant',
		domain: 'design-system',
		owners: ['@team.design'],
		extends: makeThemeRef(baseTheme),
	},
	tokens: {
		colors: {
			accent: { value: '#16a34a' },
		},
	},
	overrides: [
		{
			scope: 'tenant',
			target: 'tenant:acme',
			tokens: {
				colors: {
					primary: { value: '#2563eb' },
				},
			},
			modes: {
				dark: {
					tokens: {
						colors: {
							primary: { value: 'oklch(0.64 0.15 246)' },
						},
					},
				},
			},
		},
	],
};

describe('theme contract bridge', () => {
	it('resolves inherited theme tokens and scoped overrides', () => {
		const registry = new ThemeRegistry([baseTheme, tenantTheme]);
		const resolved = resolveThemeRefTokens(
			registry,
			makeThemeRef(tenantTheme),
			{ targets: ['tenant:acme'] }
		);

		expect(resolved.colors.background).toBe('#fafafa');
		expect(resolved.colors.primary).toBe('#2563eb');
		expect(resolved.colors.accent).toBe('#16a34a');
		expect(resolved.space.md).toBe(18);
	});

	it('resolves a theme spec directly into platform tokens', () => {
		const resolved = resolvePlatformTheme(baseTheme, 'native');

		expect('spacing' in resolved).toBe(true);
		expect(resolved.colors.background).toBe('#fafafa');
	});

	it('resolves a theme ref into platform-shaped tokens', () => {
		const registry = new ThemeRegistry([baseTheme, tenantTheme]);
		const resolved = resolvePlatformTheme(
			registry,
			makeThemeRef(tenantTheme),
			'web',
			{ targets: ['tenant:acme'] }
		);

		expect('space' in resolved).toBe(true);
		expect(resolved.colors.primary).toBe('#2563eb');
	});

	it('falls back to defaults when a ref is missing', () => {
		const registry = new ThemeRegistry([baseTheme]);
		const resolved = resolvePlatformTheme(
			registry,
			{ key: 'missing.theme', version: '1.0.0' },
			'web'
		);

		expect(resolved.colors.background).toBe('#ffffff');
	});

	it('resolves inherited dark mode tokens and scoped mode overrides', () => {
		const registry = new ThemeRegistry([baseTheme, tenantTheme]);
		const resolved = resolveThemeModeTokens(
			registry,
			makeThemeRef(tenantTheme),
			'dark',
			{ targets: ['tenant:acme'] }
		);

		expect(resolved.colors.background).toBe('oklch(0.24 0.03 255)');
		expect(resolved.colors.primary).toBe('oklch(0.64 0.15 246)');
	});

	it('maps resolved tokens to Tailwind theme and preset fragments', () => {
		const registry = new ThemeRegistry([baseTheme, tenantTheme]);
		const resolved = resolveThemeModeTokens(
			registry,
			makeThemeRef(tenantTheme),
			'light',
			{ targets: ['tenant:acme'] }
		);
		const theme = themeSpecToTailwindTheme(resolved);
		const preset = themeSpecToTailwindPreset(resolved);

		expect(theme.colors.primary).toEqual({
			DEFAULT: 'var(--ds-color-primary)',
			foreground: 'var(--ds-color-primary-foreground)',
		});
		expect(theme.borderRadius.md).toBe('var(--ds-radius-md)');
		expect(theme.spacing.md).toBe('var(--ds-space-md)');
		expect(preset.theme.extend.colors.primary).toEqual(theme.colors.primary);
	});

	it('serializes ThemeSpec variables and preserves OKLCH values', () => {
		const registry = new ThemeRegistry([baseTheme, tenantTheme]);
		const variables = themeSpecToCssVariables(
			registry,
			makeThemeRef(tenantTheme),
			{ targets: ['tenant:acme'] }
		);
		const css = themeSpecToTailwindCss(variables, {
			includeCustomVariant: true,
		});

		expect(variables.light['--ds-color-primary']).toBe('#2563eb');
		expect(variables.dark['--ds-color-primary']).toBe('oklch(0.64 0.15 246)');
		expect(css).toContain('@custom-variant dark');
		expect(css).toContain('--ds-color-primary: oklch(0.64 0.15 246);');
		expect(css).toContain('--color-primary: var(--ds-color-primary);');
	});
});
