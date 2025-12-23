export interface AnalyticsEvent {
  name: string;
  userId: string;
  tenantId?: string;
  timestamp: string | Date;
  properties?: Record<string, unknown>;
}

export interface FunnelStep {
  id: string;
  eventName: string;
  match?: (event: AnalyticsEvent) => boolean;
}

export interface FunnelDefinition {
  name: string;
  steps: FunnelStep[];
  windowHours?: number;
}

export interface FunnelStepResult {
  step: FunnelStep;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface FunnelAnalysis {
  definition: FunnelDefinition;
  totalUsers: number;
  steps: FunnelStepResult[];
}

export interface CohortEvent extends AnalyticsEvent {
  amount?: number;
}

export interface CohortDefinition {
  bucket: 'day' | 'week' | 'month';
  periods: number;
  startDate?: Date;
}

export interface CohortStats {
  cohortKey: string;
  users: number;
  retention: number[];
  ltv: number;
}

export interface CohortAnalysis {
  definition: CohortDefinition;
  cohorts: CohortStats[];
}

export interface ChurnSignal {
  userId: string;
  score: number; // 0-1
  bucket: 'low' | 'medium' | 'high';
  drivers: string[];
}

export interface GrowthMetric {
  name: string;
  current: number;
  previous?: number;
  target?: number;
}

export interface GrowthHypothesis {
  statement: string;
  metric: string;
  confidence: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}
