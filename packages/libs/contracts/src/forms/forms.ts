/* eslint-disable */
import type { AnySchemaModel, ZodSchemaModel } from '@contractspec/lib.schema';
import type { OwnerShipMeta } from '../ownership';

// ---- Core types

export type PredicateOp =
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'truthy'
  | 'empty'
  | 'lengthGt'
  | 'lengthGte'
  | 'lengthLt'
  | 'lengthLte';

// Author-time generic path helpers (computed from provided fields shape)
export interface WhenClause {
  /** Dot path in form values; arrays may use `$index` within array context. */
  path: string;
  op?: PredicateOp;
  value?: unknown;
}

export interface Predicate {
  when?: WhenClause;
  all?: Predicate[];
  anyOf?: Predicate[];
  not?: Predicate;
}

export interface FormOption {
  labelI18n: string;
  value: string | number | boolean;
  descriptionI18n?: string;
  disabled?: boolean;
}

export type OptionsSource =
  | { kind: 'static'; options: readonly FormOption[] }
  | {
      kind: 'resolver';
      resolverKey: string;
      /** Dot paths in form values to watch */
      deps: string[];
      args?: Record<string, unknown>;
    };

export interface BaseFieldSpec {
  /** Field kind discriminator. */
  kind:
    | 'text'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'group'
    | 'array';
  /** Field name (dot path relative to the form root or parent context). */
  name?: string;
  labelI18n?: string;
  descriptionI18n?: string;
  placeholderI18n?: string;
  required?: boolean;
  /** Conditional UI behavior */
  visibleWhen?: Predicate;
  enabledWhen?: Predicate;
  requiredWhen?: Predicate;
  /** UI hints */
  uiKey?: string;
  uiProps?: Record<string, unknown>;
  wrapper?: { orientation?: 'horizontal' | 'vertical' };
  /** HTML/Native autofill token (supports custom tokens) */
  autoComplete?: string;
  /** Keyboard/adaptation hints (web/native). Shape mirrors design-system KeyboardOptions but stays decoupled. */
  keyboard?: {
    kind?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoComplete?: string;
    autoCorrect?: boolean;
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'search' | 'send';
  };
  /** Optional computed value hook, provided by host computations map */
  computeFrom?: {
    computeKey: string;
    deps: string[];
    mode?: 'change' | 'blur-xs' | 'submit';
    readOnly?: boolean;
  };
}

export interface TextFieldSpec extends BaseFieldSpec {
  kind: 'text';
  name: string;
  inputMode?:
    | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'numeric'
    | 'decimal'
    | 'search';
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
}

export interface TextareaFieldSpec extends BaseFieldSpec {
  kind: 'textarea';
  name: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
}

export interface SelectFieldSpec extends BaseFieldSpec {
  kind: 'select';
  name: string;
  options: OptionsSource | readonly FormOption[]; // allow shorthand array
}

export interface CheckboxFieldSpec extends BaseFieldSpec {
  kind: 'checkbox';
  name: string;
}

export interface RadioFieldSpec extends BaseFieldSpec {
  kind: 'radio';
  name: string;
  options: OptionsSource | readonly FormOption[];
}

export interface SwitchFieldSpec extends BaseFieldSpec {
  kind: 'switch';
  name: string;
}

export interface GroupFieldSpec extends BaseFieldSpec {
  kind: 'group';
  /** Optional legend/label at group level */
  labelI18n?: string;
  fields: FieldSpec[];
}

export interface ArrayFieldSpec extends BaseFieldSpec {
  kind: 'array';
  /** Root-level field that is an array in the model (e.g., "emails") */
  name: string;
  /** Child field spec for each item (e.g., address inside emails[i].address). */
  of: Exclude<FieldSpec, ArrayFieldSpec | GroupFieldSpec>;
  min?: number;
  max?: number;
}

export type FieldSpec =
  | TextFieldSpec
  | TextareaFieldSpec
  | SelectFieldSpec
  | CheckboxFieldSpec
  | RadioFieldSpec
  | SwitchFieldSpec
  | GroupFieldSpec
  | ArrayFieldSpec;

export interface FormAction {
  key: string;
  labelI18n: string;
  op?: { name: string; version: number };
  success?: { navigateTo?: string; toastI18n?: string };
}

export interface ConstraintDecl {
  key: string; // host maps this to a function
  messageI18n: string;
  paths: string[]; // inputs for the constraint function
  args?: Record<string, unknown>;
}

export type FormValuesFor<M extends AnySchemaModel> = ZodSchemaModel<M>;

export interface FormSpec<M extends AnySchemaModel = AnySchemaModel> {
  meta: OwnerShipMeta;
  /** Canonical form data shape */
  model: M;
  /** Flat list or tree using groups/arrays */
  fields: FieldSpec[];
  policy?: { flags?: string[]; pii?: string[] };
  actions?: FormAction[];
  renderHints?: { ui: 'shadcn' | 'custom'; form: 'react-hook-form' };
  constraints?: ConstraintDecl[];
}

// ---- Registry

function formKey(meta: FormSpec['meta']) {
  return `${meta.key}.v${meta.version}`;
}

export class FormRegistry {
  private items = new Map<string, FormSpec>();

  register(spec: FormSpec): this {
    const key = formKey(spec.meta);
    if (this.items.has(key)) throw new Error(`Duplicate form ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): FormSpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number) {
    if (version != null) return this.items.get(`${key}.v${version}`);
    let candidate: FormSpec | undefined;
    let max = -Infinity;
    for (const [k, v] of this.items.entries()) {
      if (!k.startsWith(`${key}.v`)) continue;
      if (v.meta.version > max) {
        max = v.meta.version;
        candidate = v;
      }
    }
    return candidate;
  }

  /** Filter forms by criteria. */
  filter(
    criteria: import('../registry-utils').RegistryFilter
  ): FormSpec[] {
    const { filterBy } = require('../registry-utils') as typeof import('../registry-utils');
    return filterBy(this.list(), criteria);
  }

  /** List forms with specific tag. */
  listByTag(tag: string): FormSpec[] {
    return this.list().filter((f) => f.meta.tags?.includes(tag));
  }

  /** List forms by owner. */
  listByOwner(owner: string): FormSpec[] {
    return this.list().filter((f) => f.meta.owners?.includes(owner));
  }

  /** Group forms by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<FormSpec>
  ): Map<string, FormSpec[]> {
    const { groupBy } = require('../registry-utils') as typeof import('../registry-utils');
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all forms. */
  getUniqueTags(): string[] {
    const { getUniqueTags } = require('../registry-utils') as typeof import('../registry-utils');
    return getUniqueTags(this.list());
  }
}

// ---- Relations helpers (runtime)

function getAtPath(values: unknown, path: string): unknown {
  if (!path) return undefined;
  const segs = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
  let cur: unknown = values;
  for (const s of segs) {
    if (cur == null) return undefined;
    if (cur && typeof cur === 'object' && s in cur) {
      cur = (cur as Record<string, unknown>)[s];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function evalPredicate(values: unknown, pred?: Predicate): boolean {
  if (!pred) return true;
  if (pred.not) return !evalPredicate(values, pred.not);
  if (pred.all && pred.all.length)
    return pred.all.every((p) => evalPredicate(values, p));
  if (pred.anyOf && pred.anyOf.length)
    return pred.anyOf.some((p) => evalPredicate(values, p));
  if (pred.when) {
    const { path, op = 'truthy', value } = pred.when;
    const v = getAtPath(values, path);
    switch (op) {
      case 'equals':
        return v === value;
      case 'notEquals':
        return v !== value;
      case 'in':
        return Array.isArray(value) && value.includes(v as never);
      case 'notIn':
        return Array.isArray(value) && !value.includes(v as never);
      case 'gt':
        return Number(v) > Number(value);
      case 'gte':
        return Number(v) >= Number(value);
      case 'lt':
        return Number(v) < Number(value);
      case 'lte':
        return Number(v) <= Number(value);
      case 'empty':
        return (
          v == null ||
          (Array.isArray(v) ? v.length === 0 : String(v).length === 0)
        );
      case 'lengthGt':
        return (
          (Array.isArray(v) || typeof v === 'string') &&
          v.length > Number(value ?? 0)
        );
      case 'lengthGte':
        return (
          (Array.isArray(v) || typeof v === 'string') &&
          v.length >= Number(value ?? 0)
        );
      case 'lengthLt':
        return (
          (Array.isArray(v) || typeof v === 'string') &&
          v.length < Number(value ?? 0)
        );
      case 'lengthLte':
        return (
          (Array.isArray(v) || typeof v === 'string') &&
          v.length <= Number(value ?? 0)
        );
      case 'truthy':
      default:
        return Boolean(v);
    }
  }
  return true;
}

export type ConstraintHandler = (
  values: Record<string, unknown>,
  paths: string[],
  args?: Record<string, unknown>
) => { ok: true } | { ok: false; message?: string; path?: string };

/**
 * Wrap the base zod schema with relation-driven refinements (requiredWhen, array min/max)
 * and optional custom constraints. Call this when wiring RHF resolver.
 */
export function buildZodWithRelations(
  spec: FormSpec,
  handlers?: Record<string, ConstraintHandler>
) {
  const base = spec.model.getZod();

  return (base as any).superRefine(
    (values: Record<string, unknown>, ctx: any) => {
      const visit = (field: FieldSpec, parentPath?: string) => {
        const path = field.name
          ? parentPath
            ? `${parentPath}.${field.name}`
            : field.name
          : (parentPath ?? '');

        // requiredWhen enforcement (UI also shows required)
        if (field.requiredWhen) {
          const should = evalPredicate(values, field.requiredWhen);
          if (should) {
            const v = getAtPath(values, path);
            const empty =
              v == null ||
              (typeof v === 'string' && v.trim().length === 0) ||
              (Array.isArray(v) && v.length === 0);
            if (empty)
              ctx.addIssue({
                code: 'custom',
                path: path.split('.'),
                message: 'required',
              });
          }
        }

        // arrays min/max
        if (field.kind === 'array') {
          const arr = getAtPath(values, path) as unknown[] | undefined;
          if (
            field.min != null &&
            Array.isArray(arr) &&
            arr.length < field.min
          ) {
            ctx.addIssue({
              code: 'custom',
              path: path.split('.'),
              message: `min:${field.min}`,
            });
          }
          if (
            field.max != null &&
            Array.isArray(arr) &&
            arr.length > field.max
          ) {
            ctx.addIssue({
              code: 'custom',
              path: path.split('.'),
              message: `max:${field.max}`,
            });
          }
          // child
          visit(field.of, path);
        } else if (field.kind === 'group') {
          for (const child of field.fields) visit(child, path);
        }
      };

      for (const f of spec.fields) visit(f);

      // custom constraints
      if (spec.constraints && handlers) {
        for (const c of spec.constraints) {
          const fn = handlers[c.key];
          if (!fn) continue;
          const res = fn(values, c.paths, c.args);
          if (!res.ok) {
            ctx.addIssue({
              code: 'custom',
              path: (res.path ?? c.paths[0] ?? '').split('.').filter(Boolean),
              message: res.message ?? c.messageI18n,
            });
          }
        }
      }
    }
  );
}

// ---- Authoring-time helper: enforce typed paths from fields (best-effort bounded)

interface AnyFieldLike {
  kind: string;
  name?: string;
  fields?: readonly AnyFieldLike[];
  of?: AnyFieldLike;
}

type TopLevelNames<F extends readonly AnyFieldLike[]> = F[number] extends {
  name: infer N extends string;
}
  ? N
  : never;

type ArrayChildren<F extends readonly AnyFieldLike[]> = F[number] extends {
  kind: 'array';
  name: infer N extends string;
  of: infer C;
}
  ? C extends { name: infer CN extends string }
    ? `${N}.$index.${CN}`
    : never
  : never;

type GroupTopLevelNames<F extends readonly AnyFieldLike[]> = F[number] extends {
  kind: 'group';
  fields: infer G extends readonly AnyFieldLike[];
}
  ? TopLevelNames<G>
  : never;

type GroupArrayChildren<F extends readonly AnyFieldLike[]> = F[number] extends {
  kind: 'group';
  fields: infer G extends readonly AnyFieldLike[];
}
  ? ArrayChildren<G>
  : never;

type PathOfFields<F extends readonly AnyFieldLike[]> =
  | TopLevelNames<F>
  | ArrayChildren<F>
  | GroupTopLevelNames<F>
  | GroupArrayChildren<F>;

export interface TypedWhenClause<P extends string> {
  path: P;
  op?: PredicateOp;
  value?: unknown;
}
export interface TypedPredicate<P extends string> {
  when?: TypedWhenClause<P>;
  all?: TypedPredicate<P>[];
  anyOf?: TypedPredicate<P>[];
  not?: TypedPredicate<P>;
}
export type TypedOptionsSource<P extends string> =
  | { kind: 'static'; options: readonly FormOption[] }
  | {
      kind: 'resolver';
      resolverKey: string;
      deps: P[];
      args?: Record<string, unknown>;
    };

export type EnhanceFields<
  F extends readonly AnyFieldLike[],
  P extends string,
> = {
  [K in keyof F]: F[K] & {
    visibleWhen?: TypedPredicate<P>;
    enabledWhen?: TypedPredicate<P>;
    requiredWhen?: TypedPredicate<P>;
  } & (F[K] extends { kind: 'select' }
      ? { options: TypedOptionsSource<P> | readonly FormOption[] }
      : unknown) &
    (F[K] extends { kind: 'radio' }
      ? { options: TypedOptionsSource<P> | readonly FormOption[] }
      : unknown) & {
      computeFrom?: {
        computeKey: string;
        deps: P[];
        mode?: 'change' | 'blur-xs' | 'submit';
        readOnly?: boolean;
      };
    };
};

export function defineFormSpec<
  M extends AnySchemaModel,
  F extends readonly AnyFieldLike[],
>(spec: {
  meta: FormSpec<M>['meta'];
  model: M;
  fields: EnhanceFields<F, PathOfFields<F>>;
  policy?: FormSpec<M>['policy'];
  actions?: FormSpec<M>['actions'];
  renderHints?: FormSpec<M>['renderHints'];
  constraints?: {
    key: string;
    messageI18n: string;
    paths: PathOfFields<F>[];
    args?: Record<string, unknown>;
  }[];
}): FormSpec<M> {
  return spec as unknown as FormSpec<M>;
}
