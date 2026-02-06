### Integration Example - Gmail Inbound + Outbound

Website: https://contractspec.io/

This example shows how to list Gmail threads/messages and send outbound email with the Gmail providers.

Files included:

- `example.ts` - example metadata for the catalog.
- `inbound.ts` - list threads and messages using Gmail inbound provider.
- `outbound.ts` - send a message using Gmail outbound provider.
- `docs/email-gmail.docblock.ts` - documentation blocks for MCP/docs.

Usage:

```bash
export CONTRACTSPEC_EMAIL_MODE="both" # inbound | outbound | both
export CONTRACTSPEC_EMAIL_DRY_RUN="true" # set to false to send/list real data

export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export GOOGLE_REFRESH_TOKEN="your_refresh_token"
export GOOGLE_REDIRECT_URI="https://developers.google.com/oauthplayground" # optional

export GMAIL_FROM_EMAIL="sender@example.com"
export GMAIL_FROM_NAME="Sender"
export GMAIL_TO_EMAIL="recipient@example.com"
export GMAIL_TO_NAME="Recipient"

bun tsx packages/examples/email-gmail/src/run.ts
```
