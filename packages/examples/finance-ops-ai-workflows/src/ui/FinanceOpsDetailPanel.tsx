'use client';

import { Button } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import { StatusBadge } from './FinanceOpsStatusBadge';
import type { FinanceOpsDraftStatus } from './finance-ops-ai-workflows-demo-session';

export function DetailPanel({
	children,
	eyebrow,
	onMarkReady,
	onRequestChanges,
	status,
	title,
}: {
	children: ReactNode;
	eyebrow: string;
	onMarkReady: () => void;
	onRequestChanges: () => void;
	status: FinanceOpsDraftStatus;
	title: string;
}) {
	return (
		<VStack
			gap="md"
			className="min-w-0 rounded-md border border-border bg-background p-4"
		>
			<Box
				align="start"
				justify="between"
				className="!grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"
				style={{ display: 'grid' }}
			>
				<VStack gap="xs" className="min-w-0">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{eyebrow}
					</Text>
					<H3 className="truncate font-semibold text-lg">{title}</H3>
				</VStack>
				<StatusBadge status={status} />
			</Box>
			<VStack gap="sm" className="min-w-0">
				{children}
			</VStack>
			<HStack className="gap-2">
				<Button
					onPress={onRequestChanges}
					variant="outline"
					className="min-w-0 bg-background text-foreground"
				>
					Request changes
				</Button>
				<Button onPress={onMarkReady} className="min-w-0">
					Mark ready
				</Button>
			</HStack>
		</VStack>
	);
}

export function DetailField({
	label,
	value,
}: {
	label: string;
	value: ReactNode;
}) {
	return (
		<Box
			align="start"
			justify="start"
			className="!grid min-w-0 grid-cols-1 gap-1 border-border border-b py-2 last:border-b-0 sm:grid-cols-3"
			style={{ display: 'grid' }}
		>
			<Text className="font-semibold text-muted-foreground text-xs uppercase">
				{label}
			</Text>
			<Text className="min-w-0 text-sm leading-6 sm:col-span-2">{value}</Text>
		</Box>
	);
}
