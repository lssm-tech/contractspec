import type {
	ComponentVariantSpec,
	ThemeTokens as ContractThemeTokens,
	ThemeOverride,
	ThemeRef,
	ThemeRegistry,
	ThemeSpec,
} from '@contractspec/lib.contracts-spec/themes';
import type * as React from 'react';
import {
	resolveThemeModeTokens,
	type ThemeResolutionContext,
} from './contracts';
import { themeSpecToCssVariables } from './tailwind';
import { defaultTokens, type ThemeTokens } from './tokens';

export function resolveRuntimeTokens({
	tokens,
	theme,
	registry,
	themeRef,
	context,
	mode,
}: {
	tokens?: ThemeTokens;
	theme?: ThemeSpec;
	registry?: ThemeRegistry;
	themeRef?: ThemeRef;
	context?: ThemeResolutionContext;
	mode: string;
}) {
	if (theme) {
		return resolveThemeModeTokens(
			theme,
			mode,
			context,
			tokens ?? defaultTokens
		);
	}

	if (registry && themeRef) {
		return resolveThemeModeTokens(registry, themeRef, mode, context);
	}

	return tokens ?? defaultTokens;
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

function mergeComponents(
	...groups: Array<ComponentVariantSpec[] | undefined>
): ComponentVariantSpec[] | undefined {
	const components = new Map<string, ComponentVariantSpec>();

	for (const group of groups) {
		for (const component of group ?? []) {
			const previous = components.get(component.component);
			components.set(component.component, {
				component: component.component,
				variants: {
					...previous?.variants,
					...component.variants,
				},
			});
		}
	}

	return components.size ? [...components.values()] : undefined;
}

function resolveSpecComponents(
	spec: ThemeSpec,
	context?: ThemeResolutionContext
): ComponentVariantSpec[] | undefined {
	const mode = context?.mode;
	const overrideGroups = (spec.overrides ?? [])
		.filter((override) => overrideApplies(override, context))
		.flatMap((override) => [
			override.components,
			mode ? override.modes?.[mode]?.components : undefined,
		]);

	return mergeComponents(
		spec.components,
		mode ? spec.modes?.[mode]?.components : undefined,
		...overrideGroups
	);
}

function resolveRegistryComponents(
	registry: ThemeRegistry,
	ref: ThemeRef,
	context?: ThemeResolutionContext
): ComponentVariantSpec[] | undefined {
	const spec = registry.get(ref.key, ref.version);
	if (!spec) {
		return undefined;
	}

	const inherited = spec.meta.extends
		? resolveRegistryComponents(registry, spec.meta.extends, context)
		: undefined;

	return mergeComponents(inherited, resolveSpecComponents(spec, context));
}

export function resolveRuntimeComponents({
	theme,
	registry,
	themeRef,
	context,
}: {
	theme?: ThemeSpec;
	registry?: ThemeRegistry;
	themeRef?: ThemeRef;
	context?: ThemeResolutionContext;
}) {
	if (theme) {
		return resolveSpecComponents(theme, context);
	}

	if (registry && themeRef) {
		return resolveRegistryComponents(registry, themeRef, context);
	}

	return undefined;
}

export function resolveRuntimeCssVariables({
	theme,
	registry,
	themeRef,
	context,
	mode,
}: {
	theme?: ThemeSpec;
	registry?: ThemeRegistry;
	themeRef?: ThemeRef;
	context?: ThemeResolutionContext;
	mode: string;
}): React.CSSProperties | undefined {
	if (theme) {
		return themeSpecToCssVariables(theme, { context }).modes[
			mode
		] as React.CSSProperties;
	}

	if (registry && themeRef) {
		return themeSpecToCssVariables(registry, themeRef, { context }).modes[
			mode
		] as React.CSSProperties;
	}

	return undefined;
}

export function componentTokensToCssVars(tokens?: ContractThemeTokens) {
	if (!tokens) {
		return undefined;
	}

	const style: React.CSSProperties = {};

	for (const [group, values] of Object.entries(tokens)) {
		const tokenValues = (values ?? {}) as Record<
			string,
			{ value?: string | number }
		>;
		for (const [key, token] of Object.entries(tokenValues)) {
			if (token?.value != null) {
				style[
					`--ds-${toCssTokenGroup(group)}-${toKebabCase(key)}` as keyof React.CSSProperties
				] = token.value as never;
			}
		}
	}

	return style;
}

function toCssTokenGroup(group: string): string {
	if (group === 'colors') {
		return 'color';
	}
	if (group === 'radii') {
		return 'radius';
	}
	return group;
}

function toKebabCase(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[\s_.]+/g, '-')
		.toLowerCase();
}
