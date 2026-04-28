'use client';

import type {
	DataViewDensity,
	DataViewField,
	DataViewListConfig,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import { HStack, VStack } from '../layout';
import { Text } from '../typography';
import { DisplayValue } from './DataViewTable';

export interface DataViewListProps<TItem = Record<string, unknown>> {
	spec: DataViewSpec;
	items: readonly TItem[];
	className?: string;
	renderActions?: (item: TItem) => React.ReactNode;
	onSelect?: (item: TItem) => void;
	emptyState?: React.ReactNode;
	density?: DataViewDensity;
}

export function DataViewList<TItem = Record<string, unknown>>({
	spec,
	items,
	className,
	renderActions,
	onSelect,
	emptyState,
	density = 'comfortable',
}: DataViewListProps<TItem>) {
	const translate = useDesignSystemTranslation();
	if (spec.view.kind !== 'list') {
		throw new Error(
			`DataViewList received view kind "${spec.view.kind}", expected "list".`
		);
	}
	const view = spec.view as DataViewListConfig;
	const fields = view.fields;
	const primaryField = view.primaryField ?? fields[0]?.key;

	if (!items.length) {
		return (
			<VStack className={className}>
				{emptyState ?? (
					<View className="rounded-md border border-muted-foreground/40 border-dashed p-8">
						<Text className="text-center text-muted-foreground text-sm">
							No records available.
						</Text>
					</View>
				)}
			</VStack>
		);
	}

	return (
		<VStack className={className} gap={density === 'compact' ? 'sm' : 'md'}>
			{items.map((item, idx) => {
				const record = toRecord(item);
				return (
					<Pressable
						key={idx}
						className={[
							'rounded-lg border border-muted bg-card text-left shadow-sm',
							density === 'compact' ? 'p-3' : 'p-4',
						].join(' ')}
						onPress={() => onSelect?.(item)}
					>
						<VStack gap="sm">
							{primaryField ? (
								<Text className="font-medium text-base text-foreground">
									<DisplayValue
										item={record}
										fields={fields}
										fieldKey={primaryField}
									/>
								</Text>
							) : null}
							<HStack className="flex-wrap gap-x-4 gap-y-1">
								{secondaryFieldKeys(view, primaryField).map((fieldKey) => (
									<HStack key={fieldKey} className="items-center gap-1.5">
										<Text className="font-medium text-foreground/80 text-sm">
											{fieldLabel(fields, fieldKey, translate)}
										</Text>
										<Text className="text-muted-foreground text-sm">
											<DisplayValue
												item={record}
												fields={fields}
												fieldKey={fieldKey}
											/>
										</Text>
									</HStack>
								))}
							</HStack>
							{renderActions ? (
								<HStack className="items-center gap-2">
									{renderActions(item)}
								</HStack>
							) : null}
						</VStack>
					</Pressable>
				);
			})}
		</VStack>
	);
}

function toRecord(value: unknown): Record<string, unknown> {
	if (value && typeof value === 'object') {
		return value as Record<string, unknown>;
	}
	return {};
}

function fieldLabel(
	fields: DataViewField[],
	key: string,
	translate?: (value: string) => string | undefined
) {
	return resolveTranslationString(
		fields.find((field) => field.key === key)?.label ?? key,
		translate
	);
}

function secondaryFieldKeys(view: DataViewListConfig, primaryField?: string) {
	if (view.secondaryFields?.length) return view.secondaryFields;
	return view.fields
		.map((field) => field.key)
		.filter((key) => key !== primaryField);
}
