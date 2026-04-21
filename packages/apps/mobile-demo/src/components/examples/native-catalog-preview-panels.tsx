import { AgentConsolePreview } from '@contractspec/example.agent-console/ui/AgentConsolePreview';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import type { NativeExamplePreviewDefinition } from '@/examples/native-preview-registry';
import { ActionLinks } from './native-preview-links';
import {
	MetaGrid,
	Panel,
	PanelHeader,
	TagList,
} from './native-preview-primitives';

export function GenericNativeExamplePreview({
	preview,
}: {
	preview: NativeExamplePreviewDefinition;
}) {
	const { surface } = preview;

	return (
		<Panel>
			<PanelHeader title={surface.title} eyebrow="Generic native preview" />
			<Text className="text-muted-foreground text-sm leading-6">
				{surface.description ||
					'This example is available in the native catalog. A richer native surface can be added when it exposes stable sample data or contracts.'}
			</Text>
			<MetaGrid
				items={[
					['Package', surface.packageName],
					['Visibility', surface.visibility],
					['Stability', surface.stability],
					['Sandbox surface', surface.sandboxHref ? 'available' : 'none'],
				]}
			/>
			<TagList tags={surface.tags} />
			<ActionLinks preview={preview} />
		</Panel>
	);
}

export function AgentConsoleNativePreview() {
	return <AgentConsolePreview showHeaderAction={false} />;
}
