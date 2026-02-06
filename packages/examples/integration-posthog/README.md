### Integration Example - PostHog Analytics

Website: https://contractspec.io/

This example shows how to use the PostHog AnalyticsProvider implementation to:

- Capture product events and identify users.
- Run HogQL queries.
- Perform generic REST API requests (feature flag list/create/delete).
- Read events, persons, insights, and feature flags.
- Optionally call a PostHog MCP tool via JSON-RPC.

Files included:

- `example.ts` - example metadata for the catalog.
- `posthog.ts` - PostHog integration flow and helpers.
- `run.ts` - runnable entrypoint for the example.
- `docs/integration-posthog.docblock.ts` - documentation blocks for MCP/docs.

Usage:

```bash
export CONTRACTSPEC_POSTHOG_MODE="all" # capture | query | request | read | all
export CONTRACTSPEC_POSTHOG_DRY_RUN="true" # set to false for real calls
export CONTRACTSPEC_POSTHOG_ALLOW_WRITES="false" # set true to capture/create/delete

export POSTHOG_HOST="https://app.posthog.com" # optional
export POSTHOG_PROJECT_ID="12345" # required for queries and API requests
export POSTHOG_PROJECT_API_KEY="phc_..." # required for capture/identify
export POSTHOG_PERSONAL_API_KEY="phx_..." # required for queries and API requests

export POSTHOG_MCP_URL="http://localhost:3000/mcp" # optional
export POSTHOG_MCP_TOOL_NAME="posthog.query" # optional
export POSTHOG_MCP_TOOL_ARGS='{"query":"select 1"}' # optional JSON

bun tsx packages/examples/integration-posthog/src/run.ts
```

Quick run examples:

Dry-run preview (safe):

```bash
export CONTRACTSPEC_POSTHOG_MODE="all"
export CONTRACTSPEC_POSTHOG_DRY_RUN="true"
export CONTRACTSPEC_POSTHOG_ALLOW_WRITES="false"

bun tsx packages/examples/integration-posthog/src/run.ts
```

Capture only:

```bash
export CONTRACTSPEC_POSTHOG_MODE="capture"
export CONTRACTSPEC_POSTHOG_DRY_RUN="false"
export CONTRACTSPEC_POSTHOG_ALLOW_WRITES="true"

export POSTHOG_PROJECT_API_KEY="phc_..."

bun tsx packages/examples/integration-posthog/src/run.ts
```

HogQL query:

```bash
export CONTRACTSPEC_POSTHOG_MODE="query"
export CONTRACTSPEC_POSTHOG_DRY_RUN="false"

export POSTHOG_PROJECT_ID="12345"
export POSTHOG_PERSONAL_API_KEY="phx_..."

bun tsx packages/examples/integration-posthog/src/run.ts
```

Feature flags list/create/delete:

```bash
export CONTRACTSPEC_POSTHOG_MODE="request"
export CONTRACTSPEC_POSTHOG_DRY_RUN="false"
export CONTRACTSPEC_POSTHOG_ALLOW_WRITES="true"

export POSTHOG_PROJECT_ID="12345"
export POSTHOG_PERSONAL_API_KEY="phx_..."

bun tsx packages/examples/integration-posthog/src/run.ts
```

Read events/persons/insights/flags:

```bash
export CONTRACTSPEC_POSTHOG_MODE="read"
export CONTRACTSPEC_POSTHOG_DRY_RUN="false"

export POSTHOG_PROJECT_ID="12345"
export POSTHOG_PERSONAL_API_KEY="phx_..."

bun tsx packages/examples/integration-posthog/src/run.ts
```

Notes:

- HogQL queries and API requests require a PostHog personal API key.
- Capturing events requires a project API key and `CONTRACTSPEC_POSTHOG_ALLOW_WRITES=true`.
- Feature flag writes are guarded and auto-cleaned after creation.
