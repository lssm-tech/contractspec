import { describe, expect, it } from 'bun:test';
import {
	createGeminiProviderPayload,
	GEMINI_PROVIDER_INTEGRATION_PACKAGE,
} from './index';

describe('provider-gemini integration', () => {
	it('creates the expected Gemini provider payload', () => {
		const payload = createGeminiProviderPayload();

		expect(payload).toMatchObject({
			id: 'provider.gemini',
			providerKind: 'coding',
			displayName: 'Gemini',
			integrationPackage: GEMINI_PROVIDER_INTEGRATION_PACKAGE,
			authMode: 'managed',
			supportsRepoScopedPatch: false,
			supportsStructuredDiff: true,
			supportsLocalExecution: false,
		});
		expect(payload.supportedRuntimeModes).toEqual(['managed', 'hybrid']);
		expect(payload.supportedTaskTypes).toEqual([
			'clarify',
			'draft_blueprint',
			'extract_structure',
			'generate_ui_artifacts',
		]);
	});
});
