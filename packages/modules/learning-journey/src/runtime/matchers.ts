import type {
	JourneyAvailabilitySpec,
	JourneyBranchSpec,
	JourneyConditionSpec,
	JourneyEvent,
	JourneyPrerequisiteSpec,
	JourneyProgressState,
	JourneyStepProgressState,
	JourneyStepSpec,
} from '../track-spec';

export interface JourneyConditionMatch {
	masteryCount?: number;
	matched: boolean;
	occurrences?: number;
}

export const matchesPayloadFilter = (
	filter: Record<string, unknown> | undefined,
	payload: Record<string, unknown> | undefined
): boolean => {
	if (!filter) return true;
	if (!payload) return false;
	return Object.entries(filter).every(([key, value]) => payload[key] === value);
};

export const matchesBaseJourneyEvent = (
	condition: {
		eventName: string;
		eventVersion?: number;
		payloadFilter?: Record<string, unknown>;
		sourceModule?: string;
	},
	event: JourneyEvent
): boolean => {
	if (condition.eventName !== event.name) return false;
	if (
		condition.eventVersion !== undefined &&
		event.version !== undefined &&
		condition.eventVersion !== event.version
	) {
		return false;
	}
	if (
		condition.sourceModule &&
		event.sourceModule &&
		condition.sourceModule !== event.sourceModule
	) {
		return false;
	}
	return matchesPayloadFilter(condition.payloadFilter, event.payload);
};

export const matchesJourneyCondition = (
	condition: JourneyConditionSpec,
	event: JourneyEvent,
	step: JourneyStepProgressState,
	trackStartedAt: Date | undefined
): JourneyConditionMatch => {
	if (condition.kind === 'count') {
		if (!matchesBaseJourneyEvent(condition, event)) return { matched: false };
		const occurrences = step.occurrences + 1;
		const withinWindow =
			condition.withinHours === undefined ||
			(trackStartedAt !== undefined &&
				event.occurredAt !== undefined &&
				(event.occurredAt.getTime() - trackStartedAt.getTime()) /
					(1000 * 60 * 60) <=
					condition.withinHours);
		return {
			matched: withinWindow && occurrences >= condition.atLeast,
			occurrences,
		};
	}

	if (condition.kind === 'time_window') {
		if (!matchesBaseJourneyEvent(condition, event)) return { matched: false };
		if (
			condition.availableAfterHours !== undefined &&
			trackStartedAt !== undefined &&
			event.occurredAt !== undefined &&
			(event.occurredAt.getTime() - trackStartedAt.getTime()) /
				(1000 * 60 * 60) <
				condition.availableAfterHours
		) {
			return { matched: false };
		}
		if (
			condition.withinHoursOfStart !== undefined &&
			trackStartedAt !== undefined &&
			event.occurredAt !== undefined &&
			(event.occurredAt.getTime() - trackStartedAt.getTime()) /
				(1000 * 60 * 60) >
				condition.withinHoursOfStart
		) {
			return { matched: false };
		}
		return { matched: true };
	}

	if (condition.kind === 'mastery') {
		if (event.name !== condition.eventName) return { matched: false };
		if (!matchesPayloadFilter(condition.payloadFilter, event.payload)) {
			return { matched: false };
		}
		const masteryKey = condition.masteryField ?? 'mastery';
		const masteryValue = event.payload?.[masteryKey];
		if (typeof masteryValue !== 'number') return { matched: false };
		if (masteryValue < condition.minimumMastery) return { matched: false };
		const masteryCount = step.masteryCount + 1;
		return {
			masteryCount,
			matched: masteryCount >= (condition.requiredCount ?? 1),
		};
	}

	return { matched: matchesBaseJourneyEvent(condition, event) };
};

export const resolveJourneyAvailability = (
	availability: JourneyAvailabilitySpec | undefined,
	startedAt: Date | undefined
): { availableAt?: Date; dueAt?: Date } => {
	if (!availability || !startedAt) return {};

	const baseTime = startedAt.getTime();
	let unlockTime = baseTime;

	if (availability.unlockOnDay !== undefined) {
		unlockTime =
			baseTime + (availability.unlockOnDay - 1) * 24 * 60 * 60 * 1000;
	}

	if (availability.unlockAfterHours !== undefined) {
		unlockTime = baseTime + availability.unlockAfterHours * 60 * 60 * 1000;
	}

	const availableAt = new Date(unlockTime);
	const dueAt =
		availability.dueWithinHours !== undefined
			? new Date(
					availableAt.getTime() + availability.dueWithinHours * 60 * 60 * 1000
				)
			: undefined;

	return { availableAt, dueAt };
};

export const isJourneyPrerequisiteSatisfied = (
	prerequisite: JourneyPrerequisiteSpec,
	progress: JourneyProgressState
): boolean => {
	const source = progress.steps.find(
		(step) => step.stepId === prerequisite.stepId
	);
	if (!source) return false;
	if (prerequisite.kind === 'step_completed') {
		return source.status === 'COMPLETED' || source.status === 'SKIPPED';
	}
	return source.selectedBranchKey === prerequisite.branchKey;
};

export const resolveJourneyBranch = (
	step: JourneyStepSpec,
	event: JourneyEvent | undefined,
	progress: JourneyStepProgressState,
	trackStartedAt: Date | undefined
): JourneyBranchSpec | undefined => {
	if (!step.branches?.length) return undefined;
	if (!event) return step.branches.find((branch) => branch.when === undefined);

	for (const branch of step.branches) {
		if (!branch.when) continue;
		const result = matchesJourneyCondition(
			branch.when,
			event,
			progress,
			trackStartedAt
		);
		if (result.matched) return branch;
	}

	return step.branches.find((branch) => branch.when === undefined);
};
