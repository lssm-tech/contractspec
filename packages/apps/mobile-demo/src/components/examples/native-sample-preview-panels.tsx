import { AssistantSearchContract } from '@contractspec/example.ai-chat-assistant/contracts';
import { inAppDocs } from '@contractspec/example.in-app-docs/docs/in-app-docs.docblock';
import { DEMO_FIXTURES } from '@contractspec/example.policy-safe-knowledge-assistant/seed/fixtures';
import {
	createUserSpec,
	listTransactionsSpec,
	sendNotificationSpec,
} from '@contractspec/example.video-api-showcase/sample-specs';
import { allTutorials } from '@contractspec/example.video-docs-terminal/sample-tutorials';
import {
	MetricRow,
	Panel,
	PanelHeader,
	PreviewList,
} from './native-preview-primitives';

export function AiChatAssistantNativePreview() {
	return (
		<Panel>
			<PanelHeader
				title="Assistant search contract"
				eyebrow="AI assistant"
				description={AssistantSearchContract.meta.description}
			/>
			<MetricRow
				items={[
					['Operation', AssistantSearchContract.meta.key],
					['Version', AssistantSearchContract.meta.version],
					['Tags', String(AssistantSearchContract.meta.tags.length)],
				]}
			/>
			<PreviewList
				eyebrow="Seeded result shape"
				items={[
					{
						title: 'ContractSpec Documentation',
						subtitle: 'assistant.search',
						body: 'Search results include a title, snippet, and optional URL for mobile-safe rendering.',
					},
				]}
			/>
		</Panel>
	);
}

export function InAppDocsNativePreview() {
	return (
		<Panel>
			<PanelHeader
				title="In-app documentation"
				eyebrow="DocBlocks"
				description="Public DocBlocks are rendered as native help-center cards."
			/>
			<PreviewList
				items={inAppDocs.map((doc) => ({
					title: doc.title,
					subtitle: `${doc.kind} - ${doc.route}`,
					body: doc.summary,
				}))}
			/>
		</Panel>
	);
}

export function PolicySafeKnowledgeAssistantNativePreview() {
	const sources = Object.values(DEMO_FIXTURES.sources);

	return (
		<Panel>
			<PanelHeader
				title="Policy-safe knowledge fixtures"
				eyebrow="Governed assistant"
				description="Jurisdiction, locale, source, and rule fixtures are kept visible for mobile review."
			/>
			<MetricRow
				items={[
					['Jurisdictions', DEMO_FIXTURES.jurisdictions.join(', ')],
					['Locales', DEMO_FIXTURES.locales.join(', ')],
					['Sources', String(sources.length)],
				]}
			/>
			<PreviewList
				items={sources.map((source) => ({
					title: source.title,
					subtitle: `${source.jurisdiction} - ${source.authority}`,
					body: source.hash,
				}))}
			/>
		</Panel>
	);
}

export function VideoDocsTerminalNativePreview() {
	return (
		<Panel>
			<PanelHeader
				title="Terminal video tutorials"
				eyebrow="Docs video"
				description="CLI tutorial scripts are rendered from exported terminal tutorial definitions."
			/>
			<PreviewList
				items={allTutorials.map((tutorial) => ({
					title: tutorial.title,
					subtitle: tutorial.terminalTitle,
					body: tutorial.summary ?? tutorial.brief.summary,
				}))}
			/>
		</Panel>
	);
}

export function VideoApiShowcaseNativePreview() {
	const specs = [createUserSpec, listTransactionsSpec, sendNotificationSpec];

	return (
		<Panel>
			<PanelHeader
				title="API video specs"
				eyebrow="Generated surfaces"
				description="API overview definitions are rendered from exported sample specs."
			/>
			<PreviewList
				items={specs.map((spec) => ({
					title: spec.specName,
					subtitle: `${spec.method} ${spec.endpoint}`,
					body: spec.generatedOutputs.join(', '),
				}))}
			/>
		</Panel>
	);
}
