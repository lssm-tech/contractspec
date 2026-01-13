export type DeploymentMode = 'canary' | 'blue-green';

export interface OperationTarget {
  name: string;
  version: number;
  namespace?: string;
  description?: string;
}

export interface DeploymentThresholds {
  /** e.g. 0.01 = 1% */
  errorRate: number;
  latencyP50?: number;
  latencyP95?: number;
  latencyP99?: number;
  throughputDrop?: number;
  customEvaluator?: (metrics: DeploymentMetrics) => boolean;
}

export interface CanaryStage {
  percentage: number;
  minDurationMs: number;
  holdAfterMs?: number;
  /** optional override thresholds */
  thresholds?: Partial<DeploymentThresholds>;
  label?: string;
}

export interface DeploymentStrategy {
  target: OperationTarget;
  mode: DeploymentMode;
  stages?: CanaryStage[];
  thresholds: DeploymentThresholds;
  metadata?: Record<string, unknown>;
}

export interface DeploymentMetrics {
  errorRate: number;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  throughput: number;
  sampleSize?: number;
  timestamp?: Date;
}

export type MetricsProvider = (
  stage: CanaryStage,
  windowMs: number
) => Promise<DeploymentMetrics>;

export interface TrafficSplit {
  stable: number;
  candidate: number;
}

export interface RollbackAction {
  reason: string;
  stage: CanaryStage;
  triggeredAt: Date;
}

export interface DeploymentEvent<TPayload = Record<string, unknown>> {
  type:
    | 'stage_started'
    | 'stage_passed'
    | 'stage_failed'
    | 'rolled_back'
    | 'completed'
    | 'blue_green_swapped';
  payload?: TPayload;
  timestamp: Date;
}

export type DeploymentEventListener = (event: DeploymentEvent) => void;
