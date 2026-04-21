import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { LandingRouteScreen } from '@/screens/LandingRouteScreen';

export default function TemplatesScreen() {
	const router = useRouter();

	return (
		<LandingRouteScreen
			pageKey="templates"
			afterHero={
				<View className="gap-3 rounded-lg border border-input bg-card p-4">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						Preview catalog
					</Text>
					<Text className="text-muted-foreground text-sm leading-6">
						Browse every discoverable example from the mobile preview surface.
					</Text>
					<Pressable
						className="min-h-12 items-center justify-center rounded-lg bg-primary px-4 py-3"
						accessibilityRole="button"
						accessibilityLabel="Open examples"
						onPress={() => router.push('/examples')}
					>
						<Text className="font-semibold text-primary-foreground text-sm">
							Open examples
						</Text>
					</Pressable>
				</View>
			}
		/>
	);
}
