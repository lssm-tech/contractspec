/**
 * Common runtime types: execution context, policy decision & event emission.
 */
export type Actor = 'anonymous' | 'user' | 'admin';
export type Channel = 'web' | 'mobile' | 'job' | 'agent';

export type PolicyDecision =
  | {
      effect: 'allow';
      rateLimit?: { rpm: number; key: string };
      escalate?: 'human_review' | null;
    }
  | { effect: 'deny'; reason?: string };

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
  /** Event publisher (outbox+bus) */
  eventPublisher?: EventPublisher;

  /** Internal pipe: filled by executor to enforce declared events */
  __emitGuard__?: (
    name: string,
    version: number,
    payload: unknown
  ) => Promise<void>;
}
