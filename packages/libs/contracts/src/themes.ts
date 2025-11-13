import type { OwnerShipMeta } from './ownership';

export type ThemeScope = 'global' | 'tenant' | 'user';

export interface ThemeToken<T> {
  value: T;
  description?: string;
}

export interface ThemeTokens {
  colors?: Record<string, ThemeToken<string>>;
  radii?: Record<string, ThemeToken<number>>;
  space?: Record<string, ThemeToken<number>>;
  typography?: Record<string, ThemeToken<number>>;
  shadows?: Record<string, ThemeToken<string>>;
  motion?: Record<string, ThemeToken<string>>;
}

export interface ComponentVariantDefinition {
  props?: Record<string, unknown>;
  tokens?: ThemeTokens;
}

export interface ComponentVariantSpec {
  component: string;
  variants: Record<string, ComponentVariantDefinition>;
}

export interface ThemeOverride {
  scope: ThemeScope;
  target: string;
  tokens?: ThemeTokens;
  components?: ComponentVariantSpec[];
}

export interface ThemeMeta extends OwnerShipMeta {
  name: string;
  version: number;
  extends?: ThemeRef;
  scopes?: ThemeScope[];
}

export interface ThemeSpec {
  meta: ThemeMeta;
  tokens: ThemeTokens;
  components?: ComponentVariantSpec[];
  overrides?: ThemeOverride[];
}

export interface ThemeRef {
  name: string;
  version: number;
}

const themeKey = (ref: ThemeRef | ThemeMeta) =>
  `${ref.name}.v${ref.version}`;

export class ThemeRegistry {
  private readonly items = new Map<string, ThemeSpec>();

  register(spec: ThemeSpec): this {
    const key = themeKey(spec.meta);
    if (this.items.has(key))
      throw new Error(`Duplicate theme ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): ThemeSpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): ThemeSpec | undefined {
    if (version != null) return this.items.get(themeKey({ name, version }));
    let candidate: ThemeSpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.name !== name) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
        candidate = spec;
      }
    }
    return candidate;
  }
}

export function makeThemeRef(spec: ThemeSpec): ThemeRef {
  return { name: spec.meta.name, version: spec.meta.version };
}

