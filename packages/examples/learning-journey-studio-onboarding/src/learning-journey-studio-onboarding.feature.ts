/**
 * Learning Journey Studio Onboarding Feature Module Specification
 *
 * Defines the feature module for Studio onboarding journey.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Learning Journey Studio Onboarding feature module that bundles
 * Studio-specific onboarding track operations and presentations.
 */
export const LearningJourneyStudioOnboardingFeature: FeatureModuleSpec = {
  meta: {
    key: 'learning-journey-studio-onboarding',
    title: 'Learning Journey: Studio Onboarding',
    description:
      'Studio onboarding journey for getting started with ContractSpec Studio',
    domain: 'learning-journey',
    owners: ['@examples.learning-journey.studio-onboarding'],
    tags: ['learning', 'onboarding', 'studio', 'journey'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    { name: 'learningJourney.studioOnboarding.recordEvent', version: 1 },
    { name: 'learningJourney.studioOnboarding.getTrack', version: 1 },
  ],

  // Events emitted by this feature
  events: [],

  // Presentations associated with this feature
  presentations: [
    { name: 'learning.journey.studio.track', version: 1 },
    { name: 'learning.journey.studio.widget', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'learningJourney.studioOnboarding.getTrack', version: 1 },
      pres: { name: 'learning.journey.studio.track', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      name: 'learning.journey.studio.track',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'learning.journey.studio.widget',
      version: 1,
      targets: ['react'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [{ key: 'identity', version: 1 }],
  },
};
