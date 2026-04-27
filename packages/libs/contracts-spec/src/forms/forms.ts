/* eslint-disable */

import type { AnySchemaModel, ZodSchemaModel } from '@contractspec/lib.schema';
import { compareVersions } from 'compare-versions';
import type { DocBlock } from '../docs/types';
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

export interface AutocompleteOption {
	labelI18n: string;
	value: string | number | boolean;
	descriptionI18n?: string;
	disabled?: boolean;
	data?: Record<string, unknown>;
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

export interface AddressFormValue {
	line1: string;
	line2?: string;
	city?: string;
	region?: string;
	postalCode?: string;
	countryCode?: string;
}

export interface PhoneFormValue {
	countryCode: string;
	nationalNumber: string;
	extension?: string;
	e164?: string;
}

export type AutocompleteValueMapping =
	| { mode: 'scalar'; valueKey?: string }
	| { mode: 'object' }
	| { mode: 'pick'; pickKeys: string[] };

export type AutocompleteSource =
	| {
			kind: 'local';
			options: readonly AutocompleteOption[];
			searchKeys: string[];
	  }
	| {
			kind: 'resolver';
			resolverKey: string;
			deps?: string[];
			args?: Record<string, unknown>;
			searchKeys?: string[];
			minQueryLength?: number;
			debounceMs?: number;
	  };

export interface CompositePartConfig<TKeys extends string> {
	labelsI18n?: Partial<Record<TKeys, string>>;
	placeholdersI18n?: Partial<Record<TKeys, string>>;
}

export type FieldOrientation = 'horizontal' | 'vertical' | 'responsive';

export type ResponsiveColumns =
	| 1
	| 2
	| 3
	| 4
	| {
			base?: 1 | 2 | 3 | 4;
			sm?: 1 | 2 | 3 | 4;
			md?: 1 | 2 | 3 | 4;
			lg?: 1 | 2 | 3 | 4;
	  };

export type ResponsiveColumnBreakpoint = 'sm' | 'md' | 'lg';

export interface ResponsiveFormColumnsOptions {
	breakpoint?: ResponsiveColumnBreakpoint;
	base?: 1;
}

export function responsiveFormColumns(
	columns: Exclude<ResponsiveColumns, object>,
	options: ResponsiveFormColumnsOptions = {}
): ResponsiveColumns {
	const breakpoint = options.breakpoint ?? 'md';
	return {
		base: options.base ?? 1,
		[breakpoint]: columns,
	};
}

export type ResponsiveSpanValue = 1 | 2 | 3 | 4 | 'full';

export type ResponsiveSpan =
	| ResponsiveSpanValue
	| {
			base?: ResponsiveSpanValue;
			sm?: ResponsiveSpanValue;
			md?: ResponsiveSpanValue;
			lg?: ResponsiveSpanValue;
	  };

export interface FormSectionLayoutSpec {
	columns?: ResponsiveColumns;
	gap?: 'sm' | 'md' | 'lg';
	fieldOrientation?: FieldOrientation;
}

export type FormFlowKind = 'sections' | 'steps';

export interface FormSectionSpec {
	key: string;
	titleI18n: string;
	descriptionI18n?: string;
	/** Immediate field names from the surrounding field collection. */
	fieldNames: string[];
	layout?: FormSectionLayoutSpec;
}

export interface FormFlowSpec {
	kind: FormFlowKind;
	sections: FormSectionSpec[];
	previousLabelI18n?: string;
	nextLabelI18n?: string;
}

export interface FormLayoutSpec extends FormSectionLayoutSpec {
	flow?: FormFlowSpec;
}

export interface FieldLayoutSpec {
	colSpan?: ResponsiveSpan;
	orientation?: FieldOrientation;
}

export type InputGroupAddonAlign =
	| 'inline-start'
	| 'inline-end'
	| 'block-start'
	| 'block-end';

export type InputGroupAddonItem =
	| { kind: 'text'; textI18n: string }
	| { kind: 'icon'; iconKey: string; labelI18n?: string };

export interface InputGroupAddonSpec {
	align?: InputGroupAddonAlign;
	items: InputGroupAddonItem[];
}

export interface InputGroupSpec {
	addons?: InputGroupAddonSpec[];
}

export type PasswordFieldPurpose = 'current' | 'new';

export interface PasswordFieldSpec {
	purpose?: PasswordFieldPurpose;
	visibilityToggle?: boolean;
	showLabelI18n?: string;
	hideLabelI18n?: string;
}

export interface BaseFieldSpec {
	/** Field kind discriminator. */
	kind:
		| 'text'
		| 'email'
		| 'textarea'
		| 'select'
		| 'checkbox'
		| 'radio'
		| 'switch'
		| 'autocomplete'
		| 'address'
		| 'phone'
		| 'date'
		| 'time'
		| 'datetime'
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
	layout?: FieldLayoutSpec;
	/** @deprecated Use `layout.orientation`. */
	wrapper?: { orientation?: 'horizontal' | 'vertical' };
	readOnly?: boolean;
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
	inputGroup?: InputGroupSpec;
	password?: PasswordFieldSpec;
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

export interface EmailFieldSpec extends BaseFieldSpec {
	kind: 'email';
	name: string;
	inputGroup?: InputGroupSpec;
	autoComplete?: string;
	maxLength?: number;
	minLength?: number;
}

export interface TextareaFieldSpec extends BaseFieldSpec {
	kind: 'textarea';
	name: string;
	inputGroup?: InputGroupSpec;
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

export interface AutocompleteFieldSpec extends BaseFieldSpec {
	kind: 'autocomplete';
	name: string;
	multiple?: boolean;
	source: AutocompleteSource;
	valueMapping: AutocompleteValueMapping;
}

export interface AddressFieldSpec extends BaseFieldSpec {
	kind: 'address';
	name: string;
	parts?: CompositePartConfig<keyof AddressFormValue>;
	countryOptions?: OptionsSource | readonly FormOption[];
}

export interface PhoneFieldSpec extends BaseFieldSpec {
	kind: 'phone';
	name: string;
	parts?: CompositePartConfig<keyof PhoneFormValue>;
	countryOptions?: OptionsSource | readonly FormOption[];
}

export interface DateFieldSpec extends BaseFieldSpec {
	kind: 'date';
	name: string;
	minDate?: Date;
	maxDate?: Date;
}

export interface TimeFieldSpec extends BaseFieldSpec {
	kind: 'time';
	name: string;
	is24Hour?: boolean;
}

export interface DateTimeFieldSpec extends BaseFieldSpec {
	kind: 'datetime';
	name: string;
	minDate?: Date;
	maxDate?: Date;
	is24Hour?: boolean;
}

export interface GroupFieldSpec extends BaseFieldSpec {
	kind: 'group';
	/** Optional legend/label at group level */
	labelI18n?: string;
	legendI18n?: string;
	layout?: FieldLayoutSpec & FormLayoutSpec;
	fields: FieldSpec[];
}

export interface ArrayFieldSpec extends BaseFieldSpec {
	kind: 'array';
	/** Root-level field that is an array in the model (e.g., "emails") */
	name: string;
	/** Child field spec for each item (e.g., address inside emails[i].address). */
	of: Exclude<FieldSpec, ArrayFieldSpec>;
	min?: number;
	max?: number;
}

export type FieldSpec =
	| TextFieldSpec
	| EmailFieldSpec
	| TextareaFieldSpec
	| SelectFieldSpec
	| CheckboxFieldSpec
	| RadioFieldSpec
	| SwitchFieldSpec
	| AutocompleteFieldSpec
	| AddressFieldSpec
	| PhoneFieldSpec
	| DateFieldSpec
	| TimeFieldSpec
	| DateTimeFieldSpec
	| GroupFieldSpec
	| ArrayFieldSpec;

export interface FormAction {
	key: string;
	labelI18n: string;
	op?: { name: string; version: string };
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
	layout?: FormLayoutSpec;
	policy?: { flags?: string[]; pii?: string[] };
	actions?: FormAction[];
	renderHints?: { ui: 'shadcn' | 'custom'; form: 'react-hook-form' };
	constraints?: ConstraintDecl[];
}

export function isFieldReadOnly(
	field: Pick<BaseFieldSpec, 'readOnly' | 'computeFrom'>
) {
	return field.readOnly ?? field.computeFrom?.readOnly ?? false;
}

export function normalizeFieldSpec<T extends FieldSpec>(field: T): T {
	const normalizedLayout =
		field.layout ??
		(field.wrapper?.orientation
			? ({ orientation: field.wrapper.orientation } satisfies FieldLayoutSpec)
			: undefined);
	const normalizedBase =
		field.readOnly == null && field.computeFrom?.readOnly != null
			? ({
					...field,
					layout: normalizedLayout,
					readOnly: field.computeFrom.readOnly,
				} as T)
			: ({
					...field,
					layout: normalizedLayout,
				} as T);
	if (normalizedBase.kind === 'group') {
		return {
			...normalizedBase,
			fields: normalizedBase.fields.map((child) => normalizeFieldSpec(child)),
		} as T;
	}
	if (normalizedBase.kind === 'array') {
		return {
			...normalizedBase,
			of: normalizeFieldSpec(normalizedBase.of),
		} as T;
	}
	return normalizedBase;
}

export function normalizeFormSpec<M extends AnySchemaModel>(
	spec: FormSpec<M>
): FormSpec<M> {
	return {
		...spec,
		fields: spec.fields.map((field) => normalizeFieldSpec(field)),
	};
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

	get(key: string, version?: string) {
		if (version != null) return this.items.get(`${key}.v${version}`);
		let candidate: FormSpec | undefined;

		for (const [_k, v] of this.items.entries()) {
			// Basic prefix check (can be stricter if needed)
			if (v.meta.key !== key) continue;

			if (
				!candidate ||
				compareVersions(v.meta.version, candidate.meta.version) > 0
			) {
				candidate = v;
			}
		}
		return candidate;
	}

	/** Filter forms by criteria. */
	filter(criteria: import('../registry-utils').RegistryFilter): FormSpec[] {
		const { filterBy } =
			require('../registry-utils') as typeof import('../registry-utils');
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
		const { groupBy } =
			require('../registry-utils') as typeof import('../registry-utils');
		return groupBy(this.list(), keyFn);
	}

	/** Get unique tags from all forms. */
	getUniqueTags(): string[] {
		const { getUniqueTags } =
			require('../registry-utils') as typeof import('../registry-utils');
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

function resolveIndexedPath(
	path: string,
	indices: readonly number[] = []
): string {
	let indexCursor = 0;
	return path.replace(/\$index/g, () => {
		const nextIndex = indices[indexCursor];
		indexCursor += 1;
		return nextIndex == null ? '$index' : String(nextIndex);
	});
}

function toIssuePath(path: string): Array<string | number> {
	return path
		.split('.')
		.filter(Boolean)
		.map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

export function evalPredicate(
	values: unknown,
	pred?: Predicate,
	indices: readonly number[] = []
): boolean {
	if (!pred) return true;
	if (pred.not) return !evalPredicate(values, pred.not, indices);
	if (pred.all && pred.all.length)
		return pred.all.every((p) => evalPredicate(values, p, indices));
	if (pred.anyOf && pred.anyOf.length)
		return pred.anyOf.some((p) => evalPredicate(values, p, indices));
	if (pred.when) {
		const { op = 'truthy', value } = pred.when;
		const path = resolveIndexedPath(pred.when.path, indices);
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
	const normalizedSpec = normalizeFormSpec(spec);
	const base = normalizedSpec.model.getZod();

	return (base as any).superRefine(
		(values: Record<string, unknown>, ctx: any) => {
			const visit = (
				field: FieldSpec,
				parentPath?: string,
				indices: readonly number[] = []
			) => {
				const rawPath = field.name
					? parentPath
						? `${parentPath}.${field.name}`
						: field.name
					: (parentPath ?? '');
				const path = resolveIndexedPath(rawPath, indices);

				// requiredWhen enforcement (UI also shows required)
				if (field.requiredWhen) {
					const should = evalPredicate(values, field.requiredWhen, indices);
					if (should) {
						const v = getAtPath(values, path);
						const empty =
							v == null ||
							(typeof v === 'string' && v.trim().length === 0) ||
							(Array.isArray(v) && v.length === 0);
						if (empty)
							ctx.addIssue({
								code: 'custom',
								path: toIssuePath(path),
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
							path: toIssuePath(path),
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
							path: toIssuePath(path),
							message: `max:${field.max}`,
						});
					}
					if (Array.isArray(arr)) {
						arr.forEach((_item, index) => {
							visit(field.of, `${path}.${index}`, [...indices, index]);
						});
					}
				} else if (field.kind === 'group') {
					for (const child of field.fields) visit(child, path, indices);
				}
			};

			for (const f of normalizedSpec.fields) visit(f);

			// custom constraints
			if (normalizedSpec.constraints && handlers) {
				for (const c of normalizedSpec.constraints) {
					const fn = handlers[c.key];
					if (!fn) continue;
					const res = fn(values, c.paths, c.args);
					if (!res.ok) {
						ctx.addIssue({
							code: 'custom',
							path: toIssuePath(res.path ?? c.paths[0] ?? ''),
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

type JoinPath<Prefix extends string, Name extends string> = Prefix extends ''
	? Name
	: `${Prefix}.${Name}`;

type PathOfArrayItem<
	Field extends AnyFieldLike,
	Prefix extends string,
> = Field extends {
	kind: 'group';
	fields: infer G extends readonly AnyFieldLike[];
}
	? PathOfFields<G, Prefix>
	: Field extends {
				name: infer N extends string;
				fields: infer G extends readonly AnyFieldLike[];
			}
		? JoinPath<Prefix, N> | PathOfFields<G, JoinPath<Prefix, N>>
		: Field extends {
					name: infer N extends string;
				}
			? JoinPath<Prefix, N>
			: never;

type PathOfField<
	Field extends AnyFieldLike,
	Prefix extends string = '',
> = Field extends {
	kind: 'group';
	name: infer N extends string;
	fields: infer G extends readonly AnyFieldLike[];
}
	? JoinPath<Prefix, N> | PathOfFields<G, JoinPath<Prefix, N>>
	: Field extends {
				kind: 'group';
				fields: infer G extends readonly AnyFieldLike[];
			}
		? PathOfFields<G, Prefix>
		: Field extends {
					kind: 'array';
					name: infer N extends string;
					of: infer O extends AnyFieldLike;
				}
			?
					| JoinPath<Prefix, N>
					| PathOfArrayItem<O, JoinPath<Prefix, `${N}.$index`>>
			: Field extends {
						name: infer N extends string;
					}
				? JoinPath<Prefix, N>
				: never;

type PathOfFields<
	Fields extends readonly AnyFieldLike[],
	Prefix extends string = '',
> = Fields[number] extends infer Field extends AnyFieldLike
	? PathOfField<Field, Prefix>
	: never;

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

export type TypedAutocompleteSource<P extends string> =
	| {
			kind: 'local';
			options: readonly AutocompleteOption[];
			searchKeys: string[];
	  }
	| {
			kind: 'resolver';
			resolverKey: string;
			deps?: P[];
			args?: Record<string, unknown>;
			searchKeys?: string[];
			minQueryLength?: number;
			debounceMs?: number;
	  };

type EnhanceField<Field extends AnyFieldLike, P extends string> = Field & {
	visibleWhen?: TypedPredicate<P>;
	enabledWhen?: TypedPredicate<P>;
	requiredWhen?: TypedPredicate<P>;
	layout?: FieldLayoutSpec;
	readOnly?: boolean;
} & (Field extends { kind: 'select' }
		? { options: TypedOptionsSource<P> | readonly FormOption[] }
		: unknown) &
	(Field extends { kind: 'radio' }
		? { options: TypedOptionsSource<P> | readonly FormOption[] }
		: unknown) &
	(Field extends { kind: 'text' } | { kind: 'email' } | { kind: 'textarea' }
		? { inputGroup?: InputGroupSpec }
		: unknown) &
	(Field extends { kind: 'autocomplete' }
		? { source: TypedAutocompleteSource<P> }
		: unknown) &
	(Field extends {
		kind: 'group';
		fields: infer G extends readonly AnyFieldLike[];
	}
		? {
				fields: EnhanceFields<G, P>;
				layout?: FieldLayoutSpec & FormLayoutSpec;
				legendI18n?: string;
			}
		: unknown) &
	(Field extends { kind: 'array'; of: infer O extends AnyFieldLike }
		? { of: EnhanceField<O, P> }
		: unknown) & {
		computeFrom?: {
			computeKey: string;
			deps: P[];
			mode?: 'change' | 'blur-xs' | 'submit';
			readOnly?: boolean;
		};
	};

export type EnhanceFields<
	F extends readonly AnyFieldLike[],
	P extends string,
> = { [K in keyof F]: EnhanceField<F[K], P> };

export function defineFormSpec<
	M extends AnySchemaModel,
	F extends readonly AnyFieldLike[],
>(spec: {
	meta: FormSpec<M>['meta'];
	model: M;
	fields: EnhanceFields<F, PathOfFields<F>>;
	layout?: FormSpec<M>['layout'];
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

export const tech_contracts_forms_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.forms',
		title: 'Contracts: FormSpec',
		summary:
			'This document defines the canonical contracts for declarative forms.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/forms',
		tags: ['tech', 'contracts', 'forms'],
		body: `# Contracts: FormSpec

This document defines the canonical contracts for declarative forms.

## Overview

- \`FormSpec\` (in \`@contractspec/lib.contracts-spec/forms\`) declares:
  - \`meta\` (extends \`OwnerShipMeta\`) + \`key\`/\`version\` for stability.
  - \`model\` (\`@contractspec/lib.schema\` \`SchemaModel\`) as the single source of truth.
  - \`fields\` built from \`FieldSpec\` kinds: \`text\`, \`email\`, \`textarea\`, \`select\`, \`checkbox\`, \`radio\`, \`switch\`, \`autocomplete\`, \`address\`, \`phone\`, \`date\`, \`time\`, \`datetime\`, \`group\`, \`array\`.
  - \`text.password\` for masked current/new password fields with password-manager hints.
  - field-level \`readOnly\` support that preserves submitted values.
  - Optional \`layout\`, \`layout.flow\`, \`actions\`, \`policy.flags\`, \`constraints\` and \`renderHints\`.
- Relations DSL provides \`visibleWhen\`, \`enabledWhen\`, \`requiredWhen\` based on predicates.
- \`buildZodWithRelations(spec)\` augments the base zod with conditional rules and constraints.
- React adapter renders with React Hook Form + driver API for UI components.

## Rich field contracts

- \`autocomplete\` supports local filtering or resolver-backed search, including debounce/min-query hints and configurable submit-value mapping.
- Resolver-backed autocomplete stays runtime-neutral: forms declare \`resolverKey\`, dependency paths, and optional args while host renderers provide the actual fetcher.
- \`email\` represents one string email-address field; schema validation remains model-owned while renderers supply email input affordances.
- \`address\` uses the canonical \`AddressFormValue\` object shape.
- \`phone\` uses the canonical \`PhoneFormValue\` object shape.
- \`date\`, \`time\`, and \`datetime\` map directly to the corresponding schema scalar intent.
- \`array\` remains the canonical dynamic-field primitive and can repeat grouped item layouts.
- \`text\` can declare \`password.purpose\` as \`current\` or \`new\`; renderers map those to masked controls and \`current-password\` / \`new-password\` autocomplete hints.

## Progressive form layout

- \`layout.flow.kind: "sections"\` groups existing fields into accessible sections while keeping all sections visible.
- \`layout.flow.kind: "steps"\` uses the same section metadata for progressive, one-section-at-a-time rendering.
- \`FormSectionSpec.fieldNames\` references existing immediate field names; field definitions stay in \`FormSpec.fields\`.
- Unlisted fields remain visible so flow metadata cannot accidentally drop required model inputs.
- \`text\` and \`textarea\` can declare portable \`inputGroup\` addons for text and host-resolved icons.

## Layout and Groups

- \`FormSpec.layout\` and \`group.layout\` can declare 1-4 responsive columns, gap size, and default field orientation.
- \`field.layout.colSpan\` lets fields span one or more grid columns or the full row.
- \`wrapper.orientation\` remains a compatibility alias for \`layout.orientation\`.
- \`group.legendI18n\` renders as the semantic legend, falling back to \`labelI18n\`.

## Driver API (UI-agnostic)

Host apps supply a driver mapping slots to components:

- Required: \`Field\`, \`FieldLabel\`, \`FieldDescription\`, \`FieldError\`, \`Input\`, \`Textarea\`, \`Select\`, \`Checkbox\`, \`RadioGroup\`, \`Switch\`, \`Autocomplete\`, \`AddressField\`, \`PhoneField\`, \`DateField\`, \`TimeField\`, \`DateTimeField\`, \`Button\`.
- Optional: \`FieldContent\`, \`FieldGroup\`, \`FieldSet\`, \`FieldLegend\`, \`FieldSeparator\`, \`InputGroup\`, \`InputGroupAddon\`, \`InputGroupInput\`, \`InputGroupTextarea\`, \`InputGroupText\`, \`InputGroupIcon\`, and \`PasswordInput\`.
- Autocomplete drivers should accept optional \`loading\`, \`error\`, \`emptyText\`, \`loadingText\`, and \`errorText\` props so resolver-backed fields can expose async state without embedding transport details in the contract.

Use \`createFormRenderer({ driver })\` to obtain a \`render(spec)\` function.

## Arrays and Groups

- \`array\` items are rendered with \`useFieldArray\`, honoring \`min\`/\`max\` and add/remove controls.
- \`array.of\` can repeat grouped multi-field rows.
- \`group\` composes nested fields and provides optional legend/description/layout.

## Feature Flags

- Declare \`policy.flags\` on forms to signal gating. Gate usage at host boundary; avoid scattering flags across individual fields.

## Example

Use the exported \`RichFieldsShowcaseForm\` as the canonical reference for readonly, password, autocomplete, address, phone, temporal, layout, and input-group field authoring.
`,
	},
];
