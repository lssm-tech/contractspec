'use client';

import { Button } from '@contractspec/lib.design-system';
import type {
	ContractTableController,
} from '@contractspec/lib.presentation-runtime-react';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import type { ReactNode } from 'react';

const STATUS_VARIANTS: Record<
	string,
	'default' | 'secondary' | 'destructive' | 'outline'
> = {
	ACTIVE: 'default',
	CONNECTED: 'default',
	SUCCESS: 'default',
	PENDING: 'secondary',
	PAUSED: 'secondary',
	ERROR: 'destructive',
	DISCONNECTED: 'outline',
};

export function formatDateTime(value?: Date) {
	return value ? value.toLocaleString() : 'Never';
}

export function formatJson(value?: Record<string, unknown>) {
	return value ? JSON.stringify(value, null, 2) : 'No configuration';
}

export function StatusBadge({ status }: { status: string }) {
	return <Badge variant={STATUS_VARIANTS[status] ?? 'outline'}>{status}</Badge>;
}

export function IntegrationTableToolbar<TItem>({
	controller,
	label,
	toggleColumnId,
	toggleVisibleLabel,
	toggleHiddenLabel,
	pinColumnId,
	pinLabel,
	resizeColumnId,
	resizeLabel,
}: {
	controller: ContractTableController<TItem, ReactNode>;
	label: string;
	toggleColumnId: string;
	toggleVisibleLabel: string;
	toggleHiddenLabel: string;
	pinColumnId: string;
	pinLabel: string;
	resizeColumnId: string;
	resizeLabel: string;
}) {
	const firstRow = controller.rows[0];
	const toggleColumn = controller.columns.find(
		(column) => column.id === toggleColumnId
	);
	const pinColumn = controller.columns.find((column) => column.id === pinColumnId);
	const resizeColumn = controller.columns.find(
		(column) => column.id === resizeColumnId
	);
	const pinTarget = pinColumn?.pinState === 'left' ? false : 'left';

	return (
		<HStack gap="sm" className="flex-wrap">
			<Badge variant="outline">{label}</Badge>
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
				{toggleColumn?.visible ? toggleVisibleLabel : toggleHiddenLabel}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => pinColumn?.pin?.(pinTarget)}
			>
				{pinColumn?.pinState === 'left' ? `Unpin ${pinLabel}` : `Pin ${pinLabel}`}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => resizeColumn?.resizeBy?.(40)}
			>
				{resizeLabel}
			</Button>
		</HStack>
	);
}
