const example = {
  id: 'agent-console',
  title: 'Agent Console',
  summary:
    'AI agent ops console: tools, agents, runs, logs, and metrics (spec-first, regenerable).',
  tags: ['ai', 'agents', 'tools', 'orchestration'],
  kind: 'template',
  visibility: 'public',
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
} as const;

export default example;
