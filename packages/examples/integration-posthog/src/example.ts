import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'integration-posthog',
    version: '1.0.0',
    title: 'Integration — PostHog Analytics',
    description:
      'Capture events, run HogQL, and manage PostHog assets via AnalyticsProvider.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.integrations'],
    tags: ['posthog', 'analytics', 'hogql', 'integration'],
  },
  docs: {
    rootDocId: 'docs.examples.integration-posthog',
    usageDocId: 'docs.examples.integration-posthog.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.integration-posthog',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
