import { StreakEngine } from '../engines/streak';
import { XPEngine } from '../engines/xp';
import type {
	JourneyEvent,
	JourneyProgressState,
	JourneyStepProgressState,
	JourneyStepSpec,
	JourneyTrackSpec,
} from '../track-spec';
import { matchesJourneyCondition, resolveJourneyBranch } from './matchers';
import {
	buildJourneyProgressSnapshot,
	isJourneyComplete,
	synchronizeJourneyProgressState,
} from './snapshot';

const DEFAULT_STREAK_ENGINE = new StreakEngine();
const DEFAULT_XP_ENGINE = new XPEngine();

const cloneState = (state: JourneyProgressState): JourneyProgressState => ({
	...state,
	badges: [...state.badges],
	eventLog: [...state.eventLog],
	steps: state.steps.map((step) => ({ ...step })),
	streak: { ...state.streak },
});

const getStepRewardXp = (step: JourneyStepSpec) =>
	step.reward?.xp ?? step.xpReward ?? 0;

const getStepProgress = (state: JourneyProgressState, stepId: string) =>
	state.steps.find((step) => step.stepId === stepId);

const addBadge = (
	state: JourneyProgressState,
	badgeKey: string | undefined
) => {
	if (badgeKey && !state.badges.includes(badgeKey)) state.badges.push(badgeKey);
};

const applyCompletionRewards = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	eventAt: Date,
	xpEngine: XPEngine
) => {
	if (!isJourneyComplete(state) || state.completionRewardApplied) return state;
	const completionXp = track.completionRewards?.xp ?? 0;
	if (completionXp > 0) {
		state.xpEarned += xpEngine.calculate({
			activity: 'journey_complete',
			baseXp: completionXp,
			currentStreak: state.streak.currentStreak,
		}).totalXp;
	}
	addBadge(state, track.completionRewards?.badgeKey);
	state.completedAt = eventAt;
	state.completionRewardApplied = true;
	return state;
};

const completeStep = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	spec: JourneyStepSpec,
	step: JourneyStepProgressState,
	eventAt: Date,
	event: JourneyEvent | undefined,
	manual: boolean,
	xpEngine: XPEngine
) => {
	if (step.status === 'COMPLETED') return;
	const rewardXp = getStepRewardXp(spec);
	if (rewardXp > 0) {
		state.xpEarned += xpEngine.calculate({
			activity: 'journey_step',
			baseXp: rewardXp,
			currentStreak: state.streak.currentStreak,
		}).totalXp;
	}

	step.completedAt = eventAt;
	step.eventPayload = event?.payload;
	step.manual = manual;
	step.status = 'COMPLETED';
	step.triggeringEvent = event?.name ?? 'journey.step.manual';
	step.xpEarned = rewardXp;

	const branch = resolveJourneyBranch(spec, event, step, state.startedAt);
	if (!branch) return;
	step.selectedBranchKey = branch.key;
	if (branch.reward?.xp) {
		state.xpEarned += branch.reward.xp;
	}
	addBadge(state, branch.reward?.badgeKey);
};

export const createJourneyProgressState = (
	track: JourneyTrackSpec,
	options: { learnerId?: string; now?: Date } = {}
): JourneyProgressState =>
	synchronizeJourneyProgressState(
		track,
		{
			badges: [],
			completionRewardApplied: false,
			eventLog: [],
			learnerId: options.learnerId,
			startedAt: options.now,
			steps: track.steps.map((step) => ({
				masteryCount: 0,
				occurrences: 0,
				status: 'LOCKED',
				stepId: step.id,
				xpEarned: 0,
			})),
			streak: DEFAULT_STREAK_ENGINE.getInitialState(),
			trackId: track.id,
			xpEarned: 0,
		},
		{ now: options.now }
	);

export const recordJourneyEvent = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	event: JourneyEvent,
	options: { streakEngine?: StreakEngine; xpEngine?: XPEngine } = {}
): JourneyProgressState => {
	const streakEngine = options.streakEngine ?? DEFAULT_STREAK_ENGINE;
	const xpEngine = options.xpEngine ?? DEFAULT_XP_ENGINE;
	const eventAt = event.occurredAt ?? new Date();
	const nextState = synchronizeJourneyProgressState(track, cloneState(state), {
		now: eventAt,
	});

	nextState.eventLog.push({ ...event, occurredAt: eventAt, trackId: track.id });
	nextState.lastActivityAt = eventAt;
	nextState.startedAt ??= eventAt;
	nextState.streak = streakEngine.update(nextState.streak, eventAt).state;

	for (const spec of track.steps) {
		const step = getStepProgress(nextState, spec.id);
		if (!step || step.status !== 'AVAILABLE') continue;

		const result = matchesJourneyCondition(
			spec.completion,
			event,
			step,
			nextState.startedAt
		);
		if (result.occurrences !== undefined) step.occurrences = result.occurrences;
		if (result.masteryCount !== undefined)
			step.masteryCount = result.masteryCount;
		if (!result.matched) continue;

		completeStep(track, nextState, spec, step, eventAt, event, false, xpEngine);
	}

	return applyCompletionRewards(
		track,
		synchronizeJourneyProgressState(track, nextState, { now: eventAt }),
		eventAt,
		xpEngine
	);
};

export const completeJourneyStep = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	stepId: string,
	options: { now?: Date; streakEngine?: StreakEngine; xpEngine?: XPEngine } = {}
): JourneyProgressState => {
	const streakEngine = options.streakEngine ?? DEFAULT_STREAK_ENGINE;
	const xpEngine = options.xpEngine ?? DEFAULT_XP_ENGINE;
	const eventAt = options.now ?? new Date();
	const nextState = synchronizeJourneyProgressState(track, cloneState(state), {
		now: eventAt,
	});
	const spec = track.steps.find((step) => step.id === stepId);
	const step = getStepProgress(nextState, stepId);
	if (!spec || !step || step.status !== 'AVAILABLE') return nextState;

	nextState.eventLog.push({
		name: 'journey.step.manual',
		occurredAt: eventAt,
		trackId: track.id,
	});
	nextState.lastActivityAt = eventAt;
	nextState.startedAt ??= eventAt;
	nextState.streak = streakEngine.update(nextState.streak, eventAt).state;

	completeStep(
		track,
		nextState,
		spec,
		step,
		eventAt,
		{ name: 'journey.step.manual', occurredAt: eventAt },
		true,
		xpEngine
	);

	return applyCompletionRewards(
		track,
		synchronizeJourneyProgressState(track, nextState, { now: eventAt }),
		eventAt,
		xpEngine
	);
};

export const projectJourneyProgress = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	options: { now?: Date } = {}
) => buildJourneyProgressSnapshot(track, state, options);
