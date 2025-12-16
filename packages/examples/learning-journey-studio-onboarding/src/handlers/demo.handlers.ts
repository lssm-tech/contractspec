import { studioGettingStartedTrack } from '../track';

interface EmitParams {
  learnerId: string;
  occurredAt?: Date;
}

interface LearningJourneyEvent {
  learnerId: string;
  name: string;
  occurredAt: Date;
  trackId: string;
  payload?: Record<string, unknown>;
}

type RecordEvent = (event: LearningJourneyEvent) => unknown;

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
  { learnerId, occurredAt = new Date() }: EmitParams,
  record?: RecordEvent
) => {
  const event: LearningJourneyEvent = {
    learnerId,
    name: eventName,
    occurredAt,
    trackId: studioGettingStartedTrack.id,
  };
  return record ? record(event) : event;
};

export const emitAllStudioOnboardingEvents = (
  params: EmitParams,
  record?: RecordEvent
) =>
  studioOnboardingEvents.map((name) =>
    emitStudioOnboardingEvent(name, params, record)
  );



