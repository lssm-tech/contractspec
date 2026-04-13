'use client';

import {
	type ColorTokens,
	type RadiusTokens,
	type SpaceTokens,
	type ThemeTokens,
	defaultTokens as themeTokens,
} from './tokens';

export type PlatformKind = 'web' | 'native';

type WebTokens = ThemeTokens;

interface NativeTokens {
	// colors: Record<string, string>;
	colors: ColorTokens;
	spacing: SpaceTokens;
	typography: {
		h1: number;
		body: number;
	};
	radii: RadiusTokens;
	icons: Record<string, number>;
}

export type BridgedTokens = WebTokens | NativeTokens;

export function mapTokensForPlatform(
	platform: PlatformKind,
	tokens: ThemeTokens = themeTokens
): BridgedTokens {
	if (platform === 'web') return tokens;

	// Native: use numeric tokens from DS defaults
	const spacing = tokens.space;
	const radii = tokens.radii;
	const icons = tokens.icons;

	return {
		colors: tokens.colors,
		spacing,
		typography: {
			h1: tokens.typography.h1,
			body: tokens.typography.body,
		},
		radii,
		icons,
	} satisfies NativeTokens;
}
