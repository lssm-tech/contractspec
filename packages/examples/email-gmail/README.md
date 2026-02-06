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

export GMAIL_FROM_EMAIL="sender@example.com" # optional, defaults to Gmail profile
export GMAIL_FROM_NAME="Sender" # optional
export GMAIL_TO_EMAIL="recipient@example.com" # optional, defaults to Gmail profile
export GMAIL_TO_NAME="Recipient" # optional

bun tsx packages/examples/email-gmail/src/run.ts
```

Refresh token notes:

1. Open https://developers.google.com/oauthplayground
2. Click the gear icon and enable "Use your own OAuth credentials"
3. Enter GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
4. Authorize scope https://www.googleapis.com/auth/gmail.modify
   (or https://www.googleapis.com/auth/gmail.readonly for inbound only)
5. Exchange for tokens and copy the refresh token
6. Do not use https://www.googleapis.com/auth/gmail.metadata for this example
7. If you see redirect_uri_mismatch, add https://developers.google.com/oauthplayground
   to the OAuth client Authorized redirect URIs in Google Cloud Console
8. Export GOOGLE_REFRESH_TOKEN and rerun the script
