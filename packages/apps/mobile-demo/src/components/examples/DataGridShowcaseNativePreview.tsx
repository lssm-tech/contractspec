import { DataGridShowcaseDataView } from '@contractspec/example.data-grid-showcase/contracts/data-grid-showcase.data-view';
import {
	SHOWCASE_ROWS,
	type ShowcaseRow,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type SortKey = 'account' | 'arr' | 'region' | 'renewalDate' | 'status';

const PREVIEW_COLUMNS: readonly {
	key: SortKey;
	label: string;
	width: number;
	align?: 'left' | 'right';
}[] = [
	{ key: 'account', label: 'Account', width: 190 },
	{ key: 'status', label: 'Status', width: 130 },
	{ key: 'region', label: 'Region', width: 150 },
	{ key: 'arr', label: 'ARR', width: 130, align: 'right' },
	{ key: 'renewalDate', label: 'Renewal', width: 150 },
];

export function DataGridShowcaseNativePreview() {
	const [lastPressedRow, setLastPressedRow] = useState<string | null>(null);
	const [pageIndex, setPageIndex] = useState(0);
	const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>(() => {
		const tableView =
			DataGridShowcaseDataView.view.kind === 'table'
				? DataGridShowcaseDataView.view
				: null;
		const initialSort = tableView?.initialState?.sorting?.[0];
		return {
			key: isSortKey(initialSort?.field) ? initialSort.field : 'arr',
			desc: initialSort?.desc ?? true,
		};
	});
	const pageSize =
		DataGridShowcaseDataView.view.kind === 'table'
			? (DataGridShowcaseDataView.view.initialState?.pageSize ?? 4)
			: 4;

	const sortedRows = useMemo(() => {
		return [...SHOWCASE_ROWS].sort((left, right) => {
			const leftValue = left[sort.key];
			const rightValue = right[sort.key];
			if (leftValue === rightValue) return 0;
			const comparison = leftValue > rightValue ? 1 : -1;
			return sort.desc ? comparison * -1 : comparison;
		});
	}, [sort]);
	const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
	const visibleRows = sortedRows.slice(
		pageIndex * pageSize,
		pageIndex * pageSize + pageSize
	);

	const setSortKey = (key: SortKey) => {
		setPageIndex(0);
		setSort((current) => ({
			key,
			desc: current.key === key ? !current.desc : false,
		}));
	};

	return (
		<View className="gap-5">
			<View className="gap-2 rounded-lg border border-input bg-card p-4">
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					ContractSpec native preview
				</Text>
				<Text className="font-semibold text-2xl text-foreground">
					{DataGridShowcaseDataView.meta.title}
				</Text>
				<Text className="text-muted-foreground text-sm leading-6">
					This preview reuses the example DataView contract and shared rows,
					then renders them directly with React Native primitives.
				</Text>
				<Text className="font-mono text-muted-foreground text-xs">
					{DataGridShowcaseDataView.meta.key}
				</Text>
			</View>

			<View className="gap-3 rounded-lg border border-input bg-card p-3">
				<View className="gap-1">
					<Text className="font-semibold text-foreground text-lg">
						Accounts
					</Text>
					<Text className="text-muted-foreground text-xs">
						{sortedRows.length} rows - page {pageIndex + 1} of {pageCount}
					</Text>
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator>
					<View>
						<View className="flex-row border-input border-b bg-muted/60">
							{PREVIEW_COLUMNS.map((column) => {
								const active = sort.key === column.key;
								return (
									<Pressable
										key={column.key}
										className="min-h-11 justify-center px-3"
										style={{ width: column.width }}
										accessibilityRole="button"
										accessibilityLabel={`Sort by ${column.label}`}
										onPress={() => setSortKey(column.key)}
									>
										<Text className="font-semibold text-muted-foreground text-xs">
											{column.label}
											{active ? (sort.desc ? ' desc' : ' asc') : ''}
										</Text>
									</Pressable>
								);
							})}
						</View>

						{visibleRows.map((row) => (
							<Pressable
								key={row.id}
								className="flex-row border-input border-b bg-background"
								accessibilityRole="button"
								accessibilityLabel={`Select ${row.account}`}
								onPress={() => setLastPressedRow(row.account)}
							>
								{PREVIEW_COLUMNS.map((column) => (
									<View
										key={`${row.id}-${column.key}`}
										className="min-h-14 justify-center px-3"
										style={{ width: column.width }}
									>
										{renderCell(row, column.key, column.align)}
									</View>
								))}
							</Pressable>
						))}
					</View>
				</ScrollView>

				<View className="flex-row flex-wrap gap-2">
					<Button
						disabled={pageIndex === 0}
						size="sm"
						variant="outline"
						onPress={() => setPageIndex((current) => Math.max(0, current - 1))}
					>
						<Text>Previous</Text>
					</Button>
					<Button
						disabled={pageIndex >= pageCount - 1}
						size="sm"
						variant="outline"
						onPress={() =>
							setPageIndex((current) => Math.min(pageCount - 1, current + 1))
						}
					>
						<Text>Next</Text>
					</Button>
				</View>

				{lastPressedRow ? (
					<Text className="text-muted-foreground text-xs">
						Last selected row: {lastPressedRow}
					</Text>
				) : null}
			</View>
		</View>
	);
}

function renderCell(
	row: ShowcaseRow,
	key: SortKey,
	align: 'left' | 'right' = 'left'
) {
	if (key === 'status') {
		return <StatusChip status={row.status} />;
	}

	const value =
		key === 'arr'
			? formatCurrency(row.arr)
			: key === 'renewalDate'
				? formatDate(row.renewalDate)
				: String(row[key]);

	return (
		<Text
			className={`text-foreground text-sm ${align === 'right' ? 'text-right font-semibold' : ''}`}
		>
			{value}
		</Text>
	);
}

function StatusChip({ status }: { status: ShowcaseRow['status'] }) {
	const label = {
		healthy: 'Healthy',
		attention: 'Attention',
		risk: 'Risk',
	}[status];

	return (
		<View className="rounded-full border border-input bg-muted px-2 py-1">
			<Text className="font-semibold text-muted-foreground text-xs">
				{label}
			</Text>
		</View>
	);
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('en-US', {
		currency: 'USD',
		maximumFractionDigits: 0,
		style: 'currency',
	}).format(value);
}

function formatDate(value: string): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(value));
}

function isSortKey(value: string | undefined): value is SortKey {
	return PREVIEW_COLUMNS.some((column) => column.key === value);
}
