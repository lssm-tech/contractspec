import * as React from 'react';
import {
  type RecordLearningEventInput,
  useRecordLearningEvent,
} from './mutations/useLearningEventMutations';

export const StudioLearningEventNames = {
  MODULE_NAVIGATED: 'module.navigated',
  TEMPLATE_INSTANTIATED: 'studio.template.instantiated',
  SPEC_CHANGED: 'spec.changed',
  REGENERATION_COMPLETED: 'regeneration.completed',
  PLAYGROUND_SESSION_STARTED: 'playground.session.started',
  EVOLUTION_APPLIED: 'studio.evolution.applied',
} as const;

export type StudioLearningEventName =
  (typeof StudioLearningEventNames)[keyof typeof StudioLearningEventNames];

export type RecordStudioLearningEventInput = Omit<
  RecordLearningEventInput,
  'name'
> & {
  name: StudioLearningEventName;
};

export function useStudioLearningEventRecorder() {
  const record = useRecordLearningEvent();

  const recordAsync = React.useCallback(
    async (input: RecordStudioLearningEventInput) => {
      return record.mutateAsync(input);
    },
    [record]
  );

  const recordFireAndForget = React.useCallback(
    (input: RecordStudioLearningEventInput) => {
      record.mutate(input);
    },
    [record]
  );

  return {
    record,
    recordAsync,
    recordFireAndForget,
  };
}





