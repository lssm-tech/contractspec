import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { Linking, View } from 'react-native';
import type { NativeExamplePreviewDefinition } from '@/examples/native-preview-registry';

export function ActionLinks({
	preview,
}: {
	preview: NativeExamplePreviewDefinition;
}) {
	const links: Array<[string, string]> = [
		['Open docs', `https://www.contractspec.io${preview.surface.docsHref}`],
	];

	if (preview.surface.sandboxHref) {
		links.push([
			'Open sandbox',
			`https://www.contractspec.io${preview.surface.sandboxHref}`,
		]);
	}
	if (preview.surface.llmsHref) {
		links.push([
			'LLMS page',
			`https://www.contractspec.io${preview.surface.llmsHref}`,
		]);
	}
	if (preview.surface.sourceHref) {
		links.push(['Open source', preview.surface.sourceHref]);
	}

	return (
		<View className="gap-2">
			{links.map(([label, url]) => (
				<Button
					key={`${label}-${url}`}
					size="sm"
					variant="outline"
					onPress={() => void Linking.openURL(url)}
				>
					<Text>{label}</Text>
				</Button>
			))}
		</View>
	);
}
