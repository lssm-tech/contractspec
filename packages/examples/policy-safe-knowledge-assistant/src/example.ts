import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'policy-safe-knowledge-assistant',
    version: '1.0.0',
    title: 'Policy-safe Knowledge Assistant',
    description:
      'All-in-one template: locale/jurisdiction gating + versioned KB snapshots + HITL update pipeline + learning hub.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['assistant', 'knowledge', 'policy', 'hitl', 'learning'],
  },
  docs: {
    goalDocId: 'docs.examples.policy-safe-knowledge-assistant.goal',
    usageDocId: 'docs.examples.policy-safe-knowledge-assistant.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.policy-safe-knowledge-assistant',
    feature: './policy-safe-knowledge-assistant.feature',
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
});

export default example;
