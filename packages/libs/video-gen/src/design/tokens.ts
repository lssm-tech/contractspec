// ---------------------------------------------------------------------------
// Video Design Tokens -- Brand Bridge
// ---------------------------------------------------------------------------
// Imports brand tokens from @lssm/lib.design-system and re-exports them
// alongside video-specific extensions.
// ---------------------------------------------------------------------------

import type { ThemeTokens } from '@contractspec/lib.design-system';
import { defaultTokens } from '@contractspec/lib.design-system';

export type { ThemeTokens };
export { defaultTokens };

/**
 * Video-specific color extensions built on top of brand tokens.
 */
export interface VideoColorTokens {
  /** Background for video frames (may differ from web background) */
  canvasBackground: string;
  /** Code block background */
  codeBackground: string;
  /** Terminal background */
  terminalBackground: string;
  /** Terminal text color */
  terminalForeground: string;
  /** Highlight / emphasis color */
  highlight: string;
  /** Gradient start (for branded backgrounds) */
  gradientStart: string;
  /** Gradient end */
  gradientEnd: string;
}

export const defaultVideoColors: VideoColorTokens = {
  canvasBackground: defaultTokens.colors.background,
  codeBackground: '#1e1e2e',
  terminalBackground: '#0d1117',
  terminalForeground: '#c9d1d9',
  highlight: defaultTokens.colors.accent,
  gradientStart: defaultTokens.colors.primary,
  gradientEnd: defaultTokens.colors.accent,
};

/**
 * Combine brand tokens with video color extensions.
 */
export interface VideoThemeTokens extends ThemeTokens {
  video: VideoColorTokens;
}

export const defaultVideoTheme: VideoThemeTokens = {
  ...defaultTokens,
  video: defaultVideoColors,
};
