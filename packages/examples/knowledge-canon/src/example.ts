import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'knowledge-canon',
    version: '1.0.0',
    title: 'Knowledge Canon (Product Canon space)',
    description:
      'Bind a canonical knowledge space to a tenant and route assistant/workflow requests to the right sources (blueprint + app config pattern).',
    kind: 'knowledge',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['knowledge', 'canon', 'app-config', 'agents', 'workflows'],
  },
  docs: {
    rootDocId: 'docs.examples.knowledge-canon',
    usageDocId: 'docs.examples.knowledge-canon.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.knowledge-canon',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;
