/**
 * Learning Journey Platform Tour Feature Module Specification
 *
 * Defines the feature module for platform primitives tour journey.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Learning Journey Platform Tour feature module that bundles
 * platform-specific tour track operations and presentations.
 */
export const LearningJourneyPlatformTourFeature: FeatureModuleSpec = {
  meta: {
    key: 'learning-journey-platform-tour',
    version: 1,
    title: 'Learning Journey: Platform Tour',
    description:
      'Platform primitives tour journey for exploring ContractSpec core features',
    domain: 'learning-journey',
    owners: ['@examples.learning-journey.platform-tour'],
    tags: ['learning', 'platform', 'tour', 'journey'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'learningJourney.platformTour.recordEvent', version: 1 },
    { key: 'learningJourney.platformTour.getTrack', version: 1 },
  ],

  // Events emitted by this feature
  events: [],

  // Presentations associated with this feature
  presentations: [
    { key: 'learning.journey.platform.track', version: 1 },
    { key: 'learning.journey.platform.widget', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { key: 'learningJourney.platformTour.getTrack', version: 1 },
      pres: { key: 'learning.journey.platform.track', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      key: 'learning.journey.platform.track',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      key: 'learning.journey.platform.widget',
      version: 1,
      targets: ['react'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [{ key: 'identity', version: 1 }],
  },
};
