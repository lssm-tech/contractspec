'use client';

import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { DataTable } from '../data-table/DataTable';

export interface TableColumn<T> {
	header: React.ReactNode;
	cell: (item: T, index: number) => React.ReactNode;
	className?: string;
}

const containerVariants = cva('', {
	variants: {
		density: {
			compact: 'gap-3',
			comfortable: 'gap-4 md:gap-5',
		},
	},
	defaultVariants: {
		density: 'comfortable',
	},
});

export interface ListTablePageProps<T>
	extends VariantProps<typeof containerVariants> {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	items: T[];
	columns: TableColumn<T>[];
	className?: string;
	renderActions?: (item: T, index: number) => React.ReactNode;
}

export function ListTablePage<T>({
	title,
	subtitle,
	items,
	columns,
	className,
	density,
	renderActions,
}: ListTablePageProps<T>) {
	const controller = useContractTable({
		data: items,
		columns: [
			...columns.map((column, index) => ({
				id: `column.${index}`,
				header: column.header,
				cell: ({ item, rowIndex }: { item: T; rowIndex: number }) =>
					column.cell(item, rowIndex),
			})),
			...(renderActions
				? [
						{
							id: 'actions',
							header: 'Actions',
							label: 'Actions',
							canSort: false,
							canHide: false,
							canResize: false,
							cell: ({ item, rowIndex }: { item: T; rowIndex: number }) =>
								renderActions(item, rowIndex),
						},
					]
				: []),
		],
	});

	return (
		<VStack
			className={[containerVariants({ density }), className]
				.filter(Boolean)
				.join(' ')}
		>
			<VStack className="gap-1">
				<Text className="font-bold text-2xl md:text-3xl">{title}</Text>
				{subtitle ? (
					<Text className="text-base text-muted-foreground">{subtitle}</Text>
				) : null}
			</VStack>
			<DataTable controller={controller} />
		</VStack>
	);
}
