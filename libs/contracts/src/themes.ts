import type { OwnerShipMeta } from './ownership';
import { SpecContractRegistry } from './registry';

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
  key: string;
  version: string;
}

export class ThemeRegistry extends SpecContractRegistry<'theme', ThemeSpec> {
  constructor(items?: ThemeSpec[]) {
    super('theme', items);
  }
}

export function makeThemeRef(spec: ThemeSpec): ThemeRef {
  return { key: spec.meta.key, version: spec.meta.version };
}
