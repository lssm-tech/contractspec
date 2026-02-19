import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'video-marketing-clip',
    version: '1.0.0',
    title: 'Video Marketing Clips',
    description:
      'Generate short-form marketing videos from content briefs using the deterministic video-gen pipeline.',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['video', 'marketing', 'content-gen', 'social-clip'],
  },
  docs: {
    rootDocId: 'docs.examples.video-marketing-clip',
    usageDocId: 'docs.examples.video-marketing-clip.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.video-marketing-clip',
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
