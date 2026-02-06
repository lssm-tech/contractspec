import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.email-gmail',
    title: 'Gmail Inbound and Outbound (example)',
    summary: 'List threads/messages and send outbound email using Gmail.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/email-gmail',
    tags: ['email', 'gmail', 'example'],
    body: `## What this example shows
- Build an OAuth client from env vars.
- Fetch recent threads and messages.
- Send a simple outbound message.

## Guardrails
- Use dry-run when validating configs.
- Limit page sizes to avoid large fetches.
- Keep refresh tokens in secrets.`,
  },
  {
    id: 'docs.examples.email-gmail.usage',
    title: 'Gmail Example - Usage',
    summary: 'How to run inbound/outbound flows for Gmail.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/email-gmail/usage',
    tags: ['email', 'usage'],
    body: `## Usage
- Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.
- Set CONTRACTSPEC_EMAIL_MODE to inbound, outbound, or both.
- Optionally set GMAIL_INBOUND_LABEL and GMAIL_SINCE_MINUTES.

## Example
- Run run.ts to execute the selected mode and log JSON results.`,
  },
];

registerDocBlocks(blocks);
