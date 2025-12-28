const example = {
  id: 'policy-safe-knowledge-assistant',
  title: 'Policy-safe Knowledge Assistant',
  summary:
    'All-in-one template: locale/jurisdiction gating + versioned KB snapshots + HITL update pipeline + learning hub.',
  tags: ['assistant', 'knowledge', 'policy', 'hitl', 'learning'],
  kind: 'template',
  visibility: 'public',
  docs: {
    goalDocId: 'docs.examples.policy-safe-knowledge-assistant.goal',
    usageDocId: 'docs.examples.policy-safe-knowledge-assistant.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.policy-safe-knowledge-assistant',
    feature: './feature',
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
