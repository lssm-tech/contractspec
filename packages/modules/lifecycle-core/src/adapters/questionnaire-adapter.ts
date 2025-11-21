import type { LifecycleAxes, LifecycleSignal } from '@lssm/lib.lifecycle';

export interface QuestionnaireAdapterResult {
  axes?: Partial<LifecycleAxes>;
  signals?: LifecycleSignal[];
  answers?: Record<string, unknown>;
}

export interface QuestionnaireAdapter {
  fetch(): Promise<QuestionnaireAdapterResult>;
}

