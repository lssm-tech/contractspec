import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
// Note: useCurrentFrame is used by sub-components (MethodBadge, OutputChip)
import { BrandFrame } from './primitives/brand-frame';
import { AnimatedText } from './primitives/animated-text';
import { CodeBlock } from './primitives/code-block';
import { ProgressBar } from './primitives/progress-bar';
import { videoEasing } from '../design/motion';
import { defaultVideoTheme } from '../design/tokens';

// ---------------------------------------------------------------------------
// ApiOverview -- Contract spec -> API endpoint visualization
// ---------------------------------------------------------------------------
// Shows how a ContractSpec definition generates a full API surface.
// Used on the homepage demo and in documentation.
// ---------------------------------------------------------------------------

export interface ApiOverviewProps {
  /** The contract spec name (e.g., "CreateUser") */
  specName: string;
  /** HTTP method */
  method?: string;
  /** Endpoint path */
  endpoint?: string;
  /** Contract spec code snippet */
  specCode: string;
  /** Generated output items to showcase */
  generatedOutputs?: string[];
  /** Tagline */
  tagline?: string;
}

export const ApiOverview: React.FC<ApiOverviewProps> = ({
  specName,
  method = 'POST',
  endpoint = '/api/users',
  specCode,
  generatedOutputs = [
    'REST Endpoint',
    'GraphQL Mutation',
    'Prisma Model',
    'TypeScript SDK',
    'MCP Tool',
    'OpenAPI Spec',
  ],
  tagline = 'One spec. Every surface.',
}) => {
  const { durationInFrames } = useVideoConfig();

  const theme = defaultVideoTheme;

  // Scene timing
  const INTRO_END = 60; // 2s
  const CODE_START = 45;
  const CODE_END = INTRO_END + 150; // ~5s for code
  const OUTPUTS_START = CODE_END - 30;
  const TAGLINE_START = durationInFrames - 90;

  return (
    <AbsoluteFill>
      <BrandFrame variant="gradient" showBranding>
        {/* Scene 1: Title */}
        <Sequence from={0} durationInFrames={CODE_END}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Method + endpoint badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <MethodBadge method={method} enterAt={10} />
              <AnimatedText
                text={endpoint}
                variant="subheading"
                enterAt={15}
                color={theme.colors.mutedForeground}
              />
            </div>

            {/* Spec name */}
            <AnimatedText
              text={specName}
              variant="title"
              enterAt={5}
              color="#ffffff"
            />

            {/* Code block */}
            <div style={{ flex: 1, marginTop: 24 }}>
              <CodeBlock
                code={specCode}
                language="typescript"
                filename={`${specName.toLowerCase()}.contract.ts`}
                startAt={CODE_START}
                typeAnimation
              />
            </div>
          </div>
        </Sequence>

        {/* Scene 2: Generated outputs fan-out */}
        <Sequence
          from={OUTPUTS_START}
          durationInFrames={durationInFrames - OUTPUTS_START}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <AnimatedText
              text="Generates:"
              variant="heading"
              enterAt={0}
              color="#ffffff"
              align="center"
            />

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                justifyContent: 'center',
                maxWidth: '80%',
                marginTop: 32,
              }}
            >
              {generatedOutputs.map((output, i) => (
                <OutputChip
                  key={output}
                  label={output}
                  index={i}
                  startFrame={20 + i * 8}
                />
              ))}
            </div>

            {/* Tagline */}
            <Sequence from={TAGLINE_START - OUTPUTS_START}>
              <div style={{ marginTop: 48 }}>
                <AnimatedText
                  text={tagline}
                  variant="heading"
                  enterAt={0}
                  color={theme.colors.accent}
                  align="center"
                />
              </div>
            </Sequence>
          </div>
        </Sequence>
      </BrandFrame>

      <ProgressBar />
    </AbsoluteFill>
  );
};

// -- Sub-components ---------------------------------------------------------

const MethodBadge: React.FC<{ method: string; enterAt: number }> = ({
  method,
  enterAt,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [enterAt, enterAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: videoEasing.entrance,
  });

  const scale = interpolate(frame, [enterAt, enterAt + 12], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: videoEasing.emphasis,
  });

  const methodColors: Record<string, string> = {
    GET: '#61afef',
    POST: '#98c379',
    PUT: '#e5c07b',
    PATCH: '#d19a66',
    DELETE: '#e06c75',
  };

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        backgroundColor: methodColors[method] ?? '#61afef',
        color: '#000',
        padding: '8px 20px',
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 700,
        fontFamily: 'monospace',
        letterSpacing: 1,
      }}
    >
      {method}
    </div>
  );
};

const OutputChip: React.FC<{
  label: string;
  index: number;
  startFrame: number;
}> = ({ label, startFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [20, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: videoEasing.emphasis,
    }
  );

  const scale = interpolate(frame, [startFrame, startFrame + 15], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: videoEasing.emphasis,
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#ffffff',
        padding: '16px 32px',
        borderRadius: 12,
        fontSize: 28,
        fontWeight: 500,
      }}
    >
      {label}
    </div>
  );
};
