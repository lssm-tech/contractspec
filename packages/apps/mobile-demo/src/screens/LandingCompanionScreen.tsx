import type {
	LandingCta,
	LandingStoryContent,
} from '@contractspec/bundle.marketing/content';
import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { LandingStoryView } from '@/components/landing/LandingStoryView';
import {
	type LandingCtaResolveResult,
	mobileLandingRegistry,
} from '@/handlers';

const ctx = { actor: 'anonymous' as const, channel: 'mobile' as const };

export function LandingCompanionScreen() {
	const [story, setStory] = useState<LandingStoryContent | null>(null);
	const [busyCtaId, setBusyCtaId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadStory = useCallback(async () => {
		setError(null);
		try {
			const result = (await mobileLandingRegistry.execute(
				'mobileLanding.story.get',
				'1.0.0',
				{},
				ctx
			)) as { story: LandingStoryContent };
			setStory(result.story);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load story');
		}
	}, []);

	useEffect(() => {
		void loadStory();
	}, [loadStory]);

	const openCta = useCallback(async (cta: LandingCta) => {
		setBusyCtaId(cta.id);
		setError(null);
		try {
			const result = (await mobileLandingRegistry.execute(
				'mobileLanding.cta.resolve',
				'1.0.0',
				{ id: cta.id },
				ctx
			)) as LandingCtaResolveResult;
			await Linking.openURL(result.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Could not open link');
		} finally {
			setBusyCtaId(null);
		}
	}, []);

	if (!story && !error) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-6">
				<ActivityIndicator accessibilityLabel="Loading ContractSpec story" />
				<Text className="mt-4 text-muted-foreground">Loading...</Text>
			</View>
		);
	}

	if (!story) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-6">
				<Text className="mb-4 text-center text-destructive">{error}</Text>
				<Button onPress={() => void loadStory()}>
					<Text>Retry</Text>
				</Button>
			</View>
		);
	}

	return (
		<View className="flex-1">
			{error ? (
				<View className="border-destructive/20 border-b bg-destructive/10 px-4 py-3">
					<Text className="text-destructive text-sm">{error}</Text>
				</View>
			) : null}
			<LandingStoryView
				story={story}
				busyCtaId={busyCtaId}
				onPressCta={openCta}
			/>
		</View>
	);
}
