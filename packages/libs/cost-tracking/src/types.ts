export interface ExternalCallCost {
  provider: string;
  cost?: number;
  durationMs?: number;
  requestCount?: number;
}

export interface CostSample {
  operation: string;
  tenantId?: string;
  environment?: 'dev' | 'staging' | 'prod';
  dbReads?: number;
  dbWrites?: number;
  computeMs?: number;
  memoryMbMs?: number;
  externalCalls?: ExternalCallCost[];
  customCost?: number;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface CostModel {
  dbReadCost: number;
  dbWriteCost: number;
  computeMsCost: number;
  memoryMbMsCost: number;
}

export interface OperationCostSummary {
  operation: string;
  tenantId?: string;
  total: number;
  breakdown: {
    dbReads: number;
    dbWrites: number;
    compute: number;
    memory: number;
    external: number;
    custom: number;
  };
  samples: number;
}

export interface TenantBudget {
  tenantId: string;
  monthlyLimit: number;
  currency?: string;
  alertThreshold?: number;
  currentSpend?: number;
}

export interface OptimizationSuggestion {
  operation: string;
  tenantId?: string;
  category: 'n_plus_one' | 'caching' | 'batching' | 'external';
  message: string;
  evidence: Record<string, unknown>;
}

export interface BudgetAlert {
  tenantId: string;
  limit: number;
  actual: number;
  triggeredAt: Date;
}
