/**
 * Common runtime types for ContractSpec execution.
 *
 * Provides types for execution context, policy decisions, event emission,
 * and handler context passed through the contracts runtime.
 *
 * @module types
 */

// ─────────────────────────────────────────────────────────────────────────────
// Actor & Channel Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Actor type representing the entity making a request.
 *
 * - `anonymous`: Unauthenticated request
 * - `user`: Authenticated end-user
 * - `admin`: Administrative/system user with elevated privileges
 */
export type Actor = 'anonymous' | 'user' | 'admin';

/**
 * Channel through which a request originates.
 *
 * - `web`: Browser/web application
 * - `mobile`: Native mobile application
 * - `job`: Background job/scheduled task
 * - `agent`: AI agent or automated system
 */
export type Channel = 'web' | 'mobile' | 'job' | 'agent' | 'ci';

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

// ─────────────────────────────────────────────────────────────────────────────
// Contract Spec Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Discriminator for all ContractSpec specification types.
 *
 * Used to identify the kind of spec in registries and runtime operations.
 */
export type ContractSpecType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'feature'
  | 'capability'
  | 'data-view'
  | 'form'
  | 'agent'
  | 'migration'
  | 'workflow'
  | 'experiment'
  | 'integration'
  | 'theme'
  | 'knowledge'
  | 'telemetry'
  | 'example'
  | 'app-config'
  | 'product-intent'
  | 'policy'
  | 'test-spec'
  | 'type'
  | 'knowledge-space';

// ─────────────────────────────────────────────────────────────────────────────
// Policy Decision Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decision for a specific field access.
 * Used for fine-grained field-level authorization.
 */
export interface FieldLevelDecision {
  /** The field path being evaluated. */
  field: string;
  /** Whether access is allowed or denied. */
  effect: 'allow' | 'deny';
  /** Human-readable reason for the decision. */
  reason?: string;
}

/**
 * Result of a policy evaluation.
 *
 * Contains the access decision and any applicable constraints
 * like rate limits, escalation requirements, or consent needs.
 */
export interface PolicyDecision {
  /** Overall access decision: allow or deny. */
  effect: 'allow' | 'deny';
  /** Human-readable reason for the decision. */
  reason?: string;
  /** Rate limit constraints to apply if allowed. */
  rateLimit?: Pick<
    RateLimitDefinition,
    'rpm' | 'key' | 'windowSeconds' | 'burst'
  >;
  /** Escalation requirement for manual review. */
  escalate?: 'human_review' | null;
  /** Per-field access decisions. */
  fieldDecisions?: FieldLevelDecision[];
  /** PII handling policy. */
  pii?: PolicySpec['pii'];
  /** Consents required before proceeding. */
  requiredConsents?: ConsentDefinition[];
  /** Which engine produced this decision. */
  evaluatedBy?: 'engine' | 'opa';
}

/**
 * Input for policy evaluation.
 * Contains context about the request being authorized.
 */
export interface PolicyDeciderInput {
  /** Service name (e.g., "sigil"). */
  service: string;
  /** Command/operation name (e.g., "beginSignup"). */
  command: string;
  /** Operation version. */
  version: string;
  /** Actor type making the request. */
  actor: Actor;
  /** Channel the request came from. */
  channel?: Channel;
  /** Roles assigned to the actor. */
  roles?: string[];
  /** Organization context if applicable. */
  organizationId?: string | null;
  /** User context if authenticated. */
  userId?: string | null;
  /** Active feature flags. */
  flags?: string[];
}

/**
 * Function that evaluates policy rules and returns a decision.
 */
export type PolicyDecider = (
  input: PolicyDeciderInput
) => Promise<PolicyDecision>;

/**
 * Function that enforces rate limits.
 *
 * @param key - The rate limit key (e.g., user ID, IP)
 * @param cost - Cost of this request (usually 1)
 * @param rpm - Requests per minute limit
 * @throws When rate limit is exceeded
 */
export type RateLimiter = (
  key: string,
  cost: number,
  rpm: number
) => Promise<void>;

/**
 * Function that resolves translation keys to localized strings.
 */
export type TranslationResolver = (
  key: MessageKey,
  locale?: Locale
) => Promise<string | null> | string | null;

/**
 * Function that publishes events to the outbox/message bus.
 * Called after validation and guard checks pass.
 */
export type EventPublisher = (envelope: {
  /** Event key (e.g., "user.created"). */
  key: string;
  /** Event version. */
  version: string;
  /** Validated event payload. */
  payload: unknown;
  /** Trace ID for correlation. */
  traceId?: string;
}) => Promise<void>;

// ─────────────────────────────────────────────────────────────────────────────
// Handler Context
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execution context passed to operation handlers.
 *
 * Contains all contextual information and service hooks needed
 * during operation execution, including auth context, policy evaluation,
 * telemetry, event publishing, and resolved configurations.
 *
 * @example
 * ```typescript
 * async function loginHandler(input: LoginInput, ctx: HandlerCtx) {
 *   // Check policy
 *   const decision = await ctx.decide?.({
 *     service: 'auth',
 *     command: 'login',
 *     version: '1.0.0',
 *     actor: ctx.actor ?? 'anonymous',
 *   });
 *
 *   // Track telemetry
 *   ctx.telemetry?.track('login_attempt', { userId: ctx.userId });
 *
 *   // Publish event
 *   await ctx.eventPublisher?.({
 *     key: 'user.loggedIn',
 *     version: '1.0.0',
 *     payload: { userId: input.email },
 *     traceId: ctx.traceId,
 *   });
 * }
 * ```
 */
export interface HandlerCtx {
  /** Distributed trace identifier for request correlation. */
  traceId?: string;
  /** Idempotency key for deduplication. */
  idemKey?: string;
  /** Organization context for multi-tenant operations. */
  organizationId?: string | null;
  /** Authenticated user ID. */
  userId?: string | null;
  /** Actor type making the request. */
  actor?: Actor;
  /** Channel the request originated from. */
  channel?: Channel;
  /** Roles assigned to the authenticated user. */
  roles?: string[];

  /** Policy engine for authorization decisions. */
  decide?: PolicyDecider;
  /** Rate limiter service (e.g., Redis-backed). */
  rateLimit?: RateLimiter;
  /** Telemetry tracker for metrics and events. */
  telemetry?: TelemetryTracker;
  /** Event publisher for domain events (outbox/bus). */
  eventPublisher?: EventPublisher;
  /** Secret provider for secure credential access. */
  secretProvider?: SecretProvider;

  /**
   * Internal emit guard for enforcing declared event emissions.
   * Populated by the executor runtime.
   * @internal
   */
  __emitGuard__?: (
    key: string,
    version: string,
    payload: unknown
  ) => Promise<void>;
  /** Resolved application configuration for this execution. */
  appConfig?: ResolvedAppConfig;
  /** Resolved integration connections available to this execution. */
  integrations?: ResolvedIntegration[];
  /** Resolved knowledge spaces available to this execution. */
  knowledge?: ResolvedKnowledge[];
  /** Resolved branding context (logos, colors, etc.). */
  branding?: ResolvedBranding;
  /** Translation context with config and resolver. */
  translation?: {
    /** Resolved translation configuration. */
    config: ResolvedTranslation;
    /** Function to resolve translation keys. */
    resolve?: TranslationResolver;
  };
  /** Spec variant resolver for A/B testing and experiments. */
  specVariantResolver?: SpecVariantResolver;
  /** Event registry for runtime event spec lookup. */
  eventSpecResolver?: EventRegistry;
}
