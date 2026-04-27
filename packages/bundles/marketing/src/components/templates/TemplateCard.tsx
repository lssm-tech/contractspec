'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';

export interface TemplateCardProps {
	title: string;
	description: string;
	metaBadges: readonly string[];
	tags: readonly string[];
	featureList?: readonly string[];
	isNew?: boolean;
	previewAction: ReactNode;
	useAction: ReactNode;
}

export function TemplateCard({
	title,
	description,
	metaBadges,
	tags,
	featureList = [],
	isNew = false,
	previewAction,
	useAction,
}: TemplateCardProps) {
	return (
		<VStack
			as="article"
			gap="lg"
			className="editorial-panel relative transition-colors hover:border-[color:rgb(162_79_42_/_0.55)]"
		>
			{isNew ? (
				<Text className="absolute top-4 right-4 rounded-full bg-[color:var(--success)] px-2.5 py-1 font-medium text-[11px] text-white uppercase">
					New
				</Text>
			) : null}

			<VStack gap="xs">
				<H3 className="font-serif text-2xl tracking-[-0.03em]">{title}</H3>
				<Text className="text-muted-foreground text-sm">{description}</Text>
			</VStack>

			<VStack gap="md" className="flex-1">
				<HStack gap="sm" wrap="wrap">
					{metaBadges.map((badge, index) => (
						<Text
							key={`${badge}-${index}`}
							className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-foreground"
						>
							{badge}
						</Text>
					))}
				</HStack>
				{featureList.length > 0 ? (
					<Text className="text-muted-foreground text-xs">
						Features: {featureList.join(', ')}
					</Text>
				) : null}
				<HStack gap="xs" wrap="wrap">
					{tags.map((tag) => (
						<Text
							key={tag}
							className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] text-muted-foreground"
						>
							{tag}
						</Text>
					))}
				</HStack>
			</VStack>

			<HStack gap="sm" align="stretch" wrap="nowrap" className="pt-4">
				{previewAction}
				{useAction}
			</HStack>
		</VStack>
	);
}
