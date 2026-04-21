'use client';

import type {
	ComponentVariantDefinition,
	ThemeTokens as ContractThemeTokens,
	ThemeRef,
	ThemeRegistry,
	ThemeSpec,
} from '@contractspec/lib.contracts-spec/themes';
import * as React from 'react';
import type { ThemeResolutionContext } from './contracts';
import {
	componentTokensToCssVars,
	resolveRuntimeComponents,
	resolveRuntimeCssVariables,
	resolveRuntimeTokens,
} from './runtime-resolvers';
import type { BridgedTokens, PlatformKind } from './tokenBridge';
import { mapTokensForPlatform } from './tokenBridge';
import type { ThemeTokens } from './tokens';

export interface DesignSystemThemeProviderProps {
	children: React.ReactNode;
	platform?: PlatformKind;
	tokens?: ThemeTokens;
	theme?: ThemeSpec;
	registry?: ThemeRegistry;
	themeRef?: ThemeRef;
	targets?: string[];
	mode?: string;
	applyCssVariables?: boolean;
}

export interface ComponentThemeResult {
	props: Record<string, unknown>;
	tokens?: ContractThemeTokens;
}

interface DesignSystemThemeContextValue {
	platform: PlatformKind;
	tokens: ThemeTokens;
	platformTokens: BridgedTokens;
	components: ThemeSpec['components'];
	mode: string;
	cssVariables?: React.CSSProperties;
	context?: ThemeResolutionContext;
}

const DesignSystemThemeContext = React.createContext<
	DesignSystemThemeContextValue | undefined
>(undefined);

export function DesignSystemThemeProvider({
	children,
	platform = 'web',
	tokens,
	theme,
	registry,
	themeRef,
	targets,
	mode = 'light',
	applyCssVariables,
}: DesignSystemThemeProviderProps) {
	const context = React.useMemo<ThemeResolutionContext | undefined>(
		() => (targets?.length ? { targets, mode } : { mode }),
		[targets, mode]
	);
	const resolvedTokens = React.useMemo(
		() =>
			resolveRuntimeTokens({
				tokens,
				theme,
				registry,
				themeRef,
				context,
				mode,
			}),
		[tokens, theme, registry, themeRef, context, mode]
	);
	const components = React.useMemo(
		() => resolveRuntimeComponents({ theme, registry, themeRef, context }),
		[theme, registry, themeRef, context]
	);
	const cssVariables = React.useMemo(
		() =>
			resolveRuntimeCssVariables({ theme, registry, themeRef, context, mode }),
		[theme, registry, themeRef, context, mode]
	);
	const value = React.useMemo<DesignSystemThemeContextValue>(
		() => ({
			platform,
			tokens: resolvedTokens,
			platformTokens: mapTokensForPlatform(platform, resolvedTokens),
			components,
			mode,
			cssVariables,
			context,
		}),
		[platform, resolvedTokens, components, mode, cssVariables, context]
	);
	const content =
		applyCssVariables && cssVariables ? (
			<div style={cssVariables}>{children}</div>
		) : (
			children
		);

	return (
		<DesignSystemThemeContext.Provider value={value}>
			{content}
		</DesignSystemThemeContext.Provider>
	);
}

export function useDesignSystemTheme() {
	return React.useContext(DesignSystemThemeContext);
}

function findVariant(
	components: ThemeSpec['components'],
	component: string,
	variant: string
): ComponentVariantDefinition | undefined {
	return components?.find((entry) => entry.component === component)?.variants?.[
		variant
	];
}

export function useComponentTheme(
	componentKey: string,
	themeVariant = 'default'
): ComponentThemeResult {
	const theme = useDesignSystemTheme();
	const variant = findVariant(theme?.components, componentKey, themeVariant);

	return {
		props: variant?.props ?? {},
		tokens: variant?.tokens,
	};
}

export { componentTokensToCssVars };
