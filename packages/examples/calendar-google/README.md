### Integration Example - Google Calendar

Website: https://contractspec.io/

This example shows how to list upcoming events and create a new event using the Google Calendar provider.

Files included:

- `example.ts` - example metadata for the catalog.
- `sync.ts` - helper to build sample events and sync them to Google Calendar.
- `docs/calendar-google.docblock.ts` - documentation blocks for MCP/docs.

Usage:

```bash
export CONTRACTSPEC_CALENDAR_DRY_RUN="true" # set to false to create real events
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export GOOGLE_REFRESH_TOKEN="your_refresh_token"
export GOOGLE_REDIRECT_URI="https://developers.google.com/oauthplayground" # optional
export GOOGLE_CALENDAR_ID="primary" # optional

bun tsx packages/examples/calendar-google/src/run.ts
```

Refresh token notes:

1. Open https://developers.google.com/oauthplayground
2. Click the gear icon and enable "Use your own OAuth credentials"
3. Enter GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
4. Authorize scope https://www.googleapis.com/auth/calendar
5. Exchange for tokens and copy the refresh token
6. Export GOOGLE_REFRESH_TOKEN and rerun the script
