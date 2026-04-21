'use client';

import type {
	ThemeTokens as ContractThemeTokens,
	ThemeOverride,
	ThemeRef,
	ThemeRegistry,
	ThemeSpec,
} from '@contractspec/lib.contracts-spec/themes';
import type { BridgedTokens, PlatformKind } from './tokenBridge';
import { mapTokensForPlatform } from './tokenBridge';
import { defaultTokens, type ThemeTokens } from './tokens';

export interface ThemeResolutionContext {
	targets?: string[];
	mode?: string;
}

function mergeTokenGroup<TGroup extends object, TValue extends string | number>(
	base: TGroup,
	tokens?: Record<string, { value: TValue }>
) {
	if (!tokens) {
		return base;
	}

	const accumulator = { ...base } as TGroup & Record<string, TValue>;
	const writable = accumulator as Record<string, TValue>;

	for (const [key, token] of Object.entries(tokens)) {
		if (token?.value != null) {
			writable[key] = token.value;
		}
	}

	return accumulator as TGroup;
}

export function mergeThemeTokens(
	base: ThemeTokens,
	tokens?: ContractThemeTokens
): ThemeTokens {
	if (!tokens) {
		return base;
	}

	return {
		...base,
		colors: mergeTokenGroup(base.colors, tokens.colors),
		radii: mergeTokenGroup(base.radii, tokens.radii),
		space: mergeTokenGroup(base.space, tokens.space),
		typography: mergeTokenGroup(base.typography, tokens.typography),
	};
}

function overrideApplies(
	override: ThemeOverride,
	context?: ThemeResolutionContext
) {
	if (!context?.targets?.length) {
		return true;
	}
	return context.targets.includes(override.target);
}

export function resolveThemeSpecTokens(
	spec: ThemeSpec,
	context?: ThemeResolutionContext,
	baseTokens: ThemeTokens = defaultTokens
): ThemeTokens {
	let resolved = mergeThemeTokens(baseTokens, spec.tokens);
	const mode = context?.mode;

	if (mode) {
		resolved = mergeThemeTokens(resolved, spec.modes?.[mode]?.tokens);
	}

	for (const override of spec.overrides ?? []) {
		if (overrideApplies(override, context)) {
			resolved = mergeThemeTokens(resolved, override.tokens);
			if (mode) {
				resolved = mergeThemeTokens(resolved, override.modes?.[mode]?.tokens);
			}
		}
	}

	return resolved;
}

export function resolveThemeRefTokens(
	registry: ThemeRegistry,
	ref: ThemeRef,
	context?: ThemeResolutionContext
): ThemeTokens {
	const spec = registry.get(ref.key, ref.version);
	if (!spec) {
		return defaultTokens;
	}

	const inherited: ThemeTokens = spec.meta.extends
		? resolveThemeRefTokens(registry, spec.meta.extends, context)
		: defaultTokens;

	return resolveThemeSpecTokens(spec, context, inherited);
}

export function resolveThemeModeTokens(
	spec: ThemeSpec,
	mode: string,
	context?: ThemeResolutionContext,
	baseTokens?: ThemeTokens
): ThemeTokens;
export function resolveThemeModeTokens(
	registry: ThemeRegistry,
	ref: ThemeRef,
	mode: string,
	context?: ThemeResolutionContext
): ThemeTokens;
export function resolveThemeModeTokens(
	registryOrSpec: ThemeRegistry | ThemeSpec,
	refOrMode: ThemeRef | string,
	modeOrContext?: string | ThemeResolutionContext,
	contextOrBaseTokens?: ThemeResolutionContext | ThemeTokens
): ThemeTokens {
	if ('tokens' in registryOrSpec) {
		const spec = registryOrSpec;
		const mode = refOrMode as string;
		const context = modeOrContext as ThemeResolutionContext | undefined;
		const baseTokens = contextOrBaseTokens as ThemeTokens | undefined;
		return resolveThemeSpecTokens(
			spec,
			{ ...context, mode },
			baseTokens ?? defaultTokens
		);
	}

	const registry = registryOrSpec;
	const ref = refOrMode as ThemeRef;
	const mode = modeOrContext as string;
	const context = contextOrBaseTokens as ThemeResolutionContext | undefined;
	return resolveThemeRefTokens(registry, ref, { ...context, mode });
}

export function resolvePlatformTheme(
	spec: ThemeSpec,
	platform: PlatformKind,
	context?: ThemeResolutionContext
): BridgedTokens;
export function resolvePlatformTheme(
	registry: ThemeRegistry,
	ref: ThemeRef,
	platform: PlatformKind,
	context?: ThemeResolutionContext
): BridgedTokens;
export function resolvePlatformTheme(
	registryOrSpec: ThemeRegistry | ThemeSpec,
	refOrPlatform: ThemeRef | PlatformKind,
	platformOrContext?: PlatformKind | ThemeResolutionContext,
	context?: ThemeResolutionContext
): BridgedTokens {
	if ('tokens' in registryOrSpec) {
		const spec = registryOrSpec;
		const platform = refOrPlatform as PlatformKind;
		const resolvedTokens = resolveThemeSpecTokens(
			spec,
			platformOrContext as ThemeResolutionContext | undefined
		);
		return mapTokensForPlatform(platform, resolvedTokens);
	}

	const registry = registryOrSpec;
	const ref = refOrPlatform as ThemeRef;
	const platform = platformOrContext as PlatformKind;
	const resolvedTokens = resolveThemeRefTokens(registry, ref, context);
	return mapTokensForPlatform(platform, resolvedTokens);
}
