import type {
	DataViewFilter,
	DataViewFilterClause,
	DataViewFilterOperator,
	DataViewFilterScope,
	DataViewFilterSet,
	DataViewFilterValue,
} from './types';

export interface ResolvedDataViewFilters {
	user: DataViewFilterSet;
	locked: DataViewFilterSet;
	effective: DataViewFilterClause[];
	lockedChips: NonNullable<DataViewFilterScope['lockedChips']>;
}

export interface ResolveDataViewFiltersInput {
	filters?: readonly DataViewFilter[];
	scope?: DataViewFilterScope;
	user?: DataViewFilterSet;
}

const RANGE_LOWER_OPERATORS = new Set<DataViewFilterOperator>(['gt', 'gte']);
const RANGE_UPPER_OPERATORS = new Set<DataViewFilterOperator>(['lt', 'lte']);
const RANGE_OPERATORS = new Set<DataViewFilterOperator>([
	'gt',
	'gte',
	'lt',
	'lte',
	'between',
]);

export function resolveDataViewFilters({
	filters = [],
	scope,
	user,
}: ResolveDataViewFiltersInput): ResolvedDataViewFilters {
	const filterByKey = new Map(filters.map((filter) => [filter.key, filter]));
	const userFilters = sanitizeDataViewFilterSet(user ?? scope?.initial ?? {});
	const lockedFilters = sanitizeDataViewFilterSet(scope?.locked ?? {});
	const lockedClauses = filterSetToClauses(lockedFilters, filterByKey);
	const prunedUserFilters = pruneDataViewFilterSet(
		userFilters,
		filterByKey,
		lockedClauses
	);

	return {
		user: prunedUserFilters,
		locked: lockedFilters,
		effective: [
			...filterSetToClauses(prunedUserFilters, filterByKey),
			...lockedClauses,
		],
		lockedChips: scope?.lockedChips ?? 'visible-disabled',
	};
}

export function sanitizeDataViewFilterSet(
	filters: DataViewFilterSet
): DataViewFilterSet {
	return Object.fromEntries(
		Object.entries(filters)
			.map(([key, value]) => [key, sanitizeDataViewFilterValue(value)] as const)
			.filter((entry): entry is [string, DataViewFilterValue] =>
				Boolean(entry[1])
			)
	);
}

export function filterSetToClauses(
	filters: DataViewFilterSet,
	filterByKey: ReadonlyMap<string, DataViewFilter>
): DataViewFilterClause[] {
	return Object.entries(filters).flatMap(([filterKey, value]) => {
		if (!value) return [];
		return valueToClauses(filterKey, value, filterByKey.get(filterKey));
	});
}

export function pruneDataViewFilterClauses(
	userClauses: readonly DataViewFilterClause[],
	lockedClauses: readonly DataViewFilterClause[]
): DataViewFilterClause[] {
	return userClauses.filter(
		(userClause) =>
			!lockedClauses.some((lockedClause) =>
				clausesConflict(userClause, lockedClause)
			)
	);
}

export function pruneDataViewFilterSet(
	userFilters: DataViewFilterSet,
	filterByKey: ReadonlyMap<string, DataViewFilter>,
	lockedClauses: readonly DataViewFilterClause[]
): DataViewFilterSet {
	return Object.fromEntries(
		Object.entries(userFilters).flatMap(([filterKey, value]) => {
			const pruned = pruneDataViewFilterValue(
				filterKey,
				value,
				filterByKey.get(filterKey),
				lockedClauses
			);
			return pruned ? [[filterKey, pruned] as const] : [];
		})
	);
}

function sanitizeDataViewFilterValue(
	value: DataViewFilterValue | undefined
): DataViewFilterValue | undefined {
	if (!value) return undefined;
	if (value.kind === 'single') {
		return value.value == null || value.value === '' ? undefined : value;
	}
	if (value.kind === 'multi') {
		const values = value.values.filter((item) => item !== '');
		return values.length ? { ...value, values } : undefined;
	}
	if (value.kind === 'range') {
		return value.from == null && value.to == null ? undefined : value;
	}
	const clauses = value.clauses
		.map((clause) => ({
			...clause,
			value: sanitizeDataViewFilterValue(clause.value),
		}))
		.filter(
			(clause) =>
				clause.value !== undefined ||
				clause.operator === 'isNull' ||
				clause.operator === 'isNotNull'
		);
	return clauses.length ? { ...value, clauses } : undefined;
}

function valueToClauses(
	filterKey: string,
	value: DataViewFilterValue,
	filter: DataViewFilter | undefined
): DataViewFilterClause[] {
	if (value.kind === 'composite') return value.clauses;
	const field = filter?.field ?? filterKey;
	const operator = filter?.operator ?? defaultOperator(value, filter?.type);
	if (value.kind !== 'range') {
		return [{ filterKey, field, operator, value }];
	}
	const rangeOperator = rangeOperatorForValue(value);
	return rangeOperator
		? [{ filterKey, field, operator: rangeOperator, value }]
		: [];
}

function pruneDataViewFilterValue(
	filterKey: string,
	value: DataViewFilterValue | undefined,
	filter: DataViewFilter | undefined,
	lockedClauses: readonly DataViewFilterClause[]
): DataViewFilterValue | undefined {
	const sanitized = sanitizeDataViewFilterValue(value);
	if (!sanitized) return undefined;
	if (sanitized.kind === 'composite') {
		const clauses = pruneDataViewFilterClauses(
			sanitized.clauses,
			lockedClauses
		);
		return clauses.length ? { ...sanitized, clauses } : undefined;
	}
	const clauses = pruneDataViewFilterClauses(
		valueToClauses(filterKey, sanitized, filter),
		lockedClauses
	);
	return clauses.length ? sanitized : undefined;
}

function defaultOperator(
	value: DataViewFilterValue,
	type: DataViewFilter['type'] | undefined
): DataViewFilterOperator {
	if (value.kind === 'multi') return 'in';
	if (value.kind === 'range') return rangeOperatorForValue(value) ?? 'between';
	if (type === 'search') return 'contains';
	return 'eq';
}

function rangeOperatorForValue(
	value: Extract<DataViewFilterValue, { kind: 'range' }>
): DataViewFilterOperator | undefined {
	const hasFrom = value.from != null;
	const hasTo = value.to != null;
	if (hasFrom && hasTo) return 'between';
	if (hasFrom) return value.includeFrom === false ? 'gt' : 'gte';
	if (hasTo) return value.includeTo === false ? 'lt' : 'lte';
	return undefined;
}

function clausesConflict(
	userClause: DataViewFilterClause,
	lockedClause: DataViewFilterClause
) {
	if (userClause.field !== lockedClause.field) return false;
	if (userClause.operator === lockedClause.operator) return true;
	if (lockedClause.operator === 'between') {
		return RANGE_OPERATORS.has(userClause.operator);
	}
	if (RANGE_LOWER_OPERATORS.has(lockedClause.operator)) {
		return RANGE_LOWER_OPERATORS.has(userClause.operator);
	}
	if (RANGE_UPPER_OPERATORS.has(lockedClause.operator)) {
		return RANGE_UPPER_OPERATORS.has(userClause.operator);
	}
	return false;
}
