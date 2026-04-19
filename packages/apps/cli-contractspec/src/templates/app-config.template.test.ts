import { describe, expect, it } from 'bun:test';
import type { AppBlueprintSpecData } from '../types';
import { generateAppBlueprintSpec } from './app-config.template';

describe('generateAppBlueprintSpec', () => {
	const baseData: AppBlueprintSpecData = {
		key: 'demo.app',
		version: '1.0.0',
		title: 'Demo App',
		description: 'Demo blueprint.',
		domain: 'demo',
		owners: ['@team-platform'],
		tags: ['app-config'],
		stability: 'experimental',
		appId: 'demo',
		capabilitiesEnabled: [],
		capabilitiesDisabled: [],
		featureIncludes: [],
		featureExcludes: [],
		dataViews: [],
		workflows: [],
		policyRefs: [],
		themeFallbacks: [],
		activeExperiments: [],
		pausedExperiments: [],
		featureFlags: [],
		routes: [],
	};

	it('renders key-based refs and string versions', () => {
		const code = generateAppBlueprintSpec({
			...baseData,
			dataViews: [
				{ slot: 'dashboard', key: 'view.dashboard', version: '1.0.0' },
			],
			policyRefs: [{ key: 'policy.access', version: '1.0.0' }],
			theme: { key: 'theme.console', version: '1.0.0' },
			telemetry: { key: 'telemetry.app', version: '1.0.0' },
			activeExperiments: [{ key: 'exp.rollout', version: '1.0.0' }],
			routes: [
				{
					path: '/',
					guardKey: 'policy.access',
					guardVersion: '1.0.0',
					experimentKey: 'exp.rollout',
					experimentVersion: '1.0.0',
				},
			],
		});

		expect(code).toContain("key: 'demo.app'");
		expect(code).toContain("version: '1.0.0'");
		expect(code).toContain("key: 'view.dashboard'");
		expect(code).toContain("key: 'policy.access'");
		expect(code).toContain("key: 'theme.console'");
		expect(code).toContain("key: 'telemetry.app'");
		expect(code).toContain("experiment: { key: 'exp.rollout'");
	});
});
