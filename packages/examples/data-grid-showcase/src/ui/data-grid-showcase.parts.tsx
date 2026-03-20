'use client';

import { Button } from '@contractspec/lib.design-system';
import type { ContractTablePinState } from '@contractspec/lib.presentation-runtime-core';
import type { ContractTableController } from '@contractspec/lib.presentation-runtime-react';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import * as React from 'react';
import type { ShowcaseRow, ShowcaseStatus } from './data-grid-showcase.data';

const STATUS_LABELS: Record<ShowcaseStatus, string> = {
	healthy: 'Healthy',
	attention: 'Attention',
	risk: 'Risk',
};

const STATUS_VARIANTS: Record<
	ShowcaseStatus,
	'default' | 'secondary' | 'destructive'
> = {
	healthy: 'default',
	attention: 'secondary',
	risk: 'destructive',
};

export function formatCurrency(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatDate(value: string) {
	return new Date(value).toLocaleDateString();
}

export function formatDateTime(value: string) {
	return new Date(value).toLocaleString();
}

export function StatusBadge({ status }: { status: ShowcaseStatus }) {
	return (
		<Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
	);
}

export function ExpandedRowContent({ row }: { row: ShowcaseRow }) {
	return (
		<VStack gap="sm" className="py-2">
			<HStack justify="between">
				<Text className="font-medium text-sm">Renewal</Text>
				<Text className="text-muted-foreground text-sm">
					{formatDate(row.renewalDate)}
				</Text>
			</HStack>
			<HStack justify="between">
				<Text className="font-medium text-sm">Last Activity</Text>
				<Text className="text-muted-foreground text-sm">
					{formatDateTime(row.lastActivityAt)}
				</Text>
			</HStack>
			<VStack gap="xs">
				<Text className="font-medium text-sm">Notes</Text>
				<Text className="text-muted-foreground text-sm">{row.notes}</Text>
			</VStack>
		</VStack>
	);
}

export function ShowcaseToolbar({
	controller,
	label,
	primaryColumnId,
	toggleColumnId,
	pinColumnId,
}: {
	controller: ContractTableController<ShowcaseRow, React.ReactNode>;
	label: string;
	primaryColumnId: string;
	toggleColumnId: string;
	pinColumnId: string;
}) {
	const firstRow = controller.rows[0];
	const primaryColumn = controller.columns.find(
		(column) => column.id === primaryColumnId
	);
	const toggleColumn = controller.columns.find(
		(column) => column.id === toggleColumnId
	);
	const pinColumn = controller.columns.find(
		(column) => column.id === pinColumnId
	);
	const pinTarget: ContractTablePinState =
		pinColumn?.pinState === 'left' ? false : 'left';

	return (
		<HStack gap="sm" className="flex-wrap">
			<Badge variant="outline">{label}</Badge>
			<Text className="text-muted-foreground text-sm">
				Selected {controller.selectedRowIds.length}
			</Text>
			<Button
				variant="outline"
				size="sm"
				onPress={() => firstRow?.toggleSelected?.(!firstRow?.isSelected)}
			>
				Select First Row
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => firstRow?.toggleExpanded?.(!firstRow?.isExpanded)}
			>
				Expand First Row
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => toggleColumn?.toggleVisibility?.(!toggleColumn?.visible)}
			>
				{toggleColumn?.visible ? 'Hide Notes Column' : 'Show Notes Column'}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => pinColumn?.pin?.(pinTarget)}
			>
				{pinColumn?.pinState === 'left' ? 'Unpin Owner' : 'Pin Owner'}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => primaryColumn?.resizeBy?.(40)}
			>
				Widen Account
			</Button>
			<Text className="text-muted-foreground text-xs">
				Account width {primaryColumn?.size ?? 0}px
			</Text>
		</HStack>
	);
}
