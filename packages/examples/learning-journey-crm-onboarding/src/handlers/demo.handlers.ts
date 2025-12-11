import { recordEvent } from '@lssm/example.learning-journey-registry/api';
import { crmFirstWinTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
  payload?: Record<string, unknown>;
}

const events = [
  'pipeline.created',
  'contact.created',
  'deal.created',
  'deal.moved',
  'deal.won',
  'task.completed',
] as const;

type CrmEvent = (typeof events)[number];

export const emitCrmOnboardingEvent = (
  eventName: CrmEvent,
  { learnerId, occurredAt = new Date(), payload }: EmitParams
) =>
  recordEvent({
    learnerId,
    eventName,
    occurredAt,
    payload,
    trackId: crmFirstWinTrack.id,
  });

export const emitAllCrmOnboardingEvents = (params: EmitParams) =>
  events.map((name) => emitCrmOnboardingEvent(name, params));
