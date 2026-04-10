export const GEMINI_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.gemini';

export function createGeminiProviderPayload() {
	return {
		id: 'provider.gemini',
		providerKind: 'conversational',
		displayName: 'Gemini',
		integrationPackage: GEMINI_PROVIDER_INTEGRATION_PACKAGE,
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
	} as const;
}
