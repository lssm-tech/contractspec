import type {
  LifecycleAxes,
  LifecycleMetricSnapshot,
  LifecycleSignal,
} from '@contractspec/lib.lifecycle';

export interface AnalyticsAdapterResult {
  metrics?: LifecycleMetricSnapshot;
  signals?: LifecycleSignal[];
  axes?: Partial<LifecycleAxes>;
}

export interface AnalyticsAdapter {
  fetch(): Promise<AnalyticsAdapterResult>;
}










