import { recordEvent } from '@lssm/example.learning-journey.registry/api';
import { platformPrimitivesTourTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
  payload?: Record<string, unknown>;
}

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
  { learnerId, occurredAt = new Date(), payload }: EmitParams
) =>
  recordEvent({
    learnerId,
    name: eventName,
    occurredAt,
    payload,
    trackId: platformPrimitivesTourTrack.id,
  });

export const emitAllPlatformTourEvents = (params: EmitParams) =>
  platformTourEvents.map((name) => emitPlatformTourEvent(name, params));
