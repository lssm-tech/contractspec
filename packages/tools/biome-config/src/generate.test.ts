import { describe, expect, it } from 'bun:test';
import {
	generateAiRules,
	generateArtifactsForAudience,
	generateBiomePreset,
	generateGritPlugin,
} from './generate';
import { policyManifest } from './policies';

describe('@contractspec/biome-config', () => {
	it('exposes a typed policy manifest for both audiences', () => {
		expect(policyManifest.some((rule) => rule.audience === 'repo')).toBe(true);
		expect(policyManifest.some((rule) => rule.audience === 'consumer')).toBe(
			true
		);
	});

	it('generates a repo preset with restricted element enforcement', () => {
		const preset = generateBiomePreset('repo');

		expect(preset).toContain('"!generated"');
		expect(preset).toContain('"!generated/**"');
		expect(preset).toContain('noRestrictedElements');
		expect(preset).toContain('packages/apps/**/*.{js,jsx,ts,tsx}');
		expect(preset).toContain('!packages/apps/mobile-demo/**/*.{js,jsx,ts,tsx}');
		expect(preset).toContain('../plugins/repo-prefer-design-system.grit');
		expect(preset).toContain('"recommended": false');
		expect(preset).toContain('"tailwindDirectives": true');
		expect(preset).toContain('"noDuplicateClasses"');
		expect(preset).toContain('"useSortedClasses"');
		expect(preset).toContain('"functions": [');
		expect(preset).toContain('"cn"');
	});

	it('generates a consumer plugin and AI rule summary', () => {
		const plugin = generateGritPlugin('consumer');
		const aiRules = generateAiRules('consumer');
		const engineMatches = plugin.match(/engine biome\(1\.0\)/g) ?? [];

		expect(plugin).toContain('@contractspec/lib.ui-kit-web/ui/button');
		expect(plugin).toContain(
			'@contractspec/lib.contracts-runtime-server-mcp/provider-mcp'
		);
		expect(engineMatches).toHaveLength(1);
		expect(plugin).toContain('sequential {');
		expect(aiRules).toContain('consumer/require-contract-first');
		expect(aiRules).toContain('consumer/no-deprecated-contracts-monolith');
		expect(aiRules).toContain(
			'consumer/prefer-contractspec-runtime-entrypoints'
		);
	});

	it('bundles generated artifacts by audience', () => {
		const artifacts = generateArtifactsForAudience('repo');

		expect(artifacts.preset).toContain('noUnusedImports');
		expect(Object.keys(artifacts.plugins)).toEqual([
			'repo-prefer-design-system.grit',
		]);
	});
});
