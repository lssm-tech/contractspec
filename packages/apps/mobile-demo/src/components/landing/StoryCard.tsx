import type { LandingContentCard } from '@contractspec/bundle.marketing/content';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { View } from 'react-native';
import { landingIconMap } from './landing-icons';

export function StoryCard(props: {
	item: LandingContentCard;
	tone?: 'rust' | 'blue';
}) {
	const Icon = props.item.iconKey ? landingIconMap[props.item.iconKey] : null;
	const iconColor =
		props.tone === 'blue' ? 'text-[color:#2563eb]' : 'text-[color:#a24f2a]';

	return (
		<View className="rounded-lg border border-input bg-card p-4">
			{Icon ? <Icon className={`mb-4 h-5 w-5 ${iconColor}`} /> : null}
			<Text className="font-semibold text-foreground text-lg">
				{props.item.title}
			</Text>
			<Text className="mt-2 text-muted-foreground text-sm leading-6">
				{props.item.description}
			</Text>
		</View>
	);
}
