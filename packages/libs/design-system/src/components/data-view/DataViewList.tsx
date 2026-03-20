'use client';

import type {
	DataViewField,
	DataViewListConfig,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { DisplayValue } from './DataViewTable';

export interface DataViewListProps<TItem = Record<string, unknown>> {
	spec: DataViewSpec;
	items: readonly TItem[];
	className?: string;
	renderActions?: (item: TItem) => React.ReactNode;
	onSelect?: (item: TItem) => void;
	emptyState?: React.ReactNode;
}

export function DataViewList<TItem = Record<string, unknown>>({
	spec,
	items,
	className,
	renderActions,
	onSelect,
	emptyState,
}: DataViewListProps<TItem>) {
	if (spec.view.kind !== 'list') {
		throw new Error(
			`DataViewList received view kind "${spec.view.kind}", expected "list".`
		);
	}
	const view = spec.view as DataViewListConfig;
	const fields = view.fields;
	const primaryField =
		view.primaryField ??
		fields.find((field) => field.key === view.primaryField)?.key ??
		fields[0]?.key;

	if (!items.length) {
		return (
			<div className={cn('flex w-full flex-col gap-4', className)}>
				{emptyState ?? (
					<div className="rounded-md border border-muted-foreground/40 border-dashed p-8 text-center text-muted-foreground text-sm">
						No records available.
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={cn('flex w-full flex-col gap-4', className)}>
			{items.map((item, idx) => {
				const record = toRecord(item);
				return (
					<button
						type="button"
						key={idx}
						className={cn(
							'flex w-full flex-col gap-2 rounded-lg border border-muted bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
							view.layout === 'compact' &&
								'md:flex-row md:items-center md:gap-4'
						)}
						onClick={() => onSelect?.(item)}
					>
						<div className="flex flex-1 flex-col gap-1">
							{primaryField ? (
								<span className="font-medium text-base text-foreground">
									<DisplayValue
										item={record}
										fields={fields}
										fieldKey={primaryField}
									/>
								</span>
							) : null}
							<div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
								{secondaryFieldKeys(view, primaryField).map((fieldKey) => (
									<span key={fieldKey} className="flex items-center gap-1.5">
										<span className="font-medium text-foreground/80">
											{fieldLabel(fields, fieldKey)}
										</span>
										<span>
											<DisplayValue
												item={record}
												fields={fields}
												fieldKey={fieldKey}
											/>
										</span>
									</span>
								))}
							</div>
						</div>
						{renderActions ? (
							<div className="flex shrink-0 items-center gap-2">
								{renderActions(item)}
							</div>
						) : null}
					</button>
				);
			})}
		</div>
	);
}

function toRecord(value: unknown): Record<string, unknown> {
	if (value && typeof value === 'object') {
		return value as Record<string, unknown>;
	}
	return {};
}

function fieldLabel(fields: DataViewField[], key: string) {
	return fields.find((field) => field.key === key)?.label ?? key;
}

function secondaryFieldKeys(view: DataViewListConfig, primaryField?: string) {
	if (view.secondaryFields?.length) return view.secondaryFields;
	return view.fields
		.map((field) => field.key)
		.filter((key) => key !== primaryField);
}
