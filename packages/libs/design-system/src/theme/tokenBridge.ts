'use client';

import {
  type ColorTokens,
  defaultTokens as themeTokens,
  type RadiusTokens,
  type SpaceTokens,
} from './tokens';

export type PlatformKind = 'web' | 'native';

type WebTokens = typeof themeTokens;

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

export function mapTokensForPlatform(platform: PlatformKind): BridgedTokens {
  if (platform === 'web') return themeTokens;

  // Native: use numeric tokens from DS defaults
  const spacing = themeTokens.space;
  const radii = themeTokens.radii;
  const icons = themeTokens.icons;

  return {
    colors: themeTokens.colors,
    spacing,
    typography: {
      h1: themeTokens.typography.h1,
      body: themeTokens.typography.body,
    },
    radii,
    icons,
  } satisfies NativeTokens;
}
