// /**
//  * App Config Feature Module Specification
//  *
//  * Defines the feature module for tenant app configuration lifecycle.
//  */
// import { defineAppConfig } from './spec';
//
// /**
//  * App Config feature module that bundles tenant configuration
//  * lifecycle events for draft, preview, publish, and rollback stages.
//  */
// export const AppConfigFeature = defineAppConfig({
//   meta: {
//     key: 'app-config',
//     version: '1.0.0',
//     title: 'App Configuration',
//     description:
//       'Tenant app configuration lifecycle management with draft, preview, and publish stages',
//     domain: 'platform',
//     owners: ['@platform.sigil'],
//     tags: ['app-config', 'lifecycle', 'configuration', 'tenant'],
//     stability: 'beta',
//   },
//
//   // No operations for this feature - it's events-only
//   operations: [],
//
//   // Events emitted by this feature
//   events: [
//     { key: 'app_config.draft_created', version: '1.0.0' },
//     { key: 'app_config.promoted_to_preview', version: '1.0.0' },
//     { key: 'app_config.published', version: '1.0.0' },
//     { key: 'app_config.rolled_back', version: '1.0.0' },
//   ],
//
//   // No presentations for this library feature
//   presentations: [],
//   opToPresentation: [],
//   presentationsTargets: [],
//
//   // Capability definitions
//   capabilities: {
//     provides: [{ key: 'app-config', version: '1.0.0' }],
//     requires: [],
//   },
// });
