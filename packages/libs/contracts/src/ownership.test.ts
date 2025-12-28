import { describe, expect, it } from 'bun:test';
import {
  StabilityEnum,
  OwnersEnum,
  Owners,
  TagsEnum,
  Tags,
  type Stability,
  type Owner,
  type Tag,
  type OwnerShipMeta,
} from './ownership';

describe('StabilityEnum', () => {
  it('should have all stability values', () => {
    expect(StabilityEnum.Idea).toBe('idea');
    expect(StabilityEnum.InCreation).toBe('in_creation');
    expect(StabilityEnum.Experimental).toBe('experimental');
    expect(StabilityEnum.Beta).toBe('beta');
    expect(StabilityEnum.Stable).toBe('stable');
    expect(StabilityEnum.Deprecated).toBe('deprecated');
  });

  it('should allow type-safe stability values', () => {
    const stability: Stability = StabilityEnum.Stable;
    expect(stability).toBe('stable');
  });
});

describe('OwnersEnum', () => {
  it('should have platform owner values', () => {
    expect(OwnersEnum.PlatformCore).toBe('platform.core');
    expect(OwnersEnum.PlatformSigil).toBe('platform.sigil');
    expect(OwnersEnum.PlatformMarketplace).toBe('platform.marketplace');
    expect(OwnersEnum.PlatformMessaging).toBe('platform.messaging');
    expect(OwnersEnum.PlatformContent).toBe('platform.content');
    expect(OwnersEnum.PlatformFeatureFlags).toBe('platform.featureflags');
    expect(OwnersEnum.PlatformFinance).toBe('platform.finance');
  });

  it('should have backwards-compatible Owners alias', () => {
    expect(Owners).toBe(OwnersEnum);
    expect(Owners.PlatformCore).toBe('platform.core');
  });

  it('should allow custom string owners', () => {
    const customOwner: Owner = 'custom.team';
    expect(customOwner).toBe('custom.team');
  });
});

describe('TagsEnum', () => {
  it('should have all tag values', () => {
    expect(TagsEnum.Spots).toBe('spots');
    expect(TagsEnum.Collectivity).toBe('collectivity');
    expect(TagsEnum.Marketplace).toBe('marketplace');
    expect(TagsEnum.Sellers).toBe('sellers');
    expect(TagsEnum.Auth).toBe('auth');
    expect(TagsEnum.Login).toBe('login');
    expect(TagsEnum.Signup).toBe('signup');
    expect(TagsEnum.Guide).toBe('guide');
    expect(TagsEnum.Docs).toBe('docs');
    expect(TagsEnum.I18n).toBe('i18n');
    expect(TagsEnum.Incident).toBe('incident');
    expect(TagsEnum.Automation).toBe('automation');
    expect(TagsEnum.Hygiene).toBe('hygiene');
  });

  it('should have backwards-compatible Tags alias', () => {
    expect(Tags).toBe(TagsEnum);
    expect(Tags.Auth).toBe('auth');
  });

  it('should allow custom string tags', () => {
    const customTag: Tag = 'custom-feature';
    expect(customTag).toBe('custom-feature');
  });
});

describe('OwnerShipMeta interface', () => {
  it('should properly structure ownership metadata', () => {
    const meta: OwnerShipMeta = {
      version: 1,
      key: 'sigil.beginSignup',
      title: 'Signup begin',
      description: 'Begin the signup process',
      domain: 'auth',
      stability: StabilityEnum.Stable,
      owners: [OwnersEnum.PlatformCore, 'custom.team'],
      tags: [TagsEnum.Auth, TagsEnum.Signup, 'onboarding'],
    };

    expect(meta.version).toBe(1);
    expect(meta.key).toBe('sigil.beginSignup');
    expect(meta.title).toBe('Signup begin');
    expect(meta.stability).toBe('stable');
    expect(meta.owners).toContain('platform.core');
    expect(meta.tags).toContain('auth');
  });

  it('should allow optional fields', () => {
    const minimalMeta: OwnerShipMeta = {
      version: 1,
      key: 'test.operation',
      description: 'Test operation',
      stability: StabilityEnum.Experimental,
      owners: [OwnersEnum.PlatformCore],
      tags: [],
    };

    expect(minimalMeta.title).toBeUndefined();
    expect(minimalMeta.domain).toBeUndefined();
    expect(minimalMeta.docId).toBeUndefined();
  });
});
