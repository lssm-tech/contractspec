import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { videoEasing } from '../../design/motion';
import type { SceneTransitionType } from '@lssm/lib.contracts/integrations/providers/video';

// ---------------------------------------------------------------------------
// SceneTransition -- Wraps children with entrance/exit transition effects
// ---------------------------------------------------------------------------

export interface SceneTransitionProps {
  /** Transition type */
  type: SceneTransitionType;
  /** Duration of the transition in frames */
  durationInFrames: number;
  /** 'in' = entering, 'out' = exiting */
  direction: 'in' | 'out';
  /** Frame at which the transition starts (relative to sequence) */
  startAt?: number;
  children: React.ReactNode;
}

export const SceneTransitionWrapper: React.FC<SceneTransitionProps> = ({
  type,
  durationInFrames,
  direction,
  startAt = 0,
  children,
}) => {
  const frame = useCurrentFrame();

  if (type === 'none' || durationInFrames === 0) {
    return <>{children}</>;
  }

  const progress = interpolate(
    frame,
    [startAt, startAt + durationInFrames],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const styles = getTransitionStyles(type, progress);

  return <div style={styles}>{children}</div>;
};

function getTransitionStyles(
  type: SceneTransitionType,
  progress: number
): React.CSSProperties {
  const eased = videoEasing.entrance(progress);

  switch (type) {
    case 'fade':
      return {
        opacity: eased,
        width: '100%',
        height: '100%',
      };

    case 'slide-left':
      return {
        opacity: eased,
        transform: `translateX(${(1 - eased) * 100}%)`,
        width: '100%',
        height: '100%',
      };

    case 'slide-right':
      return {
        opacity: eased,
        transform: `translateX(${(1 - eased) * -100}%)`,
        width: '100%',
        height: '100%',
      };

    case 'wipe':
      return {
        clipPath: `inset(0 ${(1 - eased) * 100}% 0 0)`,
        width: '100%',
        height: '100%',
      };

    default:
      return { width: '100%', height: '100%' };
  }
}
