'use client';

import { Button } from '@contractspec/lib.design-system/components/atoms/Button';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';

export interface SuggestionsProps {
	children: React.ReactNode;
	className?: string;
}

export function Suggestions({ children, className }: SuggestionsProps) {
	return (
		<div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
	);
}

export interface SuggestionProps {
	suggestion: string;
	onClick?: (suggestion: string) => void;
	className?: string;
}

export function Suggestion({
	suggestion,
	onClick,
	className,
}: SuggestionProps) {
	const handleClick = React.useCallback(() => {
		onClick?.(suggestion);
	}, [suggestion, onClick]);

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onPress={handleClick}
			className={cn('text-muted-foreground hover:text-foreground', className)}
		>
			{suggestion}
		</Button>
	);
}
