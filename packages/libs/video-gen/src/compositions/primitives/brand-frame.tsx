import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { videoEasing, videoDurations } from '../../design/motion';
import { defaultVideoTheme } from '../../design/tokens';
import { videoSafeZone, scaleSafeZone } from '../../design/layouts';
import type { VideoStyleOverrides } from '@lssm/lib.contracts/integrations/providers/video';

// ---------------------------------------------------------------------------
// BrandFrame -- Branded container with logo area, background, and safe zone
// ---------------------------------------------------------------------------

export interface BrandFrameProps {
  /** Override style tokens */
  styleOverrides?: VideoStyleOverrides;
  /** Show the ContractSpec logo/brand in bottom-right */
  showBranding?: boolean;
  /** Animate entrance */
  animateEntrance?: boolean;
  /** Background variant */
  variant?: 'solid' | 'gradient' | 'dark';
  children: React.ReactNode;
}

export const BrandFrame: React.FC<BrandFrameProps> = ({
  styleOverrides,
  showBranding = true,
  animateEntrance = true,
  variant = 'gradient',
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const theme = defaultVideoTheme;
  const safeZone = scaleSafeZone({ type: 'custom', width, height });

  const primaryColor = styleOverrides?.primaryColor ?? theme.colors.primary;
  const accentColor = styleOverrides?.accentColor ?? theme.colors.accent;
  const isDark = styleOverrides?.darkMode ?? true;

  // Background
  let background: string;
  switch (variant) {
    case 'solid':
      background = isDark ? '#0a0a0a' : theme.colors.background;
      break;
    case 'gradient':
      background = isDark
        ? `linear-gradient(135deg, #0a0a14 0%, #0f172a 50%, #0a0a14 100%)`
        : `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.muted} 100%)`;
      break;
    case 'dark':
      background = '#000000';
      break;
  }

  // Entrance animation
  const entranceOpacity = animateEntrance
    ? interpolate(frame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: videoEasing.entrance,
      })
    : 1;

  // Brand watermark opacity (subtle)
  const brandOpacity = showBranding
    ? interpolate(
        frame,
        [videoDurations.brandReveal, videoDurations.brandReveal + 15],
        [0, 0.3],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      )
    : 0;

  return (
    <div
      style={{
        width,
        height,
        background,
        position: 'relative',
        overflow: 'hidden',
        opacity: entranceOpacity,
      }}
    >
      {/* Subtle accent glow */}
      {variant === 'gradient' && (
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '50%',
            height: '50%',
            background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Content area (within safe zone) */}
      <div
        style={{
          position: 'absolute',
          left: safeZone.horizontal,
          top: safeZone.vertical,
          width: safeZone.contentWidth,
          height: safeZone.contentHeight,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>

      {/* Brand watermark */}
      {showBranding && (
        <div
          style={{
            position: 'absolute',
            bottom: safeZone.vertical / 2,
            right: safeZone.horizontal,
            opacity: brandOpacity,
            color: isDark ? '#ffffff' : '#000000',
            fontSize: Math.round(16 * (width / 1920)),
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          ContractSpec
        </div>
      )}
    </div>
  );
};
