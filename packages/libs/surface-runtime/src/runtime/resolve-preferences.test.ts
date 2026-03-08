import { describe, expect, it } from 'bun:test';
import { buildContext } from './build-context';
import { resolvePreferenceProfile } from './resolve-preferences';
import { defaultPreferenceAdapter } from './preference-adapter';

describe('resolvePreferenceProfile', () => {
  it('returns canonical dimensions with session scope', () => {
    const ctx = buildContext({
      route: '/test',
      preferences: { density: 'dense', guidance: 'none' },
    });
    const profile = resolvePreferenceProfile(ctx);
    expect(profile.canonical.density).toBe('dense');
    expect(profile.canonical.guidance).toBe('none');
    expect(profile.sourceByDimension?.density).toBe('session');
    expect(profile.sourceByDimension?.guidance).toBe('session');
    expect(profile.constrained).toEqual({});
    expect(Array.isArray(profile.notes)).toBe(true);
  });

  it('includes all 7 dimensions in canonical', () => {
    const ctx = buildContext({ route: '/test' });
    const profile = resolvePreferenceProfile(ctx);
    const dims = [
      'guidance',
      'density',
      'dataDepth',
      'control',
      'media',
      'pace',
      'narrative',
    ];
    for (const d of dims) {
      expect(
        profile.canonical[d as keyof typeof profile.canonical]
      ).toBeDefined();
    }
  });
});

describe('defaultPreferenceAdapter', () => {
  it('resolve returns ResolvedPreferenceProfile', async () => {
    const ctx = buildContext({
      route: '/test',
      preferences: { pace: 'rapid' },
    });
    const profile = await defaultPreferenceAdapter.resolve(ctx);
    expect(profile.canonical.pace).toBe('rapid');
    expect(profile.notes).toBeDefined();
  });

  it('savePreferencePatch completes without error (stub)', async () => {
    await expect(
      defaultPreferenceAdapter.savePreferencePatch({
        actorId: 'u1',
        patch: { density: 'compact' },
        scope: 'user',
      })
    ).resolves.toBeUndefined();
  });
});
