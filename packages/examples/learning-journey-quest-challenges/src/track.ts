import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';

const dayStep = (
  id: string,
  day: number,
  eventName: string,
  description: string
): LearningJourneyTrackSpec['steps'][number] => ({
  id,
  title: `Day ${day}`,
  description,
  availability: { unlockOnDay: day },
  completion: {
    kind: 'time_window',
    eventName,
    withinHoursOfStart: (day + 1) * 24, // allow grace through next day
  },
  xpReward: 15,
  metadata: { day },
});

export const moneyResetQuestTrack: LearningJourneyTrackSpec = {
  id: 'money_reset_7day',
  name: '7-day Money Reset',
  description:
    'Time-bound quest to reset personal finances over a focused week.',
  targetUserSegment: 'money_user',
  totalXp: 105,
  completionRewards: { xpBonus: 30 },
  steps: [
    dayStep(
      'day1_map_accounts',
      1,
      'accounts.mapped',
      'Map bank and card accounts.'
    ),
    dayStep(
      'day2_categorize_transactions',
      2,
      'transactions.categorized',
      'Categorize recent transactions.'
    ),
    dayStep(
      'day3_define_goals',
      3,
      'goals.created',
      'Define at least one savings goal.'
    ),
    dayStep(
      'day4_setup_recurring_savings',
      4,
      'recurring_rule.created',
      'Set a recurring savings rule.'
    ),
    dayStep(
      'day5_review_subscriptions',
      5,
      'subscription.flagged_or_cancelled',
      'Review subscriptions and flag or cancel wasteful ones.'
    ),
    dayStep(
      'day6_plan_emergency',
      6,
      'emergency_plan.completed',
      'Draft an emergency plan and target buffer.'
    ),
    dayStep(
      'day7_review_commit',
      7,
      'quest.review.completed',
      'Review week outcomes and commit to the next month.'
    ),
  ],
};

export const questTracks: LearningJourneyTrackSpec[] = [moneyResetQuestTrack];
