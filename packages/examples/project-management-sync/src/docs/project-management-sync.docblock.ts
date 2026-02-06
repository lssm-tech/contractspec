import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.project-management-sync',
    title: 'Project Management Sync (example)',
    summary:
      'Create a shared payload of work items and sync it to Linear, Jira Cloud, or Notion.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/project-management-sync',
    tags: ['project-management', 'linear', 'jira', 'notion', 'example'],
    body: `## What this example shows
- Build a provider-agnostic payload of work items.
- Resolve the target provider from environment variables.
- Run in dry-run mode for preview output.

## Guardrails
- Keep secrets in env or secret providers only.
- Use dry-run to validate payloads before writing.
- Start with a small batch of tasks to validate setup.`,
  },
  {
    id: 'docs.examples.project-management-sync.usage',
    title: 'Project Management Sync - Usage',
    summary: 'How to run the sync with env-driven provider settings.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/project-management-sync/usage',
    tags: ['project-management', 'usage'],
    body: `## Usage
- Set CONTRACTSPEC_PM_PROVIDER to linear, jira, or notion.
- Set CONTRACTSPEC_PM_DRY_RUN=true to preview payloads.
- Provide provider-specific env vars (API keys, project IDs).

## Example
- Call runProjectManagementSyncFromEnv() from sync.ts or import it in your app.
- The helper builds a sample payload and calls the provider client.`,
  },
];

registerDocBlocks(blocks);
