import type {
	LandingCta,
	LandingNavigationItem,
	LandingPageContent,
	LandingPageKey,
} from '@contractspec/bundle.marketing/content';
import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { LandingPageView } from '@/components/landing/LandingPageView';
import { LandingScreenShell } from '@/components/landing/LandingScreenShell';
import {
	type LandingCtaResolveResult,
	type LandingNavigationResult,
	type LandingPageResult,
	mobileLandingRegistry,
} from '@/handlers';

const ctx = { actor: 'anonymous' as const, channel: 'mobile' as const };

export function LandingRouteScreen(props: { pageKey: LandingPageKey }) {
	const router = useRouter();
	const [page, setPage] = useState<LandingPageContent | null>(null);
	const [navigation, setNavigation] = useState<LandingNavigationItem[]>([]);
	const [busyCtaId, setBusyCtaId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadPage = useCallback(async () => {
		setError(null);
		try {
			const [pageResult, navResult] = await Promise.all([
				mobileLandingRegistry.execute(
					'mobileLanding.page.get',
					'1.0.0',
					{ key: props.pageKey },
					ctx
				) as Promise<LandingPageResult>,
				mobileLandingRegistry.execute(
					'mobileLanding.navigation.list',
					'1.0.0',
					{},
					ctx
				) as Promise<LandingNavigationResult>,
			]);
			setPage(pageResult.page as unknown as LandingPageContent);
			setNavigation(
				(navResult.navigation.items ?? []) as LandingNavigationItem[]
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load page');
		}
	}, [props.pageKey]);

	useEffect(() => {
		void loadPage();
	}, [loadPage]);

	const openCta = useCallback(
		async (cta: LandingCta | { id: string }) => {
			setBusyCtaId(cta.id);
			setError(null);
			try {
				const result = (await mobileLandingRegistry.execute(
					'mobileLanding.cta.resolve',
					'1.0.0',
					{ id: cta.id },
					ctx
				)) as LandingCtaResolveResult;
				if (result.kind === 'native' && result.route) {
					router.push(result.route as never);
					return;
				}
				await Linking.openURL(result.url);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Could not open link');
			} finally {
				setBusyCtaId(null);
			}
		},
		[router]
	);

	if (!page && !error) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-6">
				<ActivityIndicator accessibilityLabel="Loading ContractSpec page" />
				<Text className="mt-4 text-muted-foreground">Loading...</Text>
			</View>
		);
	}

	if (!page) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-6">
				<Text className="mb-4 text-center text-destructive">{error}</Text>
				<Button onPress={() => void loadPage()}>
					<Text>Retry</Text>
				</Button>
			</View>
		);
	}

	return (
		<LandingScreenShell
			currentPageKey={props.pageKey}
			navigation={navigation}
			onOpenExternalNav={(item) => void openCta({ id: item.id })}
		>
			{error ? (
				<View className="border-destructive/20 border-b bg-destructive/10 px-4 py-3">
					<Text className="text-destructive text-sm">{error}</Text>
				</View>
			) : null}
			<LandingPageView page={page} busyCtaId={busyCtaId} onPressCta={openCta} />
		</LandingScreenShell>
	);
}
