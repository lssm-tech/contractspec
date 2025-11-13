/**
 * Common runtime types: execution context, policy decision & event emission.
 */
export type Actor = 'anonymous' | 'user' | 'admin';
export type Channel = 'web' | 'mobile' | 'job' | 'agent';

import type {
  ConsentDefinition,
  PolicySpec,
  RateLimitDefinition,
} from './policy/spec';
import type { TelemetryTracker } from './telemetry';
import type {
  ResolvedAppConfig,
  ResolvedIntegration,
  ResolvedKnowledge,
} from './app-config/runtime';

export interface FieldLevelDecision {
  field: string;
  effect: 'allow' | 'deny';
  reason?: string;
}

export interface PolicyDecision {
  effect: 'allow' | 'deny';
  reason?: string;
  rateLimit?: Pick<RateLimitDefinition, 'rpm' | 'key' | 'windowSeconds' | 'burst'>;
  escalate?: 'human_review' | null;
  fieldDecisions?: FieldLevelDecision[];
  pii?: PolicySpec['pii'];
  requiredConsents?: ConsentDefinition[];
  evaluatedBy?: 'engine' | 'opa';
}

export interface PolicyDeciderInput {
  service: string; // e.g., "sigil"
  command: string; // e.g., "beginSignup"
  version: number;
  actor: Actor;
  channel?: Channel;
  roles?: string[];
  organizationId?: string | null;
  userId?: string | null;
  flags?: string[];
}

export type PolicyDecider = (
  input: PolicyDeciderInput
) => Promise<PolicyDecision>;

export type RateLimiter = (
  key: string,
  cost: number,
  rpm: number
) => Promise<void>;

/** Outbox/bus event publisher (after validation & guarding) */
export type EventPublisher = (envelope: {
  name: string;
  version: number;
  payload: unknown;
  traceId?: string;
}) => Promise<void>;

export interface HandlerCtx {
  traceId?: string;
  idemKey?: string;
  organizationId?: string | null;
  userId?: string | null;
  actor?: Actor;
  channel?: Channel;
  roles?: string[];

  /** Policy engine hook (policy.yaml) */
  decide?: PolicyDecider;
  /** Rate limiter (e.g., Redis) */
  rateLimit?: RateLimiter;
  /** Telemetry tracker */
  telemetry?: TelemetryTracker;
  /** Event publisher (outbox+bus) */
  eventPublisher?: EventPublisher;

  /** Internal pipe: filled by executor to enforce declared events */
  __emitGuard__?: (
    name: string,
    version: number,
    payload: unknown
  ) => Promise<void>;
  /** Resolved application configuration for the current execution context */
  appConfig?: ResolvedAppConfig;
  /** Resolved integration connections available to this execution */
  integrations?: ResolvedIntegration[];
  /** Resolved knowledge spaces available to this execution */
  knowledge?: ResolvedKnowledge[];
}
