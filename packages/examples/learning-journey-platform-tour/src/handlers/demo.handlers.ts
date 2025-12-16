import { platformPrimitivesTourTrack } from '../track';

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

export const platformTourEvents = [
  'org.member.added',
  'audit_log.created',
  'notification.sent',
  'job.completed',
  'flag.toggled',
  'attachment.attached',
  'usage.recorded',
] as const;

export type PlatformEvent = (typeof platformTourEvents)[number];

export const emitPlatformTourEvent = (
  eventName: PlatformEvent,
  { learnerId, occurredAt = new Date(), payload }: EmitParams,
  record?: RecordEvent
) => {
  const event: LearningJourneyEvent = {
    learnerId,
    name: eventName,
    occurredAt,
    payload,
    trackId: platformPrimitivesTourTrack.id,
  };
  return record ? record(event) : event;
};

export const emitAllPlatformTourEvents = (
  params: EmitParams,
  record?: RecordEvent
) =>
  platformTourEvents.map((name) => emitPlatformTourEvent(name, params, record));

