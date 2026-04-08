export const CLAUDE_CODE_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.claude-code';

export function createClaudeCodeProviderPayload() {
	return {
		id: 'provider.claude.code',
		providerKind: 'coding',
		displayName: 'Claude Code',
		integrationPackage: CLAUDE_CODE_PROVIDER_INTEGRATION_PACKAGE,
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
