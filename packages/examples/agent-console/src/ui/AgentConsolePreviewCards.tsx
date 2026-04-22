'use client';

import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type { ReactNode } from 'react';

interface AgentConsoleResponsiveCardsProps<TItem> {
	getKey: (item: TItem) => string;
	items: readonly TItem[];
	renderItem: (item: TItem) => ReactNode;
}

export function AgentConsoleResponsiveCards<TItem>({
	getKey,
	items,
	renderItem,
}: AgentConsoleResponsiveCardsProps<TItem>) {
	return (
		<HStack gap="none" align="stretch" className="flex-wrap">
			{items.map((item) => (
				<Box
					key={getKey(item)}
					gap="none"
					className="flex w-full min-w-0 p-1.5 sm:w-1/2 lg:w-1/4"
				>
					{renderItem(item)}
				</Box>
			))}
		</HStack>
	);
}

export function AgentConsoleEntityCard({
	description,
	name,
	status,
	subtitle,
}: {
	description: string;
	name: string;
	status: string;
	subtitle: string;
}) {
	return (
		<Card className="h-full w-full">
			<CardContent className="flex flex-col gap-2 pt-6">
				<HStack justify="between" align="start">
					<VStack gap="xs" className="flex-1">
						<Text className="font-semibold text-lg">{name}</Text>
						<Text className="text-muted-foreground text-sm">{subtitle}</Text>
					</VStack>
					<AgentConsoleStatusBadge status={status} />
				</HStack>
				<Text className="text-muted-foreground text-sm">{description}</Text>
			</CardContent>
		</Card>
	);
}

export function AgentConsoleStatusBadge({ status }: { status: string }) {
	const variant =
		status === 'FAILED' || status === 'CANCELLED'
			? 'destructive'
			: status === 'ACTIVE' || status === 'COMPLETED'
				? 'secondary'
				: 'outline';

	return (
		<Badge variant={variant}>
			<Text className="font-semibold text-xs">{status}</Text>
		</Badge>
	);
}
