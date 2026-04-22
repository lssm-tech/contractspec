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
} from '@contractspec/lib.ui-kit/ui/card';
import { DataTable as KitDataTable } from '@contractspec/lib.ui-kit/ui/data-table';
import { HStack, VStack } from '@contractspec/lib.ui-kit/ui/stack';
import * as React from 'react';
import {
	resolveTranslationNode,
	useDesignSystemTranslation,
} from '../../i18n/translation';

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
	const translate = useDesignSystemTranslation();
	const showHeader = title || description || headerActions;

	return (
		<Card className={className}>
			{showHeader ? (
				<CardHeader>
					<HStack justify="between" align="start">
						<VStack gap="xs">
							{title ? (
								<CardTitle>
									{resolveTranslationNode(title, translate)}
								</CardTitle>
							) : null}
							{description ? (
								<CardDescription>
									{resolveTranslationNode(description, translate)}
								</CardDescription>
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
