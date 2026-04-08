import { describe, expect, it } from 'bun:test';
import {
	COPILOT_PROVIDER_INTEGRATION_PACKAGE,
	createCopilotProviderPayload,
} from './index';

describe('provider-copilot integration', () => {
	it('creates the expected Copilot provider payload', () => {
		const payload = createCopilotProviderPayload();

		expect(payload).toMatchObject({
			id: 'provider.copilot',
			providerKind: 'coding',
			displayName: 'Copilot',
			integrationPackage: COPILOT_PROVIDER_INTEGRATION_PACKAGE,
			authMode: 'managed',
			supportsRepoScopedPatch: true,
			supportsStructuredDiff: true,
			supportsFunctionCalling: false,
			supportsLocalExecution: false,
		});
		expect(payload.supportedRuntimeModes).toEqual(['managed']);
		expect(payload.supportedTaskTypes).toContain('generate_tests');
	});
});
