import { describe, expect, it } from 'bun:test';
import {
	defineTheme,
	ThemeRegistry,
} from '@contractspec/lib.contracts-spec/themes';
import type * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Input } from '../components/atoms/Input';
import {
	DesignSystemThemeProvider,
	useComponentTheme,
	useDesignSystemTheme,
} from './runtime';

const baseTheme = defineTheme({
	meta: {
		key: 'design.test',
		version: '1.0.0',
		title: 'Test theme',
		domain: 'design-system',
		owners: ['platform.design'],
		scopes: ['tenant'],
	},
	tokens: {
		colors: {
			primary: { value: '#123456' },
		},
	},
	components: [
		{
			component: 'Input',
			variants: {
				default: {
					props: {
						className: 'theme-input',
						placeholder: 'Theme placeholder',
					},
					tokens: {
						colors: {
							border: { value: '#abcdef' },
						},
					},
				},
			},
		},
	],
	modes: {
		dark: {
			tokens: {
				colors: {
					primary: { value: 'oklch(0.64 0.15 246)' },
				},
			},
			components: [
				{
					component: 'Input',
					variants: {
						default: {
							props: {
								className: 'theme-input-dark',
							},
						},
					},
				},
			],
		},
	},
	overrides: [
		{
			scope: 'tenant',
			target: 'tenant:acme',
			tokens: {
				colors: {
					primary: { value: '#654321' },
				},
			},
		},
	],
});

function ThemeProbe() {
	const theme = useDesignSystemTheme();
	const component = useComponentTheme('Input');
	return (
		<div
			data-primary={theme?.tokens.colors.primary}
			data-platform={theme?.platform}
			data-mode={theme?.mode}
			data-css={
				theme?.cssVariables?.[
					'--ds-color-primary' as keyof React.CSSProperties
				] as string
			}
			data-class={component.props.className as string}
		/>
	);
}

describe('design-system theme runtime', () => {
	it('resolves ThemeSpec tokens, scoped overrides, and component variants', () => {
		const html = renderToStaticMarkup(
			<DesignSystemThemeProvider
				theme={baseTheme}
				platform="web"
				targets={['tenant:acme']}
			>
				<ThemeProbe />
			</DesignSystemThemeProvider>
		);

		expect(html).toContain('data-primary="#654321"');
		expect(html).toContain('data-platform="web"');
		expect(html).toContain('data-mode="light"');
		expect(html).toContain('data-class="theme-input"');
	});

	it('resolves mode tokens, mode component variants, and CSS variables', () => {
		const html = renderToStaticMarkup(
			<DesignSystemThemeProvider
				theme={baseTheme}
				platform="web"
				mode="dark"
				targets={['tenant:other']}
			>
				<ThemeProbe />
			</DesignSystemThemeProvider>
		);

		expect(html).toContain('data-primary="oklch(0.64 0.15 246)"');
		expect(html).toContain('data-mode="dark"');
		expect(html).toContain('data-css="oklch(0.64 0.15 246)"');
		expect(html).toContain('data-class="theme-input-dark"');
	});

	it('resolves ThemeRegistry + ThemeRef and lets caller props override theme defaults', () => {
		const registry = new ThemeRegistry([baseTheme]);
		const html = renderToStaticMarkup(
			<DesignSystemThemeProvider
				registry={registry}
				themeRef={{ key: 'design.test', version: '1.0.0' }}
				platform="web"
			>
				<Input placeholder="Caller placeholder" className="caller-input" />
			</DesignSystemThemeProvider>
		);

		expect(html).toContain('placeholder="Caller placeholder"');
		expect(html).toContain('theme-input');
		expect(html).toContain('caller-input');
	});
});
