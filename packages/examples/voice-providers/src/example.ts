import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'voice-providers',
    version: '1.0.0',
    title: 'Voice Providers (Gradium and Fal)',
    description:
      'Multi-provider voice integration example for Gradium and Fal text-to-speech adapters.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.integrations'],
    tags: ['voice', 'tts', 'gradium', 'fal', 'integrations'],
  },
  docs: {
    rootDocId: 'docs.examples.voice-providers',
    usageDocId: 'docs.examples.voice-providers.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.voice-providers',
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
