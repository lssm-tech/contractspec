'use client';

import type {
	DataViewDensity,
	DataViewGridConfig,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import * as React from 'react';
import { View } from 'react-native';
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
		<View className={className}>
			<DataViewList
				spec={listSpec}
				items={items}
				renderActions={renderActions}
				onSelect={onSelect}
				emptyState={emptyState}
				density={density}
			/>
		</View>
	);
}
