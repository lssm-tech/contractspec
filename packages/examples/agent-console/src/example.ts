import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'agent-console',
    version: '1.0.0',
    title: 'Agent Console',
    description:
      'AI agent ops console: tools, agents, runs, logs, and metrics (spec-first, regenerable).',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['ai', 'agents', 'tools', 'orchestration'],
  },
  docs: {
    rootDocId: 'docs.examples.agent-console.reference',
    goalDocId: 'docs.examples.agent-console.goal',
    usageDocId: 'docs.examples.agent-console.usage',
    constraintsDocId: 'docs.examples.agent-console.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.agent-console',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: {
      enabled: true,
      modes: ['playground', 'specs', 'builder', 'markdown', 'evolution'],
    },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;
