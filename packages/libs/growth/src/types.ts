export interface ExperimentVariant {
  id: string;
  weight?: number;
  description?: string;
}

export interface ExperimentDefinition {
  key: string;
  version: number;
  goal: string;
  audience?: string;
  variants: ExperimentVariant[];
  primaryMetric: string;
  guardrailMetrics?: string[];
  startDate?: Date;
  endDate?: Date;
  minimumSample?: number;
}

export interface ExperimentAssignment {
  experimentKey: string;
  variantId: string;
  userId: string;
  assignedAt: Date;
  context?: Record<string, string>;
}

export interface MetricSample {
  experimentKey: string;
  variantId: string;
  metric: string;
  value: number;
  userId?: string;
  timestamp: Date;
}

export interface ExperimentResult {
  experiment: ExperimentDefinition;
  variantMetrics: VariantMetricSummary[];
  winner?: string;
  significance?: number;
}

export interface VariantMetricSummary {
  variantId: string;
  average: number;
  samples: number;
  improvement: number;
}
