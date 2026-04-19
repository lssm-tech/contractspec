/** Scope at which a theme can be applied. */
import type { DocBlock } from './docs/types';
import type { OwnerShipMeta } from './ownership';
import { SpecContractRegistry } from './registry';
import type { VersionedSpecRef } from './versioning';

export {
	assertThemeSpecValid,
	ThemeValidationError,
	type ThemeValidationIssue,
	type ThemeValidationLevel,
	type ThemeValidationResult,
	validateThemeSpec,
} from './themes.validation';
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

/**
 * Reference to a theme spec.
 * Uses key and version to identify a specific theme.
 */
export type ThemeRef = VersionedSpecRef;

export class ThemeRegistry extends SpecContractRegistry<'theme', ThemeSpec> {
	constructor(items?: ThemeSpec[]) {
		super('theme', items);
	}
}

export function makeThemeRef(spec: ThemeSpec): ThemeRef {
	return { key: spec.meta.key, version: spec.meta.version };
}

export const defineTheme = (spec: ThemeSpec): ThemeSpec => spec;

export const tech_contracts_themes_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.themes',
		title: 'ThemeSpec Overview',
		summary:
			'`ThemeSpec` defines a structured, versioned source of truth for design tokens, component variants, and scoped overrides. Use it to describe how tenants or individual users should experience the design system without hand-maintaining ad-hoc theme files. Specs live in `@contractspec/lib.contracts-spec`, making them accessible to generators, docs, and runtime tooling.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/themes',
		tags: ['tech', 'contracts', 'themes'],
		body: `# ThemeSpec Overview

## Purpose

\`ThemeSpec\` defines a structured, versioned source of truth for design tokens, component variants, and scoped overrides. Use it to describe how tenants or individual users should experience the design system without hand-maintaining ad-hoc theme files.

## Location

- Types, helper, registry, and validation: \`packages/libs/contracts-spec/src/themes.ts\` and \`packages/libs/contracts-spec/src/themes.validation.ts\`
- Design tokens bridge: \`packages/libs/design-system/src/theme/*\`

## Schema

\`\`\`ts
export interface ThemeSpec {
  meta: ThemeMeta;            // ownership metadata + { key, version, extends?, scopes? }
  tokens: ThemeTokens;
  components?: ComponentVariantSpec[];
  overrides?: ThemeOverride[];
}
\`\`\`

- **ThemeMeta**
  - \`key\`: fully-qualified identifier (for example \`design.pastel\`)
  - \`version\`: semver string such as \`1.0.0\`
  - \`extends?\`: optional \`ThemeRef\` to a base theme
  - \`scopes?\`: default scopes where the theme applies (\`global\`, \`tenant\`, \`user\`)
- **ThemeTokens**
  - \`colors\`, \`radii\`, \`space\`, \`typography\`, \`shadows\`, \`motion\`
  - each entry is a map of \`{ value, description? }\`
- **ComponentVariantSpec**
  - \`component\`: design-system component key (for example \`Button\`, \`NavMain\`)
  - \`variants\`: map of variant names to \`{ props?, tokens? }\`
- **ThemeOverride**
  - \`scope\`: \`'global' | 'tenant' | 'user'\`
  - \`target\`: scoped identifier such as \`tenant:artisanos\` or \`user:123\`
  - \`tokens?\` / \`components?\`: partial overrides for that target

## Authoring

\`\`\`ts
import { defineTheme } from '@contractspec/lib.contracts-spec/themes';

export const PastelTheme = defineTheme({
  meta: {
    key: 'design.pastel',
    version: '1.0.0',
    title: 'Pastel',
    description: 'Soft pastel palette for marketing surfaces.',
    domain: 'design-system',
    owners: ['platform.design'],
    tags: ['theme', 'marketing'],
    stability: 'experimental',
    scopes: ['tenant'],
  },
  tokens: {
    colors: {
      background: { value: '#fdf2f8' },
    },
  },
});
\`\`\`

Use \`validateThemeSpec()\` or \`assertThemeSpecValid()\` in CI and setup flows to catch duplicate overrides, empty targets, self-referential inheritance, and missing ownership metadata before publish time.

## Registry Usage

\`\`\`ts
import { ThemeRegistry } from '@contractspec/lib.contracts-spec/themes';

const themes = new ThemeRegistry();
themes.register(PastelTheme);

const theme = themes.get('design.pastel', '1.0.0');
const tenantVariant = theme?.overrides?.find(
  (override) => override.target === 'tenant:artisanos'
);
\`\`\`

The registry guarantees \`key + version\` uniqueness and exposes \`list()\` for discovery tooling.

## Rendering

The design system consumes specs through adapters you provide:

1. Resolve the base theme plus applicable overrides.
2. Merge token maps using \`ThemeTokens\`.
3. Feed the result into \`mapTokensForPlatform\` in \`@contractspec/lib.design-system\`.

\`\`\`ts
function resolveTokens(
  registry: ThemeRegistry,
  ref: ThemeRef,
  ctx: { tenant?: string; user?: string }
) {
  const spec = registry.get(ref.key, ref.version);
  if (!spec) throw new Error('Theme not found');

  const tokens = deepMerge(spec.tokens, collectOverrides(spec.overrides, ctx));
  return mapTokensForPlatform(tokens);
}
\`\`\`

## CLI

\`\`\`
contractspec create theme
\`\`\`

Use the theme wizard to scaffold a \`.theme.ts\` file that already imports and calls \`defineTheme(...)\`.
`,
	},
];
