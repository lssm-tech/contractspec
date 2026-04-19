export const STT_PROVIDER_INTEGRATION_PACKAGE =
	'@contractspec/integration.provider.stt';

export function createSttProviderPayload() {
	return {
		id: 'provider.stt.default',
		providerKind: 'stt',
		displayName: 'Speech to Text',
		integrationPackage: STT_PROVIDER_INTEGRATION_PACKAGE,
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
		defaultRiskPolicy: {
			transcribe_audio: 'medium',
		},
	} as const;
}
export * from './integration';
