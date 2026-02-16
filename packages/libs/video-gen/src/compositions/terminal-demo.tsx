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
import { Terminal } from './primitives/terminal';
import { ProgressBar } from './primitives/progress-bar';
import type { TerminalLine } from './primitives/terminal';
import { defaultVideoTheme } from '../design/tokens';

// ---------------------------------------------------------------------------
// TerminalDemo -- CLI command walkthrough with animated terminal
// ---------------------------------------------------------------------------
// Shows ContractSpec CLI commands being typed and their output.
// Used in documentation and tutorial videos.
// ---------------------------------------------------------------------------

export interface TerminalDemoProps {
  /** Title shown above the terminal */
  title: string;
  /** Subtitle / description */
  subtitle?: string;
  /** Terminal lines (commands + output) */
  lines: TerminalLine[];
  /** Terminal window title */
  terminalTitle?: string;
  /** Prompt string */
  prompt?: string;
  /** Summary text shown after terminal completes */
  summary?: string;
}

export const TerminalDemo: React.FC<TerminalDemoProps> = ({
  title,
  subtitle,
  lines,
  terminalTitle = 'Terminal',
  prompt = '$ ',
  summary,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const theme = defaultVideoTheme;

  // Scene timing
  const TITLE_DURATION = 60;
  const TERMINAL_START = 40;
  const SUMMARY_START = durationInFrames - 90;

  return (
    <AbsoluteFill>
      <BrandFrame variant="dark" showBranding>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Title section */}
          <div>
            <AnimatedText
              text={title}
              variant="heading"
              enterAt={5}
              color="#ffffff"
            />
            {subtitle && (
              <div style={{ marginTop: 8 }}>
                <AnimatedText
                  text={subtitle}
                  variant="body"
                  enterAt={15}
                  color={theme.colors.mutedForeground}
                />
              </div>
            )}
          </div>

          {/* Terminal */}
          <Sequence from={TERMINAL_START}>
            <div style={{ flex: 1 }}>
              <Terminal
                lines={lines}
                startAt={0}
                prompt={prompt}
                title={terminalTitle}
              />
            </div>
          </Sequence>

          {/* Summary */}
          {summary && (
            <Sequence from={SUMMARY_START}>
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 24,
                }}
              >
                <AnimatedText
                  text={summary}
                  variant="subheading"
                  enterAt={0}
                  color={theme.colors.accent}
                  align="center"
                />
              </div>
            </Sequence>
          )}
        </div>
      </BrandFrame>

      <ProgressBar />
    </AbsoluteFill>
  );
};
