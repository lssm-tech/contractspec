import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

const makeTipStep = (
	id: string,
	tipId: string,
	description: string,
	previousStepId?: string
): JourneyTrackSpec['steps'][number] => ({
	id,
	title: `Resolve tip: ${tipId}`,
	description,
	completion: {
		kind: 'event',
		eventName: 'coach.tip.follow_up_action_taken',
		payloadFilter: { tipId },
	},
	prerequisites: previousStepId
		? [{ kind: 'step_completed', stepId: previousStepId }]
		: undefined,
	xpReward: 20,
	metadata: { tipId },
});

export const moneyAmbientCoachTrack: JourneyTrackSpec = {
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
			'Prompt setting a first savings goal.',
			'cash_buffer_too_high'
		),
		makeTipStep(
			'irregular_savings',
			'irregular_savings',
			'Recommend recurring saves after irregular deposits.',
			'no_savings_goal'
		),
	],
};

export const colivingAmbientCoachTrack: JourneyTrackSpec = {
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
			'Set guest frequency expectations for the house.',
			'noise_late_evening'
		),
		makeTipStep(
			'shared_space_conflicts',
			'shared_space_conflicts',
			'Offer a shared-space checklist to reduce conflicts.',
			'guest_frequency_high'
		),
	],
};

export const ambientCoachTracks: JourneyTrackSpec[] = [
	moneyAmbientCoachTrack,
	colivingAmbientCoachTrack,
];
