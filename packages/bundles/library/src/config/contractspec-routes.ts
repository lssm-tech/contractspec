import type { AppRouteConfig } from '@contractspec/lib.contracts/app-config';

/**
 * Route configuration for the ContractSpec application.
 * Defines all navigable routes with optional feature flags and guards.
 */
export const contractspecRoutes: AppRouteConfig[] = [
  // Landing/Marketing
  { path: '/', label: 'Home' },
  { path: '/product', label: 'Product' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/changelog', label: 'Changelog' },
  { path: '/contact', label: 'Contact' },

  // Documentation
  { path: '/docs', label: 'Documentation' },
  { path: '/docs/getting-started', label: 'Getting Started' },
  { path: '/docs/architecture', label: 'Architecture' },
  { path: '/docs/specs', label: 'Specs' },
  { path: '/docs/integrations', label: 'Integrations' },
  { path: '/docs/libraries', label: 'Libraries' },
  { path: '/docs/advanced', label: 'Advanced' },

  // Features
  {
    path: '/features',
    label: 'Feature Discovery',
    featureFlag: 'feature-discovery-ui',
  },

  // Sandbox
  { path: '/sandbox', label: 'Sandbox', featureFlag: 'sandbox-enabled' },
];
