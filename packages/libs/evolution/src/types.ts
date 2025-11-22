import type {
  ContractSpec,
  OpKind,
  ResourceRefDescriptor,
} from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { LifecycleStage } from '@lssm/lib.lifecycle';

export type AnomalySeverity = 'low' | 'medium' | 'high';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface OperationCoordinate {
  name: string;
  version: number;
  tenantId?: string;
}

export interface OperationMetricSample {
  operation: OperationCoordinate;
  durationMs: number;
  success: boolean;
  timestamp: Date;
  payloadSizeBytes?: number;
  errorCode?: string;
  errorMessage?: string;
  actor?: string;
  channel?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
}

export interface SpecUsageStats {
  operation: OperationCoordinate;
  totalCalls: number;
  successRate: number;
  errorRate: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  maxLatencyMs: number;
  lastSeenAt: Date;
  windowStart: Date;
  windowEnd: Date;
  topErrors: Record<string, number>;
}

export interface SuggestionEvidence {
  type: 'telemetry' | 'user-feedback' | 'simulation' | 'test';
  description: string;
  data?: Record<string, unknown>;
}

export interface SpecAnomaly {
  operation: OperationCoordinate;
  severity: AnomalySeverity;
  metric: 'latency' | 'error-rate' | 'throughput' | 'policy' | 'schema';
  description: string;
  detectedAt: Date;
  threshold?: number;
  observedValue?: number;
  evidence: SuggestionEvidence[];
}

export interface PatternConfidence {
  score: number; // 0-1
  sampleSize: number;
  pValue?: number;
}

export interface IntentPattern {
  id: string;
  type:
    | 'latency-regression'
    | 'error-spike'
    | 'missing-operation'
    | 'chained-intent'
    | 'throughput-drop'
    | 'schema-mismatch';
  description: string;
  operation?: OperationCoordinate;
  confidence: PatternConfidence;
  metadata?: Record<string, unknown>;
  evidence: SuggestionEvidence[];
}

export interface SpecSuggestionProposal {
  summary: string;
  rationale: string;
  changeType: 'new-spec' | 'revision' | 'policy-update' | 'schema-update';
  kind?: OpKind;
  spec?: ContractSpec<
    AnySchemaModel,
    AnySchemaModel | ResourceRefDescriptor<boolean>
  >;
  diff?: string;
  metadata?: Record<string, unknown>;
}

export interface SpecSuggestion {
  id: string;
  intent: IntentPattern;
  target?: OperationCoordinate;
  proposal: SpecSuggestionProposal;
  confidence: number;
  createdAt: Date;
  createdBy: string;
  status: SuggestionStatus;
  evidence: SuggestionEvidence[];
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  approvals?: {
    reviewer?: string;
    notes?: string;
    decidedAt?: Date;
    status?: SuggestionStatus;
  };
}

export interface EvolutionConfig {
  minConfidence?: number;
  autoApproveThreshold?: number;
  maxSuggestionsPerOperation?: number;
  requireApproval?: boolean;
  maxConcurrentExperiments?: number;
}

export interface SpecSuggestionFilters {
  status?: SuggestionStatus;
  operationName?: string;
}

export interface SpecSuggestionRepository {
  create(suggestion: SpecSuggestion): Promise<void>;
  getById(id: string): Promise<SpecSuggestion | undefined>;
  updateStatus(
    id: string,
    status: SuggestionStatus,
    metadata?: { reviewer?: string; notes?: string; decidedAt?: Date }
  ): Promise<void>;
  list(filters?: SpecSuggestionFilters): Promise<SpecSuggestion[]>;
}

export interface SpecSuggestionWriter {
  write(suggestion: SpecSuggestion): Promise<string>;
}

export interface OptimizationHint {
  operation: OperationCoordinate;
  category: 'schema' | 'policy' | 'performance' | 'error-handling';
  summary: string;
  justification: string;
  recommendedActions: string[];
  lifecycleStage?: LifecycleStage;
  lifecycleNotes?: string;
}
