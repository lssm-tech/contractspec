'use client';

import type {
	DataViewDensity,
	DataViewGridConfig,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { DataViewList } from './DataViewList';

export interface DataViewGridProps<TItem = Record<string, unknown>> {
	spec: DataViewSpec;
	items: readonly TItem[];
	className?: string;
	renderActions?: (item: TItem) => React.ReactNode;
	onSelect?: (item: TItem) => void;
	emptyState?: React.ReactNode;
	density?: DataViewDensity;
}

export function DataViewGrid<TItem = Record<string, unknown>>({
	spec,
	items,
	className,
	renderActions,
	onSelect,
	emptyState,
	density = 'comfortable',
}: DataViewGridProps<TItem>) {
	if (spec.view.kind !== 'grid') {
		throw new Error(
			`DataViewGrid received view kind "${spec.view.kind}", expected "grid".`
		);
	}

	const view = spec.view as DataViewGridConfig;
	const columns = view.columns ?? 3;
	const listSpec = {
		...spec,
		view: {
			kind: 'list',
			layout: 'card',
			fields: view.fields,
			primaryField: view.primaryField,
			secondaryFields: view.secondaryFields,
			filters: view.filters,
			filterScope: view.filterScope,
			actions: view.actions,
			collection: view.collection,
		},
	} satisfies DataViewSpec;

	return (
		<div
			className={cn(
				'grid w-full gap-4',
				density === 'compact' && 'gap-3',
				gridColumnsClass(columns),
				className
			)}
		>
			<DataViewList
				spec={listSpec}
				items={items}
				className="contents"
				renderActions={renderActions}
				onSelect={onSelect}
				emptyState={emptyState}
				density={density}
			/>
		</div>
	);
}

function gridColumnsClass(columns: number): string {
	if (columns <= 1) return 'grid-cols-1';
	if (columns === 2) return 'md:grid-cols-2';
	if (columns === 4) return 'md:grid-cols-2 xl:grid-cols-4';
	return 'md:grid-cols-2 lg:grid-cols-3';
}
