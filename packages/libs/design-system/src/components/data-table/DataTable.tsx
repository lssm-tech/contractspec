'use client';

import type {
	ContractTableController,
	ContractTableRowRenderModel,
} from '@contractspec/lib.presentation-runtime-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { DataTable as KitDataTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import * as React from 'react';

export interface DataTableProps<TItem = unknown> {
	controller: ContractTableController<TItem, React.ReactNode>;
	title?: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
	headerActions?: React.ReactNode;
	toolbar?: React.ReactNode;
	footer?: React.ReactNode;
	emptyState?: React.ReactNode;
	loading?: boolean;
	onRowPress?: (
		row: ContractTableRowRenderModel<TItem, React.ReactNode>
	) => void;
}

export function DataTable<TItem>({
	controller,
	title,
	description,
	className,
	headerActions,
	toolbar,
	footer,
	emptyState,
	loading,
	onRowPress,
}: DataTableProps<TItem>) {
	const showHeader = title || description || headerActions;

	return (
		<Card className={className}>
			{showHeader ? (
				<CardHeader>
					<HStack justify="between" align="start">
						<VStack gap="xs">
							{title ? <CardTitle>{title}</CardTitle> : null}
							{description ? (
								<CardDescription>{description}</CardDescription>
							) : null}
						</VStack>
						{headerActions}
					</HStack>
				</CardHeader>
			) : null}
			<CardContent>
				<KitDataTable
					controller={controller}
					toolbar={toolbar}
					footer={footer}
					emptyState={emptyState}
					loading={loading}
					onRowPress={onRowPress}
				/>
			</CardContent>
		</Card>
	);
}
