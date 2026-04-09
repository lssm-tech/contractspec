import type { ExternalExecutionProvider } from '@contractspec/lib.provider-spec';
import type { BuilderBootstrapResource } from './managed-builder-bootstrap';

export const BUILDER_BOOTSTRAP_PROVIDER_IDS = {
	conversational: 'provider.gemini',
	coding: 'provider.codex',
	codingFallback: 'provider.claude.code',
	codingFallbackSecondary: 'provider.copilot',
	stt: 'provider.stt.default',
	localHelper: 'provider.local.model',
} as const;

function createProviderPayload(input: {
	id: string;
	displayName: string;
	providerKind: ExternalExecutionProvider['providerKind'];
	integrationPackage: string;
	authMode: ExternalExecutionProvider['authMode'];
	supportedRuntimeModes: ExternalExecutionProvider['supportedRuntimeModes'];
	supportedTaskTypes: ExternalExecutionProvider['supportedTaskTypes'];
	supportsRepoScopedPatch: boolean;
	supportsStructuredDiff: boolean;
	supportsLongContext: boolean;
	supportsFunctionCalling: boolean;
	supportsStreaming: boolean;
	supportsLocalExecution: boolean;
	supportedArtifactTypes: string[];
	defaultRiskPolicy: ExternalExecutionProvider['defaultRiskPolicy'];
}) {
	return {
		id: input.id,
		providerKind: input.providerKind,
		displayName: input.displayName,
		integrationPackage: input.integrationPackage,
		authMode: input.authMode,
		supportedRuntimeModes: input.supportedRuntimeModes,
		supportedTaskTypes: input.supportedTaskTypes,
		supportsRepoScopedPatch: input.supportsRepoScopedPatch,
		supportsStructuredDiff: input.supportsStructuredDiff,
		supportsLongContext: input.supportsLongContext,
		supportsFunctionCalling: input.supportsFunctionCalling,
		supportsStreaming: input.supportsStreaming,
		supportsLocalExecution: input.supportsLocalExecution,
		supportedArtifactTypes: input.supportedArtifactTypes,
		defaultRiskPolicy: input.defaultRiskPolicy,
	} as const;
}

export function createManagedBuilderBootstrapProviders(
	includeLocalHelperProvider: boolean
) {
	const providers: Array<BuilderBootstrapResource<Record<string, unknown>>> = [
		{
			id: BUILDER_BOOTSTRAP_PROVIDER_IDS.conversational,
			payload: createProviderPayload({
				id: BUILDER_BOOTSTRAP_PROVIDER_IDS.conversational,
				providerKind: 'conversational',
				displayName: 'Gemini',
				integrationPackage: '@contractspec/integration.provider.gemini',
				authMode: 'managed',
				supportedRuntimeModes: ['managed', 'hybrid'],
				supportedTaskTypes: [
					'clarify',
					'summarize_sources',
					'draft_blueprint',
					'refine_blueprint',
					'extract_structure',
					'generate_ui_artifacts',
					'explain_diff',
				],
				supportsRepoScopedPatch: false,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				supportsLocalExecution: false,
				supportedArtifactTypes: ['json', 'markdown', 'ui_artifact'],
				defaultRiskPolicy: {
					clarify: 'low',
					summarize_sources: 'low',
					draft_blueprint: 'medium',
					refine_blueprint: 'medium',
					extract_structure: 'medium',
					generate_ui_artifacts: 'medium',
					explain_diff: 'low',
				},
			}),
		},
		{
			id: BUILDER_BOOTSTRAP_PROVIDER_IDS.coding,
			payload: createProviderPayload({
				id: BUILDER_BOOTSTRAP_PROVIDER_IDS.coding,
				providerKind: 'coding',
				displayName: 'Codex',
				integrationPackage: '@contractspec/integration.provider.codex',
				authMode: 'managed',
				supportedRuntimeModes: ['managed', 'local', 'hybrid'],
				supportedTaskTypes: [
					'propose_patch',
					'generate_tests',
					'verify_output',
					'explain_diff',
				],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				supportsLocalExecution: true,
				supportedArtifactTypes: ['diff', 'patch', 'test_report'],
				defaultRiskPolicy: {
					propose_patch: 'high',
					generate_tests: 'medium',
					verify_output: 'medium',
					explain_diff: 'low',
				},
			}),
		},
		{
			id: BUILDER_BOOTSTRAP_PROVIDER_IDS.codingFallback,
			payload: createProviderPayload({
				id: BUILDER_BOOTSTRAP_PROVIDER_IDS.codingFallback,
				providerKind: 'coding',
				displayName: 'Claude Code',
				integrationPackage: '@contractspec/integration.provider.claude-code',
				authMode: 'managed',
				supportedRuntimeModes: ['managed', 'local', 'hybrid'],
				supportedTaskTypes: [
					'propose_patch',
					'generate_tests',
					'verify_output',
					'explain_diff',
				],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				supportsLocalExecution: true,
				supportedArtifactTypes: ['diff', 'patch', 'test_report'],
				defaultRiskPolicy: {
					propose_patch: 'high',
					generate_tests: 'medium',
					verify_output: 'medium',
					explain_diff: 'low',
				},
			}),
		},
		{
			id: BUILDER_BOOTSTRAP_PROVIDER_IDS.codingFallbackSecondary,
			payload: createProviderPayload({
				id: BUILDER_BOOTSTRAP_PROVIDER_IDS.codingFallbackSecondary,
				providerKind: 'coding',
				displayName: 'Copilot',
				integrationPackage: '@contractspec/integration.provider.copilot',
				authMode: 'managed',
				supportedRuntimeModes: ['managed'],
				supportedTaskTypes: ['propose_patch', 'generate_tests', 'explain_diff'],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: false,
				supportsStreaming: true,
				supportsLocalExecution: false,
				supportedArtifactTypes: ['diff', 'patch'],
				defaultRiskPolicy: {
					propose_patch: 'high',
					generate_tests: 'medium',
					explain_diff: 'low',
				},
			}),
		},
		{
			id: BUILDER_BOOTSTRAP_PROVIDER_IDS.stt,
			payload: createProviderPayload({
				id: BUILDER_BOOTSTRAP_PROVIDER_IDS.stt,
				providerKind: 'stt',
				displayName: 'Speech to Text',
				integrationPackage: '@contractspec/integration.provider.stt',
				authMode: 'managed',
				supportedRuntimeModes: ['managed', 'local', 'hybrid'],
				supportedTaskTypes: ['transcribe_audio'],
				supportsRepoScopedPatch: false,
				supportsStructuredDiff: false,
				supportsLongContext: false,
				supportsFunctionCalling: false,
				supportsStreaming: true,
				supportsLocalExecution: true,
				supportedArtifactTypes: ['transcript', 'timestamped_segments'],
				defaultRiskPolicy: { transcribe_audio: 'medium' },
			}),
		},
	];

	if (includeLocalHelperProvider) {
		providers.push({
			id: BUILDER_BOOTSTRAP_PROVIDER_IDS.localHelper,
			payload: createProviderPayload({
				id: BUILDER_BOOTSTRAP_PROVIDER_IDS.localHelper,
				providerKind: 'routing_helper',
				displayName: 'Local Model',
				integrationPackage: '@contractspec/integration.provider.local-model',
				authMode: 'local',
				supportedRuntimeModes: ['local', 'hybrid'],
				supportedTaskTypes: [
					'clarify',
					'summarize_sources',
					'extract_structure',
				],
				supportsRepoScopedPatch: false,
				supportsStructuredDiff: false,
				supportsLongContext: false,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				supportsLocalExecution: true,
				supportedArtifactTypes: ['json', 'summary'],
				defaultRiskPolicy: {
					clarify: 'low',
					summarize_sources: 'low',
					extract_structure: 'medium',
				},
			}),
		});
	}

	return providers;
}
