'use client';

import type { ContractTableColumnDef } from '@contractspec/lib.presentation-runtime-react';
import * as React from 'react';
import type { ShowcaseRow } from './data-grid-showcase.data';
import {
	formatCurrency,
	formatDate,
	formatDateTime,
	StatusBadge,
} from './data-grid-showcase.parts';

export function useShowcaseColumns() {
	return React.useMemo<readonly ContractTableColumnDef<ShowcaseRow>[]>(
		() => [
			{
				id: 'account',
				header: 'Account',
				label: 'Account',
				accessorKey: 'account',
				size: 240,
				minSize: 180,
				canSort: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'owner',
				header: 'Owner',
				label: 'Owner',
				accessorKey: 'owner',
				size: 180,
				canSort: true,
				canHide: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'status',
				header: 'Status',
				label: 'Status',
				accessorKey: 'status',
				cell: ({ value }: { value: unknown }) => (
					<StatusBadge status={value as ShowcaseRow['status']} />
				),
				size: 140,
				canSort: true,
				canHide: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'region',
				header: 'Region',
				label: 'Region',
				accessorKey: 'region',
				size: 180,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'arr',
				header: 'ARR',
				label: 'ARR',
				accessorKey: 'arr',
				cell: ({ value }: { value: unknown }) => formatCurrency(Number(value)),
				align: 'right' as const,
				size: 140,
				canSort: true,
				canResize: true,
			},
			{
				id: 'renewalDate',
				header: 'Renewal',
				label: 'Renewal',
				accessorKey: 'renewalDate',
				cell: ({ value }: { value: unknown }) => formatDate(String(value)),
				size: 160,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'lastActivityAt',
				header: 'Last Activity',
				label: 'Last Activity',
				accessorKey: 'lastActivityAt',
				cell: ({ value }: { value: unknown }) => formatDateTime(String(value)),
				size: 200,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'notes',
				header: 'Notes',
				label: 'Notes',
				accessorKey: 'notes',
				size: 260,
				canHide: true,
				canResize: true,
			},
		],
		[]
	);
}
