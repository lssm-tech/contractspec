import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import { ApiOverview } from '../compositions/api-overview';
import { SocialClip } from '../compositions/social-clip';
import { TerminalDemo } from '../compositions/terminal-demo';
import type { ApiOverviewProps } from '../compositions/api-overview';
import type { SocialClipProps } from '../compositions/social-clip';
import type { TerminalDemoProps } from '../compositions/terminal-demo';

// ---------------------------------------------------------------------------
// DemoPlayer -- Embeddable Remotion Player for web apps
// ---------------------------------------------------------------------------
// Use this component to embed interactive video demos in any React app.
// It wraps @remotion/player with ContractSpec compositions.
// ---------------------------------------------------------------------------

/**
 * Available compositions for the player.
 */
export type DemoCompositionId = 'ApiOverview' | 'SocialClip' | 'TerminalDemo';

export interface DemoCompositionProps {
  ApiOverview: ApiOverviewProps;
  SocialClip: SocialClipProps;
  TerminalDemo: TerminalDemoProps;
}

const COMPOSITIONS = {
  ApiOverview: {
    component: ApiOverview,
    durationInFrames: 450,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  SocialClip: {
    component: SocialClip,
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  TerminalDemo: {
    component: TerminalDemo,
    durationInFrames: 600,
    fps: 30,
    width: 1920,
    height: 1080,
  },
} as const;

export interface DemoPlayerProps<T extends DemoCompositionId> {
  /** Which composition to play */
  compositionId: T;
  /** Props for the composition */
  inputProps: DemoCompositionProps[T];
  /** Show player controls */
  controls?: boolean;
  /** Autoplay on mount */
  autoPlay?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Player width (CSS value or number in px) */
  width?: string | number;
  /** Player height (CSS value). Defaults to auto (aspect ratio maintained). */
  height?: string | number;
  /** Additional CSS styles for the container */
  style?: React.CSSProperties;
  /** CSS class name */
  className?: string;
  /** Click to play behavior */
  clickToPlay?: boolean;
  /** Double click to fullscreen */
  doubleClickToFullscreen?: boolean;
}

/**
 * Embeddable video demo player.
 *
 * @example
 * ```tsx
 * <DemoPlayer
 *   compositionId="ApiOverview"
 *   inputProps={{
 *     specName: "CreateUser",
 *     specCode: "...",
 *   }}
 *   controls
 *   autoPlay
 *   loop
 * />
 * ```
 */
export function DemoPlayer<T extends DemoCompositionId>({
  compositionId,
  inputProps,
  controls = true,
  autoPlay = false,
  loop = false,
  width = '100%',
  height,
  style,
  className,
  clickToPlay = true,
  doubleClickToFullscreen = true,
}: DemoPlayerProps<T>) {
  const composition = COMPOSITIONS[compositionId];

  const playerStyle = useMemo(
    (): React.CSSProperties => ({
      width,
      height: height ?? 'auto',
      borderRadius: 12,
      overflow: 'hidden',
      ...style,
    }),
    [width, height, style]
  );

  return (
    <div className={className}>
      <Player
        component={
          composition.component as unknown as React.ComponentType<
            Record<string, unknown>
          >
        }
        durationInFrames={composition.durationInFrames}
        fps={composition.fps}
        compositionWidth={composition.width}
        compositionHeight={composition.height}
        inputProps={inputProps as unknown as Record<string, unknown>}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        style={playerStyle}
        clickToPlay={clickToPlay}
        doubleClickToFullscreen={doubleClickToFullscreen}
      />
    </div>
  );
}
