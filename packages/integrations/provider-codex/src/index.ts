export const CODEX_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.codex';

export function createCodexProviderPayload() {
	return {
		id: 'provider.codex',
		providerKind: 'coding',
		displayName: 'Codex',
		integrationPackage: CODEX_PROVIDER_INTEGRATION_PACKAGE,
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
	} as const;
}
export * from './integration';
