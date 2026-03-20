import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@contractspec/lib.ui-kit-web/ui/carousel';
import { Button } from '../atoms/Button';
import { ButtonLink } from '../atoms/ButtonLink';

export interface PricingSlide {
	name: string;
	price: string;
	tagline?: string;
	features: string[];
	cta?: { label: string; href?: string; onPress?: () => void };
	highlighted?: boolean;
}

export function PricingCarousel({
	tiers,
	className,
}: {
	tiers: PricingSlide[];
	className?: string;
}) {
	return (
		<div className={className}>
			<Carousel>
				<CarouselContent>
					{tiers.map((t, i) => (
						<CarouselItem key={i}>
							<Card
								className={
									t.highlighted ? 'border-primary shadow-lg' : undefined
								}
							>
								<CardContent className="p-6">
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
										{t.features.map((f, j) => (
											<li key={j} className="flex items-start gap-2">
												<span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
												<span>{f}</span>
											</li>
										))}
									</ul>
									{t.cta && (
										<div className="mt-6">
											{t.cta.href ? (
												<ButtonLink className="w-full" href={t.cta.href}>
													{t.cta.label}
												</ButtonLink>
											) : (
												<Button className="w-full" onPress={t.cta.onPress}>
													{t.cta.label}
												</Button>
											)}
										</div>
									)}
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
