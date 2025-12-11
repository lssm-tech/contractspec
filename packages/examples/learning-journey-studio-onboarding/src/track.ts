import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';

export const studioGettingStartedTrack: LearningJourneyTrackSpec = {
  id: 'studio_getting_started',
  productId: 'contractspec-studio',
  name: 'Studio Getting Started',
  description:
    'First 30 minutes in Studio: instantiate a template, edit the spec, regenerate, and try runtime surfaces.',
  targetUserSegment: 'new_studio_user',
  targetRole: 'developer',
  totalXp: 110,
  streakRule: { hoursWindow: 48, bonusXp: 25 },
  completionRewards: { xpBonus: 25, badgeKey: 'studio_first_30m' },
  steps: [
    {
      id: 'choose_template',
      title: 'Choose a template',
      description: 'Pick a Phase 1 template and create a sandbox.',
      order: 1,
      completion: {
        eventName: 'studio.template.instantiated',
        sourceModule: '@lssm/bundle.contractspec-studio',
      },
      xpReward: 20,
      metadata: { surface: 'templates' },
    },
    {
      id: 'edit_spec',
      title: 'Edit the spec',
      description: 'Change the spec (not generated code) and save.',
      instructions: 'Open spec editor, tweak a contract or presentation, save.',
      order: 2,
      completion: {
        eventName: 'spec.changed',
        sourceModule: '@lssm/lib.contracts',
        payloadFilter: { scope: 'sandbox' },
      },
      xpReward: 20,
      metadata: { surface: 'spec-editor' },
    },
    {
      id: 'regenerate_app',
      title: 'Regenerate the app',
      description: 'Regenerate artifacts from the updated spec.',
      order: 3,
      completion: {
        eventName: 'regeneration.completed',
        sourceModule: '@lssm/lib.contracts/regenerator',
      },
      xpReward: 20,
      metadata: { surface: 'regenerator' },
    },
    {
      id: 'play_in_playground',
      title: 'Use the playground',
      description:
        'Start a playground or runtime session against your sandbox.',
      order: 4,
      completion: {
        eventName: 'playground.session.started',
        sourceModule: '@lssm/bundle.contractspec-studio',
      },
      xpReward: 20,
      metadata: { surface: 'playground' },
    },
    {
      id: 'try_evolution_mode',
      title: 'Try evolution mode',
      description: 'Request a change via Evolution, then regenerate.',
      order: 5,
      completion: {
        eventName: 'studio.evolution.applied',
        sourceModule: '@lssm/lib.evolution',
      },
      xpReward: 30,
      metadata: { surface: 'evolution' },
    },
  ],
  metadata: {
    persona: 'first_run',
    surfacedIn: ['studio/home', 'studio/sidebar/learning'],
  },
};

export const studioLearningTracks: LearningJourneyTrackSpec[] = [
  studioGettingStartedTrack,
];
