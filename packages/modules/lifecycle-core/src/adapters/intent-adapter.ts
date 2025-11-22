import type { LifecycleSignal } from '@lssm/lib.lifecycle';

export interface IntentAdapterResult {
  signals?: LifecycleSignal[];
}

export interface IntentAdapter {
  fetch(): Promise<IntentAdapterResult>;
}



