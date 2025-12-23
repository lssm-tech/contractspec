'use client';

/**
 * withPlatformUI
 * Lightweight adapter inspired by gluestack's withGluestack pattern.
 * It centralizes tokens and responsive options while keeping DS imports
 * pointed at @ui-kit-web. Metro/Webpack aliases can swap to @ui-kit in native.
 */

export type PlatformKind = 'web' | 'native';

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface WithPlatformUIOptions<
  TTokens extends Record<string, unknown>,
> {
  tokens: TTokens;
  platform?: PlatformKind;
  breakpoints?: Partial<Breakpoints>;
}

export interface PlatformUI<TTokens> {
  platform: PlatformKind;
  tokens: TTokens;
  breakpoints: Breakpoints;
}

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function withPlatformUI<TTokens extends Record<string, unknown>>(
  options: WithPlatformUIOptions<TTokens>
): PlatformUI<TTokens> {
  const platform: PlatformKind = options.platform ?? 'web';
  const breakpoints: Breakpoints = {
    ...DEFAULT_BREAKPOINTS,
    ...options.breakpoints,
  };
  return {
    platform,
    tokens: options.tokens,
    breakpoints,
  };
}

/**
 * Example usage (app-level):
 *
 * const ui = withPlatformUI({ tokens: themeTokens });
 * // pass ui.tokens to DS providers or map classes as needed
 */
