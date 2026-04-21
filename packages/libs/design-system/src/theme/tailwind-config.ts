import type { ThemeTokens } from './tokens';

export interface TailwindThemeFragment {
	colors: Record<string, unknown>;
	borderRadius: Record<string, string>;
	spacing: Record<string, string>;
	fontSize: Record<string, string>;
}

export interface TailwindPresetFragment {
	darkMode: ['class'];
	theme: {
		extend: TailwindThemeFragment;
	};
}

function toKebabCase(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[\s_.]+/g, '-')
		.toLowerCase();
}

function colorThemeEntries(tokens: ThemeTokens): Record<string, unknown> {
	const colors: Record<string, unknown> = {};

	for (const key of Object.keys(tokens.colors)) {
		if (key.endsWith('Foreground')) {
			continue;
		}

		const cssKey = toKebabCase(key);
		const foregroundKey = `${key}Foreground`;
		const colorValue = `var(--ds-color-${cssKey})`;
		colors[cssKey] =
			foregroundKey in tokens.colors
				? {
						DEFAULT: colorValue,
						foreground: `var(--ds-color-${toKebabCase(foregroundKey)})`,
					}
				: colorValue;
	}

	return colors;
}

export function themeSpecToTailwindTheme(
	tokens: ThemeTokens
): TailwindThemeFragment {
	return {
		colors: colorThemeEntries(tokens),
		borderRadius: Object.fromEntries(
			Object.keys(tokens.radii).map((key) => [
				toKebabCase(key),
				`var(--ds-radius-${toKebabCase(key)})`,
			])
		),
		spacing: Object.fromEntries(
			Object.keys(tokens.space).map((key) => [
				toKebabCase(key),
				`var(--ds-space-${toKebabCase(key)})`,
			])
		),
		fontSize: Object.fromEntries(
			Object.keys(tokens.typography).map((key) => [
				toKebabCase(key),
				`var(--ds-typography-${toKebabCase(key)})`,
			])
		),
	};
}

export function themeSpecToTailwindPreset(
	tokens: ThemeTokens
): TailwindPresetFragment {
	return {
		darkMode: ['class'],
		theme: {
			extend: themeSpecToTailwindTheme(tokens),
		},
	};
}
