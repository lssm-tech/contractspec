import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

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
- GMAIL_FROM_EMAIL and GMAIL_TO_EMAIL default to the Gmail profile address.

## Refresh token
- Open https://developers.google.com/oauthplayground.
- Enable "Use your own OAuth credentials" and enter client ID/secret.
- Authorize https://www.googleapis.com/auth/gmail.modify and exchange tokens.
- Use https://www.googleapis.com/auth/gmail.readonly for inbound only.
- Do not use https://www.googleapis.com/auth/gmail.metadata for this example.
- Copy the refresh token into GOOGLE_REFRESH_TOKEN.
- If you see redirect_uri_mismatch, add https://developers.google.com/oauthplayground
  to the OAuth client Authorized redirect URIs in Google Cloud Console.

## Example
- Run run.ts to execute the selected mode and log JSON results.`,
  },
];

registerDocBlocks(blocks);
