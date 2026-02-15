import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.calendar-google',
    title: 'Google Calendar (example)',
    summary: 'List upcoming events and create a new event via Google Calendar.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/calendar-google',
    tags: ['calendar', 'google-calendar', 'example'],
    body: `## What this example shows
- Create a Google OAuth client from env vars.
- List upcoming events with time bounds.
- Create a new event with attendees and reminders.

## Guardrails
- Keep refresh tokens in secrets.
- Use dry-run when validating payloads.
- Limit maxResults for quick previews.`,
  },
  {
    id: 'docs.examples.calendar-google.usage',
    title: 'Google Calendar - Usage',
    summary: 'How to run the calendar sync with env-driven settings.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/calendar-google/usage',
    tags: ['calendar', 'usage'],
    body: `## Usage
- Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.
- Optionally set GOOGLE_CALENDAR_ID (defaults to primary).
- Run the sync script to create a sample event.

## Refresh token
- Open https://developers.google.com/oauthplayground.
- Enable "Use your own OAuth credentials" and enter client ID/secret.
- Authorize https://www.googleapis.com/auth/calendar and exchange tokens.
- Copy the refresh token into GOOGLE_REFRESH_TOKEN.

## Example
- Call runCalendarSyncFromEnv() from run.ts to execute the flow.`,
  },
];

registerDocBlocks(blocks);
