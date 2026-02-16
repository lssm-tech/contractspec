import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BrandFrame } from './primitives/brand-frame';
import { AnimatedText } from './primitives/animated-text';
import { ProgressBar } from './primitives/progress-bar';
import { videoEasing } from '../design/motion';
import { defaultVideoTheme } from '../design/tokens';

// ---------------------------------------------------------------------------
// SocialClip -- Short-form marketing content for LinkedIn/X/YouTube Shorts
// ---------------------------------------------------------------------------
// Designed to work in all three formats (16:9, 1:1, 9:16) with adaptive layout.
// Content is driven by a simple message structure.
// ---------------------------------------------------------------------------

export interface SocialClipProps {
  /** Hook line -- the attention grabber (first 3 seconds) */
  hook: string;
  /** Main message / value proposition */
  message: string;
  /** Supporting points (shown as a list) */
  points?: string[];
  /** Call to action */
  cta?: string;
  /** CTA URL (displayed, not clickable in video) */
  ctaUrl?: string;
  /** Accent color override */
  accentColor?: string;
}

export const SocialClip: React.FC<SocialClipProps> = ({
  hook,
  message,
  points = [],
  cta = 'Learn more',
  ctaUrl = 'contractspec.dev',
  accentColor,
}) => {
  const { durationInFrames, width, height } = useVideoConfig();

  const theme = defaultVideoTheme;
  const accent = accentColor ?? theme.colors.accent;
  const isPortrait = height > width;

  // Scene timing
  const HOOK_DURATION = 75; // 2.5s
  const MESSAGE_START = 60;
  const POINTS_START = MESSAGE_START + 60;
  const CTA_START = durationInFrames - 90;

  return (
    <AbsoluteFill>
      <BrandFrame variant="gradient" showBranding>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isPortrait ? 48 : 32,
            textAlign: 'center',
            padding: isPortrait ? '0 20px' : 0,
          }}
        >
          {/* Hook -- large, attention-grabbing */}
          <Sequence from={0} durationInFrames={HOOK_DURATION + 30}>
            <div style={{ width: '100%' }}>
              <AnimatedText
                text={hook}
                variant="title"
                enterAt={5}
                exitAt={HOOK_DURATION}
                color="#ffffff"
                align="center"
              />
            </div>
          </Sequence>

          {/* Main message */}
          <Sequence from={MESSAGE_START}>
            <div style={{ width: '100%' }}>
              <AnimatedText
                text={message}
                variant={isPortrait ? 'subheading' : 'heading'}
                enterAt={0}
                color="#ffffff"
                align="center"
              />
            </div>
          </Sequence>

          {/* Points */}
          {points.length > 0 && (
            <Sequence from={POINTS_START}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  alignItems: isPortrait ? 'flex-start' : 'center',
                  width: '100%',
                  maxWidth: isPortrait ? '100%' : '80%',
                  marginTop: 16,
                }}
              >
                {points.map((point, i) => (
                  <PointItem
                    key={point}
                    text={point}
                    index={i}
                    startFrame={i * 15}
                    accent={accent}
                  />
                ))}
              </div>
            </Sequence>
          )}

          {/* CTA */}
          <Sequence from={CTA_START}>
            <CTABlock cta={cta} url={ctaUrl} accent={accent} />
          </Sequence>
        </div>
      </BrandFrame>

      <ProgressBar color={accent} />
    </AbsoluteFill>
  );
};

// -- Sub-components ---------------------------------------------------------

const PointItem: React.FC<{
  text: string;
  index: number;
  startFrame: number;
  accent: string;
}> = ({ text, startFrame, accent }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateX = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [-30, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: videoEasing.entrance,
    }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 28,
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />
      {text}
    </div>
  );
};

const CTABlock: React.FC<{
  cta: string;
  url: string;
  accent: string;
}> = ({ cta, url, accent }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 18], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: videoEasing.emphasis,
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
      }}
    >
      <div
        style={{
          backgroundColor: accent,
          color: '#ffffff',
          padding: '16px 48px',
          borderRadius: 12,
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        {cta}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>{url}</div>
    </div>
  );
};
