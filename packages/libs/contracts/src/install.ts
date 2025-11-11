import { z } from 'zod';
import type { AnyContractSpec, ContractSpec, EmitDecl } from './spec';
import type { ResourceRefDescriptor } from './resources';
import type { HandlerCtx } from './types';
import { SpecRegistry } from './registry';
import type { EventSpec } from './events';
import type { AnySchemaModel, ZodSchemaModel } from '@lssm/lib.schema';

/** Infer input/output types from a ContractSpec */
export type SpecInput<Spec extends AnyContractSpec> = Spec['io']['input'];
export type ZodSpecInput<Spec extends AnyContractSpec> = ZodSchemaModel<
  SpecInput<Spec> extends null ? AnySchemaModel : NonNullable<SpecInput<Spec>>
>;

export type SpecOutput<Spec extends AnyContractSpec> = Spec['io']['output'];

type ResourceItem<O extends ResourceRefDescriptor<boolean>> = Record<
  O['varName'] extends string ? O['varName'] : 'id',
  string | number
>;

type ResourceRefOut<O> =
  O extends ResourceRefDescriptor<boolean>
    ? O['many'] extends true
      ? ResourceItem<O>[]
      : ResourceItem<O>
    : never;

export type RuntimeSpecOutput<Spec extends AnyContractSpec> =
  SpecOutput<Spec> extends AnySchemaModel
    ? ZodSchemaModel<SpecOutput<Spec>>
    : ResourceRefOut<SpecOutput<Spec>>;

/** Handler signature derived from the Spec */
export type HandlerFor<Spec extends AnyContractSpec> = (
  args: ZodSpecInput<Spec>,
  ctx: HandlerCtx
) => Promise<RuntimeSpecOutput<Spec>>;

/** Typed event param from Spec.sideEffects.emits */
export type EventParam<
  S extends ContractSpec<
    AnySchemaModel,
    AnySchemaModel | ResourceRefDescriptor<boolean>
  >,
> = S extends { sideEffects?: { emits?: readonly (infer E)[] } }
  ? E extends { name: string; version: number; payload: AnySchemaModel }
    ? {
        name: E['name'];
        version: E['version'];
        payload: z.infer<ReturnType<E['payload']['getZod']>>;
      }
    : never
  : never;

/** Build a type union of allowed events for a spec */
type AllowedEventUnion<
  S extends ContractSpec<
    AnySchemaModel,
    AnySchemaModel | ResourceRefDescriptor<boolean>
  >,
> = S['sideEffects'] extends { emits: readonly EmitDecl[] }
  ? {
      [K in keyof S['sideEffects']['emits']]: S['sideEffects']['emits'][K] extends {
        ref: EventSpec<infer P>;
      }
        ? {
            name: S['sideEffects']['emits'][K]['ref']['name'];
            version: S['sideEffects']['emits'][K]['ref']['version'];
            payload: z.infer<ReturnType<P['getZod']>>;
          }
        : S['sideEffects']['emits'][K] extends {
              name: infer N extends string;
              version: infer V extends number;
              payload: infer Q extends AnySchemaModel;
            }
          ? { name: N; version: V; payload: z.infer<ReturnType<Q['getZod']>> }
          : never;
    }[number]
  : never;

/** Typed emit for a given spec (validates at runtime through ctx.__emitGuard__). */
export function makeEmit<S extends AnyContractSpec>(_spec: S, ctx: HandlerCtx) {
  return {
    /** Le plus sûr : typé via EventSpec (pas besoin de tuple dans le spec) */
    ref: async <T extends AnySchemaModel>(
      ev: EventSpec<T>,
      payload: ZodSchemaModel<T>
    ) => {
      await ctx.__emitGuard__?.(ev.name, ev.version, payload);
    },
    /** Nom/version explicites (runtime-checked par la guard) */
    named: async (name: string, version: number, payload: unknown) => {
      await ctx.__emitGuard__?.(name, version, payload);
    },
    /** Compat : objet (bénéficie du typing si votre spec a un tuple `as const`) */
    object: async (evt: AllowedEventUnion<S>) => {
      // expect-error — OK si le union est précis, sinon fallback accepte string/number/unknown
      await ctx.__emitGuard__?.(evt.name, evt.version, (evt as any).payload);
    },
  };
}

/**
 * Register the Spec and bind the handler in one call, with full type inference.
 * Returns the registry for chaining.
 */
export function installOp<S extends AnyContractSpec>(
  reg: SpecRegistry,
  spec: S,
  handler: HandlerFor<S>
): SpecRegistry {
  return reg.register(spec).bind(spec, handler);
}

/**
 * Curried variant if you prefer building a module installer.
 *   const install = op(BeginSignupSpec, handler);
 *   install(reg);
 */
export function op<S extends AnyContractSpec>(
  spec: S,
  handler: HandlerFor<AnyContractSpec>
) {
  return {
    spec,
    handler,
    install: (reg: SpecRegistry) => installOp(reg, spec, handler),
  };
}
