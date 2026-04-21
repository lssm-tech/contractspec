import type { LandingNavigationItem } from '@contractspec/bundle.marketing/content';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { ExamplePreviewCard } from '@/components/examples/ExamplePreviewCard';
import {
	ExamplePreviewControls,
	type ExamplePreviewFilter,
} from '@/components/examples/ExamplePreviewControls';
import {
	ExamplesErrorBanner,
	ExamplesHeader,
	ExamplesLoadingView,
} from '@/components/examples/ExamplePreviewShell';
import { LandingScreenShell } from '@/components/landing/LandingScreenShell';
import { getNativeExamplePreview } from '@/examples/native-preview-registry';
import {
	type LandingCtaResolveResult,
	type LandingNavigationResult,
	type MobileExamplePreviewItem,
	type MobileExamplesListResult,
	mobileLandingRegistry,
} from '@/handlers';
import {
	buildMobileExampleRows,
	buildMobileExampleStats,
} from './mobile-examples-preview-model';

const ctx = { actor: 'anonymous' as const, channel: 'mobile' as const };

export function MobileExamplesPreviewScreen() {
	const router = useRouter();
	const [examples, setExamples] = useState<MobileExamplePreviewItem[]>([]);
	const [navigation, setNavigation] = useState<LandingNavigationItem[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<ExamplePreviewFilter>('all');
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');

	const loadExamples = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [examplesResult, navResult] = await Promise.all([
				mobileLandingRegistry.execute(
					'mobileLanding.examples.list',
					'1.0.0',
					{},
					ctx
				) as Promise<MobileExamplesListResult>,
				mobileLandingRegistry.execute(
					'mobileLanding.navigation.list',
					'1.0.0',
					{},
					ctx
				) as Promise<LandingNavigationResult>,
			]);
			setExamples(examplesResult.examples);
			setNavigation(navResult.navigation.items ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load examples');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadExamples();
	}, [loadExamples]);

	const rows = useMemo(
		() => buildMobileExampleRows({ examples, filter, search }),
		[examples, filter, search]
	);

	const stats = useMemo(() => buildMobileExampleStats(examples), [examples]);

	const openUrl = useCallback(async (url: string) => {
		await Linking.openURL(url);
	}, []);

	const openNativePreview = useCallback(
		(exampleKey: string) => {
			const preview = getNativeExamplePreview(exampleKey);
			router.push(
				preview?.route ?? `/example-preview?exampleKey=${exampleKey}`
			);
		},
		[router]
	);

	const openNavigationItem = useCallback(
		async (item: LandingNavigationItem) => {
			setError(null);
			try {
				const result = (await mobileLandingRegistry.execute(
					'mobileLanding.cta.resolve',
					'1.0.0',
					{ id: item.id },
					ctx
				)) as LandingCtaResolveResult;
				if (result.kind === 'native' && result.route) {
					router.push(result.route as never);
					return;
				}
				await Linking.openURL(result.url);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Could not open link');
			}
		},
		[router]
	);

	if (loading) return <ExamplesLoadingView />;
	return (
		<LandingScreenShell
			currentPageKey="examples"
			navigation={navigation}
			onOpenExternalNav={(item) => void openNavigationItem(item)}
		>
			<ScrollView className="flex-1 bg-background">
				<View className="gap-6 px-5 pt-8 pb-12">
					<ExamplesHeader />
					{error ? (
						<ExamplesErrorBanner
							error={error}
							onRetry={() => void loadExamples()}
						/>
					) : null}
					<ExamplePreviewControls
						filter={filter}
						onFilterChange={setFilter}
						onSearchChange={setSearch}
						search={search}
						stats={stats}
					/>
					<View className="gap-4">
						{rows.map(({ example, preview }) => (
							<ExamplePreviewCard
								key={example.key}
								example={example}
								isRichPreview={Boolean(preview?.rich)}
								onOpenNativePreview={openNativePreview}
								onOpenUrl={(url) => void openUrl(url)}
							/>
						))}
					</View>
				</View>
			</ScrollView>
		</LandingScreenShell>
	);
}
