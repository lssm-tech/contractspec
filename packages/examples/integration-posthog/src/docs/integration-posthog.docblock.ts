import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.integration-posthog',
    title: 'Integration Example — PostHog Analytics',
    summary:
      'Capture events, run HogQL, and manage feature flags using the PostHog analytics provider.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/integration-posthog',
    tags: ['posthog', 'analytics', 'hogql', 'example'],
    body: `## What this example shows
- Capture product events and identify users.
- Run HogQL queries through the analytics provider.
- Perform generic REST API requests (feature flag list/create/delete).
- Read events, persons, insights, and feature flags using typed reader methods.
- Optionally call a PostHog MCP tool via JSON-RPC.

## Guardrails
- Use dry-run while validating credentials.
- Writes are gated behind CONTRACTSPEC_POSTHOG_ALLOW_WRITES.
- Keep API keys in secret storage.`,
  },
  {
    id: 'docs.examples.integration-posthog.usage',
    title: 'PostHog Integration Example — Usage',
    summary: 'How to run the PostHog example with env-driven settings.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/integration-posthog/usage',
    tags: ['posthog', 'usage'],
    body: `## Usage
- Set CONTRACTSPEC_POSTHOG_MODE to capture | query | request | read | all.
- Set CONTRACTSPEC_POSTHOG_DRY_RUN=true for a safe preview.
- Set CONTRACTSPEC_POSTHOG_ALLOW_WRITES=true to enable capture and create/delete.

## Required env vars
- POSTHOG_PROJECT_ID for queries and REST requests.
- POSTHOG_PROJECT_API_KEY for capture/identify.
- POSTHOG_PERSONAL_API_KEY for HogQL queries and REST requests.

## MCP
- Set POSTHOG_MCP_URL to call tools/call.
- Optionally set POSTHOG_MCP_TOOL_NAME and POSTHOG_MCP_TOOL_ARGS (JSON).

## Example
- Call runPosthogExampleFromEnv() from run.ts to execute the flow.`,
  },
];

registerDocBlocks(blocks);
