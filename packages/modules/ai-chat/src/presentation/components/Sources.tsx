'use client';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@contractspec/lib.ui-kit-web/ui/collapsible';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { ExternalLink } from 'lucide-react';
import * as React from 'react';

export interface SourcesProps {
	children: React.ReactNode;
	className?: string;
}

export function Sources({ children, className }: SourcesProps) {
	return (
		<Collapsible className={cn('mt-2', className)} defaultOpen={false}>
			{children}
		</Collapsible>
	);
}

export interface SourcesTriggerProps {
	count: number;
	children?: React.ReactNode;
	className?: string;
}

export function SourcesTrigger({
	count,
	children,
	className,
}: SourcesTriggerProps) {
	return (
		<CollapsibleTrigger
			className={cn(
				'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground',
				className
			)}
		>
			{children ?? (
				<>
					<ExternalLink className="h-3 w-3" />
					{count} source{count !== 1 ? 's' : ''}
				</>
			)}
		</CollapsibleTrigger>
	);
}

export interface SourcesContentProps {
	children: React.ReactNode;
	className?: string;
}

export function SourcesContent({ children, className }: SourcesContentProps) {
	return (
		<CollapsibleContent>
			<div className={cn('mt-2 flex flex-wrap gap-2', className)}>
				{children}
			</div>
		</CollapsibleContent>
	);
}

export interface SourceProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	title?: string;
}

export function Source({
	href,
	title,
	className,
	children,
	...props
}: SourceProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				'inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground text-xs transition-colors hover:text-foreground',
				className
			)}
			{...props}
		>
			{children ?? (
				<>
					<ExternalLink className="h-3 w-3" />
					{title ?? href}
				</>
			)}
		</a>
	);
}
