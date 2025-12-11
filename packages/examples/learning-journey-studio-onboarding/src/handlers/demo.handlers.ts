import { recordEvent } from '@lssm/example.learning-journey-registry/api';
import { studioGettingStartedTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
}

const events = [
  'studio.template.instantiated',
  'spec.changed',
  'regeneration.completed',
  'playground.session.started',
  'studio.evolution.applied',
] as const;

type StudioEvent = (typeof events)[number];

export const emitStudioOnboardingEvent = (
  eventName: StudioEvent,
  { learnerId, occurredAt = new Date() }: EmitParams
) =>
  recordEvent({
    learnerId,
    eventName,
    occurredAt,
    trackId: studioGettingStartedTrack.id,
  });

export const emitAllStudioOnboardingEvents = (params: EmitParams) =>
  events.map((name) => emitStudioOnboardingEvent(name, params));
