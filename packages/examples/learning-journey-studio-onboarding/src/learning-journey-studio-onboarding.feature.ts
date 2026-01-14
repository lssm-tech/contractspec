/**
 * Learning Journey Studio Onboarding Feature Module Specification
 *
 * Defines the feature module for Studio onboarding journey.
 */
import { defineFeature } from '@contractspec/lib.contracts';

/**
 * Learning Journey Studio Onboarding feature module that bundles
 * Studio-specific onboarding track operations and presentations.
 */
export const LearningJourneyStudioOnboardingFeature = defineFeature({
  meta: {
    key: 'learning-journey-studio-onboarding',
    title: 'Learning Journey: Studio Onboarding',
    description:
      'Studio onboarding journey for getting started with ContractSpec Studio',
    domain: 'learning-journey',
    owners: ['@examples.learning-journey.studio-onboarding'],
    tags: ['learning', 'onboarding', 'studio', 'journey'],
    stability: 'experimental',
    version: '1.0.0',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'learningJourney.studioOnboarding.recordEvent', version: '1.0.0' },
    { key: 'learningJourney.studioOnboarding.getTrack', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [],

  // Presentations associated with this feature
  presentations: [
    { key: 'learning.journey.studio.track', version: '1.0.0' },
    { key: 'learning.journey.studio.widget', version: '1.0.0' },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: {
        key: 'learningJourney.studioOnboarding.getTrack',
        version: '1.0.0',
      },
      pres: { key: 'learning.journey.studio.track', version: '1.0.0' },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      key: 'learning.journey.studio.track',
      version: '1.0.0',
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      key: 'learning.journey.studio.widget',
      version: '1.0.0',
      targets: ['react'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});
