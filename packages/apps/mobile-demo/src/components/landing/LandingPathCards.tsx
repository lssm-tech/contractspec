import type { LandingStoryContent } from '@contractspec/bundle.marketing/content';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { View } from 'react-native';

export function LandingPathCards(props: { story: LandingStoryContent }) {
	return (
		<View className="gap-4">
			<View className="gap-4 rounded-lg border border-input bg-card p-4">
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					{props.story.adoptionPath.kicker}
				</Text>
				<Text className="font-semibold text-2xl text-foreground">
					{props.story.adoptionPath.title}
				</Text>
				{props.story.adoptionPath.steps.map((step, index) => (
					<View key={step} className="flex-row gap-3">
						<View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
							<Text className="font-semibold text-[color:#a24f2a] text-xs">
								0{index + 1}
							</Text>
						</View>
						<Text className="flex-1 text-muted-foreground text-sm leading-6">
							{step}
						</Text>
					</View>
				))}
			</View>

			<View className="gap-4 rounded-lg border border-input bg-card p-4">
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					{props.story.studio.kicker}
				</Text>
				<Text className="font-semibold text-2xl text-foreground">
					{props.story.studio.title}
				</Text>
				<Text className="text-muted-foreground text-sm leading-6">
					{props.story.studio.description}
				</Text>
				{props.story.studio.summaries.map((summary) => (
					<Text key={summary.label} className="text-muted-foreground text-sm">
						<Text className="font-semibold text-foreground">
							{summary.label}:{' '}
						</Text>
						{summary.description}
					</Text>
				))}
			</View>
		</View>
	);
}
