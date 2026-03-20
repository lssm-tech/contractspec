import { Button } from '../button';
import { cn } from '../utils';

export interface PricingTier {
	name: string;
	price: string;
	tagline?: string;
	features: string[];
	cta?: { label: string; href?: string; onClick?: () => void };
	highlighted?: boolean;
}

export function PricingTable({
	tiers,
	className,
}: {
	tiers: PricingTier[];
	className?: string;
}) {
	return (
		<section className={cn('mx-auto max-w-6xl py-12', className)}>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{tiers.map((t, idx) => (
					<div
						key={idx}
						className={cn(
							'flex flex-col rounded-lg border p-6',
							t.highlighted && 'border-primary shadow-lg'
						)}
					>
						<div className="mb-2 font-medium text-base text-muted-foreground">
							{t.name}
						</div>
						<div className="font-semibold text-3xl">{t.price}</div>
						{t.tagline && (
							<div className="mt-1 text-base text-muted-foreground">
								{t.tagline}
							</div>
						)}
						<ul className="mt-4 space-y-2 text-base">
							{t.features.map((f, i) => (
								<li key={i} className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
									<span>{f}</span>
								</li>
							))}
						</ul>
						{t.cta && (
							<div className="mt-6">
								{t.cta.href ? (
									<Button asChild className="w-full">
										{}
										<a href={t.cta.href}>{t.cta.label}</a>
									</Button>
								) : (
									<Button className="w-full" onClick={t.cta.onClick}>
										{t.cta.label}
									</Button>
								)}
							</div>
						)}
					</div>
				))}
			</div>
			<p className="mt-6 text-center text-base text-muted-foreground">
				Usage-based tiers inspired by generous free allowances and per-unit
				pricing.
			</p>
		</section>
	);
}
