import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';

export const crmFirstWinTrack: LearningJourneyTrackSpec = {
  id: 'crm_first_win',
  productId: 'crm-pipeline',
  name: 'CRM First Win',
  description:
    'Guide a new CRM user from empty pipeline to first closed-won deal.',
  targetUserSegment: 'crm_adopter',
  targetRole: 'sales',
  totalXp: 135,
  streakRule: { hoursWindow: 72, bonusXp: 25 },
  completionRewards: { xpBonus: 25, badgeKey: 'crm_first_win' },
  steps: [
    {
      id: 'create_pipeline',
      title: 'Create pipeline & stages',
      description: 'Create a pipeline with baseline stages.',
      order: 1,
      completion: {
        eventName: 'pipeline.created',
        sourceModule: '@lssm/example.crm-pipeline',
      },
      xpReward: 15,
      metadata: { surface: 'pipeline' },
    },
    {
      id: 'create_contact_and_company',
      title: 'Create contact and company',
      description: 'Add your first contact and associated company.',
      order: 2,
      completion: {
        eventName: 'contact.created',
        sourceModule: '@lssm/example.crm-pipeline',
      },
      xpReward: 20,
      metadata: { surface: 'contacts' },
    },
    {
      id: 'create_first_deal',
      title: 'Log first deal',
      description: 'Create your first deal in the pipeline.',
      order: 3,
      completion: {
        eventName: 'deal.created',
        sourceModule: '@lssm/example.crm-pipeline',
      },
      xpReward: 20,
      metadata: { surface: 'deals' },
    },
    {
      id: 'move_deal_in_pipeline',
      title: 'Move a deal across stages',
      description: 'Move a deal across at least three stages.',
      order: 4,
      completion: {
        eventName: 'deal.moved',
        sourceModule: '@lssm/example.crm-pipeline',
      },
      xpReward: 20,
      metadata: { surface: 'deals' },
    },
    {
      id: 'close_deal_won',
      title: 'Close a deal as won',
      description: 'Close a deal as won to hit first revenue.',
      order: 5,
      completion: {
        eventName: 'deal.won',
        sourceModule: '@lssm/example.crm-pipeline',
      },
      xpReward: 30,
      metadata: { surface: 'deals' },
    },
    {
      id: 'setup_follow_up',
      title: 'Create follow-up task',
      description:
        'Create a follow-up task and notification for a contact or deal.',
      order: 6,
      completion: {
        eventName: 'task.completed',
        sourceModule: '@lssm/example.crm-pipeline',
        payloadFilter: { type: 'follow_up' },
      },
      xpReward: 30,
      metadata: { surface: 'tasks' },
    },
  ],
  metadata: {
    surfacedIn: ['crm/dashboard', 'crm/pipeline'],
  },
};

export const crmLearningTracks: LearningJourneyTrackSpec[] = [crmFirstWinTrack];
