import { describe, expect, it } from 'bun:test';
import {
	makeThemeRef,
	ThemeRegistry,
	type ThemeSpec,
} from '@contractspec/lib.contracts-spec/themes';
import { resolvePlatformTheme, resolveThemeRefTokens } from './contracts';

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
});
