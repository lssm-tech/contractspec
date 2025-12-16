import { prisma as studioDb } from '@lssm/lib.database-contractspec-studio';
import type {
  CountCompletionConditionSpec,
  EventCompletionConditionSpec,
  SrsMasteryCompletionConditionSpec,
  StepCompletionConditionSpec,
  TimeWindowCompletionConditionSpec,
} from '@lssm/module.learning-journey/track-spec';

export function parseCondition(
  raw: unknown,
  fallbackEventName: string
): StepCompletionConditionSpec {
  if (raw && typeof raw === 'object') {
    return raw as StepCompletionConditionSpec;
  }
  return {
    eventName: fallbackEventName,
  } satisfies EventCompletionConditionSpec;
}

export async function matchesCondition(input: {
  condition: StepCompletionConditionSpec;
  eventName: string;
  eventPayload: Record<string, unknown> | undefined;
  occurredAt: Date;
  trackStartedAt: Date;
  organizationId: string;
}): Promise<boolean> {
  const { condition } = input;

  if (condition.kind === 'count') {
    return matchesCountCondition({
      condition,
      eventName: input.eventName,
      eventPayload: input.eventPayload,
      trackStartedAt: input.trackStartedAt,
      organizationId: input.organizationId,
    });
  }

  if (condition.kind === 'time_window') {
    return matchesTimeWindowCondition({
      condition,
      eventName: input.eventName,
      eventPayload: input.eventPayload,
      trackStartedAt: input.trackStartedAt,
      occurredAt: input.occurredAt,
    });
  }

  if (condition.kind === 'srs_mastery') {
    return matchesSrsMasteryCondition({
      condition,
      eventName: input.eventName,
      eventPayload: input.eventPayload,
      trackStartedAt: input.trackStartedAt,
      organizationId: input.organizationId,
    });
  }

  return matchesBaseEvent({
    condition,
    eventName: input.eventName,
    eventPayload: input.eventPayload,
  });
}

async function matchesCountCondition(input: {
  condition: CountCompletionConditionSpec;
  eventName: string;
  eventPayload: Record<string, unknown> | undefined;
  trackStartedAt: Date;
  organizationId: string;
}): Promise<boolean> {
  if (
    !matchesBaseEvent({
      condition: input.condition,
      eventName: input.eventName,
      eventPayload: input.eventPayload,
    })
  ) {
    return false;
  }

  const start = input.trackStartedAt;
  const end =
    input.condition.withinHours !== undefined
      ? new Date(start.getTime() + input.condition.withinHours * 60 * 60 * 1000)
      : undefined;

  const events = await studioDb.studioLearningEvent.findMany({
    where: {
      organizationId: input.organizationId,
      name: input.condition.eventName,
      createdAt: {
        gte: start,
        ...(end ? { lte: end } : {}),
      },
    },
    select: { payload: true },
    take: 500,
    orderBy: { createdAt: 'desc' },
  });

  const occurrences = events.filter((e) =>
    matchesFilter(input.condition.payloadFilter, asRecord(e.payload))
  ).length;

  return occurrences >= input.condition.atLeast;
}

function matchesTimeWindowCondition(input: {
  condition: TimeWindowCompletionConditionSpec;
  eventName: string;
  eventPayload: Record<string, unknown> | undefined;
  trackStartedAt: Date;
  occurredAt: Date;
}): boolean {
  if (
    !matchesBaseEvent({
      condition: input.condition,
      eventName: input.eventName,
      eventPayload: input.eventPayload,
    })
  ) {
    return false;
  }

  if (input.condition.availableAfterHours !== undefined) {
    const availableAt = new Date(
      input.trackStartedAt.getTime() +
        input.condition.availableAfterHours * 60 * 60 * 1000
    );
    if (input.occurredAt < availableAt) return false;
  }

  if (input.condition.withinHoursOfStart !== undefined) {
    const hoursSinceStart =
      (input.occurredAt.getTime() - input.trackStartedAt.getTime()) /
      (1000 * 60 * 60);
    if (hoursSinceStart > input.condition.withinHoursOfStart) return false;
  }

  return true;
}

async function matchesSrsMasteryCondition(input: {
  condition: SrsMasteryCompletionConditionSpec;
  eventName: string;
  eventPayload: Record<string, unknown> | undefined;
  trackStartedAt: Date;
  organizationId: string;
}): Promise<boolean> {
  if (input.eventName !== input.condition.eventName) return false;
  if (!matchesFilter(input.condition.payloadFilter, input.eventPayload))
    return false;
  if (!input.eventPayload) return false;

  const masteryKey = input.condition.masteryField ?? 'mastery';
  const masteryValue = input.eventPayload[masteryKey];
  if (typeof masteryValue !== 'number') return false;
  if (masteryValue < input.condition.minimumMastery) return false;

  const required = input.condition.requiredCount ?? 1;
  if (required <= 1) return true;

  const events = await studioDb.studioLearningEvent.findMany({
    where: {
      organizationId: input.organizationId,
      name: input.condition.eventName,
      createdAt: { gte: input.trackStartedAt },
    },
    select: { payload: true },
    take: 500,
    orderBy: { createdAt: 'desc' },
  });

  const masteryCount = events.filter((e) => {
    const payload = asRecord(e.payload);
    if (!payload) return false;
    if (!matchesFilter(input.condition.payloadFilter, payload)) return false;
    const val = payload[masteryKey];
    return typeof val === 'number' && val >= input.condition.minimumMastery;
  }).length;

  return masteryCount >= required;
}

function matchesBaseEvent(input: {
  condition: { eventName: string; payloadFilter?: Record<string, unknown> };
  eventName: string;
  eventPayload: Record<string, unknown> | undefined;
}): boolean {
  if (input.condition.eventName !== input.eventName) return false;
  return matchesFilter(input.condition.payloadFilter, input.eventPayload);
}

function matchesFilter(
  filter: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
): boolean {
  if (!filter) return true;
  if (!payload) return false;
  return Object.entries(filter).every(([key, value]) => payload[key] === value);
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  if (Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}








