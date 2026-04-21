import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { View } from 'react-native';
import type { MobileExamplePreviewItem } from '@/handlers';

export function ExamplePreviewCard(props: {
	example: MobileExamplePreviewItem;
	isRichPreview: boolean;
	onOpenUrl: (url: string) => void;
	onOpenNativePreview: (exampleKey: string) => void;
}) {
	const { example, isRichPreview, onOpenNativePreview, onOpenUrl } = props;
	const tags = example.tags.slice(0, 4);
	const sourceUrl = example.sourceUrl;
	const secondaryActions: Array<[string, string]> = [['Docs', example.docsUrl]];

	if (example.sandboxUrl) {
		secondaryActions.push(['Web sandbox', example.sandboxUrl]);
	}
	if (example.llmsUrl) {
		secondaryActions.push(['LLMS', example.llmsUrl]);
	}
	if (sourceUrl) {
		secondaryActions.push(['Source', sourceUrl]);
	}

	return (
		<View className="gap-4 rounded-lg border border-input bg-card p-4">
			<View className="gap-2">
				<View className="flex-row flex-wrap gap-2">
					<Text className="rounded-full border border-input px-2 py-1 text-muted-foreground text-xs">
						{example.visibility}
					</Text>
					<Text className="rounded-full border border-input px-2 py-1 text-muted-foreground text-xs">
						{example.stability}
					</Text>
					{isRichPreview ? (
						<Text className="rounded-full border border-primary px-2 py-1 text-primary text-xs">
							Rich native preview
						</Text>
					) : example.supportsInlinePreview ? (
						<Text className="rounded-full border border-input px-2 py-1 text-muted-foreground text-xs">
							UI export
						</Text>
					) : null}
				</View>
				<Text className="font-semibold text-2xl text-foreground">
					{example.title}
				</Text>
				<Text className="text-muted-foreground text-sm leading-6">
					{example.summary}
				</Text>
				<Text className="font-mono text-muted-foreground text-xs">
					{example.packageName}
				</Text>
			</View>

			{tags.length > 0 ? (
				<View className="flex-row flex-wrap gap-2">
					{tags.map((tag) => (
						<Text
							key={tag}
							className="rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs"
						>
							{tag}
						</Text>
					))}
				</View>
			) : null}

			<View className="gap-2">
				<Button onPress={() => onOpenNativePreview(example.key)}>
					<Text>Preview in app</Text>
				</Button>
				{secondaryActions.map(([label, url]) => (
					<Button
						key={`${example.key}-${label}`}
						size="sm"
						variant="outline"
						onPress={() => onOpenUrl(url)}
					>
						<Text>{label}</Text>
					</Button>
				))}
			</View>
		</View>
	);
}
