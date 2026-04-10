'use client';

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
		<div className="editorial-panel relative flex flex-col space-y-4 transition-colors hover:border-[color:rgb(162_79_42_/_0.55)]">
			{isNew ? (
				<span className="absolute top-4 right-4 rounded-full bg-[color:var(--success)] px-2.5 py-1 font-medium text-[11px] text-white uppercase">
					New
				</span>
			) : null}

			<div>
				<h3 className="font-serif text-2xl tracking-[-0.03em]">{title}</h3>
				<p className="mt-1 text-muted-foreground text-sm">{description}</p>
			</div>

			<div className="flex-1 space-y-3">
				<div className="flex flex-wrap gap-2">
					{metaBadges.map((badge) => (
						<span
							key={badge}
							className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-foreground"
						>
							{badge}
						</span>
					))}
				</div>
				{featureList.length > 0 ? (
					<p className="text-muted-foreground text-xs">
						<span className="font-medium text-foreground">Features:</span>{' '}
						{featureList.join(', ')}
					</p>
				) : null}
				<div className="flex flex-wrap gap-1">
					{tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] text-muted-foreground"
						>
							{tag}
						</span>
					))}
				</div>
			</div>

			<div className="flex gap-2 pt-4">
				{previewAction}
				{useAction}
			</div>
		</div>
	);
}
