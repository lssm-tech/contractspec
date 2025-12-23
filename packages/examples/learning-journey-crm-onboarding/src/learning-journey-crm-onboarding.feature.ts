/**
 * Learning Journey CRM Onboarding Feature Module Specification
 *
 * Defines the feature module for CRM first-win onboarding journey.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Learning Journey CRM Onboarding feature module that bundles
 * CRM-specific onboarding track operations and presentations.
 */
export const LearningJourneyCrmOnboardingFeature: FeatureModuleSpec = {
  meta: {
    key: 'learning-journey-crm-onboarding',
    title: 'Learning Journey: CRM Onboarding',
    description:
      'CRM first-win onboarding journey with step-by-step guidance for new CRM users',
    domain: 'learning-journey',
    owners: ['@examples.learning-journey.crm-onboarding'],
    tags: ['learning', 'crm', 'onboarding', 'journey'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    { name: 'learningJourney.crmOnboarding.recordEvent', version: 1 },
    { name: 'learningJourney.crmOnboarding.getTrack', version: 1 },
  ],

  // Events emitted by this feature
  events: [],

  // Presentations associated with this feature
  presentations: [
    { name: 'learning.journey.crm.track', version: 1 },
    { name: 'learning.journey.crm.widget', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'learningJourney.crmOnboarding.getTrack', version: 1 },
      pres: { name: 'learning.journey.crm.track', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      name: 'learning.journey.crm.track',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'learning.journey.crm.widget',
      version: 1,
      targets: ['react'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [{ key: 'identity', version: 1 }],
  },
};
