### Integration Example - Project Management Sync

Website: https://contractspec.io/

This example shows how to create work items in Linear, Jira Cloud, and Notion using the project-management providers.

Files included:

- `example.ts` – example metadata for the catalog.
- `sync.ts` – helper to build sample work items and sync them to a provider.
- `docs/project-management-sync.docblock.ts` – documentation blocks for MCP/docs.

Usage:

```bash
export CONTRACTSPEC_PM_PROVIDER="linear" # linear | jira | notion
export CONTRACTSPEC_PM_DRY_RUN="true"    # set to false to create real items

# Linear
export LINEAR_API_KEY="your_key"
export LINEAR_TEAM_ID="team_id"

# Jira Cloud
# export JIRA_SITE_URL="https://acme.atlassian.net"
# export JIRA_EMAIL="user@acme.com"
# export JIRA_API_TOKEN="jira_token"
# export JIRA_PROJECT_KEY="PM"

# Notion
# export NOTION_API_KEY="secret"
# export NOTION_DATABASE_ID="database_id"
# export NOTION_SUMMARY_PARENT_PAGE_ID="parent_page_id" # optional

bun tsx packages/examples/project-management-sync/src/run.ts
```
