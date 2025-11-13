import { describe, expect, it } from 'vitest';
import { AppConfigRegistry, type AppConfigSpec } from './spec';
import { StabilityEnum, type Owner, type Tag } from '../ownership';

const baseMeta = {
  title: 'Tenant App Config' as const,
  description: 'Configuration for tenant' as const,
  domain: 'core',
  owners: ['@team.platform'] as Owner[],
  tags: ['app-config'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const makeConfig = (version: number): AppConfigSpec => ({
  meta: {
    ...baseMeta,
    name: 'tenant-a.app',
    version,
    appId: 'app',
    tenantId: 'tenant-a',
    environment: 'production',
  },
});

describe('AppConfigRegistry', () => {
  it('registers and retrieves configs', () => {
    const registry = new AppConfigRegistry();
    const spec = makeConfig(1);
    registry.register(spec);
    expect(registry.get('tenant-a.app', 1)).toEqual(spec);
  });

  it('returns latest version when omitted', () => {
    const registry = new AppConfigRegistry();
    registry.register(makeConfig(1));
    const latest = makeConfig(2);
    registry.register(latest);
    expect(registry.get('tenant-a.app')).toEqual(latest);
  });

  it('throws on duplicate registration', () => {
    const registry = new AppConfigRegistry();
    const spec = makeConfig(1);
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(/Duplicate AppConfig/);
  });
});

