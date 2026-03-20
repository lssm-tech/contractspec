'use client';

import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import * as React from 'react';

export interface VisualizationGridProps {
	children: React.ReactNode;
	className?: string;
}

export function VisualizationGrid({
	children,
	className,
}: VisualizationGridProps) {
	return (
		<VStack gap="md" className={className}>
			{children}
		</VStack>
	);
}
