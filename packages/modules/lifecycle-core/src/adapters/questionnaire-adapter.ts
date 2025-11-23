import type {
  LifecycleAxes,
  LifecycleSignal,
} from '@contractspec/lib.lifecycle';

export interface QuestionnaireAdapterResult {
  axes?: Partial<LifecycleAxes>;
  signals?: LifecycleSignal[];
  answers?: Record<string, unknown>;
}

export interface QuestionnaireAdapter {
  fetch(): Promise<QuestionnaireAdapterResult>;
}


