import type { LifecycleSignal } from '@contractspec/lib.lifecycle';

export interface IntentAdapterResult {
  signals?: LifecycleSignal[];
}

export interface IntentAdapter {
  fetch(): Promise<IntentAdapterResult>;
}


