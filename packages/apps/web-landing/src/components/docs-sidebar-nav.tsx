'use client';

export const docsSections = [
  {
    title: 'Docs overview',
    href: '/docs',
    items: [],
  },
  {
    title: 'Getting Started',
    items: [
      { title: 'Start Here', href: '/docs/getting-started/start-here' },
      { title: 'Compatibility', href: '/docs/getting-started/compatibility' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Hello World', href: '/docs/getting-started/hello-world' },
      { title: 'DataView Tutorial', href: '/docs/getting-started/dataviews' },
      { title: 'Developer Tools', href: '/docs/getting-started/tools' },
      {
        title: 'Troubleshooting',
        href: '/docs/getting-started/troubleshooting',
      },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Overview', href: '/docs/guides' },
      {
        title: 'Next.js One Endpoint',
        href: '/docs/guides/nextjs-one-endpoint',
      },
      {
        title: 'Spec Validation + Typing',
        href: '/docs/guides/spec-validation-and-typing',
      },
      {
        title: 'Generate Docs + Clients',
        href: '/docs/guides/generate-docs-clients-schemas',
      },
      {
        title: 'CI Diff Gating',
        href: '/docs/guides/ci-contract-diff-gating',
      },
    ],
  },
  {
    title: 'Reference',
    items: [{ title: 'Contract Reference', href: '/docs/reference' }],
  },
  {
    title: 'Examples',
    items: [{ title: 'Catalog', href: '/docs/examples' }],
  },
  {
    title: 'Architecture',
    items: [
      { title: 'Overview', href: '/docs/architecture' },
      { title: 'App Configuration', href: '/docs/architecture/app-config' },
      { title: 'Multi-Tenancy', href: '/docs/architecture/multi-tenancy' },
      {
        title: 'Integration Binding',
        href: '/docs/architecture/integration-binding',
      },
      {
        title: 'Knowledge Binding',
        href: '/docs/architecture/knowledge-binding',
      },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Overview', href: '/docs/specs' },
      { title: 'Capabilities', href: '/docs/specs/capabilities' },
      { title: 'DataViews', href: '/docs/specs/dataviews' },
      { title: 'Workflows', href: '/docs/specs/workflows' },
      { title: 'Policy', href: '/docs/specs/policy' },
      { title: 'Overlays', href: '/docs/specs/overlays' },
    ],
  },
  {
    title: 'Libraries',
    items: [
      { title: 'Overview', href: '/docs/libraries' },
      { title: 'Contracts', href: '/docs/libraries/contracts' },
      { title: 'Schema', href: '/docs/libraries/schema' },
      { title: 'UI Kit', href: '/docs/libraries/ui-kit' },
      { title: 'Design System', href: '/docs/libraries/design-system' },
      { title: 'Accessibility', href: '/docs/libraries/accessibility' },
      { title: 'GraphQL', href: '/docs/libraries/graphql' },
      { title: 'Data & Backend', href: '/docs/libraries/data-backend' },
      { title: 'Multi-Tenancy', href: '/docs/libraries/multi-tenancy' },
      { title: 'Observability', href: '/docs/libraries/observability' },
      { title: 'Resilience', href: '/docs/libraries/resilience' },
      { title: 'Overlay Engine', href: '/docs/libraries/overlay-engine' },
      { title: 'Runtime', href: '/docs/libraries/runtime' },
      { title: 'DataViews', href: '/docs/libraries/data-views' },
      { title: 'Workflows', href: '/docs/libraries/workflows' },
      { title: 'Personalization', href: '/docs/libraries/personalization' },
      {
        title: 'Workflow Composer',
        href: '/docs/libraries/workflow-composer',
      },
    ],
  },
  {
    title: 'Intent Pages',
    items: [
      { title: 'Contract-first API', href: '/docs/intent/contract-first-api' },
      {
        title: 'Spec-driven Development',
        href: '/docs/intent/spec-driven-development',
      },
      {
        title: 'Deterministic Codegen',
        href: '/docs/intent/deterministic-codegen',
      },
      {
        title: 'Schema Validation + TypeScript',
        href: '/docs/intent/schema-validation-typescript',
      },
      {
        title: 'OpenAPI Alternative',
        href: '/docs/intent/openapi-alternative',
      },
      {
        title: 'Generate Client from Schema',
        href: '/docs/intent/generate-client-from-schema',
      },
    ],
  },
  {
    title: 'Ecosystem',
    items: [
      { title: 'Plugin API', href: '/docs/ecosystem/plugins' },
      { title: 'Integrations', href: '/docs/ecosystem/integrations' },
      { title: 'Templates', href: '/docs/ecosystem/templates' },
      { title: 'Registry', href: '/docs/ecosystem/registry' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { title: 'Overview', href: '/docs/integrations' },
      { title: 'Spec Model', href: '/docs/integrations/spec-model' },
      { title: 'Stripe', href: '/docs/integrations/stripe' },
      { title: 'Postmark', href: '/docs/integrations/postmark' },
      { title: 'Resend', href: '/docs/integrations/resend' },
      { title: 'Gmail API', href: '/docs/integrations/gmail' },
      { title: 'Google Calendar', href: '/docs/integrations/google-calendar' },
      { title: 'OpenAI', href: '/docs/integrations/openai' },
      { title: 'ElevenLabs', href: '/docs/integrations/elevenlabs' },
      { title: 'Qdrant', href: '/docs/integrations/qdrant' },
      { title: 'S3 Storage', href: '/docs/integrations/s3' },
      { title: 'Twilio', href: '/docs/integrations/twilio' },
      {
        title: 'Circuit Breakers',
        href: '/docs/integrations/circuit-breakers',
      },
    ],
  },
  {
    title: 'Knowledge & Context',
    items: [
      { title: 'Overview', href: '/docs/knowledge' },
      { title: 'Categories', href: '/docs/knowledge/categories' },
      { title: 'Spaces', href: '/docs/knowledge/spaces' },
      { title: 'Sources', href: '/docs/knowledge/sources' },
      { title: 'Examples', href: '/docs/knowledge/examples' },
    ],
  },
  {
    title: 'Safety',
    items: [
      { title: 'Overview', href: '/docs/safety' },
      { title: 'Spec Signing', href: '/docs/safety/signing' },
      { title: 'Policy Decision Points', href: '/docs/safety/pdp' },
      { title: 'Audit Logs', href: '/docs/safety/auditing' },
      { title: 'Tenant Isolation', href: '/docs/safety/tenant-isolation' },
      { title: 'Migrations', href: '/docs/safety/migrations' },
      { title: 'Security & Trust', href: '/docs/safety/security-trust' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'Custom Renderers', href: '/docs/advanced/renderers' },
      { title: 'MCP Adapters', href: '/docs/advanced/mcp' },
      { title: 'Telemetry', href: '/docs/advanced/telemetry' },
      { title: 'Distributed Tracing', href: '/docs/ops/distributed-tracing' },
      {
        title: 'Workflow Monitoring',
        href: '/docs/advanced/workflow-monitoring',
      },
      { title: 'Overlay Editor', href: '/docs/advanced/overlay-editor' },
    ],
  },
  {
    title: 'Comparison',
    items: [
      { title: 'Overview', href: '/docs/comparison' },
      { title: 'Workflow Engines', href: '/docs/comparison/workflow-engines' },
      {
        title: 'Internal-tool Builders',
        href: '/docs/comparison/internal-tool-builders',
      },
      {
        title: 'Automation Platforms',
        href: '/docs/comparison/automation-platforms',
      },
      { title: 'Windmill', href: '/docs/comparison/windmill' },
      {
        title: 'Enterprise Orchestrators',
        href: '/docs/comparison/enterprise-platforms',
      },
    ],
  },
  {
    title: 'About',
    items: [{ title: 'Manifesto', href: '/docs/manifesto' }],
  },
];
