'use client';

import type { ApprovalRequest } from '@contractspec/lib.ai-agent/approval';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { Badge } from '@contractspec/lib.ui-kit/ui/badge';
import { HStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import * as React from 'react';
import { Button } from '../atoms/Button';
import { DataTable } from '../data-table/DataTable';

export interface ApprovalQueueProps {
	title?: string;
	description?: string;
	requests: ApprovalRequest[];
	onApprove?: (request: ApprovalRequest) => void;
	onReject?: (request: ApprovalRequest) => void;
	className?: string;
	emptyState?: React.ReactNode;
}

export function ApprovalQueue({
	title = 'Approvals',
	description = 'Requests escalated by AI agents',
	requests,
	onApprove,
	onReject,
	className,
	emptyState = (
		<Text className="text-muted-foreground">Nothing waiting for review.</Text>
	),
}: ApprovalQueueProps) {
	const controller = useContractTable({
		data: requests,
		columns: [
			{
				id: 'agent',
				header: 'Agent',
				accessor: (request) => request.agentId,
				cell: ({ item }) => <Text className="font-medium">{item.agentId}</Text>,
			},
			{
				id: 'reason',
				header: 'Reason',
				accessor: (request) => request.reason,
				cell: ({ item }) => <Text className="max-w-sm">{item.reason}</Text>,
			},
			{
				id: 'tenant',
				header: 'Tenant',
				accessor: (request) => request.tenantId ?? '—',
			},
			{
				id: 'requested',
				header: 'Requested',
				accessor: (request) => formatRelative(request.requestedAt),
			},
			{
				id: 'status',
				header: 'Status',
				accessor: (request) => request.status,
				cell: ({ item }) => (
					<Badge variant={badgeVariant(item.status)}>{item.status}</Badge>
				),
			},
			{
				id: 'actions',
				header: 'Actions',
				canSort: false,
				canHide: false,
				canResize: false,
				cell: ({ item }) => (
					<HStack gap="sm">
						<Button
							size="sm"
							variant="secondary"
							disabled={item.status !== 'pending'}
							onPress={() => onReject?.(item)}
						>
							Reject
						</Button>
						<Button
							size="sm"
							disabled={item.status !== 'pending'}
							onPress={() => onApprove?.(item)}
						>
							Approve
						</Button>
					</HStack>
				),
			},
		],
	});

	return (
		<DataTable
			controller={controller}
			title={title}
			description={description}
			className={className}
			emptyState={emptyState}
		/>
	);
}

function badgeVariant(
	status: ApprovalRequest['status']
): 'default' | 'secondary' | 'outline' | 'destructive' {
	switch (status) {
		case 'approved':
			return 'default';
		case 'rejected':
			return 'destructive';
		default:
			return 'secondary';
	}
}

function formatRelative(date: Date) {
	const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
	const deltaMinutes = Math.round(
		(Date.now() - new Date(date).getTime()) / 60000
	);
	if (Math.abs(deltaMinutes) < 60) {
		return formatter.format(-deltaMinutes, 'minute');
	}
	const deltaHours = Math.round(deltaMinutes / 60);
	if (Math.abs(deltaHours) < 24) {
		return formatter.format(-deltaHours, 'hour');
	}
	const deltaDays = Math.round(deltaHours / 24);
	return formatter.format(-deltaDays, 'day');
}
