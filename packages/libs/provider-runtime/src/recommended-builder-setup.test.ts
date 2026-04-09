import { describe, expect, it } from 'bun:test';
import { createManagedBuilderRoutingPolicyPayload } from './recommended-builder-setup';

describe('managed builder routing policy defaults', () => {
	it('creates an explicit managed-first routing policy with runtime and fallback rules', () => {
		const payload = createManagedBuilderRoutingPolicyPayload({
			conversationalProviderId: 'provider.gemini',
			codingProviderId: 'provider.codex',
			codingFallbackProviderIds: ['provider.claude.code', 'provider.copilot'],
			sttProviderId: 'provider.stt.default',
			localHelperProviderId: 'provider.local.model',
		});

		expect(payload.taskRules).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					taskType: 'clarify',
					preferredProviders: ['provider.gemini'],
					fallbackProviders: ['provider.local.model'],
				}),
				expect.objectContaining({
					taskType: 'propose_patch',
					preferredProviders: ['provider.codex'],
					fallbackProviders: ['provider.claude.code', 'provider.copilot'],
				}),
				expect.objectContaining({
					taskType: 'transcribe_audio',
					preferredProviders: ['provider.stt.default'],
				}),
			])
		);
		expect(payload.riskRules).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					riskLevelAtOrAbove: 'high',
					requireComparison: true,
				}),
			])
		);
		expect(payload.runtimeModeRules).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					runtimeMode: 'local',
					disallowManagedProvidersForSensitiveData: true,
				}),
				expect.objectContaining({
					runtimeMode: 'hybrid',
					disallowManagedProvidersForSensitiveData: true,
				}),
			])
		);
		expect(payload.comparisonRules).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					taskType: 'propose_patch',
					comparisonMode: 'dual_provider',
				}),
			])
		);
		expect(payload.fallbackRules).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					onFailure: 'provider_failed',
					action: 'fallback_or_escalate',
				}),
			])
		);
		expect(payload.defaultProviderProfileId).toBe('provider.gemini');
	});
});
