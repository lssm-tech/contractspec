import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { DataGridShowcaseNativePreview } from '@/components/examples/DataGridShowcaseNativePreview';
import {
	AgentConsoleNativePreview,
	AiChatAssistantNativePreview,
	AnalyticsDashboardNativePreview,
	ConnectionsNativePreview,
	CrmPipelineNativePreview,
	GenericNativeExamplePreview,
	InAppDocsNativePreview,
	IntegrationHubNativePreview,
	LearningJourneyNativePreview,
	MarketplaceNativePreview,
	PocketFamilyOfficeNativePreview,
	PolicySafeKnowledgeAssistantNativePreview,
	SaasBoilerplateNativePreview,
	VideoApiShowcaseNativePreview,
	VideoDocsTerminalNativePreview,
	VisualizationShowcaseNativePreview,
	WorkflowSystemNativePreview,
} from '@/components/examples/NativeExamplePreviewPanels';
import { getNativeExamplePreview } from '@/examples/native-preview-registry';

export function MobileExampleNativePreviewScreen() {
	const router = useRouter();
	const params = useLocalSearchParams<{ exampleKey?: string | string[] }>();
	const exampleKey = Array.isArray(params.exampleKey)
		? params.exampleKey[0]
		: params.exampleKey;
	const preview = exampleKey ? getNativeExamplePreview(exampleKey) : undefined;
	const showIntro = preview?.kind !== 'agent-console';

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-6 px-5 pt-8 pb-12">
				{showIntro ? (
					<View className="gap-3">
						<Text className="font-semibold text-muted-foreground text-sm uppercase">
							In-app example preview
						</Text>
						<Text className="font-bold text-4xl text-foreground leading-tight">
							{preview?.title ?? 'Preview unavailable'}
						</Text>
						<Text className="text-base text-muted-foreground leading-7">
							{preview?.description ??
								'This example does not have a native preview yet.'}
						</Text>
					</View>
				) : null}

				{preview ? (
					<NativePreviewBody preview={preview} />
				) : (
					<View className="gap-4 rounded-lg border border-input bg-card p-4">
						<Text className="text-muted-foreground text-sm leading-6">
							Native previews are registered deliberately so the mobile app only
							shows examples that render with React Native primitives.
						</Text>
						<Button variant="outline" onPress={() => router.push('/examples')}>
							<Text>Back to examples</Text>
						</Button>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

function NativePreviewBody({
	preview,
}: {
	preview: NonNullable<ReturnType<typeof getNativeExamplePreview>>;
}) {
	switch (preview.kind) {
		case 'agent-console':
			return <AgentConsoleNativePreview />;
		case 'ai-chat-assistant':
			return <AiChatAssistantNativePreview />;
		case 'analytics-dashboard':
			return <AnalyticsDashboardNativePreview />;
		case 'connections':
			return <ConnectionsNativePreview exampleKey={preview.key} />;
		case 'crm-pipeline':
			return <CrmPipelineNativePreview />;
		case 'data-grid-showcase':
			return <DataGridShowcaseNativePreview />;
		case 'in-app-docs':
			return <InAppDocsNativePreview />;
		case 'integration-hub':
			return <IntegrationHubNativePreview />;
		case 'learning-journey':
			return <LearningJourneyNativePreview exampleKey={preview.key} />;
		case 'marketplace':
			return <MarketplaceNativePreview />;
		case 'pocket-family-office':
			return <PocketFamilyOfficeNativePreview />;
		case 'policy-safe-knowledge-assistant':
			return <PolicySafeKnowledgeAssistantNativePreview />;
		case 'saas-boilerplate':
			return <SaasBoilerplateNativePreview />;
		case 'video-api-showcase':
			return <VideoApiShowcaseNativePreview />;
		case 'video-docs-terminal':
			return <VideoDocsTerminalNativePreview />;
		case 'visualization-showcase':
			return <VisualizationShowcaseNativePreview />;
		case 'workflow-system':
			return <WorkflowSystemNativePreview />;
		case 'generic':
		default:
			return <GenericNativeExamplePreview preview={preview} />;
	}
}
