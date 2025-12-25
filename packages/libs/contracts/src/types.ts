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
  ResolvedTranslation,
} from './app-config/runtime';
import type { ResolvedBranding } from './app-config/branding';
import type { Locale, MessageKey } from './translations/catalog';
import type { SecretProvider } from './integrations/secrets/provider';
import type { SpecVariantResolver } from './experiments/spec-resolver';
import type { EventRegistry } from './events';

export type SpecType =
  | 'app-config'
  | 'capability'
  | 'data-view'
  | 'experiment'
  | 'form'
  | 'integration'
  | 'knowledge'
  | 'operation'
  | 'policy'
  | 'presentation'
  | 'telemetry'
  | 'workflow'
  | 'event'
  | 'feature'
  | 'migration';

export interface FieldLevelDecision {
  field: string;
  effect: 'allow' | 'deny';
  reason?: string;
}

export interface PolicyDecision {
  effect: 'allow' | 'deny';
  reason?: string;
  rateLimit?: Pick<
    RateLimitDefinition,
    'rpm' | 'key' | 'windowSeconds' | 'burst'
  >;
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

export type TranslationResolver = (
  key: MessageKey,
  locale?: Locale
) => Promise<string | null> | string | null;

/** Outbox/bus event publisher (after validation & guarding) */
export type EventPublisher = (envelope: {
  key: string;
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
  /** Secret provider for secure credentials */
  secretProvider?: SecretProvider;

  /** Internal pipe: filled by executor to enforce declared events */
  __emitGuard__?: (
    key: string,
    version: number,
    payload: unknown
  ) => Promise<void>;
  /** Resolved application configuration for the current execution context */
  appConfig?: ResolvedAppConfig;
  /** Resolved integration connections available to this execution */
  integrations?: ResolvedIntegration[];
  /** Resolved knowledge spaces available to this execution */
  knowledge?: ResolvedKnowledge[];
  /** Resolved branding context */
  branding?: ResolvedBranding;
  /** Translation context */
  translation?: {
    config: ResolvedTranslation;
    resolve?: TranslationResolver;
  };
  /** Optional spec variant resolver for experiments */
  specVariantResolver?: SpecVariantResolver;
  eventSpecResolver?: EventRegistry;
}
