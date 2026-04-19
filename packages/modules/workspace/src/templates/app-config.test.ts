import { describe, expect, it } from 'bun:test';
import type { AppBlueprintSpecData } from '../types/spec-types';
import { generateAppBlueprintSpec } from './app-config';

describe('generateAppBlueprintSpec', () => {
	const baseData: AppBlueprintSpecData = {
		key: 'test.app',
		version: '1.0.0',
		title: 'Test App',
		description: 'Test Description',
		domain: 'test-domain',
		owners: ['team-a'],
		tags: ['tag-1'],
		stability: 'stable',
		appId: 'app-123',
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

	it('generates a basic app config', () => {
		const code = generateAppBlueprintSpec(baseData);
		expect(code).toContain(
			"import type { AppBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config'"
		);
		expect(code).toContain('export const AppAppConfig: AppBlueprintSpec = {');
		expect(code).toContain("key: 'test.app'");
		expect(code).toContain("appId: 'app-123'");
	});

	it('includes capabilities', () => {
		const data: AppBlueprintSpecData = {
			...baseData,
			capabilitiesEnabled: ['cap.a'],
			capabilitiesDisabled: ['cap.b'],
		};
		const code = generateAppBlueprintSpec(data);
		expect(code).toContain("enabled: [{ key: 'cap.a' }]");
		expect(code).toContain("disabled: [{ key: 'cap.b' }]");
	});

	it('includes features', () => {
		const data: AppBlueprintSpecData = {
			...baseData,
			featureIncludes: ['feat.a'],
		};
		const code = generateAppBlueprintSpec(data);
		expect(code).toContain("include: [{ key: 'feat.a' }]");
	});

	it('includes data views mapping', () => {
		const data: AppBlueprintSpecData = {
			...baseData,
			dataViews: [{ slot: 'main', key: 'view.main', version: '1.0.0' }],
		};
		const code = generateAppBlueprintSpec(data);
		expect(code).toContain('main: {');
		expect(code).toContain("key: 'view.main'");
		expect(code).toContain("version: '1.0.0'");
	});

	it('includes key-based policy, theme, telemetry, and route refs', () => {
		const data: AppBlueprintSpecData = {
			...baseData,
			policyRefs: [{ key: 'policy.access', version: '1.0.0' }],
			theme: { key: 'theme.console', version: '1.0.0' },
			themeFallbacks: [{ key: 'theme.default', version: '1.0.0' }],
			telemetry: { key: 'telemetry.app', version: '1.0.0' },
			activeExperiments: [{ key: 'exp.onboarding', version: '1.0.0' }],
			routes: [
				{
					path: '/',
					guardKey: 'policy.access',
					guardVersion: '1.0.0',
					experimentKey: 'exp.onboarding',
					experimentVersion: '1.0.0',
				},
			],
		};
		const code = generateAppBlueprintSpec(data);
		expect(code).toContain("key: 'policy.access'");
		expect(code).toContain("primary: { key: 'theme.console'");
		expect(code).toContain("key: 'telemetry.app'");
		expect(code).toContain("experiment: { key: 'exp.onboarding'");
	});

	it('includes routes', () => {
		const data: AppBlueprintSpecData = {
			...baseData,
			routes: [{ path: '/', label: 'Home', dataView: 'dv.home' }],
		};
		const code = generateAppBlueprintSpec(data);
		expect(code).toContain("path: '/'");
		expect(code).toContain("label: 'Home'");
		expect(code).toContain("dataView: 'dv.home'");
	});
});
