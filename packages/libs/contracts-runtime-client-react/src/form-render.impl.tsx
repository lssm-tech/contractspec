'use client';

import type {
	AddressFieldSpec,
	AddressFormValue,
	ArrayFieldSpec,
	AutocompleteFieldSpec,
	AutocompleteOption,
	CurrencyFieldSpec,
	DateFieldSpec,
	DateTimeFieldSpec,
	DurationFieldSpec,
	EmailFieldSpec,
	FieldSpec,
	FormFlowSpec,
	FormLayoutSpec,
	FormOption,
	FormSectionSpec,
	FormSpec,
	FormValuesFor,
	InputGroupAddonSpec,
	InputGroupSpec,
	NumberFieldSpec,
	OptionsSource,
	PercentFieldSpec,
	PhoneFieldSpec,
	PhoneFormValue,
	RadioFieldSpec,
	SelectFieldSpec,
	TextareaFieldSpec,
	TextFieldSpec,
	TimeFieldSpec,
} from '@contractspec/lib.contracts-spec/forms';
import {
	buildZodWithRelations,
	evalPredicate,
	isFieldReadOnly,
	normalizeFormSpec,
} from '@contractspec/lib.contracts-spec/forms';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
	Controller,
	type FieldValues,
	type Resolver,
	type UseFormReturn,
	useFieldArray,
	useForm,
} from 'react-hook-form';

type FormFieldValues<M extends AnySchemaModel> = FormValuesFor<M> & FieldValues;

type NumericFieldSlotProps = React.InputHTMLAttributes<HTMLInputElement> & {
	format?:
		| NumberFieldSpec['format']
		| PercentFieldSpec['format']
		| CurrencyFieldSpec['format']
		| DurationFieldSpec['format'];
	valueScale?: PercentFieldSpec['valueScale'];
	valueUnit?: DurationFieldSpec['valueUnit'];
};

export interface DriverSlots {
	FormRoot?: React.ComponentType<
		React.PropsWithChildren<{
			className?: string;
			onSubmit?: React.FormEventHandler;
		}>
	>;
	Field: React.ComponentType<
		React.PropsWithChildren<{
			className?: string;
			orientation?: 'vertical' | 'horizontal' | 'responsive';
			layout?: FieldSpec['layout'];
			'data-invalid'?: boolean;
			'data-disabled'?: boolean;
			hidden?: boolean;
			disabled?: boolean;
		}>
	>;
	FieldLabel: React.ComponentType<
		React.PropsWithChildren<{ htmlFor?: string }>
	>;
	FieldContent?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	FieldDescription: React.ComponentType<
		React.PropsWithChildren<{ id?: string }>
	>;
	FieldError: React.ComponentType<{
		id?: string;
		errors: { message?: string }[];
	}>;
	FieldGroup?: React.ComponentType<
		React.PropsWithChildren<{ className?: string; layout?: FormLayoutSpec }>
	>;
	FieldSet?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	FieldLegend?: React.ComponentType<
		React.PropsWithChildren<{ variant?: 'label' | 'legend' }>
	>;
	FieldSeparator?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	FieldArray?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	FieldArrayItem?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	Actions?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	Input: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
	NumberField?: React.ComponentType<NumericFieldSlotProps>;
	PercentField?: React.ComponentType<NumericFieldSlotProps>;
	CurrencyField?: React.ComponentType<NumericFieldSlotProps>;
	DurationField?: React.ComponentType<NumericFieldSlotProps>;
	Textarea: React.ComponentType<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>
	>;
	InputGroup?: React.ComponentType<
		React.PropsWithChildren<{ className?: string }>
	>;
	InputGroupAddon?: React.ComponentType<
		React.PropsWithChildren<{
			align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
			className?: string;
		}>
	>;
	InputGroupInput?: React.ComponentType<
		React.InputHTMLAttributes<HTMLInputElement>
	>;
	InputGroupTextarea?: React.ComponentType<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>
	>;
	InputGroupText?: React.ComponentType<React.PropsWithChildren<object>>;
	InputGroupIcon?: React.ComponentType<{
		iconKey: string;
		label?: string;
	}>;
	PasswordInput?: React.ComponentType<
		React.InputHTMLAttributes<HTMLInputElement> & {
			passwordPurpose?: 'current' | 'new';
			visibilityToggle?: boolean;
			showLabelI18n?: string;
			hideLabelI18n?: string;
		}
	>;
	Select: React.ComponentType<
		{
			id?: string;
			name?: string;
			value?: unknown;
			onChange?: (value: unknown) => void;
			disabled?: boolean;
			'aria-invalid'?: boolean;
			'aria-describedby'?: string;
			options: FormOption[];
		} & Record<string, unknown>
	>;
	Checkbox: React.ComponentType<
		{
			id?: string;
			name?: string;
			checked?: boolean;
			onCheckedChange?: (value: boolean) => void;
			disabled?: boolean;
			'aria-invalid'?: boolean;
			'aria-describedby'?: string;
		} & Record<string, unknown>
	>;
	RadioGroup: React.ComponentType<
		{
			id?: string;
			name?: string;
			value?: unknown;
			onValueChange?: (value: unknown) => void;
			disabled?: boolean;
			'aria-invalid'?: boolean;
			'aria-describedby'?: string;
			options: FormOption[];
		} & Record<string, unknown>
	>;
	Switch: React.ComponentType<
		{
			id?: string;
			name?: string;
			checked?: boolean;
			onCheckedChange?: (value: boolean) => void;
			disabled?: boolean;
			'aria-invalid'?: boolean;
			'aria-describedby'?: string;
		} & Record<string, unknown>
	>;
	Autocomplete: React.ComponentType<{
		id?: string;
		name?: string;
		disabled?: boolean;
		readOnly?: boolean;
		'aria-invalid'?: boolean;
		'aria-describedby'?: string;
		placeholder?: string;
		multiple?: boolean;
		query: string;
		options: AutocompleteOption[];
		selectedOptions: AutocompleteOption[];
		loading?: boolean;
		error?: string | null;
		emptyText?: string;
		loadingText?: string;
		errorText?: string;
		onQueryChange?: (query: string) => void;
		onSelectOption?: (option: AutocompleteOption) => void;
		onRemoveOption?: (option: AutocompleteOption) => void;
	}>;
	AddressField: React.ComponentType<{
		id?: string;
		name?: string;
		value?: AddressFormValue | null;
		onChange?: (value: AddressFormValue) => void;
		disabled?: boolean;
		readOnly?: boolean;
		'aria-invalid'?: boolean;
		'aria-describedby'?: string;
		parts?: AddressFieldSpec['parts'];
		countryOptions?: FormOption[];
	}>;
	PhoneField: React.ComponentType<{
		id?: string;
		name?: string;
		value?: PhoneFormValue | null;
		onChange?: (value: PhoneFormValue) => void;
		disabled?: boolean;
		readOnly?: boolean;
		'aria-invalid'?: boolean;
		'aria-describedby'?: string;
		parts?: PhoneFieldSpec['parts'];
		countryOptions?: FormOption[];
		input?: PhoneFieldSpec['input'];
		output?: PhoneFieldSpec['output'];
		country?: PhoneFieldSpec['country'];
		display?: PhoneFieldSpec['display'];
	}>;
	DateField: React.ComponentType<{
		id?: string;
		name?: string;
		value?: Date | null;
		onChange?: (value: Date | null) => void;
		disabled?: boolean;
		readOnly?: boolean;
		'aria-invalid'?: boolean;
		'aria-describedby'?: string;
		placeholder?: string;
		minDate?: Date | string;
		maxDate?: Date | string;
		format?: DateFieldSpec['format'];
	}>;
	TimeField: React.ComponentType<{
		id?: string;
		name?: string;
		value?: Date | null;
		onChange?: (value: Date | null) => void;
		disabled?: boolean;
		readOnly?: boolean;
		'aria-invalid'?: boolean;
		'aria-describedby'?: string;
		placeholder?: string;
		is24Hour?: boolean;
		format?: TimeFieldSpec['format'];
	}>;
	DateTimeField: React.ComponentType<{
		id?: string;
		name?: string;
		value?: Date | null;
		onChange?: (value: Date | null) => void;
		disabled?: boolean;
		readOnly?: boolean;
		'aria-invalid'?: boolean;
		'aria-describedby'?: string;
		datePlaceholder?: string;
		timePlaceholder?: string;
		minDate?: Date | string;
		maxDate?: Date | string;
		is24Hour?: boolean;
		format?: DateTimeFieldSpec['format'];
	}>;
	Button: React.ComponentType<
		React.PropsWithChildren<{
			type?: 'button' | 'submit' | 'reset';
			variant?: string;
			size?: string;
			onClick?: () => void;
			disabled?: boolean;
		}>
	>;
}

export type ResolverMap<TValues> = Record<
	string,
	(
		values: TValues,
		args?: Record<string, unknown>
	) => Promise<readonly unknown[]> | readonly unknown[]
>;

export type ComputationMap<TValues> = Record<
	string,
	(values: TValues) => unknown
>;

export interface PhoneRendererOptions {
	input?: PhoneFieldSpec['input'];
	output?: PhoneFieldSpec['output'];
	country?: PhoneFieldSpec['country'];
	display?: PhoneFieldSpec['display'];
}

export interface CreateRendererOptions<TValues = Record<string, unknown>> {
	driver: DriverSlots;
	formOptions?: Record<string, unknown>;
	onSubmitOverride?: (
		values: TValues,
		actionKey: string
	) => Promise<void> | void;
	activeFlags?: string[];
	resolvers?: ResolverMap<TValues>;
	computations?: ComputationMap<TValues>;
	phone?: PhoneRendererOptions;
	unmountStrategy?: 'keep' | 'clear';
	submitMode?: 'form' | 'button';
}

export interface RenderOptions<TValues = Record<string, unknown>> {
	defaultValues?: Partial<TValues>;
	overrides?: Partial<CreateRendererOptions<TValues>>;
}

function toOptionsArray(
	src: OptionsSource | readonly FormOption[] | undefined
): OptionsSource | undefined {
	if (!src) return undefined;
	if (Array.isArray(src)) {
		return { kind: 'static', options: [...src] };
	}
	return src as OptionsSource;
}

function getAtPath(values: unknown, path: string): unknown {
	if (!path) return undefined;
	const segs = path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean);
	let cur: unknown = values;
	for (const seg of segs) {
		if (cur == null) return undefined;
		cur = (cur as Record<string, unknown>)[seg];
	}
	return cur;
}

function extractIndices(path: string | undefined) {
	if (!path) return [] as number[];
	return path
		.split('.')
		.filter((segment) => /^\d+$/.test(segment))
		.map((segment) => Number(segment));
}

function fieldPath(parent: string | undefined, name?: string) {
	if (!name) return parent ?? '';
	return parent ? `${parent}.${name}` : name;
}

function joinClassNames(...values: Array<string | undefined | false>) {
	return values.filter(Boolean).join(' ') || undefined;
}

const GRID_COLUMN_CLASSES = {
	base: {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
	},
	sm: {
		1: 'sm:grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-3',
		4: 'sm:grid-cols-4',
	},
	md: {
		1: 'md:grid-cols-1',
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
	},
	lg: {
		1: 'lg:grid-cols-1',
		2: 'lg:grid-cols-2',
		3: 'lg:grid-cols-3',
		4: 'lg:grid-cols-4',
	},
} as const;

const GRID_SPAN_CLASSES = {
	base: {
		1: 'col-span-1',
		2: 'col-span-2',
		3: 'col-span-3',
		4: 'col-span-4',
		full: 'col-span-full',
	},
	sm: {
		1: 'sm:col-span-1',
		2: 'sm:col-span-2',
		3: 'sm:col-span-3',
		4: 'sm:col-span-4',
		full: 'sm:col-span-full',
	},
	md: {
		1: 'md:col-span-1',
		2: 'md:col-span-2',
		3: 'md:col-span-3',
		4: 'md:col-span-4',
		full: 'md:col-span-full',
	},
	lg: {
		1: 'lg:col-span-1',
		2: 'lg:col-span-2',
		3: 'lg:col-span-3',
		4: 'lg:col-span-4',
		full: 'lg:col-span-full',
	},
} as const;

const GRID_GAP_CLASSES = {
	sm: 'gap-3',
	md: 'gap-4',
	lg: 'gap-6',
} as const;

function formLayoutClassName(layout?: FormLayoutSpec) {
	if (!layout?.columns) return undefined;
	const columnClasses =
		typeof layout.columns === 'number'
			? GRID_COLUMN_CLASSES.base[layout.columns]
			: joinClassNames(
					layout.columns.base
						? GRID_COLUMN_CLASSES.base[layout.columns.base]
						: undefined,
					layout.columns.sm
						? GRID_COLUMN_CLASSES.sm[layout.columns.sm]
						: undefined,
					layout.columns.md
						? GRID_COLUMN_CLASSES.md[layout.columns.md]
						: undefined,
					layout.columns.lg
						? GRID_COLUMN_CLASSES.lg[layout.columns.lg]
						: undefined
				);

	return joinClassNames(
		'grid w-full',
		columnClasses,
		GRID_GAP_CLASSES[layout.gap ?? 'md']
	);
}

function fieldLayoutClassName(layout?: FieldSpec['layout']) {
	if (!layout?.colSpan) return undefined;
	const colSpan = layout.colSpan;
	if (typeof colSpan === 'number' || colSpan === 'full') {
		return GRID_SPAN_CLASSES.base[colSpan];
	}
	return joinClassNames(
		colSpan.base ? GRID_SPAN_CLASSES.base[colSpan.base] : undefined,
		colSpan.sm ? GRID_SPAN_CLASSES.sm[colSpan.sm] : undefined,
		colSpan.md ? GRID_SPAN_CLASSES.md[colSpan.md] : undefined,
		colSpan.lg ? GRID_SPAN_CLASSES.lg[colSpan.lg] : undefined
	);
}

function ariaDescribedBy(
	descriptionId: string | undefined,
	errorId: string | undefined,
	invalid: boolean
) {
	return (
		[descriptionId, invalid ? errorId : undefined].filter(Boolean).join(' ') ||
		undefined
	);
}

function DefaultFieldGroup({
	children,
	className,
}: React.PropsWithChildren<{ className?: string; layout?: FormLayoutSpec }>) {
	return <div className={className}>{children}</div>;
}

function fieldCollectionKey(field: FieldSpec, index: number) {
	return field.name ?? `${field.kind}-${index}`;
}

function partitionFlowFields(fields: readonly FieldSpec[], flow: FormFlowSpec) {
	const claimed = new Set<number>();
	const sections = flow.sections
		.map((section) => {
			const sectionFields = section.fieldNames
				.map((fieldName) => {
					const index = fields.findIndex(
						(candidate, candidateIndex) =>
							!claimed.has(candidateIndex) && candidate.name === fieldName
					);
					if (index < 0) return undefined;
					claimed.add(index);
					return { field: fields[index] as FieldSpec, index };
				})
				.filter((value): value is FieldCollectionEntry => value != null);

			return { section, fields: sectionFields };
		})
		.filter((entry) => entry.fields.length > 0);

	const unlistedFields = fields
		.map((field, index) => ({ field, index }))
		.filter((entry) => !claimed.has(entry.index));

	return { sections, unlistedFields };
}

function getRenderableFlowSectionCount(
	fields: readonly FieldSpec[],
	flow: FormFlowSpec | undefined
) {
	if (!flow) return 0;
	return partitionFlowFields(fields, flow).sections.length;
}

function clampStepIndex(index: number, sectionCount: number) {
	return Math.min(Math.max(index, 0), Math.max(sectionCount - 1, 0));
}

interface FieldCollectionEntry {
	field: FieldSpec;
	index: number;
}

interface FieldCollectionRendererProps {
	driver: DriverSlots;
	fields: readonly FieldSpec[];
	layout?: FormLayoutSpec;
	parent?: string;
	idBase: string;
	renderField: (
		field: FieldSpec,
		parent?: string,
		parentLayout?: FormLayoutSpec,
		fallbackId?: string
	) => React.ReactElement | null;
	activeStepIndex?: number;
	onActiveStepIndexChange?: (index: number) => void;
}

function FieldCollectionRenderer({
	driver,
	fields,
	layout,
	parent,
	idBase,
	renderField,
	activeStepIndex,
	onActiveStepIndexChange,
}: FieldCollectionRendererProps) {
	const [localStepIndex, setLocalStepIndex] = React.useState(0);
	const FieldGroup = driver.FieldGroup ?? DefaultFieldGroup;
	const FieldSet = driver.FieldSet ?? 'div';
	const FieldLegend = driver.FieldLegend;
	const flow = layout?.flow;
	const fieldEntries = fields.map((field, index) => ({ field, index }));

	const renderPlainFields = (plainFields: readonly FieldCollectionEntry[]) => (
		<FieldGroup layout={layout} className={formLayoutClassName(layout)}>
			{plainFields.map(({ field, index }) => (
				<React.Fragment key={fieldCollectionKey(field, index)}>
					{renderField(field, parent, layout, `${idBase}-${index}`)}
				</React.Fragment>
			))}
		</FieldGroup>
	);

	if (!flow?.sections.length) {
		return renderPlainFields(fieldEntries);
	}

	const { sections, unlistedFields } = partitionFlowFields(fields, flow);
	if (sections.length === 0) {
		return renderPlainFields(fieldEntries);
	}

	const stepIndex = clampStepIndex(
		activeStepIndex ?? localStepIndex,
		sections.length
	);
	const setStepIndex = onActiveStepIndexChange ?? setLocalStepIndex;

	const renderSection = (
		section: FormSectionSpec,
		sectionFields: readonly FieldCollectionEntry[]
	) => {
		const sectionLayout = section.layout ?? layout;
		const descriptionId = section.descriptionI18n
			? `${idBase}-${section.key}-description`
			: undefined;
		return (
			<FieldSet
				key={section.key}
				className={fieldLayoutClassName({ colSpan: 'full' })}
			>
				{FieldLegend ? (
					<FieldLegend variant="legend">{section.titleI18n}</FieldLegend>
				) : (
					<driver.FieldLabel>{section.titleI18n}</driver.FieldLabel>
				)}
				{section.descriptionI18n ? (
					<driver.FieldDescription id={descriptionId}>
						{section.descriptionI18n}
					</driver.FieldDescription>
				) : null}
				<FieldGroup
					layout={sectionLayout}
					className={formLayoutClassName(sectionLayout)}
				>
					{sectionFields.map(({ field, index }) => (
						<React.Fragment key={fieldCollectionKey(field, index)}>
							{renderField(field, parent, sectionLayout, `${idBase}-${index}`)}
						</React.Fragment>
					))}
				</FieldGroup>
			</FieldSet>
		);
	};

	if (flow.kind === 'steps') {
		const activeSection = sections[stepIndex];
		return (
			<>
				<div className="flex flex-wrap gap-2" data-slot="form-steps">
					{sections.map(({ section }, index) => (
						<driver.Button
							key={section.key}
							type="button"
							variant={index === stepIndex ? 'default' : 'outline'}
							size="sm"
							onClick={() => setStepIndex(index)}
						>
							{section.titleI18n}
						</driver.Button>
					))}
				</div>
				{activeSection
					? renderSection(activeSection.section, activeSection.fields)
					: null}
				<div className="flex flex-wrap gap-2" data-slot="form-step-actions">
					<driver.Button
						type="button"
						variant="outline"
						size="sm"
						disabled={stepIndex <= 0}
						onClick={() =>
							setStepIndex(clampStepIndex(stepIndex - 1, sections.length))
						}
					>
						{flow.previousLabelI18n ?? 'Previous'}
					</driver.Button>
					<driver.Button
						type="button"
						variant="outline"
						size="sm"
						disabled={stepIndex >= sections.length - 1}
						onClick={() =>
							setStepIndex(clampStepIndex(stepIndex + 1, sections.length))
						}
					>
						{flow.nextLabelI18n ?? 'Next'}
					</driver.Button>
				</div>
				{unlistedFields.length ? renderPlainFields(unlistedFields) : null}
			</>
		);
	}

	return (
		<>
			{sections.map(({ section, fields: sectionFields }) =>
				renderSection(section, sectionFields)
			)}
			{unlistedFields.length ? renderPlainFields(unlistedFields) : null}
		</>
	);
}

function makeDepsKey(values: unknown, deps: string[] | undefined) {
	if (!deps || deps.length === 0) return '[]';
	try {
		return JSON.stringify(deps.map((dep) => getAtPath(values, dep)));
	} catch {
		return '[]';
	}
}

function useDebouncedValue<T>(value: T, delayMs: number) {
	const [debounced, setDebounced] = React.useState(value);
	React.useEffect(() => {
		const timeout = globalThis.setTimeout(() => setDebounced(value), delayMs);
		return () => globalThis.clearTimeout(timeout);
	}, [delayMs, value]);
	return debounced;
}

function useResolvedOptions<TValues>(
	values: TValues,
	source: OptionsSource | undefined,
	resolvers?: ResolverMap<TValues>
) {
	const [options, setOptions] = React.useState<FormOption[]>([]);
	const depKey = React.useMemo(() => {
		if (!source) return 'nil';
		if (source.kind === 'static') return JSON.stringify(source.options ?? []);
		return `${source.resolverKey}:${makeDepsKey(values, source.deps)}`;
	}, [source, values]);

	React.useEffect(() => {
		let mounted = true;
		const resolve = async () => {
			if (!source) {
				setOptions([]);
				return;
			}
			if (source.kind === 'static') {
				setOptions([...(source.options ?? [])]);
				return;
			}
			const resolver = resolvers?.[source.resolverKey];
			if (!resolver) {
				setOptions([]);
				return;
			}
			const next = await resolver(values, source.args);
			if (mounted) {
				setOptions([...((next as FormOption[] | undefined) ?? [])]);
			}
		};
		void resolve();
		return () => {
			mounted = false;
		};
	}, [depKey, resolvers, source, values]);

	return options;
}

function coerceDateValue(value: unknown) {
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) return parsed;
	}
	return null;
}

function parseTimeValue(value: unknown) {
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
	if (typeof value !== 'string' || value.trim().length === 0) return null;
	const [hoursRaw, minutesRaw] = value.split(':').map((part) => Number(part));
	const hours = hoursRaw ?? Number.NaN;
	const minutes = minutesRaw ?? Number.NaN;
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
	const next = new Date();
	next.setHours(hours, minutes, 0, 0);
	return next;
}

function serializeTimeValue(value: Date | null) {
	if (!value) return '';
	return `${String(value.getHours()).padStart(2, '0')}:${String(
		value.getMinutes()
	).padStart(2, '0')}`;
}

function autocompleteOptionRecord(option: AutocompleteOption) {
	return {
		value: option.value,
		labelI18n: option.labelI18n,
		descriptionI18n: option.descriptionI18n,
		...(option.data ?? {}),
	};
}

export function filterAutocompleteOptions(
	options: readonly AutocompleteOption[],
	query: string,
	searchKeys: string[]
) {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return [...options];
	const terms = normalized.split(/\s+/).filter(Boolean);
	return options.filter((option) => {
		const record = autocompleteOptionRecord(option);
		const haystack = [
			option.labelI18n,
			option.descriptionI18n,
			String(option.value),
			...searchKeys.map((key) => String(getAtPath(record, key) ?? '')),
		]
			.join(' ')
			.toLowerCase();
		return terms.every((term) => haystack.includes(term));
	});
}

export function mapAutocompleteValue(
	option: AutocompleteOption,
	mapping: AutocompleteFieldSpec['valueMapping']
) {
	const record = autocompleteOptionRecord(option);
	switch (mapping.mode) {
		case 'scalar':
			return mapping.valueKey
				? (getAtPath(record, mapping.valueKey) ?? option.value)
				: option.value;
		case 'pick':
			return Object.fromEntries(
				mapping.pickKeys.map((key) => [key, getAtPath(record, key)])
			);
		case 'object':
		default:
			return option.data ?? record;
	}
}

function sameSelection(left: unknown, right: unknown) {
	try {
		return JSON.stringify(left) === JSON.stringify(right);
	} catch {
		return left === right;
	}
}

function selectedAutocompleteOptions(
	options: readonly AutocompleteOption[],
	value: unknown,
	mapping: AutocompleteFieldSpec['valueMapping'],
	multiple?: boolean
) {
	const values = multiple && Array.isArray(value) ? value : [value];
	return options.filter((option) =>
		values.some((candidate) =>
			sameSelection(mapAutocompleteValue(option, mapping), candidate)
		)
	);
}

function autocompleteOptionKey(option: AutocompleteOption) {
	return String(option.value);
}

function mergeAutocompleteOptions(
	options: readonly AutocompleteOption[],
	cached: readonly AutocompleteOption[]
) {
	const seen = new Set<string>();
	const merged: AutocompleteOption[] = [];
	for (const option of [...options, ...cached]) {
		const key = autocompleteOptionKey(option);
		if (seen.has(key)) continue;
		seen.add(key);
		merged.push(option);
	}
	return merged;
}

function autocompleteResolverErrorMessage(error: unknown) {
	if (error instanceof Error && error.message.trim()) return error.message;
	if (typeof error === 'string' && error.trim()) return error;
	return 'Unable to load options.';
}

function autocompleteDependencyArgs<TValues>(
	values: TValues,
	deps: readonly string[] | undefined
) {
	return Object.fromEntries(
		(deps ?? []).map((path) => [path, getAtPath(values, path)])
	);
}

function normalizePhoneValue(value: PhoneFormValue | null | undefined) {
	if (!value) {
		return {
			countryCode: '',
			nationalNumber: '',
		} satisfies PhoneFormValue;
	}
	const trimmedCountry = value.countryCode.trim();
	const digits = value.nationalNumber.replace(/\D+/g, '');
	const canDeriveE164 = Boolean(
		trimmedCountry &&
			digits &&
			(trimmedCountry.startsWith('+') || /^\d+$/.test(trimmedCountry))
	);
	const next: PhoneFormValue = {
		...value,
		countryCode: trimmedCountry,
		countryIso2: value.countryIso2?.trim().toUpperCase(),
		nationalNumber: value.nationalNumber,
	};
	if (value.e164 != null) {
		next.e164 = value.e164;
	} else if (canDeriveE164) {
		next.e164 = `${trimmedCountry.replace(/^\+?/, '+')}${digits}`;
	}
	return next;
}

function mergePhoneOptions(
	spec: PhoneFieldSpec,
	defaults?: PhoneRendererOptions
): PhoneRendererOptions {
	return {
		input: { ...defaults?.input, ...spec.input },
		output: { ...defaults?.output, ...spec.output },
		country: { ...defaults?.country, ...spec.country },
		display: { ...defaults?.display, ...spec.display },
	};
}

function stringAtPath(values: unknown, path: string | undefined) {
	if (!path) return undefined;
	const value = getAtPath(values, path);
	return value == null ? undefined : String(value);
}

function readPhoneValue<TValues extends FieldValues>(props: {
	fieldValue: unknown;
	values: TValues;
	config: PhoneRendererOptions;
}) {
	const output = props.config.output;
	if (output?.mode === 'split') {
		const nationalNumber =
			stringAtPath(props.values, output.nationalNumberName) ??
			(props.fieldValue == null ? '' : String(props.fieldValue));
		return normalizePhoneValue({
			countryCode: stringAtPath(props.values, output.countryCodeName) ?? '',
			countryIso2: stringAtPath(props.values, output.countryIso2Name),
			nationalNumber,
			e164: stringAtPath(props.values, output.e164Name),
		});
	}
	if (typeof props.fieldValue === 'string') {
		return normalizePhoneValue({
			countryCode: '',
			nationalNumber: props.fieldValue.startsWith('+') ? '' : props.fieldValue,
			e164: props.fieldValue.startsWith('+') ? props.fieldValue : undefined,
		});
	}
	return normalizePhoneValue(
		(props.fieldValue as PhoneFormValue | null | undefined) ?? null
	);
}

function countryCodeOutput(
	value: PhoneFormValue,
	output?: PhoneFieldSpec['output']
) {
	return output?.countryCodeFormat === 'iso2'
		? (value.countryIso2 ?? '')
		: value.countryCode;
}

function setPhonePath<TValues extends FieldValues>(
	form: UseFormReturn<TValues>,
	path: string | undefined,
	value: string
) {
	if (!path) return;
	form.setValue(path as never, value as never, {
		shouldDirty: true,
		shouldValidate: true,
	});
}

function writeLinkedPhonePaths<TValues extends FieldValues>(props: {
	form: UseFormReturn<TValues>;
	ctxName: string;
	fieldOnChange: (value: unknown) => void;
	value: PhoneFormValue;
	config: PhoneRendererOptions;
}) {
	const output = props.config.output;
	const value = normalizePhoneValue(props.value);

	if (output?.mode === 'e164') {
		props.fieldOnChange(value.e164 ?? '');
		setPhonePath(props.form, output.e164Name, value.e164 ?? '');
		return;
	}

	if (output?.mode === 'split') {
		props.fieldOnChange(value.nationalNumber);
		if (
			output.nationalNumberName &&
			output.nationalNumberName !== props.ctxName
		) {
			setPhonePath(props.form, output.nationalNumberName, value.nationalNumber);
		}
		setPhonePath(
			props.form,
			output.countryCodeName,
			countryCodeOutput(value, output)
		);
		setPhonePath(props.form, output.countryIso2Name, value.countryIso2 ?? '');
		setPhonePath(props.form, output.e164Name, value.e164 ?? '');
		return;
	}

	props.fieldOnChange(value);
	setPhonePath(props.form, output?.e164Name, value.e164 ?? '');
}

interface FieldRenderContext {
	name: string;
	id: string;
	enabled: boolean;
	readOnly: boolean;
	visible: boolean;
	descriptionId?: string;
	errorId?: string;
}

interface CommonWrapProps {
	className?: string;
	orientation?: 'vertical' | 'horizontal' | 'responsive';
	layout?: FieldSpec['layout'];
	'data-invalid'?: boolean;
	'data-disabled'?: boolean;
	hidden?: boolean;
	disabled?: boolean;
}

function renderInputGroupAddonItem(
	driver: DriverSlots,
	item: InputGroupAddonSpec['items'][number],
	key: React.Key
) {
	if (item.kind === 'text') {
		const InputGroupText = driver.InputGroupText ?? React.Fragment;
		return <InputGroupText key={key}>{item.textI18n}</InputGroupText>;
	}

	if (driver.InputGroupIcon) {
		return (
			<driver.InputGroupIcon
				key={key}
				iconKey={item.iconKey}
				label={item.labelI18n}
			/>
		);
	}

	if (item.labelI18n) {
		const InputGroupText = driver.InputGroupText ?? React.Fragment;
		return <InputGroupText key={key}>{item.labelI18n}</InputGroupText>;
	}

	return null;
}

function renderInputGroupAddons(
	driver: DriverSlots,
	inputGroup: InputGroupSpec | undefined
) {
	const InputGroupAddon = driver.InputGroupAddon;
	if (!InputGroupAddon || !inputGroup?.addons?.length) return null;
	return inputGroup.addons.map((addon, addonIndex) => (
		<InputGroupAddon
			key={`${addon.align ?? 'inline-start'}-${addonIndex}`}
			align={addon.align}
		>
			{addon.items.map((item, itemIndex) =>
				renderInputGroupAddonItem(driver, item, itemIndex)
			)}
		</InputGroupAddon>
	));
}

interface PasswordFieldRenderIntent {
	purpose: 'current' | 'new';
	autoComplete: 'current-password' | 'new-password';
	visibilityToggle: boolean;
	showLabelI18n?: string;
	hideLabelI18n?: string;
}

function resolvePasswordFieldIntent(
	field: TextFieldSpec
): PasswordFieldRenderIntent | undefined {
	const uiType =
		field.uiProps &&
		typeof field.uiProps.type === 'string' &&
		field.uiProps.type.toLowerCase() === 'password';
	const autoComplete = field.keyboard?.autoComplete ?? field.autoComplete;
	const isNewPassword =
		field.password?.purpose === 'new' ||
		field.keyboard?.kind === 'new-password' ||
		autoComplete === 'new-password';
	const isPassword =
		field.password != null ||
		uiType ||
		isNewPassword ||
		field.keyboard?.kind === 'password' ||
		autoComplete === 'current-password';

	if (!isPassword) return undefined;

	const purpose = isNewPassword ? 'new' : 'current';
	return {
		purpose,
		autoComplete: purpose === 'new' ? 'new-password' : 'current-password',
		visibilityToggle: field.password?.visibilityToggle ?? true,
		showLabelI18n: field.password?.showLabelI18n,
		hideLabelI18n: field.password?.hideLabelI18n,
	};
}

function SelectFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	values: TValues;
	spec: SelectFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
	resolvers?: ResolverMap<TValues>;
}) {
	const options = useResolvedOptions(
		props.values,
		toOptionsArray(props.spec.options),
		props.resolvers
	);
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.Select
							id={props.ctx.id}
							name={props.ctx.name}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							disabled={!props.ctx.enabled || props.ctx.readOnly}
							value={field.value}
							onChange={(value) => {
								if (props.ctx.readOnly) return;
								field.onChange(value);
							}}
							options={options}
							{...(props.spec.uiProps as Record<string, unknown>)}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function RadioFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	values: TValues;
	spec: RadioFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
	resolvers?: ResolverMap<TValues>;
}) {
	const options = useResolvedOptions(
		props.values,
		toOptionsArray(props.spec.options),
		props.resolvers
	);
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.RadioGroup
							id={props.ctx.id}
							name={props.ctx.name}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							disabled={!props.ctx.enabled || props.ctx.readOnly}
							value={field.value}
							onValueChange={(value) => {
								if (props.ctx.readOnly) return;
								field.onChange(value);
							}}
							options={options}
							{...(props.spec.uiProps as Record<string, unknown>)}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function AutocompleteFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	values: TValues;
	spec: AutocompleteFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
	resolvers?: ResolverMap<TValues>;
}) {
	const [query, setQuery] = React.useState('');
	const debounceMs =
		props.spec.source.kind === 'resolver'
			? (props.spec.source.debounceMs ?? 200)
			: 0;
	const debouncedQuery = useDebouncedValue(query, debounceMs);
	const [resolverOptions, setResolverOptions] = React.useState<
		AutocompleteOption[]
	>([]);
	const [cachedOptions, setCachedOptions] = React.useState<
		AutocompleteOption[]
	>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const requestSeqRef = React.useRef(0);
	const suppressedResolverQueryRef = React.useRef<string | null>(null);
	const depKey = React.useMemo(() => {
		return props.spec.source.kind === 'resolver'
			? `${props.spec.source.resolverKey}:${makeDepsKey(
					props.values,
					props.spec.source.deps
				)}:${debouncedQuery}`
			: 'local';
	}, [debouncedQuery, props.spec.source, props.values]);

	React.useEffect(() => {
		if (props.spec.source.kind !== 'resolver') return;
		const requestId = requestSeqRef.current + 1;
		requestSeqRef.current = requestId;
		const resolver = props.resolvers?.[props.spec.source.resolverKey];
		const minQueryLength = props.spec.source.minQueryLength ?? 0;
		if (!resolver || debouncedQuery.trim().length < minQueryLength) {
			setResolverOptions([]);
			setLoading(false);
			setError(null);
			return;
		}
		if (suppressedResolverQueryRef.current === debouncedQuery) {
			suppressedResolverQueryRef.current = null;
			setLoading(false);
			setError(null);
			return;
		}
		let mounted = true;
		const controller =
			typeof AbortController !== 'undefined' ? new AbortController() : null;
		const args = {
			...(props.spec.source.args ?? {}),
			query: debouncedQuery,
			deps: autocompleteDependencyArgs(props.values, props.spec.source.deps),
			fieldName: props.ctx.name,
			...(controller ? { signal: controller.signal } : {}),
		};
		setLoading(true);
		setError(null);
		void Promise.resolve(resolver(props.values, args))
			.then((next) => {
				if (!mounted || requestSeqRef.current !== requestId) return;
				const nextOptions = [
					...((next as AutocompleteOption[] | undefined) ?? []),
				];
				setResolverOptions(nextOptions);
				setCachedOptions((current) =>
					mergeAutocompleteOptions(nextOptions, current)
				);
			})
			.catch((nextError) => {
				if (!mounted || requestSeqRef.current !== requestId) return;
				if (controller?.signal.aborted) return;
				setResolverOptions([]);
				setError(autocompleteResolverErrorMessage(nextError));
			})
			.finally(() => {
				if (mounted && requestSeqRef.current === requestId) {
					setLoading(false);
				}
			});
		return () => {
			mounted = false;
			controller?.abort();
		};
	}, [
		depKey,
		props.ctx.name,
		props.resolvers,
		props.spec.source,
		debouncedQuery,
	]);

	const options =
		props.spec.source.kind === 'local'
			? filterAutocompleteOptions(
					props.spec.source.options,
					query,
					props.spec.source.searchKeys
				)
			: resolverOptions;

	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				const optionPool =
					props.spec.source.kind === 'resolver'
						? mergeAutocompleteOptions(options, cachedOptions)
						: options;
				const selectedOptions = selectedAutocompleteOptions(
					optionPool,
					field.value,
					props.spec.valueMapping,
					props.spec.multiple
				);

				const commitOption = (option: AutocompleteOption) => {
					if (props.ctx.readOnly) return;
					setCachedOptions((current) =>
						mergeAutocompleteOptions([option], current)
					);
					const mapped = mapAutocompleteValue(option, props.spec.valueMapping);
					if (props.spec.multiple) {
						const current = Array.isArray(field.value) ? field.value : [];
						const exists = current.some((item) => sameSelection(item, mapped));
						field.onChange(exists ? current : [...current, mapped]);
						return;
					}
					field.onChange(mapped);
					suppressedResolverQueryRef.current = option.labelI18n;
					setQuery(option.labelI18n);
				};

				const removeOption = (option: AutocompleteOption) => {
					if (props.ctx.readOnly || !props.spec.multiple) return;
					const mapped = mapAutocompleteValue(option, props.spec.valueMapping);
					const current = Array.isArray(field.value) ? field.value : [];
					field.onChange(
						current.filter((item) => !sameSelection(item, mapped))
					);
				};

				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.Autocomplete
							id={props.ctx.id}
							name={props.ctx.name}
							disabled={!props.ctx.enabled}
							readOnly={props.ctx.readOnly}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							placeholder={props.spec.placeholderI18n}
							multiple={props.spec.multiple}
							query={query}
							options={options}
							selectedOptions={selectedOptions}
							loading={loading}
							error={error}
							onQueryChange={setQuery}
							onSelectOption={commitOption}
							onRemoveOption={removeOption}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function AddressFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	values: TValues;
	spec: AddressFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
	resolvers?: ResolverMap<TValues>;
}) {
	const countryOptions = useResolvedOptions(
		props.values,
		toOptionsArray(props.spec.countryOptions),
		props.resolvers
	);
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.AddressField
							id={props.ctx.id}
							name={props.ctx.name}
							value={
								(field.value as AddressFormValue | null | undefined) ?? null
							}
							onChange={(value) => {
								if (props.ctx.readOnly) return;
								field.onChange(value);
							}}
							disabled={!props.ctx.enabled}
							readOnly={props.ctx.readOnly}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							parts={props.spec.parts}
							countryOptions={countryOptions}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function PhoneFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	values: TValues;
	spec: PhoneFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
	resolvers?: ResolverMap<TValues>;
	phone?: PhoneRendererOptions;
}) {
	const phoneConfig = mergePhoneOptions(props.spec, props.phone);
	const countryOptions = useResolvedOptions(
		props.values,
		toOptionsArray(props.spec.countryOptions),
		props.resolvers
	);
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;
	const controllerName =
		phoneConfig.output?.mode === 'split' &&
		phoneConfig.output.nationalNumberName
			? phoneConfig.output.nationalNumberName
			: props.ctx.name;

	return (
		<Controller
			name={controllerName as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.PhoneField
							id={props.ctx.id}
							name={props.ctx.name}
							value={readPhoneValue({
								fieldValue: field.value,
								values: props.values,
								config: phoneConfig,
							})}
							onChange={(value) => {
								if (props.ctx.readOnly) return;
								writeLinkedPhonePaths({
									form: props.form,
									ctxName: props.ctx.name,
									fieldOnChange: field.onChange,
									value,
									config: phoneConfig,
								});
							}}
							disabled={!props.ctx.enabled}
							readOnly={props.ctx.readOnly}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							parts={props.spec.parts}
							countryOptions={countryOptions}
							input={phoneConfig.input}
							output={phoneConfig.output}
							country={phoneConfig.country}
							display={phoneConfig.display}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

type NumericFieldSpec =
	| NumberFieldSpec
	| PercentFieldSpec
	| CurrencyFieldSpec
	| DurationFieldSpec;

function NumericFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	spec: NumericFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
}) {
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;
	const uiProps = (props.spec.uiProps ?? {}) as Partial<
		React.InputHTMLAttributes<HTMLInputElement>
	>;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				const value =
					typeof field.value === 'number'
						? formatNumericInputValue(field.value, props.spec)
						: typeof field.value === 'string'
							? field.value
							: '';
				const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
					id: props.ctx.id,
					name: props.ctx.name,
					'aria-invalid': fieldState.invalid || undefined,
					'aria-describedby': describedBy,
					placeholder: props.spec.placeholderI18n,
					disabled: !props.ctx.enabled,
					readOnly: props.ctx.readOnly,
					type: 'number',
					inputMode:
						props.spec.kind === 'number' ? props.spec.inputMode : 'decimal',
					min: props.spec.min,
					max: props.spec.max,
					step: props.spec.step,
					value,
					onBlur: field.onBlur,
					onChange: (event) => {
						if (props.ctx.readOnly) return;
						field.onChange(
							parseNumericInputValue(event.currentTarget.value, props.spec)
						);
					},
					...uiProps,
				};
				const NumericInput = resolveNumericFieldSlot(props.driver, props.spec);
				const numericSlotProps = numericFieldSlotProps(props.spec);

				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<NumericInput {...inputProps} {...numericSlotProps} />
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function resolveNumericFieldSlot(driver: DriverSlots, spec: NumericFieldSpec) {
	switch (spec.kind) {
		case 'number':
			return driver.NumberField ?? driver.Input;
		case 'percent':
			return driver.PercentField ?? driver.Input;
		case 'currency':
			return driver.CurrencyField ?? driver.Input;
		case 'duration':
			return driver.DurationField ?? driver.Input;
	}
}

function numericFieldSlotProps(spec: NumericFieldSpec) {
	switch (spec.kind) {
		case 'number':
			return { format: spec.format };
		case 'percent':
			return { format: spec.format, valueScale: spec.valueScale };
		case 'currency':
			return { format: spec.format };
		case 'duration':
			return { format: spec.format, valueUnit: spec.valueUnit };
	}
}

function parseNumericInputValue(
	value: string,
	spec: NumericFieldSpec
): number | string | undefined {
	if (value.trim() === '') return undefined;
	if ('valueMode' in spec && spec.valueMode === 'string') return value;
	const parsed = Number(value);
	if (Number.isNaN(parsed)) return value;
	if (spec.kind === 'percent') {
		const valueScale = spec.valueScale ?? spec.format?.valueScale ?? 'fraction';
		return valueScale === 'fraction' ? parsed / 100 : parsed;
	}
	return parsed;
}

function formatNumericInputValue(
	value: number,
	spec: NumericFieldSpec
): number | string {
	if (spec.kind !== 'percent') return value;
	const valueScale = spec.valueScale ?? spec.format?.valueScale ?? 'fraction';
	return valueScale === 'fraction' ? value * 100 : value;
}

function DateFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	spec: DateFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
}) {
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.DateField
							id={props.ctx.id}
							name={props.ctx.name}
							value={coerceDateValue(field.value)}
							onChange={(value) => {
								if (props.ctx.readOnly) return;
								field.onChange(value);
							}}
							disabled={!props.ctx.enabled}
							readOnly={props.ctx.readOnly}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							placeholder={props.spec.placeholderI18n}
							minDate={props.spec.minDate}
							maxDate={props.spec.maxDate}
							format={props.spec.format}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function TimeFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	spec: TimeFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
}) {
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.TimeField
							id={props.ctx.id}
							name={props.ctx.name}
							value={parseTimeValue(field.value)}
							onChange={(value) => {
								if (props.ctx.readOnly) return;
								field.onChange(serializeTimeValue(value));
							}}
							disabled={!props.ctx.enabled}
							readOnly={props.ctx.readOnly}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							placeholder={props.spec.placeholderI18n}
							is24Hour={props.spec.is24Hour}
							format={props.spec.format}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function DateTimeFieldControl<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	spec: DateTimeFieldSpec;
	ctx: FieldRenderContext;
	labelNode: React.ReactNode;
	descNode: React.ReactNode;
	commonWrapProps: CommonWrapProps;
}) {
	const DriverField = props.driver.Field;
	const DriverError = props.driver.FieldError;

	return (
		<Controller
			name={props.ctx.name as never}
			control={props.form.control}
			render={({ field, fieldState }) => {
				const err = fieldState.error ? [fieldState.error] : [];
				const describedBy = ariaDescribedBy(
					props.ctx.descriptionId,
					props.ctx.errorId,
					fieldState.invalid
				);
				return (
					<DriverField
						{...props.commonWrapProps}
						data-invalid={
							fieldState.invalid ||
							props.commonWrapProps['data-invalid'] ||
							undefined
						}
					>
						{props.labelNode}
						<props.driver.DateTimeField
							id={props.ctx.id}
							name={props.ctx.name}
							value={coerceDateValue(field.value)}
							onChange={(value) => {
								if (props.ctx.readOnly) return;
								field.onChange(value);
							}}
							disabled={!props.ctx.enabled}
							readOnly={props.ctx.readOnly}
							aria-invalid={fieldState.invalid || undefined}
							aria-describedby={describedBy}
							datePlaceholder={props.spec.placeholderI18n}
							timePlaceholder={props.spec.placeholderI18n}
							minDate={props.spec.minDate}
							maxDate={props.spec.maxDate}
							is24Hour={props.spec.is24Hour}
							format={props.spec.format}
						/>
						{props.descNode}
						{fieldState.invalid ? (
							<DriverError id={props.ctx.errorId} errors={err} />
						) : null}
					</DriverField>
				);
			}}
		/>
	);
}

function ArrayFieldRenderer<TValues extends FieldValues>(props: {
	driver: DriverSlots;
	form: UseFormReturn<TValues>;
	spec: ArrayFieldSpec;
	parent?: string;
	renderField: (
		field: FieldSpec,
		parent?: string,
		parentLayout?: FormLayoutSpec,
		fallbackId?: string
	) => React.ReactElement | null;
}) {
	const name = fieldPath(props.parent, props.spec.name);
	const FieldArray = props.driver.FieldArray ?? 'div';
	const FieldArrayItem = props.driver.FieldArrayItem ?? 'div';
	const { fields, append, remove } = useFieldArray({
		control: props.form.control,
		name: name as never,
	});
	const canAdd = props.spec.max == null || fields.length < props.spec.max;
	const canRemove = (index: number) =>
		(props.spec.min == null
			? fields.length > 0
			: fields.length > props.spec.min) && index >= 0;

	return (
		<FieldArray key={name} className={fieldLayoutClassName(props.spec.layout)}>
			{props.spec.labelI18n ? (
				<props.driver.FieldLabel>
					{props.spec.labelI18n}
				</props.driver.FieldLabel>
			) : null}
			{fields.map((row, index) => (
				<FieldArrayItem key={row.id ?? index}>
					{props.renderField(props.spec.of, `${name}.${index}`)}
					{canRemove(index) ? (
						<props.driver.Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => remove(index)}
						>
							Remove
						</props.driver.Button>
					) : null}
				</FieldArrayItem>
			))}
			{canAdd ? (
				<props.driver.Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => append({} as never)}
				>
					Add
				</props.driver.Button>
			) : null}
		</FieldArray>
	);
}

export function createFormRenderer<M extends AnySchemaModel = AnySchemaModel>(
	base: CreateRendererOptions<FormValuesFor<M>>
) {
	const conf = base;

	function InternalForm(props: {
		spec: FormSpec<M>;
		options?: RenderOptions<FormValuesFor<M>>;
		merged: CreateRendererOptions<FormValuesFor<M>>;
	}) {
		const normalizedSpec = React.useMemo(
			() => normalizeFormSpec(props.spec),
			[props.spec]
		);
		const baseZod = React.useMemo(
			() => buildZodWithRelations(normalizedSpec),
			[normalizedSpec]
		);
		type Values = FormFieldValues<M>;
		const resolver = zodResolver(baseZod) as Resolver<Values, any, Values>;
		const form = useForm<Values, any, Values>({
			...props.merged.formOptions,
			resolver,
			defaultValues: props.options?.defaultValues as never,
		});
		const values = form.watch();
		const [activeStepIndex, setActiveStepIndex] = React.useState(0);

		const renderField = (
			field: FieldSpec,
			parent?: string,
			parentLayout?: FormLayoutSpec,
			fallbackId?: string
		): React.ReactElement | null => {
			const DriverField = props.merged.driver.Field;
			const DriverLabel = props.merged.driver.FieldLabel;
			const DriverDesc = props.merged.driver.FieldDescription;
			const DriverError = props.merged.driver.FieldError;
			const DriverFieldSet = props.merged.driver.FieldSet ?? 'div';
			const DriverLegend = props.merged.driver.FieldLegend;
			const name = fieldPath(parent, field.name);
			const indices = extractIndices(parent);
			const visible = evalPredicate(values, field.visibleWhen, indices);
			const enabled = evalPredicate(values, field.enabledWhen, indices);
			const readOnly = isFieldReadOnly(field);
			const invalid = Boolean(form.getFieldState(name as never)?.invalid);
			const idBase =
				name.replace(/\./g, '-') ||
				fallbackId ||
				parent?.replace(/\./g, '-') ||
				'form-field';

			if (!visible) return null;

			const ctx: FieldRenderContext = {
				name,
				id: idBase,
				enabled,
				readOnly,
				visible,
				descriptionId: field.descriptionI18n
					? `${idBase}-description`
					: undefined,
				errorId: `${idBase}-error`,
			};
			const commonWrapProps: CommonWrapProps = {
				className: fieldLayoutClassName(field.layout),
				orientation:
					field.layout?.orientation ?? parentLayout?.fieldOrientation,
				layout: field.layout,
				'data-invalid': invalid || undefined,
				'data-disabled': !enabled || readOnly || undefined,
				hidden: !visible,
				disabled: !enabled || readOnly,
			};
			const labelNode = field.labelI18n ? (
				<DriverLabel htmlFor={ctx.id}>{field.labelI18n}</DriverLabel>
			) : null;
			const descNode = field.descriptionI18n ? (
				<DriverDesc id={ctx.descriptionId}>{field.descriptionI18n}</DriverDesc>
			) : null;

			if (field.kind === 'group') {
				const legendNode = field.legendI18n ?? field.labelI18n;
				return (
					<DriverFieldSet
						key={name || `${idBase}-group`}
						className={fieldLayoutClassName(field.layout)}
					>
						{legendNode && DriverLegend ? (
							<DriverLegend variant="legend">{legendNode}</DriverLegend>
						) : legendNode ? (
							<DriverLabel>{legendNode}</DriverLabel>
						) : null}
						{descNode}
						<FieldCollectionRenderer
							driver={props.merged.driver}
							fields={field.fields}
							layout={field.layout}
							parent={name}
							idBase={idBase}
							renderField={renderField}
						/>
					</DriverFieldSet>
				);
			}

			if (field.kind === 'array') {
				return (
					<ArrayFieldRenderer
						key={name}
						driver={props.merged.driver}
						form={form}
						spec={field}
						parent={parent}
						renderField={renderField}
					/>
				);
			}

			if (field.kind === 'select') {
				return (
					<SelectFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						values={values}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
						resolvers={props.merged.resolvers}
					/>
				);
			}

			if (field.kind === 'radio') {
				return (
					<RadioFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						values={values}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
						resolvers={props.merged.resolvers}
					/>
				);
			}

			if (field.kind === 'autocomplete') {
				return (
					<AutocompleteFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						values={values}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
						resolvers={props.merged.resolvers}
					/>
				);
			}

			if (field.kind === 'address') {
				return (
					<AddressFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						values={values}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
						resolvers={props.merged.resolvers}
					/>
				);
			}

			if (field.kind === 'phone') {
				return (
					<PhoneFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						values={values}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
						resolvers={props.merged.resolvers}
						phone={props.merged.phone}
					/>
				);
			}

			if (
				field.kind === 'number' ||
				field.kind === 'percent' ||
				field.kind === 'currency' ||
				field.kind === 'duration'
			) {
				return (
					<NumericFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
					/>
				);
			}

			if (field.kind === 'date') {
				return (
					<DateFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
					/>
				);
			}

			if (field.kind === 'time') {
				return (
					<TimeFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
					/>
				);
			}

			if (field.kind === 'datetime') {
				return (
					<DateTimeFieldControl
						key={name}
						driver={props.merged.driver}
						form={form}
						spec={field}
						ctx={ctx}
						labelNode={labelNode}
						descNode={descNode}
						commonWrapProps={commonWrapProps}
					/>
				);
			}

			return (
				<Controller
					key={name}
					name={name as never}
					control={form.control}
					render={({ field: rhfField, fieldState }) => {
						const err = fieldState.error ? [fieldState.error] : [];
						const describedBy = ariaDescribedBy(
							ctx.descriptionId,
							ctx.errorId,
							fieldState.invalid
						);
						const wrapProps = {
							...commonWrapProps,
							'data-invalid':
								fieldState.invalid ||
								commonWrapProps['data-invalid'] ||
								undefined,
						};
						const errorNode = fieldState.invalid ? (
							<DriverError id={ctx.errorId} errors={err} />
						) : null;
						if (field.kind === 'email') {
							const emailField = field as EmailFieldSpec;
							const uiProps = (field.uiProps ?? {}) as Partial<
								React.InputHTMLAttributes<HTMLInputElement>
							>;
							const keyboardAutoCorrect =
								emailField.keyboard?.autoCorrect == null
									? undefined
									: emailField.keyboard.autoCorrect
										? 'on'
										: 'off';
							const emailAutoComplete = (emailField.keyboard?.autoComplete ??
								emailField.autoComplete ??
								uiProps.autoComplete ??
								'email') as React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
							const emailAutoCapitalize = (emailField.keyboard
								?.autoCapitalize ??
								uiProps.autoCapitalize ??
								'none') as React.InputHTMLAttributes<HTMLInputElement>['autoCapitalize'];
							const emailAutoCorrect = (keyboardAutoCorrect ??
								uiProps.autoCorrect ??
								'off') as React.InputHTMLAttributes<HTMLInputElement>['autoCorrect'];
							const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
								id: ctx.id,
								'aria-invalid': fieldState.invalid || undefined,
								'aria-describedby': describedBy,
								placeholder: field.placeholderI18n,
								disabled: !ctx.enabled,
								readOnly: ctx.readOnly,
								...rhfField,
								...uiProps,
								type: 'email',
								inputMode: 'email',
								autoComplete: emailAutoComplete,
								autoCapitalize: emailAutoCapitalize,
								autoCorrect: emailAutoCorrect,
								maxLength: emailField.maxLength,
								minLength: emailField.minLength,
							};
							const canRenderInputGroup =
								emailField.inputGroup?.addons?.length &&
								props.merged.driver.InputGroup &&
								props.merged.driver.InputGroupAddon &&
								props.merged.driver.InputGroupInput;
							const InputGroup = props.merged.driver.InputGroup;
							const InputGroupInput = props.merged.driver.InputGroupInput;
							return (
								<DriverField {...wrapProps}>
									{labelNode}
									{canRenderInputGroup && InputGroup && InputGroupInput ? (
										<InputGroup>
											<InputGroupInput {...inputProps} />
											{renderInputGroupAddons(
												props.merged.driver,
												emailField.inputGroup
											)}
										</InputGroup>
									) : (
										<props.merged.driver.Input {...inputProps} />
									)}
									{descNode}
									{errorNode}
								</DriverField>
							);
						}

						if (field.kind === 'text') {
							const textField = field as TextFieldSpec;
							const passwordIntent = resolvePasswordFieldIntent(textField);
							const uiProps = (field.uiProps ?? {}) as Partial<
								React.InputHTMLAttributes<HTMLInputElement>
							>;
							const inputProps = {
								id: ctx.id,
								'aria-invalid': fieldState.invalid || undefined,
								'aria-describedby': describedBy,
								placeholder: field.placeholderI18n,
								autoComplete: textField.autoComplete,
								inputMode: textField.inputMode,
								maxLength: textField.maxLength,
								minLength: textField.minLength,
								disabled: !ctx.enabled,
								readOnly: ctx.readOnly,
								...rhfField,
								...uiProps,
								...(passwordIntent
									? {
											type: 'password',
											autoComplete: passwordIntent.autoComplete,
											autoCapitalize: 'none',
											autoCorrect: 'off',
										}
									: {}),
							};
							const PasswordInput = props.merged.driver.PasswordInput;
							if (passwordIntent && PasswordInput) {
								return (
									<DriverField {...wrapProps}>
										{labelNode}
										<PasswordInput
											{...inputProps}
											passwordPurpose={passwordIntent.purpose}
											visibilityToggle={passwordIntent.visibilityToggle}
											showLabelI18n={passwordIntent.showLabelI18n}
											hideLabelI18n={passwordIntent.hideLabelI18n}
										/>
										{descNode}
										{errorNode}
									</DriverField>
								);
							}
							const canRenderInputGroup =
								textField.inputGroup?.addons?.length &&
								props.merged.driver.InputGroup &&
								props.merged.driver.InputGroupAddon &&
								props.merged.driver.InputGroupInput;
							const InputGroup = props.merged.driver.InputGroup;
							const InputGroupInput = props.merged.driver.InputGroupInput;
							return (
								<DriverField {...wrapProps}>
									{labelNode}
									{canRenderInputGroup && InputGroup && InputGroupInput ? (
										<InputGroup>
											<InputGroupInput {...inputProps} />
											{renderInputGroupAddons(
												props.merged.driver,
												textField.inputGroup
											)}
										</InputGroup>
									) : (
										<props.merged.driver.Input {...inputProps} />
									)}
									{descNode}
									{errorNode}
								</DriverField>
							);
						}

						if (field.kind === 'textarea') {
							const textareaField = field as TextareaFieldSpec;
							const textareaProps = {
								id: ctx.id,
								'aria-invalid': fieldState.invalid || undefined,
								'aria-describedby': describedBy,
								placeholder: field.placeholderI18n,
								rows: textareaField.rows,
								maxLength: textareaField.maxLength,
								disabled: !ctx.enabled,
								readOnly: ctx.readOnly,
								...rhfField,
								...(field.uiProps as Record<string, unknown>),
							};
							const canRenderInputGroup =
								textareaField.inputGroup?.addons?.length &&
								props.merged.driver.InputGroup &&
								props.merged.driver.InputGroupAddon &&
								props.merged.driver.InputGroupTextarea;
							const InputGroup = props.merged.driver.InputGroup;
							const InputGroupTextarea = props.merged.driver.InputGroupTextarea;
							return (
								<DriverField {...wrapProps}>
									{labelNode}
									{canRenderInputGroup && InputGroup && InputGroupTextarea ? (
										<InputGroup>
											<InputGroupTextarea {...textareaProps} />
											{renderInputGroupAddons(
												props.merged.driver,
												textareaField.inputGroup
											)}
										</InputGroup>
									) : (
										<props.merged.driver.Textarea {...textareaProps} />
									)}
									{descNode}
									{errorNode}
								</DriverField>
							);
						}

						if (field.kind === 'checkbox') {
							const checkbox = (
								<props.merged.driver.Checkbox
									id={ctx.id}
									name={ctx.name}
									aria-invalid={fieldState.invalid || undefined}
									aria-describedby={describedBy}
									disabled={!ctx.enabled || ctx.readOnly}
									checked={Boolean(rhfField.value)}
									onCheckedChange={(value) => {
										if (ctx.readOnly) return;
										rhfField.onChange(value);
									}}
									{...(field.uiProps as Record<string, unknown>)}
								/>
							);
							const FieldContent = props.merged.driver.FieldContent;
							const inline =
								commonWrapProps.orientation === 'horizontal' ||
								commonWrapProps.orientation === 'responsive';
							return (
								<DriverField {...wrapProps}>
									{inline && FieldContent ? (
										<>
											{checkbox}
											<FieldContent>
												{labelNode}
												{descNode}
												{errorNode}
											</FieldContent>
										</>
									) : (
										<>
											{labelNode}
											{checkbox}
											{descNode}
											{errorNode}
										</>
									)}
								</DriverField>
							);
						}

						if (field.kind === 'switch') {
							const control = (
								<props.merged.driver.Switch
									id={ctx.id}
									name={ctx.name}
									aria-invalid={fieldState.invalid || undefined}
									aria-describedby={describedBy}
									disabled={!ctx.enabled || ctx.readOnly}
									checked={Boolean(rhfField.value)}
									onCheckedChange={(value) => {
										if (ctx.readOnly) return;
										rhfField.onChange(value);
									}}
									{...(field.uiProps as Record<string, unknown>)}
								/>
							);
							const FieldContent = props.merged.driver.FieldContent;
							const inline =
								commonWrapProps.orientation === 'horizontal' ||
								commonWrapProps.orientation === 'responsive';
							return (
								<DriverField {...wrapProps}>
									{inline && FieldContent ? (
										<>
											{control}
											<FieldContent>
												{labelNode}
												{descNode}
												{errorNode}
											</FieldContent>
										</>
									) : (
										<>
											{labelNode}
											{control}
											{descNode}
											{errorNode}
										</>
									)}
								</DriverField>
							);
						}

						return <></>;
					}}
				/>
			);
		};

		const onSubmit = async (data: Values) => {
			const actionKey = normalizedSpec.actions?.[0]?.key ?? 'submit';
			if (props.merged.onSubmitOverride) {
				return props.merged.onSubmitOverride(data, actionKey);
			}
		};
		const FormRoot = props.merged.driver.FormRoot ?? 'form';
		const Actions = props.merged.driver.Actions ?? 'div';
		const submitMode = props.merged.submitMode ?? 'form';
		const submit = form.handleSubmit(onSubmit);
		const flowSectionCount = getRenderableFlowSectionCount(
			normalizedSpec.fields,
			normalizedSpec.layout?.flow
		);
		const activeFlowStep = clampStepIndex(activeStepIndex, flowSectionCount);
		const showActions =
			normalizedSpec.layout?.flow?.kind !== 'steps' ||
			flowSectionCount === 0 ||
			activeFlowStep >= flowSectionCount - 1;
		const submitButtonProps =
			submitMode === 'button'
				? ({
						type: 'button',
						onClick: () => {
							void submit();
						},
					} as const)
				: ({ type: 'submit' } as const);

		return (
			<FormRoot onSubmit={submitMode === 'form' ? submit : undefined}>
				<FieldCollectionRenderer
					driver={props.merged.driver}
					fields={normalizedSpec.fields}
					layout={normalizedSpec.layout}
					idBase="field"
					renderField={renderField}
					activeStepIndex={activeFlowStep}
					onActiveStepIndexChange={setActiveStepIndex}
				/>
				{normalizedSpec.actions?.length && showActions ? (
					<Actions>
						{normalizedSpec.actions.map((action) => (
							<props.merged.driver.Button
								key={action.key}
								{...submitButtonProps}
							>
								{action.labelI18n}
							</props.merged.driver.Button>
						))}
					</Actions>
				) : null}
			</FormRoot>
		);
	}

	return {
		render: (spec: FormSpec<M>, options?: RenderOptions<FormValuesFor<M>>) => (
			<InternalForm
				spec={spec}
				options={options}
				merged={{
					...conf,
					...(options?.overrides ?? {}),
				}}
			/>
		),
	};
}
