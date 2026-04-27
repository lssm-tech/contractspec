'use client';

import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import type { SectionPreview } from './form-showcase-preview.model';

export function FieldKindGrid({ kinds }: { kinds: readonly string[] }) {
	return (
		<Box
			align="stretch"
			justify="start"
			wrap="wrap"
			className="grid grid-cols-2 gap-2 md:grid-cols-3"
		>
			{kinds.map((kind) => (
				<Text
					key={kind}
					className="rounded-md border border-border bg-background px-3 py-2 font-medium text-sm capitalize"
				>
					{kind.replaceAll('-', ' ')}
				</Text>
			))}
		</Box>
	);
}

export function SectionTimeline({
	sections,
}: {
	sections: readonly SectionPreview[];
}) {
	return (
		<VStack gap="sm">
			{sections.map((section, index) => (
				<HStack
					key={section.key}
					align="start"
					wrap="nowrap"
					className="rounded-md border border-border bg-background p-3"
				>
					<Text className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-xs">
						{index + 1}
					</Text>
					<VStack gap="xs" className="min-w-0">
						<Text className="font-semibold text-sm">
							{section.titleI18n ?? section.key}
						</Text>
						<Text className="text-muted-foreground text-xs">
							{section.descriptionI18n ??
								`${section.fieldNames.length} fields: ${section.fieldNames.join(', ')}`}
						</Text>
					</VStack>
				</HStack>
			))}
		</VStack>
	);
}

export function SampleValues({
	values,
}: {
	values: readonly (readonly [string, string])[];
}) {
	return (
		<VStack
			gap="xs"
			className="rounded-md border border-border bg-muted/40 p-3"
		>
			{values.map(([label, value]) => (
				<HStack key={label} justify="between" wrap="nowrap" className="gap-3">
					<Text className="text-muted-foreground text-xs">{label}</Text>
					<Text className="truncate font-medium text-xs">{value}</Text>
				</HStack>
			))}
		</VStack>
	);
}

export function PreviewPanel({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<VStack
			as="article"
			gap="md"
			className="min-w-0 flex-1 rounded-lg border border-border bg-card p-4 shadow-sm"
		>
			<VStack as="header" gap="xs">
				<H3 className="font-semibold text-lg">{title}</H3>
				<Text className="text-muted-foreground text-sm leading-6">
					{description}
				</Text>
			</VStack>
			{children}
		</VStack>
	);
}

export function Metric({ label, value }: { label: string; value: string }) {
	return (
		<VStack gap="none" className="min-w-0 flex-1">
			<Text className="font-semibold text-2xl">{value}</Text>
			<Text className="text-muted-foreground text-xs uppercase">{label}</Text>
		</VStack>
	);
}
