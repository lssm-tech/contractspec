// ---------------------------------------------------------------------------
// Sample Content Briefs for Marketing Video Generation
// ---------------------------------------------------------------------------

import type { ContentBrief } from '@contractspec/lib.content-gen/types';

/**
 * Product launch brief -- announcing ContractSpec to the market.
 */
export const productLaunchBrief: ContentBrief = {
  title: 'Ship APIs 10x Faster with ContractSpec',
  summary:
    'ContractSpec generates REST, GraphQL, DB schemas, SDKs, and MCP tools from a single spec definition.',
  problems: [
    'Teams rewrite the same API logic across multiple surfaces',
    'Manual synchronization leads to inconsistent endpoints',
    'Schema drift between frontend, backend, and documentation',
  ],
  solutions: [
    'One spec, every surface -- define once, generate everything',
    'Deterministic output -- same spec always produces the same code',
    'Fully ejectable -- no lock-in, standard TypeScript',
  ],
  metrics: [
    '10x faster API development',
    'Zero schema drift across surfaces',
    '18 generated files from 3 contracts',
  ],
  audience: {
    role: 'Engineering Lead',
    industry: 'SaaS',
    painPoints: ['API maintenance burden', 'Cross-surface consistency'],
  },
  callToAction: 'Try ContractSpec today at contractspec.dev',
};

/**
 * Feature announcement brief -- new MCP tool generation.
 */
export const featureAnnouncementBrief: ContentBrief = {
  title: 'Now Generating MCP Tools from Your Specs',
  summary:
    'ContractSpec v2 adds automatic MCP tool generation -- your contracts now power AI assistants natively.',
  problems: [
    'Building MCP tools manually is tedious and error-prone',
    'AI assistants need structured tool definitions that stay in sync with APIs',
  ],
  solutions: [
    'Automatic MCP tool generation from existing contract specs',
    'Type-safe tool definitions with Zod schema validation',
    'Zero additional configuration -- just build',
  ],
  audience: {
    role: 'Developer',
    painPoints: ['MCP integration complexity'],
  },
  callToAction: 'Upgrade to ContractSpec v2',
};

/**
 * Case study brief -- customer success story.
 */
export const caseStudyBrief: ContentBrief = {
  title: 'How Acme Corp Cut API Dev Time by 80%',
  summary:
    'Acme Corp migrated 47 endpoints to ContractSpec and eliminated manual synchronization across 5 surfaces.',
  problems: [
    '47 REST endpoints maintained manually across 3 teams',
    'GraphQL schema constantly out of sync with REST',
    'SDK updates lagged behind API changes by weeks',
  ],
  solutions: [
    'Migrated to ContractSpec in 2 weeks',
    'Single source of truth for all 47 endpoints',
    'Automated SDK and documentation generation',
  ],
  metrics: [
    '80% reduction in API development time',
    'Zero sync issues since migration',
    '3 teams now share one spec repository',
  ],
  audience: {
    role: 'CTO',
    industry: 'FinTech',
    painPoints: ['API maintenance costs', 'Team coordination'],
  },
  callToAction: 'Read the full case study at contractspec.dev/customers',
};
