import { describe, expect, it } from 'bun:test';
import { generateAppBlueprintSpec } from './app-config';
import type { AppBlueprintSpecData } from '../types/spec-types';

describe('generateAppBlueprintSpec', () => {
  const baseData: AppBlueprintSpecData = {
    name: 'test.app',
    version: '1',
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
      "import type { AppBlueprintSpec } from '@contractspec/lib.contracts/app-config'"
    );
    expect(code).toContain(
      'export const Test_appAppConfig: AppBlueprintSpec = {'
    );
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
      dataViews: [{ slot: 'main', name: 'view.main', version: '1' }],
    };
    const code = generateAppBlueprintSpec(data);
    expect(code).toContain('main: {');
    expect(code).toContain("name: 'view.main'");
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
