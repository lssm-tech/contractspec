import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { defaultVideoTheme } from '../../design/tokens';

// ---------------------------------------------------------------------------
// ProgressBar -- Video progress indicator (bottom of frame)
// ---------------------------------------------------------------------------

export interface ProgressBarProps {
  /** Bar height in pixels */
  height?: number;
  /** Bar color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Position */
  position?: 'top' | 'bottom';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  height = 4,
  color = defaultVideoTheme.colors.primary,
  backgroundColor = 'rgba(255,255,255,0.1)',
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();

  const progress = frame / durationInFrames;

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        width,
        height,
        backgroundColor,
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'none',
        }}
      />
    </div>
  );
};
