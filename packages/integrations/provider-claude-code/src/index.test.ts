import { describe, expect, it } from 'bun:test';
import {
	CLAUDE_CODE_PROVIDER_INTEGRATION_PACKAGE,
	createClaudeCodeProviderPayload,
} from './index';

describe('provider-claude-code integration', () => {
	it('creates the expected Claude Code provider payload', () => {
		const payload = createClaudeCodeProviderPayload();

		expect(payload).toMatchObject({
			id: 'provider.claude.code',
			providerKind: 'coding',
			displayName: 'Claude Code',
			integrationPackage: CLAUDE_CODE_PROVIDER_INTEGRATION_PACKAGE,
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
		expect(payload.supportedTaskTypes).toContain('generate_tests');
		expect(payload.defaultRiskPolicy.explain_diff).toBe('low');
	});
});
