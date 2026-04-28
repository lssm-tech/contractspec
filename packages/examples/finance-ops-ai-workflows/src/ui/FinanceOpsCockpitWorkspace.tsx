'use client';

import { Button } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import { StatusBadge } from './FinanceOpsStatusBadge';
import type { FinanceOpsDraftStatus } from './finance-ops-ai-workflows-demo-session';

export function WorkflowWorkspace({
	detail,
	list,
	listTitle,
	metrics,
	status,
	summary,
	title,
}: {
	detail: ReactNode;
	list: ReactNode;
	listTitle: string;
	metrics?: readonly { label: string; value: string }[];
	status: FinanceOpsDraftStatus;
	summary: string;
	title: string;
}) {
	return (
		<VStack gap="md" className="min-w-0 rounded-lg border border-border p-4">
			<Box
				align="start"
				justify="between"
				className="!grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2"
				style={{ display: 'grid' }}
			>
				<VStack gap="xs" className="min-w-0">
					<H2 className="font-semibold text-xl leading-tight">{title}</H2>
					<Text className="line-clamp-2 text-muted-foreground text-sm leading-6">
						{summary}
					</Text>
				</VStack>
				<StatusBadge status={status} />
			</Box>
			{metrics && metrics.length > 0 ? (
				<Box
					align="stretch"
					justify="start"
					className="!grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4"
					style={{ display: 'grid' }}
				>
					{metrics.map((metric) => (
						<VStack
							key={`${metric.label}-${metric.value}`}
							gap="xs"
							className="min-w-0 rounded-md border border-border bg-muted/40 p-3"
						>
							<Text className="truncate font-semibold text-muted-foreground text-xs uppercase">
								{metric.label}
							</Text>
							<Text className="truncate font-semibold text-sm">
								{metric.value}
							</Text>
						</VStack>
					))}
				</Box>
			) : null}
			<div className="flex min-w-0 flex-col gap-4 lg:flex-row">
				<VStack gap="sm" className="min-w-0 lg:basis-[48%] lg:shrink-0">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{listTitle}
					</Text>
					<VStack gap="xs" className="min-w-0">
						{list}
					</VStack>
				</VStack>
				<div className="min-w-0 lg:flex-1">{detail}</div>
			</div>
		</VStack>
	);
}

export function SelectableRow({
	badge,
	label,
	meta,
	onSelect,
	selected,
	value,
}: {
	badge?: string;
	label: string;
	meta: string;
	onSelect: () => void;
	selected: boolean;
	value?: string;
}) {
	return (
		<Button
			onPress={onSelect}
			variant="outline"
			className={[
				'h-auto min-h-12 w-full min-w-0 justify-start overflow-hidden p-0 text-left text-foreground',
				selected ? 'border-primary bg-primary/10' : 'bg-background',
			].join(' ')}
		>
			<HStack
				align="center"
				justify="between"
				wrap="nowrap"
				className="w-full min-w-0 gap-3 px-3 py-2"
			>
				<VStack gap="xs" className="min-w-0 flex-1">
					<Text className="truncate font-semibold text-sm">{label}</Text>
					<Text className="truncate text-muted-foreground text-xs">{meta}</Text>
				</VStack>
				{value ? (
					<Text className="shrink-0 truncate font-semibold text-sm">
						{value}
					</Text>
				) : null}
				{badge ? (
					<Text className="shrink-0 rounded-full border border-border px-2 py-1 text-[0.68rem] uppercase">
						{badge}
					</Text>
				) : null}
			</HStack>
		</Button>
	);
}
