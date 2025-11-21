export interface SLODefinition {
  id: string;
  capability?: string;
  description?: string;
  targetAvailability: number; // e.g. 0.999
  latencyP99TargetMs?: number;
  latencyP95TargetMs?: number;
  rollingWindowMs: number;
  tags?: string[];
  alerts?: {
    fastBurnThreshold?: number; // e.g. 14x error budget burn
    slowBurnThreshold?: number; // e.g. 6x error budget burn
    minSamples?: number;
  };
}

export interface SLOWindowSample {
  good: number;
  bad: number;
  latencyP99?: number;
  latencyP95?: number;
  timeframeMs?: number;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface ErrorBudgetSnapshot {
  remaining: number;
  consumed: number;
  windowMs: number;
  updatedAt: Date;
}

export interface SLOSnapshot {
  definition: SLODefinition;
  availability: number;
  latencyP99?: number;
  latencyP95?: number;
  errorBudget: ErrorBudgetSnapshot;
  sample: SLOWindowSample;
}

export interface IncidentPayload {
  definition: SLODefinition;
  reason: string;
  snapshot: SLOSnapshot;
  severity: 'warning' | 'critical';
}

export interface IncidentManager {
  createIncident(payload: IncidentPayload): Promise<void> | void;
}
