import { describe, expect, it } from 'bun:test';
import { ThemeRegistry, makeThemeRef, type ThemeSpec } from './themes';
import { StabilityEnum, type Tag, type Owner } from './ownership';

const baseMeta = {
  title: 'Pastel Theme' as const,
  description: 'Soft pastel colors for marketing sites' as const,
  domain: 'design-system' as const,
  owners: ['@team.design'] as Owner[],
  tags: ['theme', 'marketing'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const pastelTheme: ThemeSpec = {
  meta: {
    ...baseMeta,
    key: 'design.pastel',
    version: 1,
    scopes: ['tenant'],
  },
  tokens: {
    colors: {
      background: { value: '#fdf2f8' },
      foreground: { value: '#1f2937' },
    },
    radii: {
      card: { value: 12 },
    },
  },
  components: [
    {
      component: 'Button',
      variants: {
        pastel: {
          props: { variant: 'pastel' },
          tokens: {
            colors: {
              primary: { value: '#fab1a0' },
              primaryForeground: { value: '#1f2937' },
            },
          },
        },
      },
    },
  ],
  overrides: [
    {
      scope: 'tenant',
      target: 'tenant:artisanos',
      tokens: {
        colors: {
          primary: { value: '#38bdf8' },
        },
      },
    },
  ],
};

describe('ThemeRegistry', () => {
  it('registers and retrieves themes by name/version', () => {
    const registry = new ThemeRegistry();
    registry.register(pastelTheme);
    const stored = registry.get('design.pastel', 1);
    expect(stored?.meta.name).toBe('design.pastel');
    expect(stored?.tokens.colors?.background?.value).toBe('#fdf2f8');
  });

  it('returns latest version when version omitted', () => {
    const registry = new ThemeRegistry();
    registry.register(pastelTheme);
    registry.register({
      ...pastelTheme,
      meta: { ...pastelTheme.meta, version: 2 },
    });
    const latest = registry.get('design.pastel');
    expect(latest?.meta.version).toBe(2);
  });

  it('creates stable theme references', () => {
    const ref = makeThemeRef(pastelTheme);
    expect(ref).toEqual({ name: 'design.pastel', version: 1 });
  });
});
