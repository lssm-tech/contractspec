import { recordEvent } from '@lssm/example.learning-journey.registry/api';
import { studioGettingStartedTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
}

export const studioOnboardingEvents = [
  'studio.template.instantiated',
  'spec.changed',
  'regeneration.completed',
  'playground.session.started',
  'studio.evolution.applied',
] as const;

export type StudioEvent = (typeof studioOnboardingEvents)[number];

export const emitStudioOnboardingEvent = (
  eventName: StudioEvent,
  { learnerId, occurredAt = new Date() }: EmitParams
) =>
  recordEvent({
    learnerId,
    name: eventName,
    occurredAt,
    trackId: studioGettingStartedTrack.id,
  });

export const emitAllStudioOnboardingEvents = (params: EmitParams) =>
  studioOnboardingEvents.map((name) => emitStudioOnboardingEvent(name, params));
