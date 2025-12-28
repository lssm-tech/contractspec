import { describe, expect, it } from 'bun:test';
import { AppBlueprintRegistry, type AppBlueprintSpec } from './spec';
import { StabilityEnum, type Owner, type Tag } from '../ownership';

const baseMeta = {
  title: 'Tenant App Config' as const,
  description: 'Configuration for tenant' as const,
  domain: 'core',
  owners: ['@team.platform'] as Owner[],
  tags: ['app-config'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const makeBlueprint = (version: string): AppBlueprintSpec => ({
  meta: {
    ...baseMeta,
    key: 'tenant-a.app',
    version,
    appId: 'app',
  },
});

describe('AppBlueprintRegistry', () => {
  it('registers and retrieves configs', () => {
    const registry = new AppBlueprintRegistry();
    const spec = makeBlueprint('1.0.0');
    registry.register(spec);
    expect(registry.get('tenant-a.app', '1.0.0')).toEqual(spec);
  });

  it('returns latest version when omitted', () => {
    const registry = new AppBlueprintRegistry();
    registry.register(makeBlueprint('1.0.0'));
    const latest = makeBlueprint('2.0.0');
    registry.register(latest);
    expect(registry.get('tenant-a.app')).toEqual(latest);
  });

  it('throws on duplicate registration', () => {
    const registry = new AppBlueprintRegistry();
    const spec = makeBlueprint('1.0.0');
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(
      /Duplicate contract/
    );
  });
});
