import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { ActivityIndicator, View } from 'react-native';

export function ExamplesLoadingView() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-6">
			<ActivityIndicator accessibilityLabel="Loading examples" />
			<Text className="mt-4 text-muted-foreground">Loading examples...</Text>
		</View>
	);
}

export function ExamplesHeader() {
	return (
		<View className="gap-3">
			<Text className="font-semibold text-muted-foreground text-sm uppercase">
				Examples
			</Text>
			<Text className="font-bold text-4xl text-foreground leading-tight">
				Web-mobile parity catalog
			</Text>
			<Text className="text-base text-muted-foreground leading-7">
				The same discoverable ContractSpec examples available on web, rendered
				in mobile with native previews and web fallback links.
			</Text>
		</View>
	);
}

export function ExamplesErrorBanner({
	error,
	onRetry,
}: {
	error: string;
	onRetry: () => void;
}) {
	return (
		<View className="gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
			<Text className="text-destructive text-sm">{error}</Text>
			<Button variant="outline" onPress={onRetry}>
				<Text>Retry</Text>
			</Button>
		</View>
	);
}
