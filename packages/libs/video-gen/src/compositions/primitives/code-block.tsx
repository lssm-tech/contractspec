import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { videoEasing, videoDurations } from '../../design/motion';
import { videoTypography, scaleTypography } from '../../design/typography';
import { defaultVideoColors } from '../../design/tokens';

// ---------------------------------------------------------------------------
// CodeBlock -- Syntax-highlighted code display with typing animation
// ---------------------------------------------------------------------------

export interface CodeBlockProps {
  /** Code string to display */
  code: string;
  /** Language label shown in the top bar */
  language?: string;
  /** Frame at which typing starts */
  startAt?: number;
  /** Whether to animate typing or show all at once */
  typeAnimation?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Filename to show in the title bar */
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  startAt = 0,
  typeAnimation = true,
  backgroundColor = defaultVideoColors.codeBackground,
  textColor = '#abb2bf',
  filename,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const codeStyle = scaleTypography(videoTypography.code, width);

  // Typing animation: reveal characters over time
  const totalChars = code.length;
  const typingDuration = totalChars * videoDurations.codeTypingPerChar;

  const charsVisible = typeAnimation
    ? Math.floor(
        interpolate(
          frame,
          [startAt, startAt + typingDuration],
          [0, totalChars],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        )
      )
    : totalChars;

  const visibleCode = code.slice(0, charsVisible);

  // Entrance opacity
  const opacity = interpolate(frame, [startAt, startAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: videoEasing.entrance,
  });

  // Cursor blink
  const showCursor =
    typeAnimation && charsVisible < totalChars && frame % 16 < 10;

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: 16,
        padding: 0,
        opacity,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ff5f57',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#febc2e',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#28c840',
            }}
          />
        </div>
        {/* Filename / language */}
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#666',
            fontSize: codeStyle.fontSize * 0.7,
            fontFamily: 'monospace',
          }}
        >
          {filename ?? language}
        </div>
      </div>
      {/* Code content */}
      <div style={{ padding: '24px 32px' }}>
        <pre
          style={{
            margin: 0,
            fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
            fontSize: codeStyle.fontSize,
            lineHeight: codeStyle.lineHeight,
            color: textColor,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {visibleCode}
          {showCursor && (
            <span
              style={{
                backgroundColor: textColor,
                width: '2px',
                display: 'inline-block',
                height: '1.2em',
                verticalAlign: 'text-bottom',
              }}
            >
              &nbsp;
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};
