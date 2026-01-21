import type { ContentBrief } from '@contractspec/lib.content-gen';

export const contractFirstApiBrief: ContentBrief = {
  title: 'Contract-first API',
  summary:
    'Design APIs by writing contracts first, then generate consistent implementations across frameworks.',
  problems: [
    'API drift between frontend and backend',
    'Inconsistent error handling across endpoints',
    'Documentation becomes outdated quickly',
    'Manual OpenAPI maintenance is error-prone',
  ],
  solutions: [
    'Single source of truth for API contracts',
    'Generate OpenAPI and SDKs from contracts',
    'Type-safe request/response validation',
    'Always-in-sync documentation',
  ],
  audience: {
    role: 'API developers',
    industry: 'Software development',
    maturity: 'scaleup',
  },
  callToAction: 'Start with a simple operation contract',
  references: [
    {
      label: 'Next.js One Endpoint Guide',
      url: '/docs/guides/nextjs-one-endpoint',
    },
    {
      label: 'API Reference',
      url: '/docs/api',
    },
  ],
};

export const specDrivenDevelopmentBrief: ContentBrief = {
  title: 'Spec-driven development',
  summary:
    'Build features by writing specifications first, then generate type-safe implementations.',
  problems: [
    'Feature requirements are ambiguous',
    'Frontend and backend implementations diverge',
    'Testing lacks clear contract definitions',
    'Code reviews focus on style instead of behavior',
  ],
  solutions: [
    'Executable specifications as single source of truth',
    'Generate type-safe clients from specs',
    'Automated contract testing',
    'Clear behavior contracts for teams',
  ],
  audience: {
    role: 'Development teams',
    industry: 'Software engineering',
    maturity: 'enterprise',
  },
  callToAction: 'Define your first feature spec',
  references: [
    {
      label: 'Spec Validation + Typing Guide',
      url: '/docs/guides/spec-validation-and-typing',
    },
    {
      label: 'Core Contracts',
      url: '/docs/core-contracts',
    },
  ],
};

export const deterministicCodegenBrief: ContentBrief = {
  title: 'Deterministic codegen',
  summary:
    'Regenerate code from contracts without breaking existing functionality or losing customizations.',
  problems: [
    'Generated code conflicts with manual changes',
    'Regeneration loses custom business logic',
    'Teams avoid regeneration after customization',
    'Code migration between versions is risky',
  ],
  solutions: [
    'Clear separation of generated vs hand-written code',
    'Incremental regeneration with conflict detection',
    'Protected zones for custom logic',
    'Automatic migration paths',
  ],
  audience: {
    role: 'Platform engineers',
    industry: 'Developer tools',
    maturity: 'scaleup',
  },
  callToAction: 'Try deterministic regeneration',
  references: [
    {
      label: 'Generate Docs + Clients Guide',
      url: '/docs/guides/generate-docs-clients-schemas',
    },
    {
      label: 'CLI Reference',
      url: '/docs/getting-started/cli',
    },
  ],
};

export const schemaValidationTypescriptBrief: ContentBrief = {
  title: 'Schema validation TypeScript',
  summary:
    'Generate TypeScript types from contracts and validate data at runtime with zero overhead.',
  problems: [
    'Runtime type validation is boilerplate-heavy',
    'Type definitions drift from schemas',
    'Validation logic scattered across codebase',
    'Poor error messages for invalid data',
  ],
  solutions: [
    'Auto-generated TypeScript from contracts',
    'Zod schemas for runtime validation',
    'Type-safe validation with clear errors',
    'Single source of schema truth',
  ],
  audience: {
    role: 'TypeScript developers',
    industry: 'Web development',
    maturity: 'early',
  },
  callToAction: 'Generate typed contracts now',
  references: [
    {
      label: 'Type Safety Guide',
      url: '/docs/guides/spec-validation-and-typing',
    },
    {
      label: 'Schema Reference',
      url: '/docs/schemas',
    },
  ],
};

export const openapiAlternativeBrief: ContentBrief = {
  title: 'OpenAPI alternative',
  summary:
    'A spec-first approach that goes beyond OpenAPI with executable contracts and code generation.',
  problems: [
    'OpenAPI is documentation-only',
    'No type safety from OpenAPI specs',
    'Manual SDK generation is complex',
    'Cannot validate implementations against OpenAPI',
  ],
  solutions: [
    'Executable contracts with validation',
    'Generate multiple outputs from one spec',
    'Type-safe by default',
    'Built-in testing and validation',
  ],
  audience: {
    role: 'API architects',
    industry: 'Enterprise software',
    maturity: 'enterprise',
  },
  callToAction: 'Compare with OpenAPI approach',
  references: [
    {
      label: 'Generate OpenAPI from Contracts',
      url: '/docs/guides/generate-docs-clients-schemas',
    },
    {
      label: 'Contract vs OpenAPI',
      url: '/docs/comparison/openapi',
    },
  ],
};

export const generateClientFromSchemaBrief: ContentBrief = {
  title: 'Generate client from schema',
  summary:
    'Automatically generate type-safe API clients in any language from your contracts.',
  problems: [
    'Writing API clients is repetitive',
    'Manual clients have type mismatches',
    'Keeping clients in sync with APIs',
    'Language-specific client maintenance',
  ],
  solutions: [
    'Generate clients for multiple languages',
    'Type-safe request/response handling',
    'Automatic client updates from contracts',
    'Consistent error handling across languages',
  ],
  audience: {
    role: 'Full-stack developers',
    industry: 'Software development',
    maturity: 'scaleup',
  },
  callToAction: 'Generate your first API client',
  references: [
    {
      label: 'Client Generation Guide',
      url: '/docs/guides/generate-docs-clients-schemas',
    },
    {
      label: 'Supported Languages',
      url: '/docs/integrations',
    },
  ],
};
