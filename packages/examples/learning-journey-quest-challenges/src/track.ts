import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

const dayStep = (
	id: string,
	day: number,
	eventName: string,
	description: string,
	previousStepId?: string
): JourneyTrackSpec['steps'][number] => ({
	id,
	title: `Day ${day}`,
	description,
	availability: { unlockOnDay: day },
	prerequisites: previousStepId
		? [{ kind: 'step_completed', stepId: previousStepId }]
		: undefined,
	completion: {
		kind: 'time_window',
		eventName,
		withinHoursOfStart: (day + 1) * 24, // allow grace through next day
	},
	xpReward: 15,
	metadata: { day },
});

export const moneyResetQuestTrack: JourneyTrackSpec = {
	id: 'money_reset_7day',
	name: '7-day Money Reset',
	description:
		'Time-bound quest to reset personal finances over a focused week.',
	targetUserSegment: 'money_user',
	totalXp: 105,
	completionRewards: { xp: 30 },
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
			'Categorize recent transactions.',
			'day1_map_accounts'
		),
		dayStep(
			'day3_define_goals',
			3,
			'goals.created',
			'Define at least one savings goal.',
			'day2_categorize_transactions'
		),
		dayStep(
			'day4_setup_recurring_savings',
			4,
			'recurring_rule.created',
			'Set a recurring savings rule.',
			'day3_define_goals'
		),
		dayStep(
			'day5_review_subscriptions',
			5,
			'subscription.flagged_or_cancelled',
			'Review subscriptions and flag or cancel wasteful ones.',
			'day4_setup_recurring_savings'
		),
		dayStep(
			'day6_plan_emergency',
			6,
			'emergency_plan.completed',
			'Draft an emergency plan and target buffer.',
			'day5_review_subscriptions'
		),
		dayStep(
			'day7_review_commit',
			7,
			'quest.review.completed',
			'Review week outcomes and commit to the next month.',
			'day6_plan_emergency'
		),
	],
};

export const questTracks: JourneyTrackSpec[] = [moneyResetQuestTrack];
