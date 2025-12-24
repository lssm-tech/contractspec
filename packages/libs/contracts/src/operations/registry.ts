/**
 * OperationSpecRegistry:
 * - Registers ContractSpecs (unique by name+version)
 * - Binds runtime handlers to specs
 * - Provides lookup, iteration, and a safe execute() with validation/policy/enforcement
 *
 * Includes a minimal OpRegistry shim for backward-compat (deprecated).
 */
import {
  filterBy,
  getUniqueOwners,
  getUniqueTags,
  groupBy,
  GroupingStrategies,
} from '../registry-utils';
import {
  type AnyOperationSpec,
  isEmitDeclRef,
  type OperationSpec,
  type TelemetryTrigger,
} from './operation';
import type { ResourceRefDescriptor } from '../resources';
import type { HandlerCtx } from '../types';
import { eventKey } from '../events';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { HandlerForOperationSpec } from '../install';

export type OperationKey = `${string}.v${number}`;

export function opKey(name: string, version: number): OperationKey {
  return `${name}.v${version}`;
}

type AnyOperationHandler = (args: unknown, ctx: HandlerCtx) => Promise<unknown>;

/**
 * In-memory registry for ContractSpecs and their bound handlers.
 * Provides validation, policy enforcement, and guarded event emission at execute time.
 */
export class OperationSpecRegistry {
  private specs = new Map<OperationKey, AnyOperationSpec>();
  private handlers = new Map<OperationKey, AnyOperationHandler>();

  /**
   * Registers a OperationSpec definition.
   *
   * @param spec - The contract specification to register.
   * @returns The registry instance for chaining.
   * @throws If a spec with the same name and version is already registered.
   */
  register<
    I extends AnySchemaModel,
    O extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  >(spec: OperationSpec<I, O>): this {
    const key = opKey(spec.meta.key, spec.meta.version);
    if (this.specs.has(key)) throw new Error(`Duplicate spec ${key}`);
    this.specs.set(key, spec as AnyOperationSpec);
    return this;
  }

  /**
   * Binds a runtime handler implementation to a previously registered spec.
   *
   * @param spec - The spec to bind to.
   * @param handler - The async function implementing the business logic.
   * @returns The registry instance for chaining.
   * @throws If the spec is not found or a handler is already bound.
   */
  bind<
    I extends AnySchemaModel,
    O extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  >(
    spec: OperationSpec<I, O>,
    handler: HandlerForOperationSpec<OperationSpec<I, O>>
  ): this {
    const key: OperationKey = opKey(spec.meta.key, spec.meta.version);

    if (!this.specs.has(key))
      throw new Error(`Cannot bind; spec not found: ${key}`);
    if (this.handlers.has(key))
      throw new Error(`Handler already bound for ${key}`);
    this.handlers.set(key, handler as unknown as AnyOperationHandler);
    return this;
  }

  /**
   * Retrieves a registered spec by name and version.
   * If version is omitted, returns the highest version found.
   *
   * @param name - Operation name.
   * @param version - (Optional) Specific version.
   */
  getSpec(name: string, version?: number): AnyOperationSpec | undefined {
    if (version != null) return this.specs.get(opKey(name, version));
    // find highest version by scanning keys of the same name
    let found: AnyOperationSpec | undefined;
    let maxV = -Infinity;
    for (const [k, s] of this.specs.entries()) {
      if (!k.startsWith(`${name}.v`)) continue;
      if (s.meta.version > maxV) {
        maxV = s.meta.version;
        found = s;
      }
    }
    return found;
  }

  /**
   * Retrieves the bound handler for a spec.
   */
  getHandler(name: string, version?: number): AnyOperationHandler | undefined {
    const spec = this.getSpec(name, version);
    if (!spec) return undefined;
    return this.handlers.get(opKey(spec.meta.key, spec.meta.version));
  }

  /** Iterate all registered specs. */
  listSpecs(): AnyOperationSpec[] {
    return [...this.specs.values()];
  }

  /** Iterate all bound operations (spec+handler). */
  listBound(): { spec: AnyOperationSpec; handler: AnyOperationHandler }[] {
    const out: { spec: AnyOperationSpec; handler: AnyOperationHandler }[] = [];
    for (const [k, spec] of this.specs.entries()) {
      const h = this.handlers.get(k);
      if (h) out.push({ spec, handler: h });
    }
    return out;
  }

  /**
   * Filter specs by criteria.
   */
  filter(
    criteria: import('../registry-utils').RegistryFilter
  ): AnyOperationSpec[] {
    return filterBy(this.listSpecs(), criteria);
  }

  /**
   * List specs with specific tag.
   */
  listByTag(tag: string): AnyOperationSpec[] {
    return this.listSpecs().filter((s) => s.meta.tags?.includes(tag));
  }

  /**
   * List specs by owner.
   */
  listByOwner(owner: string): AnyOperationSpec[] {
    return this.listSpecs().filter((s) => s.meta.owners?.includes(owner));
  }

  /**
   * Group specs by key function.
   */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<AnyOperationSpec>
  ): Map<string, AnyOperationSpec[]> {
    return groupBy(this.listSpecs(), keyFn);
  }

  /**
   * Group by domain (first segment of name).
   */
  groupByDomain(): Map<string, AnyOperationSpec[]> {
    return this.groupBy(GroupingStrategies.byDomain);
  }

  /**
   * Group by tag.
   */
  groupByTag(): Map<string, AnyOperationSpec[]> {
    return this.groupBy(GroupingStrategies.byTag);
  }

  /**
   * Get unique tags from all specs.
   */
  getUniqueTags(): string[] {
    return getUniqueTags(this.listSpecs());
  }

  /**
   * Get unique owners from all specs.
   */
  getUniqueOwners(): string[] {
    return getUniqueOwners(this.listSpecs());
  }

  /**
   * Execute an operation by name/version with full runtime protections:
   * 1. Validates input against Zod schema.
   * 2. Enforces policy (Auth, RBAC, Rate Limits) via PDP.
   * 3. Guards event emission to ensure only declared events are sent.
   * 4. Validates output against Zod schema (if applicable).
   * 5. Tracks telemetry (success/failure).
   *
   * @param name - Operation name.
   * @param version - Operation version (optional, defaults to latest).
   * @param rawInput - The raw input payload (e.g. from JSON body).
   * @param ctx - The runtime context (actor, tenant, etc.).
   */
  async execute(
    name: string,
    version: number | undefined,
    rawInput: unknown,
    ctx: HandlerCtx
  ): Promise<unknown> {
    const baseSpec = this.getSpec(name, version);
    if (!baseSpec)
      throw new Error(
        `Spec not found for ${name}${version ? `.v${version}` : ''}`
      );
    const spec =
      (await ctx.specVariantResolver?.resolve(
        {
          name: basespec.meta.key,
          version: baseSpec.meta.version,
          kind: baseSpec.meta.kind,
        },
        ctx
      )) ?? baseSpec;

    let key = opKey(spec.meta.key, spec.meta.version);
    let handler = this.handlers.get(key);
    if (!handler) {
      const fallbackKey = opKey(basespec.meta.key, baseSpec.meta.version);
      handler = this.handlers.get(fallbackKey);
      key = fallbackKey;
    }
    if (!handler) throw new Error(`No handler bound for ${key}`);

    // 1) Validate input
    const parsedInput = spec.io.input?.getZod().parse(rawInput);

    // 2) Policy enforcement
    if (ctx.decide) {
      const [service, command] = spec.meta.key.split('.');
      if (!service || !command)
        throw new Error(`Invalid spec name: ${spec.meta.key}`);
      const decision = await ctx.decide({
        service,
        command,
        version: spec.meta.version,
        actor: ctx.actor ?? 'anonymous',
        channel: ctx.channel,
        roles: ctx.roles,
        organizationId: ctx.organizationId,
        userId: ctx.userId,
        flags: [], // adapter may fill flags from request
      });
      if (decision.effect === 'deny') {
        throw new Error(`PolicyDenied: ${spec.meta.key}.v${spec.meta.version}`);
      }
      if (decision.rateLimit && ctx.rateLimit) {
        const key = decision.rateLimit.key ?? 'default';
        const rpm = decision.rateLimit.rpm ?? 60;
        await ctx.rateLimit(key, 1, rpm);
      }
      // escalations are advisory; adapter may short-circuit if needed
    }

    // 3) Event emission guard
    const allowedEvents = new Map<string, AnySchemaModel>();
    if (spec.sideEffects?.emits) {
      for (const e of spec.sideEffects.emits) {
        if (isEmitDeclRef(e)) {
          allowedEvents.set(`${e.ref.name}.v${e.ref.version}`, e.ref.payload);
        } else {
          allowedEvents.set(`${e.name}.v${e.version}`, e.payload);
        }
      }
    }

    const emitGuard = async (
      eventName: string,
      eventVersion: number,
      payload: unknown
    ) => {
      const key2 = eventKey(eventName, eventVersion);
      const schema = allowedEvents.get(key2);
      if (!schema)
        throw new Error(
          `UndeclaredEvent: ${key2} not allowed by ${opKey(spec.meta.key, spec.meta.version)}`
        );
      const parsed = schema.getZod().parse(payload);
      // Delegate to service publisher if present
      await ctx.eventPublisher?.({
        name: eventName,
        version: eventVersion,
        payload: parsed,
        traceId: ctx.traceId,
      });
    };

    // 4) Execute handler with guarded ctx
    if (ctx.appConfig) {
      if (!ctx.branding) {
        ctx.branding = ctx.appConfig.branding;
      }
      if (!ctx.translation) {
        ctx.translation = { config: ctx.appConfig.translation };
      } else if (!ctx.translation.config) {
        ctx.translation = {
          ...ctx.translation,
          config: ctx.appConfig.translation,
        };
      }
    }
    const telemetryContext = ctx.telemetry;
    const trackTelemetry = async (
      trigger: TelemetryTrigger | undefined,
      details: { input: unknown; output?: unknown; error?: unknown }
    ) => {
      if (!telemetryContext || !trigger?.event) return;
      try {
        const props = trigger.properties?.(details) ?? {};
        await telemetryContext.track(
          trigger.event.name,
          trigger.event.version ?? 1,
          props,
          {
            tenantId: ctx.organizationId ?? undefined,
            organizationId: ctx.organizationId,
            userId: ctx.userId,
            actor: ctx.actor,
            channel: ctx.channel,
            metadata: ctx.traceId ? { traceId: ctx.traceId } : undefined,
          }
        );
      } catch (_error) {
        // Best-effort telemetry: swallow errors to avoid breaking the handler.
      }
    };

    let result: unknown;
    try {
      result = await handler(parsedInput, {
        ...ctx,
        __emitGuard__: emitGuard,
      });
    } catch (error) {
      if (spec.telemetry?.failure) {
        await trackTelemetry(spec.telemetry.failure, {
          input: parsedInput ?? rawInput,
          error,
        });
      }
      throw error;
    }

    if (spec.telemetry?.success) {
      await trackTelemetry(spec.telemetry.success, {
        input: parsedInput ?? rawInput,
        output: result,
      });
    }

    // 5) Validate output when the spec declares a SchemaModel output.
    const outputModel = spec.io.output as
      | AnySchemaModel
      | ResourceRefDescriptor<boolean>;
    if ((outputModel as AnySchemaModel)?.getZod) {
      const parsedOutput = (outputModel as AnySchemaModel)
        .getZod()
        .parse(result);
      return parsedOutput;
    }
    // ResourceRefDescriptor path: adapter may hydrate entity; leave as-is
    return result;
  }
}
