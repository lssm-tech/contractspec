import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.voice-providers',
    title: 'Voice Providers (example)',
    summary:
      'Multi-provider voice integration example covering Gradium and Fal text-to-speech flows.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/voice-providers',
    tags: ['voice', 'tts', 'gradium', 'fal', 'example'],
    body:
      '## What this example shows\n' +
      '- Provider selection for `ai-voice.gradium` and `ai-voice.fal`.\n' +
      '- Listing voice catalogs and synthesizing text into audio bytes.\n' +
      '- Connection metadata patterns for BYOK secret references.\n\n' +
      '## Secrets and config\n' +
      '- `apiKey` for each provider.\n' +
      '- Gradium config: `defaultVoiceId`, `region`, `outputFormat`.\n' +
      '- Fal config: `modelId`, `defaultVoiceUrl`, synthesis tuning fields.\n\n' +
      '## Guardrails\n' +
      '- Keep API keys in secret providers only.\n' +
      '- Prefer declarative provider config over hardcoded runtime options.\n' +
      '- Keep synthesis side effects explicit for deterministic workflows.',
  },
  {
    id: 'docs.examples.voice-providers.usage',
    title: 'Voice Providers - Usage',
    summary:
      'How to wire provider factory and synthesis helpers in runtime code.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/voice-providers/usage',
    tags: ['voice', 'usage'],
    body:
      '## Usage\n' +
      '- Call `createVoiceProvider` with integration key, secrets, and config.\n' +
      '- Use `listVoices` to expose voice choices in admin/config screens.\n' +
      '- Use `synthesizeVoice` for message generation or workflow steps.\n\n' +
      '## Notes\n' +
      '- Fal uses an audio URL output; this example downloads bytes for a canonical result shape.\n' +
      '- Gradium maps provider output formats into ContractSpec voice result conventions.',
  },
];

registerDocBlocks(blocks);
