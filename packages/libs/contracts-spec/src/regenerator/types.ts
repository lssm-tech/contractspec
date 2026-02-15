import type { AppBlueprintSpec, TenantAppConfig } from '../app-config/spec';
import type { ResolvedAppConfig } from '../app-config/runtime';
import type { TelemetrySpec } from '../telemetry/spec';

export type RegeneratorSignal =
  | TelemetrySignalEnvelope
  | ErrorSignalEnvelope
  | BehaviorSignalEnvelope;

export interface TelemetrySignalEnvelope {
  type: 'telemetry';
  contextId: string;
  signal: TelemetrySignal;
}

export interface TelemetrySignal {
  eventName: string;
  eventVersion: number;
  count: number;
  windowStart: Date;
  windowEnd: Date;
  anomalyScore?: number;
  classification?: 'normal' | 'warning' | 'critical';
  metadata?: Record<string, unknown>;
  telemetrySpec?: TelemetrySpec;
}

export interface ErrorSignalEnvelope {
  type: 'error';
  contextId: string;
  signal: ErrorSignal;
}

export interface ErrorSignal {
  id: string;
  classification: 'runtime' | 'policy' | 'workflow' | 'unknown';
  message: string;
  occurredAt: Date;
  count: number;
  metadata?: Record<string, unknown>;
}

export interface BehaviorSignalEnvelope {
  type: 'behavior';
  contextId: string;
  signal: BehaviorSignal;
}

export interface BehaviorSignal {
  feature: string;
  metric: 'usage' | 'conversion' | 'latency' | 'custom';
  value: number;
  baseline?: number;
  windowStart: Date;
  windowEnd: Date;
  metadata?: Record<string, unknown>;
}

export interface SpecChangeProposal {
  id: string;
  title: string;
  summary: string;
  confidence: ProposalConfidence;
  rationale: string[];
  target: ProposalTarget;
  diff?: string;
  actions: ProposalAction[];
  blockers?: ProposalBlocker[];
  createdAt: Date;
  signalIds: string[];
}

export type ProposalConfidence = 'low' | 'medium' | 'high';

export interface ProposalTarget {
  specType:
    | 'workflow'
    | 'capability'
    | 'policy'
    | 'dataView'
    | 'telemetry'
    | 'experiment'
    | 'theme'
    | 'unknown';
  reference: {
    key: string;
    version?: string;
  };
  tenantScoped?: boolean;
}

export type ProposalAction =
  | {
      kind: 'update_blueprint';
      summary: string;
    }
  | {
      kind: 'update_tenant_config';
      summary: string;
    }
  | {
      kind: 'run_tests';
      tests: string[];
    }
  | {
      kind: 'run_migrations';
      migrations: string[];
    }
  | {
      kind: 'trigger_regeneration';
      summary?: string;
    };

export interface ProposalBlocker {
  description: string;
  kind:
    | 'missing_context'
    | 'insufficient_data'
    | 'user_feedback'
    | 'manual_review';
}

export interface RegenerationContext {
  id: string;
  blueprint: AppBlueprintSpec;
  tenantConfig: TenantAppConfig;
  resolved: ResolvedAppConfig;
}

export interface RegenerationRule {
  readonly id: string;
  readonly description: string;
  evaluate(
    context: RegenerationContext,
    signals: RegeneratorSignal[]
  ): Promise<SpecChangeProposal[]>;
}

export interface ProposalSink {
  submit(
    context: RegenerationContext,
    proposal: SpecChangeProposal
  ): Promise<void>;
}
