'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import Link from 'next/link';
import * as React from 'react';

interface OverviewCardProps {
	title: string;
	summary: string;
	href: string;
	preview?: React.ReactNode;
	ctaLabel: string;
}

export function OverviewCard({
	title,
	summary,
	href,
	preview,
	ctaLabel,
}: OverviewCardProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="rounded-md border bg-background/50 p-4 text-left shadow-2xs transition hover:bg-accent/40">
					<div className="font-medium text-lg">{title}</div>
					<div className="text-foreground/80">{summary}</div>
				</button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{preview}
					<div>
						<Link
							href={href}
							className="inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground"
						>
							{ctaLabel}
						</Link>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
