import { describe, expect, it } from 'bun:test';
import {
	createLocalModelProviderPayload,
	LOCAL_MODEL_PROVIDER_INTEGRATION_PACKAGE,
} from './index';

describe('provider-local-model integration', () => {
	it('creates the expected local model provider payload', () => {
		const payload = createLocalModelProviderPayload();

		expect(payload).toMatchObject({
			id: 'provider.local.model',
			providerKind: 'routing_helper',
			displayName: 'Local Model',
			integrationPackage: LOCAL_MODEL_PROVIDER_INTEGRATION_PACKAGE,
			authMode: 'local',
			supportsRepoScopedPatch: false,
			supportsStructuredDiff: false,
			supportsFunctionCalling: true,
			supportsLocalExecution: true,
		});
		expect(payload.supportedRuntimeModes).toEqual(['local', 'hybrid']);
		expect(payload.supportedTaskTypes).toEqual([
			'clarify',
			'summarize_sources',
			'extract_structure',
		]);
	});
});
