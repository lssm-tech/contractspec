import { recordEvent } from '@lssm/example.learning-journey-registry/api';
import { platformPrimitivesTourTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
  payload?: Record<string, unknown>;
}

const events = [
  'org.member.added',
  'audit_log.created',
  'notification.sent',
  'job.completed',
  'flag.toggled',
  'attachment.attached',
  'usage.recorded',
] as const;

type PlatformEvent = (typeof events)[number];

export const emitPlatformTourEvent = (
  eventName: PlatformEvent,
  { learnerId, occurredAt = new Date(), payload }: EmitParams
) =>
  recordEvent({
    learnerId,
    eventName,
    occurredAt,
    payload,
    trackId: platformPrimitivesTourTrack.id,
  });

export const emitAllPlatformTourEvents = (params: EmitParams) =>
  events.map((name) => emitPlatformTourEvent(name, params));
