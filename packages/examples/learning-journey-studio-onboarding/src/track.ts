import type { LearningJourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

export const studioGettingStartedTrack: LearningJourneyTrackSpec = {
  id: 'studio_getting_started',
  productId: 'contractspec-studio',
  name: 'Studio Getting Started',
  description:
    'First 30 minutes in Studio: create a project, edit the spec, deploy/regenerate, and try key modules.',
  targetUserSegment: 'new_studio_user',
  targetRole: 'developer',
  totalXp: 110,
  streakRule: { hoursWindow: 48, bonusXp: 25 },
  completionRewards: { xpBonus: 25, badgeKey: 'studio_first_30m' },
  steps: [
    {
      id: 'choose_template',
      title: 'Choose a template',
      description: 'Create your first Studio project (starter template).',
      order: 1,
      completion: {
        eventName: 'studio.template.instantiated',
        sourceModule: '@contractspec/bundle.studio',
      },
      xpReward: 20,
      metadata: { surface: 'projects' },
    },
    {
      id: 'edit_spec',
      title: 'Edit the spec',
      description: 'Change the spec (not generated code) and save.',
      instructions: 'Open spec editor, tweak a contract or presentation, save.',
      order: 2,
      completion: {
        eventName: 'spec.changed',
        sourceModule: '@contractspec/bundle.studio',
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
        sourceModule: '@contractspec/lib.contracts/regenerator',
      },
      xpReward: 20,
      metadata: { surface: 'regenerator' },
    },
    {
      id: 'open_canvas',
      title: 'Open the canvas',
      description: 'Visit the canvas module for your project.',
      order: 4,
      completion: {
        eventName: 'module.navigated',
        sourceModule: '@contractspec/bundle.studio',
        payloadFilter: { moduleId: 'canvas' },
      },
      xpReward: 20,
      metadata: { surface: 'canvas' },
    },
    {
      id: 'try_evolution_mode',
      title: 'Try evolution mode',
      description: 'Request a change via Evolution, then regenerate.',
      order: 5,
      completion: {
        eventName: 'studio.evolution.applied',
        sourceModule: '@contractspec/lib.evolution',
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
