import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'meeting-recorder-providers',
    version: '1.0.0',
    title: 'Meeting Recorder Providers',
    description:
      'Multi-provider meeting recorder integration example with list, transcript, and webhook handling.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'transcripts', 'webhooks', 'integrations'],
  },
  docs: {
    rootDocId: 'docs.examples.meeting-recorder-providers',
    usageDocId: 'docs.examples.meeting-recorder-providers.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.meeting-recorder-providers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
