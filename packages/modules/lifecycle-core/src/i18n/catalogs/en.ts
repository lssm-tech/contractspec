/**
 * English (en) translation catalog for @contractspec/module.lifecycle-core.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'lifecycle-core.messages',
    version: '1.0.0',
    domain: 'lifecycle-core',
    description: 'Milestone titles, descriptions, and action items',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // Stage 0: Exploration
    'milestone.stage0ProblemStatement.title': {
      value: 'Write the pain statement',
      description: 'Milestone title for stage 0',
    },
    'milestone.stage0ProblemStatement.description': {
      value:
        "Capture the clearest description of the top problem in the customer's own words.",
      description: 'Milestone description for stage 0',
    },
    'milestone.stage0ProblemStatement.action.0': {
      value: 'Interview at least 5 ideal customers',
      description: 'Action item for stage 0 milestone',
    },
    'milestone.stage0ProblemStatement.action.1': {
      value: 'Synthesize quotes into a one-page brief',
      description: 'Action item for stage 0 milestone',
    },

    // Stage 1: Problem-Solution Fit
    'milestone.stage1PrototypeLoop.title': {
      value: 'Prototype feedback loop',
      description: 'Milestone title for stage 1',
    },
    'milestone.stage1PrototypeLoop.description': {
      value: 'Ship a clickable prototype and gather 3 rounds of feedback.',
      description: 'Milestone description for stage 1',
    },
    'milestone.stage1PrototypeLoop.action.0': {
      value: 'Create a low-fidelity prototype',
      description: 'Action item for stage 1 milestone',
    },
    'milestone.stage1PrototypeLoop.action.1': {
      value: 'Schedule standing feedback calls',
      description: 'Action item for stage 1 milestone',
    },

    // Stage 2: MVP & Early Traction
    'milestone.stage2Activation.title': {
      value: 'Activation checklist',
      description: 'Milestone title for stage 2',
    },
    'milestone.stage2Activation.description': {
      value: 'Define the minimum steps required for a new user to succeed.',
      description: 'Milestone description for stage 2',
    },
    'milestone.stage2Activation.action.0': {
      value: 'Document onboarding flow',
      description: 'Action item for stage 2 milestone',
    },
    'milestone.stage2Activation.action.1': {
      value: 'Instrument activation analytics',
      description: 'Action item for stage 2 milestone',
    },

    // Stage 3: Product-Market Fit
    'milestone.stage3RetentionNarrative.title': {
      value: 'Retention narrative',
      description: 'Milestone title for stage 3',
    },
    'milestone.stage3RetentionNarrative.description': {
      value: 'Create the before/after story that proves why users stay.',
      description: 'Milestone description for stage 3',
    },
    'milestone.stage3RetentionNarrative.action.0': {
      value: 'Interview 3 retained users',
      description: 'Action item for stage 3 milestone',
    },
    'milestone.stage3RetentionNarrative.action.1': {
      value: 'Publish a one-pager with concrete metrics',
      description: 'Action item for stage 3 milestone',
    },

    // Stage 4: Growth / Scale-up
    'milestone.stage4GrowthLoop.title': {
      value: 'Install a growth loop',
      description: 'Milestone title for stage 4',
    },
    'milestone.stage4GrowthLoop.description': {
      value:
        'Stand up a repeatable acquisition \u2192 activation \u2192 referral motion.',
      description: 'Milestone description for stage 4',
    },
    'milestone.stage4GrowthLoop.action.0': {
      value: 'Define loop metrics',
      description: 'Action item for stage 4 milestone',
    },
    'milestone.stage4GrowthLoop.action.1': {
      value: 'Assign owners for each stage',
      description: 'Action item for stage 4 milestone',
    },
    'milestone.stage4GrowthLoop.action.2': {
      value: 'Review weekly',
      description: 'Action item for stage 4 milestone',
    },

    // Stage 5: Expansion / Platform
    'milestone.stage5PlatformBlueprint.title': {
      value: 'Platform blueprint',
      description: 'Milestone title for stage 5',
    },
    'milestone.stage5PlatformBlueprint.description': {
      value: 'Align on APIs, integrations, and governance for partners.',
      description: 'Milestone description for stage 5',
    },
    'milestone.stage5PlatformBlueprint.action.0': {
      value: 'Create integration scoring rubric',
      description: 'Action item for stage 5 milestone',
    },
    'milestone.stage5PlatformBlueprint.action.1': {
      value: 'Publish partner onboarding checklist',
      description: 'Action item for stage 5 milestone',
    },

    // Stage 6: Maturity / Renewal
    'milestone.stage6RenewalOps.title': {
      value: 'Renewal operating rhythm',
      description: 'Milestone title for stage 6',
    },
    'milestone.stage6RenewalOps.description': {
      value:
        'Decide whether to optimize, reinvest, or sunset each major surface.',
      description: 'Milestone description for stage 6',
    },
    'milestone.stage6RenewalOps.action.0': {
      value: 'Hold quarterly renewal review',
      description: 'Action item for stage 6 milestone',
    },
    'milestone.stage6RenewalOps.action.1': {
      value: 'Document reinvestment bets',
      description: 'Action item for stage 6 milestone',
    },
  },
});
