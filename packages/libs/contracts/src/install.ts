import * as z from 'zod';
import type { AnyOperationSpec, EmitDecl, OperationSpec } from './operations/';
import type { ResourceRefDescriptor } from './resources';
import type { HandlerCtx } from './types';
import { OperationSpecRegistry } from './operations/registry';
import type { EventSpec } from './events';
import type { AnySchemaModel, ZodSchemaModel } from '@lssm/lib.schema';

/** Infer input/output types from a OperationSpec */
export type OperationSpecInput<Spec extends AnyOperationSpec> =
  Spec['io']['input'];
export type ZodOperationSpecInput<Spec extends AnyOperationSpec> =
  ZodSchemaModel<
    OperationSpecInput<Spec> extends null
      ? AnySchemaModel
      : NonNullable<OperationSpecInput<Spec>>
  >;

export type OperationSpecOutput<Spec extends AnyOperationSpec> =
  Spec['io']['output'];

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

export type RuntimeSpecOutput<Spec extends AnyOperationSpec> =
  OperationSpecOutput<Spec> extends AnySchemaModel
    ? ZodSchemaModel<OperationSpecOutput<Spec>>
    : ResourceRefOut<OperationSpecOutput<Spec>>;

/** Handler signature derived from the Spec */
export type HandlerForOperationSpec<Spec extends AnyOperationSpec> = (
  args: ZodOperationSpecInput<Spec>,
  ctx: HandlerCtx
) => Promise<RuntimeSpecOutput<Spec>>;

/** Typed event param from Spec.sideEffects.emits */
export type EventParam<
  S extends OperationSpec<
    AnySchemaModel,
    AnySchemaModel | ResourceRefDescriptor<boolean>
  >,
> = S extends { sideEffects?: { emits?: readonly (infer E)[] } }
  ? E extends { key: string; version: number; payload: AnySchemaModel }
    ? {
        key: E['key'];
        version: E['version'];
        payload: z.infer<ReturnType<E['payload']['getZod']>>;
      }
    : never
  : never;

/** Build a type union of allowed events for a spec */
type AllowedEventUnion<
  S extends OperationSpec<
    AnySchemaModel,
    AnySchemaModel | ResourceRefDescriptor<boolean>
  >,
> = S['sideEffects'] extends { emits: readonly EmitDecl[] }
  ? {
      [K in keyof S['sideEffects']['emits']]: S['sideEffects']['emits'][K] extends {
        ref: EventSpec<infer P>;
      }
        ? {
            key: S['sideEffects']['emits'][K]['ref']['meta']['key'];
            version: S['sideEffects']['emits'][K]['ref']['meta']['version'];
            payload: z.infer<ReturnType<P['getZod']>>;
          }
        : S['sideEffects']['emits'][K] extends {
              key: infer N extends string;
              version: infer V extends number;
              payload: infer Q extends AnySchemaModel;
            }
          ? { key: N; version: V; payload: z.infer<ReturnType<Q['getZod']>> }
          : never;
    }[number]
  : never;

/** Typed emit for a given spec (validates at runtime through ctx.__emitGuard__). */
export function makeEmit<S extends AnyOperationSpec>(
  _spec: S,
  ctx: HandlerCtx
) {
  return {
    /** Le plus sûr : typé via EventSpec (pas besoin de tuple dans le spec) */
    ref: async <T extends AnySchemaModel>(
      ev: EventSpec<T>,
      payload: ZodSchemaModel<T>
    ) => {
      await ctx.__emitGuard__?.(ev.meta.key, ev.meta.version, payload);
    },
    /** Nom/version explicites (runtime-checked par la guard) */
    key: async (key: string, version: number, payload: unknown) => {
      await ctx.__emitGuard__?.(key, version, payload);
    },
    /** Compat : objet (bénéficie du typing si votre spec a un tuple `as const`) */
    object: async (evt: AllowedEventUnion<S>) => {
      // expect-error — OK si le union est précis, sinon fallback accepte string/number/unknown
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ctx.__emitGuard__?.(evt.key, evt.version, (evt as any).payload);
    },
  };
}

/**
 * Register the Spec and bind the handler in one call, with full type inference.
 * Returns the registry for chaining.
 */
export function installOp<S extends AnyOperationSpec>(
  reg: OperationSpecRegistry,
  spec: S,
  handler: HandlerForOperationSpec<S>
): OperationSpecRegistry {
  return reg.register(spec).bind(spec, handler);
}

/**
 * Curried variant if you prefer building a module installer.
 *   const install = op(BeginSignupSpec, handler);
 *   install(reg);
 */
export function op<S extends AnyOperationSpec>(
  spec: S,
  handler: HandlerForOperationSpec<AnyOperationSpec>
) {
  return {
    spec,
    handler,
    install: (reg: OperationSpecRegistry) => installOp(reg, spec, handler),
  };
}
