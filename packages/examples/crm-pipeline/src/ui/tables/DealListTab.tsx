'use client';

import {
	Button,
	DataTable,
	LoaderBlock,
} from '@contractspec/lib.design-system';
import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import * as React from 'react';
import { type Deal, useDealList } from '../hooks/useDealList';

function formatCurrency(value: number, currency = 'USD') {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

function statusVariant(status: Deal['status']) {
	switch (status) {
		case 'WON':
			return 'default';
		case 'LOST':
			return 'destructive';
		case 'STALE':
			return 'outline';
		default:
			return 'secondary';
	}
}

export interface DealListDataTableProps {
	deals: Deal[];
	totalItems: number;
	pageIndex: number;
	pageSize: number;
	sorting: ContractTableSort[];
	loading?: boolean;
	onSortingChange: (sorting: ContractTableSort[]) => void;
	onPaginationChange: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	onDealClick?: (dealId: string) => void;
}

export function DealListDataTable({
	deals,
	totalItems,
	pageIndex,
	pageSize,
	sorting,
	loading,
	onSortingChange,
	onPaginationChange,
	onDealClick,
}: DealListDataTableProps) {
	const controller = useContractTable<Deal>({
		data: deals,
		columns: [
			{
				id: 'deal',
				header: 'Deal',
				label: 'Deal',
				accessor: (deal) => deal.name,
				cell: ({ item }) => (
					<VStack gap="xs">
						<Text className="font-medium text-sm">{item.name}</Text>
						<Text className="text-muted-foreground text-xs">
							{item.companyId ?? 'Unassigned company'}
						</Text>
					</VStack>
				),
				size: 240,
				minSize: 180,
				canSort: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'value',
				header: 'Value',
				label: 'Value',
				accessorKey: 'value',
				cell: ({ item }) => formatCurrency(item.value, item.currency),
				align: 'right',
				size: 140,
				canSort: true,
				canResize: true,
			},
			{
				id: 'status',
				header: 'Status',
				label: 'Status',
				accessorKey: 'status',
				cell: ({ value }) => (
					<Badge variant={statusVariant(value as Deal['status'])}>
						{String(value)}
					</Badge>
				),
				size: 130,
				canSort: true,
				canHide: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'expectedCloseDate',
				header: 'Expected Close',
				label: 'Expected Close',
				accessor: (deal) => deal.expectedCloseDate?.toISOString() ?? '',
				cell: ({ item }) =>
					item.expectedCloseDate?.toLocaleDateString() ?? 'Not scheduled',
				size: 170,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'updatedAt',
				header: 'Updated',
				label: 'Updated',
				accessor: (deal) => deal.updatedAt.toISOString(),
				cell: ({ item }) => item.updatedAt.toLocaleDateString(),
				size: 140,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'actions',
				header: 'Actions',
				label: 'Actions',
				accessor: (deal) => deal.id,
				cell: ({ item }) => (
					<Button
						variant="ghost"
						size="sm"
						onPress={() => onDealClick?.(item.id)}
					>
						Actions
					</Button>
				),
				size: 120,
				canSort: false,
				canHide: false,
				canPin: false,
				canResize: false,
			},
		],
		executionMode: 'server',
		selectionMode: 'multiple',
		totalItems,
		state: {
			sorting,
			pagination: {
				pageIndex,
				pageSize,
			},
		},
		onSortingChange: onSortingChange,
		onPaginationChange: onPaginationChange,
		initialState: {
			columnVisibility: { updatedAt: false },
			columnPinning: { left: ['deal', 'status'], right: [] },
		},
		renderExpandedContent: (deal) => (
			<VStack gap="sm" className="py-2">
				<HStack justify="between">
					<Text className="font-medium text-sm">Owner</Text>
					<Text className="text-muted-foreground text-sm">{deal.ownerId}</Text>
				</HStack>
				<HStack justify="between">
					<Text className="font-medium text-sm">Contact</Text>
					<Text className="text-muted-foreground text-sm">
						{deal.contactId ?? 'No linked contact'}
					</Text>
				</HStack>
				{deal.wonSource ? (
					<HStack justify="between">
						<Text className="font-medium text-sm">Won Source</Text>
						<Text className="text-muted-foreground text-sm">
							{deal.wonSource}
						</Text>
					</HStack>
				) : null}
				{deal.lostReason ? (
					<HStack justify="between">
						<Text className="font-medium text-sm">Lost Reason</Text>
						<Text className="text-muted-foreground text-sm">
							{deal.lostReason}
						</Text>
					</HStack>
				) : null}
				{deal.notes ? (
					<VStack gap="xs">
						<Text className="font-medium text-sm">Notes</Text>
						<Text className="text-muted-foreground text-sm">{deal.notes}</Text>
					</VStack>
				) : null}
			</VStack>
		),
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="All Deals"
			description="Server-mode table using the shared ContractSpec controller."
			loading={loading}
			toolbar={
				<HStack gap="sm" className="flex-wrap">
					<Text className="text-muted-foreground text-sm">
						Selected {controller.selectedRowIds.length}
					</Text>
					<Text className="text-muted-foreground text-sm">
						{totalItems} total deals
					</Text>
				</HStack>
			}
			footer={`Page ${controller.pageIndex + 1} of ${controller.pageCount}`}
			emptyState={
				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
					No deals found
				</div>
			}
		/>
	);
}

export function DealListTab({
	onDealClick,
}: {
	onDealClick?: (dealId: string) => void;
}) {
	const [sorting, setSorting] = React.useState<ContractTableSort[]>([
		{ id: 'value', desc: true },
	]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 3,
	});
	const { data, loading } = useDealList({
		pageIndex: pagination.pageIndex,
		pageSize: pagination.pageSize,
		sorting,
	});

	if (loading && !data) {
		return <LoaderBlock label="Loading deals..." />;
	}

	return (
		<DealListDataTable
			deals={data?.deals ?? []}
			totalItems={data?.total ?? 0}
			pageIndex={pagination.pageIndex}
			pageSize={pagination.pageSize}
			sorting={sorting}
			loading={loading}
			onSortingChange={(nextSorting) => {
				setSorting(nextSorting);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
			onPaginationChange={setPagination}
			onDealClick={onDealClick}
		/>
	);
}
