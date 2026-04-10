export const COPILOT_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.copilot';

export function createCopilotProviderPayload() {
	return {
		id: 'provider.copilot',
		providerKind: 'coding',
		displayName: 'Copilot',
		integrationPackage: COPILOT_PROVIDER_INTEGRATION_PACKAGE,
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
	} as const;
}
