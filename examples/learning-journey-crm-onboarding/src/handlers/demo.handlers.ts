import { crmFirstWinTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
  payload?: Record<string, unknown>;
}

interface LearningJourneyEvent {
  learnerId: string;
  name: string;
  occurredAt: Date;
  trackId: string;
  payload?: Record<string, unknown>;
}

type RecordEvent = (event: LearningJourneyEvent) => unknown;

export const crmOnboardingEvents = [
  'pipeline.created',
  'contact.created',
  'deal.created',
  'deal.moved',
  'deal.won',
  'task.completed',
] as const;

export type CrmEvent = (typeof crmOnboardingEvents)[number];

export const emitCrmOnboardingEvent = (
  eventName: CrmEvent,
  { learnerId, occurredAt = new Date(), payload }: EmitParams,
  record?: RecordEvent
) => {
  const event: LearningJourneyEvent = {
    learnerId,
    name: eventName,
    occurredAt,
    payload,
    trackId: crmFirstWinTrack.id,
  };
  return record ? record(event) : event;
};

export const emitAllCrmOnboardingEvents = (
  params: EmitParams,
  record?: RecordEvent
) =>
  crmOnboardingEvents.map((name) =>
    emitCrmOnboardingEvent(name, params, record)
  );
