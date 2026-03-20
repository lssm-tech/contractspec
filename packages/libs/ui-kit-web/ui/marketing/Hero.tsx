import * as React from 'react';
import { Button } from '../button';
import { cn } from '../utils';

export function Hero({
	title,
	subtitle,
	primaryCta,
	secondaryCta,
	className,
}: {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	primaryCta?: { label: string; href?: string; onClick?: () => void };
	secondaryCta?: { label: string; href?: string; onClick?: () => void };
	className?: string;
}) {
	return (
		<section className={cn('mx-auto max-w-4xl py-16 text-center', className)}>
			<h1 className="font-bold text-4xl tracking-tight md:text-5xl">{title}</h1>
			{subtitle && (
				<p className="mt-4 text-lg text-muted-foreground md:text-xl">
					{subtitle}
				</p>
			)}
			{(primaryCta || secondaryCta) && (
				<div className="mt-8 flex items-center justify-center gap-3">
					{primaryCta &&
						(primaryCta.href ? (
							<Button asChild size="lg">
								{}
								<a href={primaryCta.href}>{primaryCta.label}</a>
							</Button>
						) : (
							<Button size="lg" onClick={primaryCta.onClick}>
								{primaryCta.label}
							</Button>
						))}
					{secondaryCta &&
						(secondaryCta.href ? (
							<Button variant="outline" asChild size="lg">
								{}
								<a href={secondaryCta.href}>{secondaryCta.label}</a>
							</Button>
						) : (
							<Button
								variant="outline"
								size="lg"
								onClick={secondaryCta.onClick}
							>
								{secondaryCta.label}
							</Button>
						))}
				</div>
			)}
		</section>
	);
}
