import { describe, expect, it } from 'bun:test';
import {
	createSttProviderPayload,
	STT_PROVIDER_INTEGRATION_PACKAGE,
} from './index';

describe('provider-stt integration', () => {
	it('creates the expected speech-to-text provider payload', () => {
		const payload = createSttProviderPayload();

		expect(payload).toMatchObject({
			id: 'provider.stt.default',
			providerKind: 'stt',
			displayName: 'Speech to Text',
			integrationPackage: STT_PROVIDER_INTEGRATION_PACKAGE,
			authMode: 'managed',
			supportsRepoScopedPatch: false,
			supportsStructuredDiff: false,
			supportsStreaming: true,
			supportsLocalExecution: true,
		});
		expect(payload.supportedRuntimeModes).toEqual([
			'managed',
			'local',
			'hybrid',
		]);
		expect(payload.supportedTaskTypes).toEqual(['transcribe_audio']);
	});
});
