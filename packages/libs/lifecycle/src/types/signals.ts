import { LifecycleStage } from './stages';
import type { LifecycleAxis, LifecycleAxes } from './axes';

export type LifecycleSignalSource =
  | 'analytics'
  | 'questionnaire'
  | 'intent'
  | 'manual'
  | 'simulation';

export type LifecycleSignalKind =
  | 'metric'
  | 'qualitative'
  | 'event'
  | 'milestone'
  | 'heuristic';

export interface LifecycleSignal {
  id: string;
  stageHint?: LifecycleStage;
  axis?: LifecycleAxis;
  kind: LifecycleSignalKind;
  source: LifecycleSignalSource;
  name: string;
  value: number | string | boolean;
  weight: number;
  confidence: number; // 0-1
  details?: Record<string, unknown>;
  capturedAt: string;
}

export interface LifecycleMetricSnapshot {
  activeUsers?: number;
  weeklyActiveUsers?: number;
  retentionRate?: number;
  monthlyRecurringRevenue?: number;
  customerCount?: number;
  teamSize?: number;
  burnMultiple?: number;
  qualitativeSupport?: string[];
}

export interface LifecycleScore {
  stage: LifecycleStage;
  score: number;
  confidence: number;
  supportingSignals: string[];
}

export interface LifecycleAssessmentInput {
  axes?: Partial<LifecycleAxes>;
  metrics?: LifecycleMetricSnapshot;
  signals?: LifecycleSignal[];
  questionnaireAnswers?: Record<string, unknown>;
}
