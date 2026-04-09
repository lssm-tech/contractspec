import { describe, expect, it } from 'bun:test';
import {
	BUILDER_MANAGED_RUNTIME_TARGET_ID,
	createManagedBuilderBootstrapPreset,
} from './managed-builder-bootstrap';

describe('managed builder bootstrap preset', () => {
	it('builds the managed MVP bootstrap resources and routing policy', () => {
		const preset = createManagedBuilderBootstrapPreset();

		expect(preset.preset).toBe('managed_mvp');
		expect(preset.defaultRuntimeMode).toBe('managed');
		expect(preset.runtimeTargets).toEqual([
			expect.objectContaining({ id: BUILDER_MANAGED_RUNTIME_TARGET_ID }),
		]);
		expect(preset.providers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'provider.gemini' }),
				expect.objectContaining({ id: 'provider.codex' }),
				expect.objectContaining({ id: 'provider.stt.default' }),
				expect.objectContaining({ id: 'provider.local.model' }),
			])
		);
		expect(preset.routingPolicy.defaultProviderProfileId).toBe(
			'provider.gemini'
		);
	});

	it('respects optional local and hybrid runtime inclusion flags', () => {
		const preset = createManagedBuilderBootstrapPreset({
			includeLocalRuntimeTarget: true,
			includeHybridRuntimeTarget: true,
			includeLocalHelperProvider: false,
		});

		expect(preset.runtimeTargets.map((target) => target.id)).toEqual([
			'rt_managed_default',
			'rt_local_default',
			'rt_hybrid_default',
		]);
		expect(
			preset.providers.some(
				(provider) => provider.id === 'provider.local.model'
			)
		).toBe(false);
	});

	it('supports local-daemon and hybrid presets with explicit default runtime modes', () => {
		const localPreset = createManagedBuilderBootstrapPreset({
			preset: 'local_daemon_mvp',
		});
		const hybridPreset = createManagedBuilderBootstrapPreset({
			preset: 'hybrid_mvp',
		});

		expect(localPreset.defaultRuntimeMode).toBe('local');
		expect(localPreset.runtimeTargets.map((target) => target.id)).toContain(
			'rt_local_default'
		);
		expect(localPreset.defaultProviderProfileId).toBe('provider.local.model');
		expect(hybridPreset.defaultRuntimeMode).toBe('hybrid');
		expect(hybridPreset.runtimeTargets.map((target) => target.id)).toContain(
			'rt_hybrid_default'
		);
	});
});
