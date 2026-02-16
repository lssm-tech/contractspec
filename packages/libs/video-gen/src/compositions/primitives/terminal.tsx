import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { videoEasing, videoDurations } from '../../design/motion';
import { videoTypography, scaleTypography } from '../../design/typography';
import { defaultVideoColors } from '../../design/tokens';

// ---------------------------------------------------------------------------
// Terminal -- CLI/terminal simulator with typing + output animation
// ---------------------------------------------------------------------------

export interface TerminalLine {
  /** The text content */
  text: string;
  /** Line type determines styling */
  type: 'command' | 'output' | 'error' | 'success' | 'comment';
  /** Delay in frames before this line appears (relative to previous line end) */
  delay?: number;
}

export interface TerminalProps {
  /** Lines to display in sequence */
  lines: TerminalLine[];
  /** Frame at which the terminal appears */
  startAt?: number;
  /** Terminal prompt string */
  prompt?: string;
  /** Terminal title */
  title?: string;
  /** Background color */
  backgroundColor?: string;
  /** Typing speed in frames per character (for command lines) */
  typingSpeed?: number;
}

const LINE_TYPE_COLORS: Record<TerminalLine['type'], string> = {
  command: '#c9d1d9',
  output: '#8b949e',
  error: '#f85149',
  success: '#3fb950',
  comment: '#6e7681',
};

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  startAt = 0,
  prompt = '$ ',
  title = 'Terminal',
  backgroundColor = defaultVideoColors.terminalBackground,
  typingSpeed = videoDurations.codeTypingPerChar,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const codeStyle = scaleTypography(videoTypography.code, width);

  // Calculate cumulative frame offsets for each line
  const lineTimings: { startFrame: number; endFrame: number }[] = [];
  let currentFrame = startAt;

  for (const line of lines) {
    const delay = line.delay ?? 10;
    const lineStart = currentFrame + delay;

    if (line.type === 'command') {
      // Commands type character by character
      const typeDuration = line.text.length * typingSpeed;
      lineTimings.push({
        startFrame: lineStart,
        endFrame: lineStart + typeDuration,
      });
      currentFrame = lineStart + typeDuration;
    } else {
      // Output/error/success appear instantly with a short fade
      lineTimings.push({ startFrame: lineStart, endFrame: lineStart + 5 });
      currentFrame = lineStart + 5;
    }
  }

  // Entrance animation
  const opacity = interpolate(frame, [startAt, startAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: videoEasing.entrance,
  });

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: 16,
        overflow: 'hidden',
        opacity,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          gap: 8,
        }}
      >
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
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#484f58',
            fontSize: codeStyle.fontSize * 0.7,
            fontFamily: 'monospace',
          }}
        >
          {title}
        </div>
      </div>
      {/* Terminal content */}
      <div style={{ padding: '24px 32px', minHeight: 200 }}>
        {lines.map((line, i) => {
          const timing = lineTimings[i];
          if (!timing || frame < timing.startFrame) return null;

          const isCommand = line.type === 'command';
          const lineColor = LINE_TYPE_COLORS[line.type];

          // For commands, calculate visible characters
          let visibleText = line.text;
          if (isCommand) {
            const typingProgress = interpolate(
              frame,
              [timing.startFrame, timing.endFrame],
              [0, line.text.length],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            visibleText = line.text.slice(0, Math.floor(typingProgress));
          }

          // For non-commands, fade in
          const lineOpacity = isCommand
            ? 1
            : interpolate(
                frame,
                [timing.startFrame, timing.startFrame + 5],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }
              );

          // Cursor for active command
          const isTyping =
            isCommand && frame >= timing.startFrame && frame <= timing.endFrame;
          const showCursor = isTyping && frame % 16 < 10;

          return (
            <div
              key={`${i}-${line.text.slice(0, 20)}`}
              style={{
                fontFamily:
                  "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
                fontSize: codeStyle.fontSize,
                lineHeight: 1.8,
                color: lineColor,
                opacity: lineOpacity,
                whiteSpace: 'pre-wrap',
              }}
            >
              {isCommand && <span style={{ color: '#3fb950' }}>{prompt}</span>}
              {line.type === 'comment' && (
                <span style={{ color: LINE_TYPE_COLORS.comment }}>{'# '}</span>
              )}
              {visibleText}
              {showCursor && (
                <span
                  style={{
                    backgroundColor: '#c9d1d9',
                    width: '2px',
                    display: 'inline-block',
                    height: '1.2em',
                    verticalAlign: 'text-bottom',
                  }}
                >
                  &nbsp;
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
