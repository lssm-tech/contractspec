import React from 'react';
import { Composition } from 'remotion';
import { ApiOverview } from '../compositions/api-overview';
import { SocialClip } from '../compositions/social-clip';
import { TerminalDemo } from '../compositions/terminal-demo';
import type { ApiOverviewProps } from '../compositions/api-overview';
import type { SocialClipProps } from '../compositions/social-clip';
import type { TerminalDemoProps } from '../compositions/terminal-demo';

// Remotion Composition expects LooseComponentType<Record<string, unknown>>.
// Our components have strict props. This helper bridges the gap safely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComp = React.ComponentType<any>;

// ---------------------------------------------------------------------------
// Remotion Root -- Registers all compositions
// ---------------------------------------------------------------------------

// Default props for studio preview
const defaultApiOverviewProps: ApiOverviewProps = {
  specName: 'CreateUser',
  method: 'POST',
  endpoint: '/api/users',
  specCode: `export const createUser = defineCommand({
  meta: {
    name: 'CreateUser',
    version: '1.0.0',
    stability: 'Stable',
  },
  io: {
    input: z.object({
      email: z.string().email(),
      name: z.string(),
      role: z.enum(['admin', 'user']),
    }),
    output: z.object({
      id: z.string().uuid(),
      email: z.string(),
      createdAt: z.date(),
    }),
  },
});`,
  generatedOutputs: [
    'REST Endpoint',
    'GraphQL Mutation',
    'Prisma Model',
    'TypeScript SDK',
    'MCP Tool',
    'OpenAPI Spec',
  ],
  tagline: 'One spec. Every surface.',
};

const defaultSocialClipProps: SocialClipProps = {
  hook: 'Stop rewriting the same API logic.',
  message:
    'ContractSpec generates REST, GraphQL, DB, SDK, and MCP from a single spec.',
  points: [
    'Deterministic output',
    'Fully ejectable',
    'Standard tech, no lock-in',
  ],
  cta: 'Try ContractSpec',
  ctaUrl: 'contractspec.dev',
};

const defaultTerminalDemoProps: TerminalDemoProps = {
  title: 'Getting Started with ContractSpec',
  subtitle: 'Define once, generate everything.',
  lines: [
    { type: 'comment', text: 'Initialize a new ContractSpec project' },
    { type: 'command', text: 'npx contractspec init my-api' },
    { type: 'output', text: 'Created my-api/ with 3 sample contracts' },
    { type: 'command', text: 'cd my-api && npx contractspec build' },
    { type: 'success', text: 'Built 3 contracts -> 18 generated files' },
    { type: 'output', text: '  REST endpoints:  3' },
    { type: 'output', text: '  GraphQL types:   3' },
    { type: 'output', text: '  Prisma models:   3' },
    { type: 'output', text: '  TypeScript SDK:  3' },
    { type: 'output', text: '  MCP tools:       3' },
    { type: 'output', text: '  OpenAPI specs:   3' },
    { type: 'command', text: 'npx contractspec validate' },
    { type: 'success', text: 'All contracts valid. 0 warnings.' },
  ],
  terminalTitle: 'contractspec',
  summary: 'Ship faster. Stay coherent.',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* API Overview -- landscape (homepage demo) */}
      <Composition
        id="ApiOverview"
        component={ApiOverview as AnyComp}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultApiOverviewProps}
      />

      {/* Social Clip -- landscape */}
      <Composition
        id="SocialClip"
        component={SocialClip as AnyComp}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultSocialClipProps}
      />

      {/* Social Clip -- square (LinkedIn, X feed) */}
      <Composition
        id="SocialClipSquare"
        component={SocialClip as AnyComp}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultSocialClipProps}
      />

      {/* Social Clip -- portrait (Stories, Reels, Shorts) */}
      <Composition
        id="SocialClipPortrait"
        component={SocialClip as AnyComp}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultSocialClipProps}
      />

      {/* Terminal Demo -- landscape (docs) */}
      <Composition
        id="TerminalDemo"
        component={TerminalDemo as AnyComp}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultTerminalDemoProps}
      />
    </>
  );
};
