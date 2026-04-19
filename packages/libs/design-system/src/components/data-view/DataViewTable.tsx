'use client';

import type {
	DataViewField,
	DataViewSpec,
	DataViewTableConfig,
} from '@contractspec/lib.contracts-spec/data-views';
import { useDataViewTable } from '@contractspec/lib.presentation-runtime-react';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import * as React from 'react';
import {
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import { DataTable as ContractDataTable } from '../data-table/DataTable';
import { DataViewFormattedValue, getAtPath } from './utils';

export interface DataViewTableProps {
	spec: DataViewSpec;
	items: Record<string, unknown>[];
	className?: string;
	onRowClick?: (item: Record<string, unknown>) => void;
	toolbar?: React.ReactNode;
	loading?: boolean;
	emptyState?: React.ReactNode;
	headerActions?: React.ReactNode;
	footer?: React.ReactNode;
}

export function DataViewTable({
	spec,
	items,
	className,
	onRowClick,
	toolbar,
	loading,
	emptyState,
	headerActions,
	footer,
}: DataViewTableProps) {
	const translate = useDesignSystemTranslation();
	if (spec.view.kind !== 'table') {
		throw new Error(
			`DataViewTable received view kind "${spec.view.kind}", expected "table".`
		);
	}

	const view = spec.view as DataViewTableConfig;
	const expandedFields = React.useMemo(
		() =>
			(view.rowExpansion?.fields ?? [])
				.map((fieldKey) =>
					view.fields.find((candidate) => candidate.key === fieldKey)
				)
				.filter((field): field is DataViewField => Boolean(field)),
		[view.fields, view.rowExpansion?.fields]
	);

	const controller = useDataViewTable({
		spec,
		data: items,
		renderValue: ({ value, field }) => (
			<DataViewFormattedValue value={value} format={field.format} />
		),
		renderExpandedContent:
			expandedFields.length > 0
				? ({ item, fields }) => (
						<VStack gap="sm" className="py-2">
							{fields.map((field) => (
								<HStack key={field.key} justify="between" align="start">
									<Text className="font-medium text-muted-foreground text-sm">
										{resolveTranslationString(field.label, translate)}
									</Text>
									<Text className="text-right text-sm">
										<DisplayValue
											item={item}
											fields={fields}
											fieldKey={field.key}
										/>
									</Text>
								</HStack>
							))}
						</VStack>
					)
				: undefined,
	});

	return (
		<ContractDataTable
			controller={controller}
			className={className}
			title={resolveTranslationString(spec.meta.title, translate)}
			description={resolveTranslationString(spec.meta.description, translate)}
			toolbar={toolbar}
			loading={loading}
			headerActions={headerActions}
			emptyState={emptyState}
			footer={footer}
			onRowPress={onRowClick ? (row) => onRowClick(row.original) : undefined}
		/>
	);
}

function fieldByKey(fields: DataViewField[], key: string) {
	return fields.find((field) => field.key === key);
}

export function DisplayValue({
	item,
	fields,
	fieldKey,
}: {
	item: Record<string, unknown>;
	fields: DataViewField[];
	fieldKey: string;
}) {
	const field = fieldByKey(fields, fieldKey);
	if (!field) return '';
	const value = getAtPath(item, field.dataPath);
	return <DataViewFormattedValue value={value} format={field.format} />;
}
