import { describe, expect, it } from 'bun:test';
import {
	CODEX_PROVIDER_INTEGRATION_PACKAGE,
	createCodexProviderPayload,
} from './index';

describe('provider-codex integration', () => {
	it('creates the expected Codex provider payload', () => {
		const payload = createCodexProviderPayload();

		expect(payload).toMatchObject({
			id: 'provider.codex',
			providerKind: 'coding',
			displayName: 'Codex',
			integrationPackage: CODEX_PROVIDER_INTEGRATION_PACKAGE,
			authMode: 'managed',
			supportsRepoScopedPatch: true,
			supportsStructuredDiff: true,
			supportsLocalExecution: true,
		});
		expect(payload.supportedRuntimeModes).toEqual([
			'managed',
			'local',
			'hybrid',
		]);
		expect(payload.supportedTaskTypes).toContain('propose_patch');
		expect(payload.defaultRiskPolicy.propose_patch).toBe('high');
	});
});
