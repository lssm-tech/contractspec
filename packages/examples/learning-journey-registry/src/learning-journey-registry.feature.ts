/**
 * Learning Journey Registry Feature Module Specification
 *
 * Defines the feature module for the learning journey registry.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Learning Journey Registry feature module that bundles
 * the shared presentations for learning journey tracks.
 */
export const LearningJourneyRegistryFeature: FeatureModuleSpec = {
  meta: {
    key: 'learning-journey-registry',
    title: 'Learning Journey Registry',
    description:
      'Shared registry and presentations for learning journey tracks',
    domain: 'learning-journey',
    owners: ['@learning-team'],
    tags: ['learning', 'journey', 'onboarding', 'registry'],
    stability: 'experimental',
  },

  // No operations in the registry - it's presentation-only
  operations: [],

  // Events emitted by this feature
  events: [],

  // Presentations associated with this feature
  presentations: [
    { key: 'learning.journey.track_list', version: 1 },
    { key: 'learning.journey.track_detail', version: 1 },
    { key: 'learning.journey.progress_widget', version: 1 },
  ],

  // No op to presentation links for registry
  opToPresentation: [],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      key: 'learning.journey.track_list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'learning.journey.track_detail',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      key: 'learning.journey.progress_widget',
      version: 1,
      targets: ['react'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [{ key: 'identity', version: 1 }],
  },
};
