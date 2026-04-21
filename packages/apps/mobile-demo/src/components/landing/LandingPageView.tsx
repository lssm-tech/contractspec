import type {
	LandingCta,
	LandingPageContent,
} from '@contractspec/bundle.marketing/content';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { LandingCtaButton } from './LandingCtaButton';
import { StoryCard } from './StoryCard';

export function LandingPageView(props: {
	page: LandingPageContent;
	busyCtaId: string | null;
	onPressCta: (cta: LandingCta) => void;
	afterHero?: ReactNode;
}) {
	return (
		<ScrollView className="flex-1">
			<View className="gap-8 px-5 pt-8 pb-12">
				<View className="gap-5">
					<Text className="font-semibold text-muted-foreground text-sm uppercase">
						{props.page.kicker}
					</Text>
					<Text className="font-bold text-4xl text-foreground leading-tight">
						{props.page.title}
					</Text>
					<Text className="text-base text-muted-foreground leading-7">
						{props.page.description}
					</Text>
					<View className="gap-3">
						{props.page.heroCtas.map((cta) => (
							<LandingCtaButton
								key={cta.id}
								cta={cta}
								disabled={props.busyCtaId === cta.id}
								onPress={props.onPressCta}
							/>
						))}
					</View>
				</View>

				{props.afterHero}

				{props.page.stats ? (
					<View className="gap-3">
						{props.page.stats.map((stat) => (
							<View
								key={stat.label}
								className="rounded-lg border border-input bg-card p-4"
							>
								<Text className="font-bold text-3xl text-foreground">
									{stat.value}
								</Text>
								<Text className="text-muted-foreground text-sm">
									{stat.label}
								</Text>
							</View>
						))}
					</View>
				) : null}

				{props.page.sections.map((section) => (
					<View key={section.id} className="gap-4">
						<Text className="font-semibold text-muted-foreground text-xs uppercase">
							{section.kicker}
						</Text>
						<Text className="font-semibold text-3xl text-foreground">
							{section.title}
						</Text>
						{section.description ? (
							<Text className="text-base text-muted-foreground leading-7">
								{section.description}
							</Text>
						) : null}
						{section.items.map((item) => (
							<StoryCard key={item.title} item={item} />
						))}
					</View>
				))}

				{props.page.finalCta ? (
					<View className="gap-4 rounded-lg border border-input bg-card p-4">
						<Text className="font-semibold text-muted-foreground text-xs uppercase">
							{props.page.finalCta.kicker}
						</Text>
						<Text className="font-semibold text-2xl text-foreground">
							{props.page.finalCta.title}
						</Text>
						<Text className="text-muted-foreground text-sm leading-6">
							{props.page.finalCta.description}
						</Text>
						{props.page.finalCta.ctas.map((cta) => (
							<LandingCtaButton
								key={cta.id}
								cta={cta}
								disabled={props.busyCtaId === cta.id}
								onPress={props.onPressCta}
							/>
						))}
					</View>
				) : null}
			</View>
		</ScrollView>
	);
}
