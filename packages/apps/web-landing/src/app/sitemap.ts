import type { MetadataRoute } from 'next';

const BASE_URL = 'https://contractspec.io';

// Marketing/Landing pages
const MARKETING_ROUTES = [
  '',
  '/changelog',
  '/cofounder',
  '/contact',
  '/contribute',
  '/design-partner',
  '/features',
  '/legal/privacy',
  '/legal/terms',
  '/pricing',
  '/product',
  '/templates',
];

// Documentation pages
const DOCS_ROUTES = [
  '/docs',
  '/docs/manifesto',
  // Getting Started
  '/docs/getting-started/installation',
  '/docs/getting-started/hello-world',
  '/docs/getting-started/dataviews',
  '/docs/getting-started/tools',
  '/docs/getting-started/tools/cli',
  '/docs/getting-started/tools/vscode',
  // Specs
  '/docs/specs',
  '/docs/specs/commands',
  '/docs/specs/queries',
  '/docs/specs/events',
  '/docs/specs/presentations',
  '/docs/specs/tests',
  // Architecture
  '/docs/architecture',
  '/docs/architecture/app-config',
  '/docs/architecture/integration-binding',
  '/docs/architecture/knowledge-binding',
  '/docs/architecture/multi-tenancy',
  // Integrations
  '/docs/integrations',
  '/docs/integrations/circuit-breakers',
  '/docs/integrations/elevenlabs',
  '/docs/integrations/gmail',
  '/docs/integrations/google-calendar',
  '/docs/integrations/openai',
  '/docs/integrations/postmark',
  '/docs/integrations/powens',
  '/docs/integrations/qdrant',
  '/docs/integrations/resend',
  '/docs/integrations/s3',
  '/docs/integrations/spec-model',
  '/docs/integrations/stripe',
  '/docs/integrations/twilio',
  // Knowledge
  '/docs/knowledge',
  '/docs/knowledge/sources',
  '/docs/knowledge/retrieval',
  '/docs/knowledge/embeddings',
  '/docs/knowledge/rag',
  // Libraries
  '/docs/libraries',
  '/docs/libraries/contracts',
  '/docs/libraries/ai-agent',
  '/docs/libraries/design-system',
  '/docs/libraries/evolution',
  '/docs/libraries/observability',
  '/docs/libraries/progressive-delivery',
  '/docs/libraries/schema',
  // Advanced
  '/docs/advanced/mcp',
  '/docs/advanced/overlay-editor',
  '/docs/advanced/renderers',
  '/docs/advanced/spec-experiments',
  '/docs/advanced/telemetry',
  '/docs/advanced/workflow-monitoring',
  // Safety
  '/docs/safety',
  '/docs/safety/guardrails',
  '/docs/safety/policies',
  '/docs/safety/audit',
  '/docs/safety/compliance',
  '/docs/safety/encryption',
  // Ops
  '/docs/ops',
  '/docs/ops/deployment',
  // Comparison
  '/docs/comparison',
  '/docs/comparison/automation-platforms',
  '/docs/comparison/enterprise-platforms',
  '/docs/comparison/internal-tool-builders',
  '/docs/comparison/windmill',
  '/docs/comparison/workflow-engines',
  // Studio
  '/docs/studio',
  '/docs/studio/overview',
  '/docs/studio/editor',
  '/docs/studio/preview',
  '/docs/studio/deployment',
  '/docs/studio/collaboration',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const marketingEntries: MetadataRoute.Sitemap = MARKETING_ROUTES.map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : route === '/pricing' ? 0.9 : 0.8,
    })
  );

  const docsEntries: MetadataRoute.Sitemap = DOCS_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '/docs' ? 0.9 : 0.7,
  }));

  return [...marketingEntries, ...docsEntries];
}
