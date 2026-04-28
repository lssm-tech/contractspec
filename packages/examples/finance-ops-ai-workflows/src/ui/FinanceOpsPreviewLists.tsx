'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';

export function PillList({ items }: { items: readonly string[] }) {
	return (
		<HStack className="gap-2">
			{items.slice(0, 8).map((item) => (
				<Text
					key={item}
					className="rounded-full border border-border bg-background px-2 py-1 text-muted-foreground text-xs"
				>
					{item}
				</Text>
			))}
		</HStack>
	);
}

export function OrderedList({ items }: { items: readonly string[] }) {
	return (
		<VStack gap="xs">
			{items.map((item, index) => (
				<HStack
					key={`${index}-${item}`}
					align="start"
					wrap="nowrap"
					className="gap-3"
				>
					<Text className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-xs">
						{index + 1}
					</Text>
					<Text className="text-sm leading-6">{item}</Text>
				</HStack>
			))}
		</VStack>
	);
}

export function ReviewItem({ label, value }: { label: string; value: string }) {
	return (
		<VStack
			gap="xs"
			className="rounded-md border border-border bg-background p-3"
		>
			<Text className="font-semibold text-muted-foreground text-xs uppercase">
				{label}
			</Text>
			<Text className="text-sm leading-6">{value}</Text>
		</VStack>
	);
}
