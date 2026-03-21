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

		expect(plugin).toContain('@contractspec/lib.ui-kit-web/ui/button');
		expect(aiRules).toContain('consumer/require-contract-first');
	});

	it('bundles generated artifacts by audience', () => {
		const artifacts = generateArtifactsForAudience('repo');

		expect(artifacts.preset).toContain('noUnusedImports');
		expect(Object.keys(artifacts.plugins)).toEqual([
			'repo-prefer-design-system.grit',
		]);
	});
});
