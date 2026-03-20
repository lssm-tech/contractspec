import { Link } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '../button';
import { Text } from '../text';
import { P } from '../typography';
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
		<View className={cn('mx-auto max-w-4xl py-16', className)}>
			<Text className="font-bold text-4xl tracking-tight md:text-5xl">
				{title}
			</Text>
			{subtitle && (
				<P className="mt-4 text-lg text-muted-foreground md:text-xl">
					{subtitle}
				</P>
			)}
			{(primaryCta || secondaryCta) && (
				<View className="mt-8 flex flex-row items-center justify-center gap-3">
					{primaryCta &&
						(primaryCta.href ? (
							<Button size="lg">
								<Link href={primaryCta.href}>{primaryCta.label}</Link>
							</Button>
						) : (
							<Button size="lg" onPress={primaryCta.onClick}>
								{primaryCta.label}
							</Button>
						))}
					{secondaryCta &&
						(secondaryCta.href ? (
							<Button variant="outline" size="lg">
								<Link href={secondaryCta.href}>{secondaryCta.label}</Link>
							</Button>
						) : (
							<Button
								variant="outline"
								size="lg"
								onPress={secondaryCta.onClick}
							>
								{secondaryCta.label}
							</Button>
						))}
				</View>
			)}
		</View>
	);
}
