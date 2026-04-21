import type {
	LandingCta,
	LandingStoryContent,
} from '@contractspec/bundle.marketing/content';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { ScrollView, View } from 'react-native';
import { LandingCtaButton } from './LandingCtaButton';
import { LandingPathCards } from './LandingPathCards';
import { landingIconMap } from './landing-icons';
import { StoryCard } from './StoryCard';

export function LandingStoryView(props: {
	story: LandingStoryContent;
	busyCtaId: string | null;
	onPressCta: (cta: LandingCta) => void;
}) {
	const BadgeIcon = landingIconMap[props.story.hero.badge.iconKey];

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-8 px-5 pt-8 pb-12">
				<View className="gap-5">
					<View className="flex-row items-center self-start rounded-full bg-muted px-3 py-2">
						<BadgeIcon className="mr-2 h-4 w-4 text-[color:#a24f2a]" />
						<Text className="font-semibold text-muted-foreground text-xs uppercase">
							{props.story.hero.badge.label}
						</Text>
					</View>
					<View className="gap-3">
						<Text className="font-semibold text-muted-foreground text-sm uppercase">
							{props.story.hero.kicker}
						</Text>
						<Text className="font-bold text-4xl text-foreground leading-tight">
							{props.story.hero.title}
						</Text>
						<Text className="text-base text-muted-foreground leading-7">
							{props.story.hero.subtitle}
						</Text>
					</View>
					<View className="gap-3">
						{props.story.hero.ctas.map((cta) => (
							<LandingCtaButton
								key={cta.id}
								cta={cta}
								disabled={props.busyCtaId === cta.id}
								onPress={props.onPressCta}
							/>
						))}
					</View>
					<View className="gap-3">
						{props.story.hero.proofStats.map((stat) => (
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
				</View>

				<View className="gap-4 rounded-lg border border-input bg-card p-4">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{props.story.clarityPanel.kicker}
					</Text>
					<Text className="font-semibold text-2xl text-foreground">
						{props.story.clarityPanel.title}
					</Text>
					<Text className="text-muted-foreground text-sm leading-6">
						{props.story.clarityPanel.description}
					</Text>
					{props.story.clarityPanel.points.map((point) => (
						<Text key={point} className="text-foreground text-sm leading-6">
							- {point}
						</Text>
					))}
				</View>

				<View className="gap-4">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{props.story.failureModes.kicker}
					</Text>
					<Text className="font-semibold text-3xl text-foreground">
						{props.story.failureModes.title}
					</Text>
					<Text className="text-base text-muted-foreground leading-7">
						{props.story.failureModes.description}
					</Text>
					{props.story.failureModes.items.map((item) => (
						<StoryCard key={item.title} item={item} />
					))}
				</View>

				<View className="gap-4">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{props.story.systemSurfaces.kicker}
					</Text>
					<Text className="font-semibold text-3xl text-foreground">
						{props.story.systemSurfaces.title}
					</Text>
					<Text className="text-base text-muted-foreground leading-7">
						{props.story.systemSurfaces.description}
					</Text>
					{props.story.systemSurfaces.items.map((item) => (
						<StoryCard key={item.title} item={item} />
					))}
				</View>

				<View className="gap-4">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{props.story.outputs.kicker}
					</Text>
					<Text className="font-semibold text-3xl text-foreground">
						{props.story.outputs.title}
					</Text>
					<Text className="text-base text-muted-foreground leading-7">
						{props.story.outputs.description}
					</Text>
					{props.story.outputs.items.map((item) => (
						<StoryCard key={item.title} item={item} tone="blue" />
					))}
				</View>

				<LandingPathCards story={props.story} />

				<View className="gap-4 rounded-lg border border-input bg-card p-4">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{props.story.finalCta.kicker}
					</Text>
					<Text className="font-semibold text-2xl text-foreground">
						{props.story.finalCta.title}
					</Text>
					<Text className="text-muted-foreground text-sm leading-6">
						{props.story.finalCta.description}
					</Text>
					{props.story.finalCta.ctas.map((cta) => (
						<LandingCtaButton
							key={cta.id}
							cta={cta}
							disabled={props.busyCtaId === cta.id}
							onPress={props.onPressCta}
						/>
					))}
				</View>
			</View>
		</ScrollView>
	);
}
