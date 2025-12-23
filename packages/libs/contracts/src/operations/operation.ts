/**
 * ContractSpec: a single source of truth describing one operation (command/query).
 * It carries narrative context for humans/agents AND machine-typed input/output/policy.
 */
import type { EventSpec } from '../events';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { ResourceRefDescriptor } from '../resources';
import type { Owner, Stability, Tag } from '../ownership';
import type { DocId } from '../docs/registry';
import type { PolicyRef } from '../policy/spec';
import type { TestSpecRef } from '../tests/spec';

/**
 * Distinguishes between state-changing operations (command) and read-only operations (query).
 */
export type OpKind = 'command' | 'query';

/**
 * Type of implementation artifact.
 */
export type ImplementationType =
  | 'handler'
  | 'component'
  | 'form'
  | 'test'
  | 'service'
  | 'hook'
  | 'other';

/**
 * Reference to an implementation file for a spec.
 * Used for explicit implementation mapping.
 */
export interface ImplementationRef {
  /** Path to implementation file (relative to workspace root) */
  path: string;
  /** Type of implementation artifact */
  type: ImplementationType;
  /** Optional human-readable description */
  description?: string;
}

// preferred: reference a declared event
export interface EmitDeclRef {
  ref: EventSpec<AnySchemaModel>;
  when: string;
}
// inline (fallback)
export interface EmitDeclInline {
  name: string;
  version: number;
  when: string;
  payload: AnySchemaModel;
}
/**
 * Declaration of an event that an operation may emit.
 * Can be a reference to an `EventSpec` or an inline definition.
 */
export type EmitDecl = EmitDeclRef | EmitDeclInline;
export const isEmitDeclRef = (e: EmitDecl): e is EmitDeclRef => 'ref' in e;

export interface TelemetryTrigger {
  event: { name: string; version?: number };
  properties?: (args: {
    input: unknown;
    output?: unknown;
    error?: unknown;
  }) => Record<string, unknown>;
}

/**
 * The core specification interface for any operation (Command or Query).
 *
 * @template Input - The Zod-backed schema model for the input payload.
 * @template Output - The Zod-backed schema model for the output payload, or a resource reference.
 * @template Events - Tuple of events that this operation may emit.
 */
export interface OperationSpec<
  Input extends AnySchemaModel,
  Output extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  Events extends readonly EmitDecl[] | undefined =
    | readonly EmitDecl[]
    | undefined,
> {
  meta: {
    /** Fully-qualified op name (e.g., "sigil.beginSignup") */
    name: string;
    /** Breaking changes => bump version */
    version: number;
    /** "command" changes state; "query" is read-only/idempotent */
    kind: OpKind;
    /** Lifecycle marker for comms & tooling */
    stability: Stability;
    /** Owners for CODEOWNERS / on-call / approvals */
    owners: Owner[];
    /** Search tags, grouping, docs navigation */
    tags: Tag[];
    /** Short human-friendly summary */
    description: string;
    /** Business goal: why this exists */
    goal: string;
    /** Background, constraints, scope edges (feeds docs & LLM context) */
    context: string;
    /** Optional doc block id for this operation. */
    docId?: DocId;
  };

  io: {
    /** Zod schema for input payload */
    input: Input | null;
    /** Zod schema for output payload */
    output: Output;
    /** Named, typed errors this op may throw (optional) */
    errors?: Record<
      string,
      {
        description: string;
        http?: number; // suggested HTTP status if surfaced over REST
        gqlCode?: string; // suggested GraphQL error code
        when: string; // human-readable condition
      }
    >;
  };

  policy: {
    /** Minimal auth category allowed to call this op */
    auth: 'anonymous' | 'user' | 'admin';
    /** Idempotency hint. Queries default true; commands default false. */
    idempotent?: boolean;
    /** Soft rate limit suggestion; adapter enforces via limiter */
    rateLimit?: { rpm: number; key: 'user' | 'org' | 'global' };
    /** Feature flags that must be ON for this op to run */
    flags?: string[];
    /** Whether a human must approve before action (e.g., risky commands) */
    escalate?: 'human_review' | null;
    /** JSONPath-like pointers to redact from logs/prompts */
    pii?: string[];
    /** Referenced policy specs governing access */
    policies?: PolicyRef[];
    /** Field-level overrides referencing policy specs */
    fieldPolicies?: {
      field: string;
      actions: ('read' | 'write')[];
      policy?: PolicyRef;
    }[];
  };

  sideEffects?: {
    /** Declared events this op may emit; runtime will guard against others */
    emits?: Events;
    /** Analytics intents (names); the service decides the sink */
    analytics?: string[];
    /** Audit intents (labels); the service decides storage */
    audit?: string[];
  };

  telemetry?: {
    success?: TelemetryTrigger;
    failure?: TelemetryTrigger;
  };

  tests?: TestSpecRef[];

  transport?: {
    rest?: {
      /** Override HTTP method (default: POST for commands, GET for queries) */
      method?: 'GET' | 'POST';
      /** Override path (default derived from meta.name/version) */
      path?: string;
    };
    gql?: {
      /** Override field name (default: dots→underscores + _vN) */
      field?: string;
      returns?: string;
      // byIdField?: string;
      // resource?: string;
    };
    mcp?: {
      /** Override tool identifier (default: "<name>.v<version>") */
      toolName?: string;
    };
  };

  acceptance?: {
    /** Gherkin-lite scenarios for docs & auto tests */
    scenarios?: {
      name: string;
      given: string[];
      when: string[];
      then: string[];
    }[];
    /** Request/response examples (used for docs & snapshot tests) */
    examples?: { name: string; input: unknown; output: unknown }[];
  };

  /**
   * Explicit implementation file mappings.
   * Used for tracking and verifying that this spec is correctly implemented.
   */
  implementations?: ImplementationRef[];
}

export type AnyOperationSpec = OperationSpec<
  AnySchemaModel,
  AnySchemaModel | ResourceRefDescriptor<boolean>
>;

/**
 * Helper to define a Command (write operation).
 * Sets `kind: 'command'` and defaults `idempotent: false`.
 */
export const defineCommand = <
  I extends AnySchemaModel,
  O extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  E extends readonly EmitDecl[] | undefined = undefined,
>(
  spec: Omit<OperationSpec<I, O, E>, 'meta' | 'policy'> & {
    meta: Omit<OperationSpec<I, O, E>['meta'], 'kind'>;
    policy: Omit<OperationSpec<I, O, E>['policy'], 'idempotent'>;
  }
): OperationSpec<I, O, E> => ({
  ...spec,
  meta: { ...spec.meta, kind: 'command' as const },
  policy: {
    ...spec.policy,
    idempotent:
      (spec.policy as never as OperationSpec<never, never, never>)?.['policy']
        ?.idempotent ?? false,
  },
});

/**
 * Helper to define a Query (read-only operation).
 * Sets `kind: 'query'` and forces `idempotent: true`.
 */
export const defineQuery = <
  I extends AnySchemaModel,
  O extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  E extends readonly EmitDecl[] | undefined = undefined,
>(
  spec: Omit<OperationSpec<I, O, E>, 'meta' | 'policy'> & {
    meta: Omit<OperationSpec<I, O, E>['meta'], 'kind'>;
    policy: Omit<OperationSpec<I, O, E>['policy'], 'idempotent'>;
  }
): OperationSpec<I, O, E> => ({
  ...spec,
  meta: { ...spec.meta, kind: 'query' as const },
  policy: { ...spec.policy, idempotent: true },
});
