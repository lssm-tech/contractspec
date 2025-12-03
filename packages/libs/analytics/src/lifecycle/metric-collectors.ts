import type {
  LifecycleMetricSnapshot,
  LifecycleSignal,
  LifecycleStage,
} from '@contractspec/lib.lifecycle';
import type { AnalyticsEvent } from '../types';

export interface LifecycleMetricSource {
  getActiveUsers(): Promise<number | undefined>;
  getWeeklyActiveUsers?(): Promise<number | undefined>;
  getRetentionRate?(): Promise<number | undefined>;
  getMonthlyRecurringRevenue?(): Promise<number | undefined>;
  getCustomerCount?(): Promise<number | undefined>;
  getTeamSize?(): Promise<number | undefined>;
  getBurnMultiple?(): Promise<number | undefined>;
}

export const collectLifecycleMetrics = async (
  source: LifecycleMetricSource
): Promise<LifecycleMetricSnapshot> => {
  const [
    activeUsers,
    weeklyActiveUsers,
    retentionRate,
    monthlyRecurringRevenue,
    customerCount,
    teamSize,
    burnMultiple,
  ] = await Promise.all([
    source.getActiveUsers(),
    source.getWeeklyActiveUsers?.(),
    source.getRetentionRate?.(),
    source.getMonthlyRecurringRevenue?.(),
    source.getCustomerCount?.(),
    source.getTeamSize?.(),
    source.getBurnMultiple?.(),
  ]);

  return {
    activeUsers,
    weeklyActiveUsers,
    retentionRate,
    monthlyRecurringRevenue,
    customerCount,
    teamSize,
    burnMultiple,
  };
};

export const metricsToSignals = (
  metrics: LifecycleMetricSnapshot,
  tenantId?: string
): LifecycleSignal[] =>
  Object.entries(metrics)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([metricKey, value]) => ({
      id: `lifecycle-metric:${metricKey}`,
      kind: 'metric',
      source: 'analytics',
      name: metricKey,
      value,
      weight: 1,
      confidence: 0.8,
      details: tenantId ? { tenantId } : undefined,
      capturedAt: new Date().toISOString(),
    }));

export const lifecycleEventNames = {
  assessmentRun: 'lifecycle_assessment_run',
  stageChanged: 'lifecycle_stage_changed',
  guidanceConsumed: 'lifecycle_guidance_consumed',
} as const;

export interface LifecycleStageChangePayload {
  tenantId?: string;
  previousStage?: LifecycleStage;
  nextStage: LifecycleStage;
  confidence: number;
}

export const createStageChangeEvent = (
  payload: LifecycleStageChangePayload
): AnalyticsEvent => ({
  name: lifecycleEventNames.stageChanged,
  userId: 'system',
  tenantId: payload.tenantId,
  timestamp: new Date(),
  properties: { ...payload },
});

