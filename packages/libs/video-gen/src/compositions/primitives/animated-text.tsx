import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { videoEasing, videoDurations } from '../../design/motion';
import { videoTypography, scaleTypography } from '../../design/typography';
import type { VideoTypeStyle } from '../../design/typography';

// ---------------------------------------------------------------------------
// AnimatedText -- Text with entrance/exit animations
// ---------------------------------------------------------------------------

export interface AnimatedTextProps {
  /** The text content to display */
  text: string;
  /** Typography style key or custom style */
  variant?: keyof typeof videoTypography;
  /** Custom style override */
  style?: Partial<VideoTypeStyle>;
  /** Frame at which text enters (relative to composition start) */
  enterAt?: number;
  /** Frame at which text exits. Omit to keep visible. */
  exitAt?: number;
  /** Color */
  color?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Additional CSS styles */
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = 'body',
  style: styleOverride,
  enterAt = 0,
  exitAt,
  color = '#ffffff',
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const baseStyle = videoTypography[variant];
  const scaled = scaleTypography(baseStyle, width);
  const finalStyle = { ...scaled, ...styleOverride };

  // Entrance animation
  const enterProgress = interpolate(
    frame,
    [enterAt, enterAt + videoDurations.textEntrance],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1], {
    easing: videoEasing.entrance,
  });

  const enterTranslateY = interpolate(enterProgress, [0, 1], [30, 0], {
    easing: videoEasing.entrance,
  });

  // Exit animation (if specified)
  let exitOpacity = 1;
  let exitTranslateY = 0;

  if (exitAt !== undefined) {
    const exitProgress = interpolate(
      frame,
      [exitAt, exitAt + videoDurations.textExit],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
      easing: videoEasing.exit,
    });

    exitTranslateY = interpolate(exitProgress, [0, 1], [0, -20], {
      easing: videoEasing.exit,
    });
  }

  const opacity = enterOpacity * exitOpacity;
  const translateY = enterTranslateY + exitTranslateY;

  return (
    <div
      style={{
        fontSize: finalStyle.fontSize,
        lineHeight: finalStyle.lineHeight,
        fontWeight: finalStyle.fontWeight,
        letterSpacing: finalStyle.letterSpacing,
        color,
        textAlign: align,
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: 'opacity, transform',
      }}
    >
      {text}
    </div>
  );
};
