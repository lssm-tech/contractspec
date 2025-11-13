/**
 * SpecRegistry:
 * - Registers ContractSpecs (unique by name+version)
 * - Binds runtime handlers to specs
 * - Provides lookup, iteration, and a safe execute() with validation/policy/enforcement
 *
 * Includes a minimal OpRegistry shim for backward-compat (deprecated).
 */
import { type ContractSpec, isEmitDeclRef } from './spec';
import type { ResourceRefDescriptor } from './resources';
import type { HandlerCtx } from './types';
import { eventKey } from './events';
import type { AnySchemaModel, ZodSchemaModel } from '@lssm/lib.schema';
import type { HandlerFor } from './install';

export type OperationKey = `${string}.v${number}`;

export function opKey(name: string, version: number): OperationKey {
  return `${name}.v${version}`;
}

type AnySpec = ContractSpec<
  AnySchemaModel,
  AnySchemaModel | ResourceRefDescriptor<boolean>
>;
type AnyHandler = (args: any, ctx: HandlerCtx) => Promise<unknown>;

/**
 * In-memory registry for ContractSpecs and their bound handlers.
 * Provides validation, policy enforcement, and guarded event emission at execute time.
 */
export class SpecRegistry {
  private specs = new Map<OperationKey, AnySpec>();
  private handlers = new Map<OperationKey, AnyHandler>();

  /** Register a ContractSpec. Throws if duplicate key. */
  register<
    I extends AnySchemaModel,
    O extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  >(spec: ContractSpec<I, O>): this {
    const key = opKey(spec.meta.name, spec.meta.version);
    if (this.specs.has(key)) throw new Error(`Duplicate spec ${key}`);
    this.specs.set(key, spec as AnySpec);
    return this;
  }

  /** Bind a handler implementation to a previously-registered spec. */
  bind<
    I extends AnySchemaModel,
    O extends AnySchemaModel | ResourceRefDescriptor<boolean>,
  >(spec: ContractSpec<I, O>, handler: HandlerFor<ContractSpec<I, O>>): this {
    const key: OperationKey = opKey(spec.meta.name, spec.meta.version);

    if (!this.specs.has(key))
      throw new Error(`Cannot bind; spec not found: ${key}`);
    if (this.handlers.has(key))
      throw new Error(`Handler already bound for ${key}`);
    this.handlers.set(key, handler);
    return this;
  }

  /** Retrieve a spec; if version omitted, returns highest version. */
  getSpec(name: string, version?: number): AnySpec | undefined {
    if (version != null) return this.specs.get(opKey(name, version));
    // find highest version by scanning keys of the same name
    let found: AnySpec | undefined;
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

  /** Retrieve a handler for given name/version. */
  getHandler(name: string, version?: number): AnyHandler | undefined {
    const spec = this.getSpec(name, version);
    if (!spec) return undefined;
    return this.handlers.get(opKey(spec.meta.name, spec.meta.version));
  }

  /** Iterate all registered specs. */
  listSpecs(): AnySpec[] {
    return [...this.specs.values()];
  }

  /** Iterate all bound operations (spec+handler). */
  listBound(): { spec: AnySpec; handler: AnyHandler }[] {
    const out: { spec: AnySpec; handler: AnyHandler }[] = [];
    for (const [k, spec] of this.specs.entries()) {
      const h = this.handlers.get(k);
      if (h) out.push({ spec, handler: h });
    }
    return out;
  }

  /**
   * Execute an operation by name/version:
   * - Validates input against zod
   * - Enforces policy (auth/flags/rate-limit/escalation)
   * - Guards event emission to declared events (via ctx.__emitGuard__)
   * - Validates output (SchemaModel outputs)
   */
  async execute(
    name: string,
    version: number | undefined,
    rawInput: unknown,
    ctx: HandlerCtx
  ): Promise<unknown> {
    const spec = this.getSpec(name, version);
    if (!spec)
      throw new Error(
        `Spec not found for ${name}${version ? `.v${version}` : ''}`
      );

    const key = opKey(spec.meta.name, spec.meta.version);
    const handler = this.handlers.get(key);
    if (!handler) throw new Error(`No handler bound for ${key}`);

    // 1) Validate input
    const parsedInput = spec.io.input?.getZod().parse(rawInput);

    // 2) Policy enforcement
    if (ctx.decide) {
      const [service, command] = spec.meta.name.split('.');
      const decision = await ctx.decide({
        service: service!,
        command: command!,
        version: spec.meta.version,
        actor: ctx.actor ?? 'anonymous',
        channel: ctx.channel,
        roles: ctx.roles,
        organizationId: ctx.organizationId,
        userId: ctx.userId,
        flags: [], // adapter may fill flags from request
      });
      if (decision.effect === 'deny') {
        throw new Error(
          `PolicyDenied: ${spec.meta.name}.v${spec.meta.version}`
        );
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
          `UndeclaredEvent: ${key2} not allowed by ${opKey(spec.meta.name, spec.meta.version)}`
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
    const result = await handler(parsedInput, {
      ...ctx,
      __emitGuard__: emitGuard,
    });

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
