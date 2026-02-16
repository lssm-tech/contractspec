// ---------------------------------------------------------------------------
// Video Typography Tokens
// ---------------------------------------------------------------------------
// Larger type scales optimized for video readability at various resolutions.
// These supplement the design-system typography tokens with video-specific sizes.
// ---------------------------------------------------------------------------

export interface VideoTypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: number;
}

/**
 * Typography scale for 1920x1080 (landscape) videos.
 * Scale down proportionally for smaller formats.
 */
export const videoTypography = {
  /** Main title -- large, bold */
  title: {
    fontSize: 72,
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: -1,
  },
  /** Section heading */
  heading: {
    fontSize: 56,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  /** Subheading */
  subheading: {
    fontSize: 40,
    lineHeight: 1.25,
    fontWeight: 500,
  },
  /** Body text */
  body: {
    fontSize: 32,
    lineHeight: 1.5,
    fontWeight: 400,
  },
  /** Code / monospace text */
  code: {
    fontSize: 28,
    lineHeight: 1.6,
    fontWeight: 400,
  },
  /** Small caption text */
  caption: {
    fontSize: 24,
    lineHeight: 1.4,
    fontWeight: 400,
  },
  /** Badge / label text */
  label: {
    fontSize: 20,
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: 1,
  },
} as const satisfies Record<string, VideoTypeStyle>;

/**
 * Scale typography for a target width relative to 1920px landscape.
 */
export function scaleTypography(
  style: VideoTypeStyle,
  targetWidth: number
): VideoTypeStyle {
  const scale = targetWidth / 1920;
  return {
    ...style,
    fontSize: Math.round(style.fontSize * scale),
    letterSpacing: style.letterSpacing
      ? Math.round(style.letterSpacing * scale * 10) / 10
      : undefined,
  };
}
