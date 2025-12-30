import type { LearningJourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

const makeTipStep = (
  id: string,
  tipId: string,
  description: string
): LearningJourneyTrackSpec['steps'][number] => ({
  id,
  title: `Resolve tip: ${tipId}`,
  description,
  completion: {
    kind: 'event',
    eventName: 'coach.tip.follow_up_action_taken',
    payloadFilter: { tipId },
  },
  xpReward: 20,
  metadata: { tipId },
});

export const moneyAmbientCoachTrack: LearningJourneyTrackSpec = {
  id: 'money_ambient_coach',
  name: 'Ambient Coach — Money',
  description:
    'Subtle coaching for money patterns (cash buffer, goals, saving rhythm).',
  targetUserSegment: 'money_user',
  totalXp: 60,
  steps: [
    makeTipStep(
      'cash_buffer_too_high',
      'cash_buffer_too_high',
      'Suggest sweeping excess cash into goals.'
    ),
    makeTipStep(
      'no_savings_goal',
      'no_savings_goal',
      'Prompt setting a first savings goal.'
    ),
    makeTipStep(
      'irregular_savings',
      'irregular_savings',
      'Recommend recurring saves after irregular deposits.'
    ),
  ],
};

export const colivingAmbientCoachTrack: LearningJourneyTrackSpec = {
  id: 'coliving_ambient_coach',
  name: 'Ambient Coach — Coliving',
  description: 'Contextual tips for healthy coliving habits.',
  targetUserSegment: 'coliving',
  totalXp: 60,
  steps: [
    makeTipStep(
      'noise_late_evening',
      'noise_late_evening',
      'Suggest updating quiet hours to reduce evening noise.'
    ),
    makeTipStep(
      'guest_frequency_high',
      'guest_frequency_high',
      'Set guest frequency expectations for the house.'
    ),
    makeTipStep(
      'shared_space_conflicts',
      'shared_space_conflicts',
      'Offer a shared-space checklist to reduce conflicts.'
    ),
  ],
};

export const ambientCoachTracks: LearningJourneyTrackSpec[] = [
  moneyAmbientCoachTrack,
  colivingAmbientCoachTrack,
];
