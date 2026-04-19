'use client';

import {
	Button,
	CodeBlock,
	DataTableToolbar,
} from '@contractspec/lib.design-system';
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
	sortColumnIds,
	searchValue,
	onSearchChange,
	activeChips,
	onClearAll,
	filterActions,
	onAction,
}: {
	controller: ContractTableController<ShowcaseRow, React.ReactNode>;
	label: string;
	primaryColumnId: string;
	toggleColumnId: string;
	pinColumnId: string;
	sortColumnIds: [string, string];
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	activeChips?: {
		key: string;
		label: React.ReactNode;
		onRemove?: () => void;
	}[];
	onClearAll?: () => void;
	filterActions?: React.ReactNode;
	onAction?: (message: string) => void;
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
	const firstSortColumn = controller.columns.find(
		(column) => column.id === sortColumnIds[0]
	);
	const secondSortColumn = controller.columns.find(
		(column) => column.id === sortColumnIds[1]
	);

	const runAction = React.useCallback(
		(action: string, handler: () => void) => {
			handler();
			onAction?.(`${label}: ${action}`);
		},
		[label, onAction]
	);

	return (
		<DataTableToolbar
			controller={controller}
			searchPlaceholder="Search accounts, owners, regions, or notes"
			searchValue={searchValue}
			onSearchChange={onSearchChange}
			activeChips={activeChips}
			onClearAll={onClearAll}
			actionsStart={
				<HStack gap="sm" className="flex-wrap">
					<Badge variant="outline">{label}</Badge>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction('toggled first-row selection', () =>
								firstRow?.toggleSelected?.(!firstRow?.isSelected)
							)
						}
					>
						Select First Row
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction('toggled first-row expansion', () =>
								firstRow?.toggleExpanded?.(!firstRow?.isExpanded)
							)
						}
					>
						Expand First Row
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction(
								toggleColumn?.visible
									? 'hid the notes column'
									: 'showed the notes column',
								() => toggleColumn?.toggleVisibility?.(!toggleColumn?.visible)
							)
						}
					>
						{toggleColumn?.visible ? 'Hide Notes Column' : 'Show Notes Column'}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction('pinned owner left', () => pinColumn?.pin?.('left'))
						}
					>
						Pin Owner Left
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction('pinned owner right', () => pinColumn?.pin?.('right'))
						}
					>
						Pin Owner Right
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction('cleared owner pinning', () => pinColumn?.pin?.(false))
						}
					>
						Unpin Owner
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction(
								`toggled sorting for ${firstSortColumn?.label ?? sortColumnIds[0]}`,
								() => firstSortColumn?.toggleSorting?.()
							)
						}
					>
						Toggle ARR Sort
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction(
								`toggled sorting for ${secondSortColumn?.label ?? sortColumnIds[1]}`,
								() => secondSortColumn?.toggleSorting?.()
							)
						}
					>
						Toggle Renewal Sort
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={() =>
							runAction('widened the account column', () =>
								primaryColumn?.resizeBy?.(40)
							)
						}
					>
						Widen Account
					</Button>
					{filterActions}
				</HStack>
			}
			actionsEnd={
				<>
					<Text className="text-muted-foreground text-xs">
						Account width {primaryColumn?.size ?? 0}px
					</Text>
					<Text className="text-muted-foreground text-xs">
						Pin state {String(pinColumn?.pinState || 'none')}
					</Text>
				</>
			}
		/>
	);
}

export function ShowcaseHeaderActions({
	label,
	loading,
	showEmpty,
	onToggleLoading,
	onToggleEmpty,
	onReset,
}: {
	label: string;
	loading: boolean;
	showEmpty: boolean;
	onToggleLoading: () => void;
	onToggleEmpty: () => void;
	onReset: () => void;
}) {
	return (
		<HStack gap="sm" className="flex-wrap justify-end">
			<Button variant="outline" size="sm" onPress={onToggleLoading}>
				{loading ? 'Stop Loading' : 'Simulate Loading'}
			</Button>
			<Button variant="outline" size="sm" onPress={onToggleEmpty}>
				{showEmpty ? 'Restore Rows' : 'Show Empty State'}
			</Button>
			<Button variant="ghost" size="sm" onPress={onReset}>
				Reset {label}
			</Button>
		</HStack>
	);
}

export function LayerMap() {
	return (
		<div className="grid gap-4 lg:grid-cols-4">
			<LayerCard
				title="@contractspec/lib.contracts-spec"
				description="Owns the declarative DataViewSpec contract for the account grid, including execution mode, selection, pinning, resizing, expansion, and initial state."
				eyebrow="Contract layer"
			/>
			<LayerCard
				title="@contractspec/lib.ui-kit"
				description="Provides the native-first primitive table renderer. The same controller and row model can be rendered inside Expo and React Native without changing the contract layer."
				eyebrow="Native primitive"
			/>
			<LayerCard
				title="@contractspec/lib.ui-kit-web"
				description="Provides the raw web primitive table renderer with pagination, visibility, pinning, resizing, selection, expansion, loading, and empty states."
				eyebrow="Web primitive"
			/>
			<LayerCard
				title="@contractspec/lib.design-system"
				description="Wraps the web primitive into an opinionated card surface that adds title, description, header actions, and canonical product-facing presentation."
				eyebrow="Composed surface"
			/>
		</div>
	);
}

function LayerCard({
	title,
	description,
	eyebrow,
}: {
	title: string;
	description: string;
	eyebrow: string;
}) {
	return (
		<div className="rounded-xl border border-border/80 bg-background/70 p-4">
			<Text className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
				{eyebrow}
			</Text>
			<Text className="mt-3 font-semibold text-base">{title}</Text>
			<Text className="mt-2 text-muted-foreground text-sm">{description}</Text>
		</div>
	);
}

export function CapabilityList() {
	const items = [
		'client + server execution',
		'single + multiple selection',
		'sorting',
		'pagination',
		'column visibility',
		'column resizing',
		'left/right pinning',
		'row expansion',
		'loading + empty states',
		'row press logs',
		'DataView adapter',
	];

	return (
		<HStack gap="sm" className="flex-wrap">
			{items.map((item) => (
				<Badge key={item} variant="outline">
					{item}
				</Badge>
			))}
		</HStack>
	);
}

export function InteractionLog({ entries }: { entries: string[] }) {
	return (
		<div className="rounded-xl border border-border/80 bg-background/70 p-4">
			<Text className="font-semibold text-base">Interaction Log</Text>
			<Text className="mt-1 text-muted-foreground text-sm">
				Row presses and control actions are logged here so the demo shows state
				changes instead of only static screenshots.
			</Text>
			<VStack gap="xs" className="mt-4">
				{entries.length > 0 ? (
					entries.map((entry, index) => (
						<Text key={`${entry}-${index}`} className="text-sm">
							{entry}
						</Text>
					))
				) : (
					<Text className="text-muted-foreground text-sm">
						No interactions yet. Click a row or one of the capability controls.
					</Text>
				)}
			</VStack>
		</div>
	);
}

export function NativePrimitivePanel() {
	return (
		<div className="space-y-4 rounded-xl border border-border/80 bg-background/70 p-4">
			<Text className="font-semibold text-base">
				Native-first primitive example
			</Text>
			<Text className="text-muted-foreground text-sm">
				The browser demo cannot mount the React Native renderer directly, so
				this lane shows the exact Expo/React Native code path that uses the same
				showcase rows, controller shape, and feature flags.
			</Text>
			<CodeBlock
				language="tsx"
				filename="packages/examples/data-grid-showcase/src/ui/native-table.tsx"
				code={NATIVE_PRIMITIVE_CODE}
			/>
		</div>
	);
}

const NATIVE_PRIMITIVE_CODE = `import { DataTableToolbar } from "@contractspec/lib.design-system";
import { DataTable } from "@contractspec/lib.ui-kit/ui/data-table";
import { useContractTable } from "@contractspec/lib.presentation-runtime-react";

import { SHOWCASE_ROWS } from "./data-grid-showcase.data";
import { useShowcaseColumns } from "./data-grid-showcase.columns";
import { ExpandedRowContent } from "./data-grid-showcase.parts";

export function NativePrimitiveTable() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: "single",
    initialState: {
      sorting: [{ id: "arr", desc: true }],
      pagination: { pageIndex: 0, pageSize: 4 },
      columnVisibility: { notes: false },
      columnPinning: { left: ["account"], right: [] },
    },
    renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
    getCanExpand: () => true,
  });

  return (
    <DataTable
      controller={controller}
      toolbar={
        <DataTableToolbar
          controller={controller}
          searchPlaceholder="Search accounts"
        />
      }
      footer={\`Rows \${controller.rows.length}\`}
    />
  );
}`;
