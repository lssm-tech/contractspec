export type BehaviorEventType =
  | 'field_access'
  | 'feature_usage'
  | 'workflow_step';

export interface BehaviorEventBase {
  id?: string;
  tenantId: string;
  userId?: string;
  role?: string;
  device?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface FieldAccessEvent extends BehaviorEventBase {
  type: 'field_access';
  operation: string;
  field: string;
}

export interface FeatureUsageEvent extends BehaviorEventBase {
  type: 'feature_usage';
  feature: string;
  action: 'opened' | 'completed' | 'dismissed';
}

export interface WorkflowStepEvent extends BehaviorEventBase {
  type: 'workflow_step';
  workflow: string;
  step: string;
  status: 'entered' | 'completed' | 'skipped' | 'errored';
}

export type BehaviorEvent =
  | FieldAccessEvent
  | FeatureUsageEvent
  | WorkflowStepEvent;

export interface BehaviorQuery {
  tenantId?: string;
  userId?: string;
  role?: string;
  feature?: string;
  operation?: string;
  workflow?: string;
  since?: number;
  until?: number;
  limit?: number;
}

export interface BehaviorSummary {
  fieldCounts: Record<string, number>;
  featureCounts: Record<string, number>;
  workflowStepCounts: Record<string, Record<string, number>>;
  totalEvents: number;
}

export interface BehaviorInsights {
  unusedFields: string[];
  frequentlyUsedFields: string[];
  suggestedHiddenFields: string[];
  workflowBottlenecks: {
    workflow: string;
    step: string;
    dropRate: number;
  }[];
  layoutPreference?: 'form' | 'grid' | 'list' | 'table';
}







