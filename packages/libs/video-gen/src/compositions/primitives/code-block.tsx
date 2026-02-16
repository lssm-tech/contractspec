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

/**
 * Minimal syntax token colors (no external syntax highlighter dependency).
 * Maps common patterns to colors.
 */
const TOKEN_COLORS: Record<string, string> = {
  keyword: '#c678dd',
  string: '#98c379',
  number: '#d19a66',
  comment: '#5c6370',
  type: '#e5c07b',
  function: '#61afef',
  punctuation: '#abb2bf',
  operator: '#56b6c2',
};

/** Minimal inline tokenizer for display purposes. */
function tokenize(code: string): { text: string; color: string }[] {
  const tokens: { text: string; color: string }[] = [];
  const keywords =
    /\b(import|export|from|const|let|var|function|return|if|else|interface|type|async|await|new|class|extends|implements)\b/g;
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  const comments = /\/\/.*$/gm;
  const numbers = /\b\d+\.?\d*\b/g;
  const types = /\b[A-Z][a-zA-Z0-9]*\b/g;

  // Simple approach: push the whole code as default, let CSS handle display
  // For video purposes, a basic coloring is sufficient
  const remaining = code;
  let match: RegExpExecArray | null;

  // Process comments first
  const commentRegex = /\/\/.*$/gm;
  const parts: { text: string; color: string; index: number }[] = [];

  while ((match = commentRegex.exec(remaining)) !== null) {
    parts.push({
      text: match[0],
      color: TOKEN_COLORS.comment!,
      index: match.index,
    });
  }

  // Process strings
  const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  while ((match = stringRegex.exec(remaining)) !== null) {
    parts.push({
      text: match[0],
      color: TOKEN_COLORS.string!,
      index: match.index,
    });
  }

  // For simplicity in video rendering, return the full code with default color
  // A full tokenizer would be complex; this gives visual variety
  if (parts.length === 0) {
    tokens.push({ text: code, color: '#abb2bf' });
  } else {
    // Sort by index and interleave
    parts.sort((a, b) => a.index - b.index);
    let lastIndex = 0;
    for (const part of parts) {
      if (part.index > lastIndex) {
        tokens.push({
          text: remaining.slice(lastIndex, part.index),
          color: '#abb2bf',
        });
      }
      tokens.push({ text: part.text, color: part.color });
      lastIndex = part.index + part.text.length;
    }
    if (lastIndex < remaining.length) {
      tokens.push({ text: remaining.slice(lastIndex), color: '#abb2bf' });
    }
  }

  return tokens;
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
