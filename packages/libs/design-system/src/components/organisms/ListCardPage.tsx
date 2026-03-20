'use client';

import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { useResponsive } from '../../platform/useResponsive';

const containerVariants = cva('', {
	variants: {
		density: {
			compact: 'gap-3',
			comfortable: 'gap-4 md:gap-5',
		},
	},
	defaultVariants: {
		density: 'comfortable',
	},
});

const gridVariants = cva('grid', {
	variants: {
		size: {
			sm: 'gap-3',
			md: 'gap-4',
			lg: 'gap-6',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export interface ListCardPageProps<T>
	extends VariantProps<typeof containerVariants>,
		VariantProps<typeof gridVariants> {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	items: T[];
	renderCard: (item: T, index: number) => React.ReactNode;
	className?: string;
	columns?: { mobile?: number; tablet?: number; desktop?: number };
}

export function ListCardPage<T>({
	title,
	subtitle,
	items,
	renderCard,
	className,
	columns,
	density,
	size,
}: ListCardPageProps<T>) {
	const { screen } = useResponsive();
	const cols =
		screen === 'desktop'
			? (columns?.desktop ?? 3)
			: screen === 'tablet'
				? (columns?.tablet ?? 2)
				: (columns?.mobile ?? 1);
	const presetColsClass =
		cols === 1
			? 'grid-cols-1'
			: cols === 2
				? 'grid-cols-2'
				: cols === 3
					? 'grid-cols-3'
					: cols === 4
						? 'grid-cols-4'
						: 'grid-cols-3';
	return (
		<VStack
			className={[containerVariants({ density }), className]
				.filter(Boolean)
				.join(' ')}
		>
			<VStack className="gap-1">
				<h1 className="font-bold text-2xl md:text-3xl">{title}</h1>
				{subtitle ? (
					<p className="text-base text-muted-foreground">{subtitle}</p>
				) : null}
			</VStack>
			<div className={[gridVariants({ size }), presetColsClass].join(' ')}>
				{items.map((item, index) => (
					<Card key={index} className="border-none shadow-2xs">
						<CardContent className="p-4 md:p-5 lg:p-6">
							{renderCard(item, index)}
						</CardContent>
					</Card>
				))}
			</div>
		</VStack>
	);
}
