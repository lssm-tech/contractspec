import type { ContractSpec, ResourceRefDescriptor } from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { ExperimentDefinition } from '../types';

export type AnyContract = ContractSpec<
  AnySchemaModel,
  AnySchemaModel | ResourceRefDescriptor<boolean>
>;

export interface OperationCoordinate {
  name: string;
  version: number;
}

export interface SpecVariantBinding {
  id: string;
  spec: AnyContract;
  description?: string;
  rolloutPercentage?: number; // 0-1
}

export interface SpecExperimentConfig {
  target: OperationCoordinate;
  experiment: ExperimentDefinition;
  control: AnyContract;
  variants: SpecVariantBinding[];
  rolloutStages?: number[]; // e.g. [0.01, 0.1, 0.5, 1]
  activeStageIndex?: number;
  status?: 'draft' | 'running' | 'paused' | 'rolled_back' | 'completed';
  guardrails?: {
    errorRateThreshold?: number;
    latencyP99ThresholdMs?: number;
  };
}

export interface SpecAssignment {
  spec: AnyContract;
  variantId: string;
  experimentKey: string;
}

export interface SpecExperimentMetricSample {
  operation: OperationCoordinate;
  variantId: string;
  experimentKey: string;
  latencyMs: number;
  success: boolean;
  timestamp: Date;
}

export interface SpecExperimentEvaluation {
  shouldRollback: boolean;
  reasons: string[];
  latencyP99?: number;
  errorRate?: number;
  winner?: string;
  pValue?: number;
}


