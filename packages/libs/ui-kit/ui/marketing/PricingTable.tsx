import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button } from '../button';
import { Text } from '../text';
import { P } from '../typography';
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
		<View className={cn('mx-auto max-w-6xl py-12', className)}>
			<View className="flex flex-col gap-6 md:flex-row md:flex-wrap">
				{tiers.map((t, idx) => (
					<View
						key={idx}
						className={cn(
							'flex flex-1 flex-col rounded-lg border p-6',
							t.highlighted && 'border-primary shadow-lg'
						)}
					>
						<Text className="mb-2 font-medium text-base text-muted-foreground">
							{t.name}
						</Text>
						<Text className="font-semibold text-3xl">{t.price}</Text>
						{t.tagline && (
							<Text className="mt-1 text-base text-muted-foreground">
								{t.tagline}
							</Text>
						)}
						<View className="mt-4 flex flex-col gap-2">
							{t.features.map((f, i) => (
								<View key={i} className="flex flex-row items-start gap-2">
									<View className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
									<Text className="text-base">{f}</Text>
								</View>
							))}
						</View>
						{t.cta && (
							<View className="mt-6">
								{t.cta.href ? (
									<Button className="w-full">
										<Link href={t.cta.href}>{t.cta.label}</Link>
									</Button>
								) : (
									<Button className="w-full" onPress={t.cta.onClick}>
										{t.cta.label}
									</Button>
								)}
							</View>
						)}
					</View>
				))}
			</View>
			<P className="mt-6 text-center text-base text-muted-foreground">
				Usage-based tiers inspired by generous free allowances and per-unit
				pricing.
			</P>
		</View>
	);
}
