export const LOCAL_MODEL_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.local-model';

export function createLocalModelProviderPayload() {
	return {
		id: 'provider.local.model',
		providerKind: 'routing_helper',
		displayName: 'Local Model',
		integrationPackage: LOCAL_MODEL_PROVIDER_INTEGRATION_PACKAGE,
		authMode: 'local',
		supportedRuntimeModes: ['local', 'hybrid'],
		supportedTaskTypes: ['clarify', 'summarize_sources', 'extract_structure'],
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
	} as const;
}
