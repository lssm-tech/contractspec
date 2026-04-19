'use client';

import {
	Button,
	DataTable,
	DataTableToolbar,
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
	search: string;
	status: 'OPEN' | 'WON' | 'LOST' | 'all';
	loading?: boolean;
	onSortingChange: (sorting: ContractTableSort[]) => void;
	onPaginationChange: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: 'OPEN' | 'WON' | 'LOST' | 'all') => void;
	onDealClick?: (dealId: string) => void;
}

function buildStatusActions({
	value,
	onChange,
}: {
	value: 'OPEN' | 'WON' | 'LOST' | 'all';
	onChange: (value: 'OPEN' | 'WON' | 'LOST' | 'all') => void;
}) {
	return (
		<HStack gap="sm" className="flex-wrap">
			<Button
				variant={value === 'all' ? 'secondary' : 'outline'}
				size="sm"
				onPress={() => onChange('all')}
			>
				All Deals
			</Button>
			<Button
				variant={value === 'OPEN' ? 'secondary' : 'outline'}
				size="sm"
				onPress={() => onChange('OPEN')}
			>
				Open Only
			</Button>
			<Button
				variant={value === 'WON' ? 'secondary' : 'outline'}
				size="sm"
				onPress={() => onChange('WON')}
			>
				Won Only
			</Button>
			<Button
				variant={value === 'LOST' ? 'secondary' : 'outline'}
				size="sm"
				onPress={() => onChange('LOST')}
			>
				Lost Only
			</Button>
		</HStack>
	);
}

export function DealListDataTable({
	deals,
	totalItems,
	pageIndex,
	pageSize,
	sorting,
	search,
	status,
	loading,
	onSortingChange,
	onPaginationChange,
	onSearchChange,
	onStatusChange,
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
				<DataTableToolbar
					controller={controller}
					searchPlaceholder="Search deals, companies, contacts, or notes"
					searchValue={search}
					onSearchChange={onSearchChange}
					activeChips={
						status === 'all'
							? []
							: [
									{
										key: 'status',
										label: `Status: ${status}`,
										onRemove: () => onStatusChange('all'),
									},
								]
					}
					onClearAll={() => {
						onSearchChange('');
						onStatusChange('all');
					}}
					actionsStart={buildStatusActions({
						value: status,
						onChange: onStatusChange,
					})}
					actionsEnd={
						<Text className="text-muted-foreground text-sm">
							{totalItems} total deals
						</Text>
					}
				/>
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
	const [search, setSearch] = React.useState('');
	const [status, setStatus] = React.useState<'OPEN' | 'WON' | 'LOST' | 'all'>(
		'all'
	);
	const { data, loading } = useDealList({
		pageIndex: pagination.pageIndex,
		pageSize: pagination.pageSize,
		search,
		status,
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
			search={search}
			status={status}
			loading={loading}
			onSortingChange={(nextSorting) => {
				setSorting(nextSorting);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
			onPaginationChange={setPagination}
			onSearchChange={(value) => {
				setSearch(value);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
			onStatusChange={(value) => {
				setStatus(value);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
			onDealClick={onDealClick}
		/>
	);
}
