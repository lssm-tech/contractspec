import type {
	ThemeRef,
	ThemeRegistry,
	ThemeSpec,
} from '@contractspec/lib.contracts-spec/themes';
import {
	resolveThemeModeTokens,
	type ThemeResolutionContext,
} from './contracts';
import type { ThemeTokens } from './tokens';

export type ThemeCssVariableMap = Record<string, string>;

export interface ThemeCssVariables {
	light: ThemeCssVariableMap;
	dark: ThemeCssVariableMap;
	modes: Record<string, ThemeCssVariableMap>;
}

export interface ThemeTailwindBridgeOptions {
	context?: ThemeResolutionContext;
	targets?: string[];
	modes?: string[];
	rootSelector?: string;
	darkSelector?: string;
	includeTheme?: boolean;
	includeCustomVariant?: boolean;
}

const DEFAULT_MODE_NAMES = ['light', 'dark'] as const;

function toKebabCase(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[\s_.]+/g, '-')
		.toLowerCase();
}

function withContext(
	options: ThemeTailwindBridgeOptions | undefined,
	mode: string
): ThemeResolutionContext {
	return {
		...options?.context,
		targets: options?.targets ?? options?.context?.targets,
		mode,
	};
}

function cssValue(value: string | number): string {
	return typeof value === 'number' ? `${value}px` : value;
}

function tokenVariables(group: string, values: object): ThemeCssVariableMap {
	return Object.fromEntries(
		Object.entries(values).map(([key, value]) => [
			`--ds-${group}-${toKebabCase(key)}`,
			cssValue(value as string | number),
		])
	);
}

function tokensToCssVariables(tokens: ThemeTokens): ThemeCssVariableMap {
	return {
		...tokenVariables('color', tokens.colors),
		...tokenVariables('radius', tokens.radii),
		...tokenVariables('space', tokens.space),
		...tokenVariables('typography', tokens.typography),
		...tokenVariables('icon', tokens.icons),
	};
}

function getSpecModeNames(spec: ThemeSpec | undefined): string[] {
	return Object.keys(spec?.modes ?? {});
}

function getRegistryModeNames(
	registry: ThemeRegistry,
	ref: ThemeRef,
	seen = new Set<string>()
): string[] {
	const seenKey = `${ref.key}@${ref.version}`;
	if (seen.has(seenKey)) {
		return [];
	}
	seen.add(seenKey);

	const spec = registry.get(ref.key, ref.version);
	return [
		...getRegistryModeNamesForSpec(registry, spec, seen),
		...getSpecModeNames(spec),
	];
}

function getRegistryModeNamesForSpec(
	registry: ThemeRegistry,
	spec: ThemeSpec | undefined,
	seen: Set<string>
): string[] {
	if (!spec?.meta.extends) {
		return [];
	}
	return getRegistryModeNames(registry, spec.meta.extends, seen);
}

function collectModeNames(
	source: ThemeSpec | ThemeRegistry,
	refOrOptions?: ThemeRef | ThemeTailwindBridgeOptions,
	options?: ThemeTailwindBridgeOptions
): string[] {
	const configuredModes =
		'tokens' in source
			? getSpecModeNames(source)
			: getRegistryModeNames(source, refOrOptions as ThemeRef);
	return Array.from(
		new Set([
			...DEFAULT_MODE_NAMES,
			...configuredModes,
			...(options?.modes ?? []),
			...(!('tokens' in source)
				? []
				: ((refOrOptions as ThemeTailwindBridgeOptions | undefined)?.modes ??
					[])),
		])
	);
}

function resolveModeTokens(
	source: ThemeSpec | ThemeRegistry,
	refOrMode: ThemeRef | string,
	modeOrOptions?: string | ThemeTailwindBridgeOptions,
	options?: ThemeTailwindBridgeOptions
): ThemeTokens {
	if ('tokens' in source) {
		const mode = refOrMode as string;
		const bridgeOptions = modeOrOptions as
			| ThemeTailwindBridgeOptions
			| undefined;
		return resolveThemeModeTokens(
			source,
			mode,
			withContext(bridgeOptions, mode)
		);
	}

	const ref = refOrMode as ThemeRef;
	const mode = modeOrOptions as string;
	return resolveThemeModeTokens(source, ref, mode, withContext(options, mode));
}

export function themeSpecToCssVariables(
	spec: ThemeSpec,
	options?: ThemeTailwindBridgeOptions
): ThemeCssVariables;
export function themeSpecToCssVariables(
	registry: ThemeRegistry,
	ref: ThemeRef,
	options?: ThemeTailwindBridgeOptions
): ThemeCssVariables;
export function themeSpecToCssVariables(
	source: ThemeSpec | ThemeRegistry,
	refOrOptions?: ThemeRef | ThemeTailwindBridgeOptions,
	options?: ThemeTailwindBridgeOptions
): ThemeCssVariables {
	const bridgeOptions =
		'tokens' in source
			? (refOrOptions as ThemeTailwindBridgeOptions | undefined)
			: options;
	const modes = collectModeNames(source, refOrOptions, bridgeOptions);
	const modeVariables = Object.fromEntries(
		modes.map((mode) => {
			const tokens =
				'tokens' in source
					? resolveModeTokens(source, mode, bridgeOptions)
					: resolveModeTokens(
							source,
							refOrOptions as ThemeRef,
							mode,
							bridgeOptions
						);
			return [mode, tokensToCssVariables(tokens)];
		})
	);

	return {
		light: modeVariables.light ?? {},
		dark: modeVariables.dark ?? {},
		modes: modeVariables,
	};
}
