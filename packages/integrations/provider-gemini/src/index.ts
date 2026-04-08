export const GEMINI_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.gemini';

export function createGeminiProviderPayload() {
	return {
		id: 'provider.gemini',
		providerKind: 'coding',
		displayName: 'Gemini',
		integrationPackage: GEMINI_PROVIDER_INTEGRATION_PACKAGE,
		authMode: 'managed',
		supportedRuntimeModes: ['managed', 'hybrid'],
		supportedTaskTypes: [
			'clarify',
			'draft_blueprint',
			'extract_structure',
			'generate_ui_artifacts',
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
			draft_blueprint: 'medium',
			extract_structure: 'medium',
			generate_ui_artifacts: 'medium',
		},
	} as const;
}
