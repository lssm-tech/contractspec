import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.meeting-recorder-providers',
    title: 'Meeting Recorder Providers (example)',
    summary:
      'Multi-provider meeting recorder example covering list, transcript fetch, and webhook ingestion.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/meeting-recorder-providers',
    tags: ['meeting-recorder', 'integration', 'example', 'transcripts'],
    body:
      '## What this example shows\n' +
      '- Provider selection for Granola (API and MCP), tl;dv, Fireflies, and Fathom.\n' +
      '- List meetings + fetch transcripts using the MeetingRecorderProvider interface.\n' +
      '- Webhook verification and normalization into a single event shape.\n\n' +
      '## Secrets and config\n' +
      '- apiKey (all providers)\n' +
      '- Granola MCP: set transport=mcp and provide mcpAccessToken (or apiKey fallback for MCP proxy).\n' +
      '- webhookSecret (Fireflies and Fathom)\n' +
      '- baseUrl overrides for sandbox or proxy setups\n' +
      '- mcpUrl and mcpHeaders for custom MCP routing\n' +
      '- pageSize / transcriptsPageSize for pagination\n' +
      '- Fathom options: includeTranscript, includeSummary, includeActionItems, includeCrmMatches, triggeredFor\n\n' +
      '## Guardrails\n' +
      '- Keep secrets in a dedicated secret provider.\n' +
      '- Verify webhook signatures before triggering workflows.\n' +
      '- Treat transcript ingestion as async workflows, not inline writes.',
  },
  {
    id: 'docs.examples.meeting-recorder-providers.usage',
    title: 'Meeting Recorder Providers - Usage',
    summary: 'How to wire the provider factory and handlers in a runtime.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/meeting-recorder-providers/usage',
    tags: ['meeting-recorder', 'usage'],
    body:
      '## Usage\n' +
      '- Call `createMeetingRecorderProvider` with an integration key, secrets, and config.\n' +
      '- Use `listMeetingRecorderMeetings` to fetch metadata pages.\n' +
      '- Use `getMeetingRecorderTranscript` to fetch transcript content.\n' +
      '- Wire `handleMeetingRecorderWebhook` to your webhook endpoint.\n\n' +
      '## Notes\n' +
      '- Replace the placeholder stores with your app persistence.\n' +
      '- Record the raw webhook payload for replay or debugging.',
  },
];

registerDocBlocks(blocks);
