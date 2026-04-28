import type {
	DataViewConfig,
	DataViewFilter,
	DataViewFilterValue,
	DataViewSpec,
} from '../data-views';

export interface DataViewQueryParams {
	filters?: Record<string, unknown>;
	sort?: { field: string; direction: 'asc' | 'desc' };
	pagination?: { page: number; pageSize: number };
	search?: string;
}

export interface DataViewQuery {
	operationName: string;
	input: Record<string, unknown>;
	meta: {
		pagination: { page: number; pageSize: number; skip: number; take: number };
		sorting?: { field: string; direction: 'asc' | 'desc' };
	};
}

export class DataViewQueryGenerator {
	constructor(private spec: DataViewSpec) {}

	generate(params: DataViewQueryParams): DataViewQuery {
		const { primary } = this.spec.source;
		const page = params.pagination?.page ?? 1;
		const pageSize =
			params.pagination?.pageSize ?? collectionPageSize(this.spec.view) ?? 20;
		const skip = (page - 1) * pageSize;
		const take = pageSize;

		const input: Record<string, unknown> = {
			skip,
			take,
			...params.filters,
		};

		if (params.search) {
			input.search = params.search;
		}

		if (params.sort) {
			input.orderBy = {
				[params.sort.field]: params.sort.direction,
			};
		}

		return {
			operationName: primary.key,
			input,
			meta: {
				pagination: { page, pageSize, skip, take },
				sorting: params.sort,
			},
		};
	}

	validateParams(params: DataViewQueryParams): string[] {
		const errors: string[] = [];

		// Validate filters against spec
		if (params.filters && this.spec.view.filters) {
			for (const key of Object.keys(params.filters)) {
				const defined = this.spec.view.filters.find((f) => f.key === key);
				if (!defined) {
					errors.push(`Unknown filter key: ${key}`);
					continue;
				}
				const typeError = validateFilterValue(defined, params.filters[key]);
				if (typeError) {
					errors.push(typeError);
				}
			}
		}

		// Validate sort field
		if (params.sort) {
			const field = this.spec.view.fields.find(
				(f) => f.key === params.sort?.field
			);
			if (!field) {
				errors.push(`Unknown sort field: ${params.sort.field}`);
			} else if (field.sortable === false) {
				errors.push(`Field is not sortable: ${params.sort.field}`);
			}
		}

		return errors;
	}
}

function collectionPageSize(view: DataViewConfig): number | undefined {
	if (view.kind === 'detail') return undefined;
	return view.collection?.pagination?.pageSize;
}

function validateFilterValue(
	filter: DataViewFilter,
	value: unknown
): string | undefined {
	if (value == null) return undefined;
	const raw = unwrapFilterValue(value);
	switch (filter.type) {
		case 'number':
		case 'percent':
		case 'currency':
		case 'duration':
			return validateNumericFilter(filter.key, raw);
		case 'boolean':
			return typeof raw === 'boolean'
				? undefined
				: `Filter must be boolean: ${filter.key}`;
		case 'date':
		case 'time':
		case 'datetime':
			return validateComparableFilter(filter.key, raw);
		case 'search':
		case 'enum':
		default:
			return undefined;
	}
}

function unwrapFilterValue(value: unknown): unknown {
	if (!isFilterValue(value)) return value;
	switch (value.kind) {
		case 'single':
			return value.value;
		case 'multi':
			return value.values;
		case 'range':
			return [value.from, value.to].filter((item) => item != null);
		case 'composite':
			return undefined;
	}
}

function isFilterValue(value: unknown): value is DataViewFilterValue {
	return (
		typeof value === 'object' &&
		value != null &&
		'kind' in value &&
		typeof (value as { kind?: unknown }).kind === 'string'
	);
}

function validateNumericFilter(
	key: string,
	value: unknown
): string | undefined {
	const values = Array.isArray(value) ? value : [value];
	return values.every((item) => typeof item === 'number')
		? undefined
		: `Filter must be numeric: ${key}`;
}

function validateComparableFilter(
	key: string,
	value: unknown
): string | undefined {
	const values = Array.isArray(value) ? value : [value];
	return values.every(
		(item) => typeof item === 'string' || typeof item === 'number'
	)
		? undefined
		: `Filter must be comparable: ${key}`;
}
