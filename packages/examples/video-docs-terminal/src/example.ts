import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'video-docs-terminal',
    version: '1.0.0',
    title: 'Video Docs Terminal',
    description:
      'Generate terminal demo videos from CLI walkthroughs using the TerminalDemo composition and ScriptGenerator.',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['video', 'documentation', 'terminal', 'cli', 'tutorial'],
  },
  docs: {
    rootDocId: 'docs.examples.video-docs-terminal',
    usageDocId: 'docs.examples.video-docs-terminal.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.video-docs-terminal',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
