import {
	PricingTable,
	type PricingTier,
} from '@contractspec/lib.ui-kit-web/ui/marketing/PricingTable';
import * as React from 'react';

export function PricingSection({
	tiers,
	title,
	subtitle,
	className,
}: {
	tiers: PricingTier[];
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={`py-12 sm:py-16 lg:py-24 ${className || ''}`}>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{title ? (
					<div className="mb-8 text-center">
						<h2 className="font-bold text-3xl md:text-4xl">{title}</h2>
						{subtitle ? (
							<p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground">
								{subtitle}
							</p>
						) : null}
					</div>
				) : null}
				<PricingTable tiers={tiers} />
			</div>
		</section>
	);
}
