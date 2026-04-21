export interface PresentationAliasOptions {
	uiKitWeb?: string;
	uiKitNative?: string;
	presentationReact?: string;
	presentationNative?: string;
}

export interface PresentationAliasTargets {
	uiKitWeb: string;
	uiKitNative: string;
	presentationReact: string;
	presentationNative: string;
}

export type TurbopackAliasTarget = string | { browser: string };

export const WEBPACK_WEB_EXTENSIONS = [
	'.web.js',
	'.web.jsx',
	'.web.ts',
	'.web.tsx',
] as const;

export const TURBOPACK_WEB_EXTENSIONS = [
	'.web.tsx',
	'.web.ts',
	'.web.jsx',
	'.web.js',
] as const;

export const TURBOPACK_DEFAULT_EXTENSIONS = [
	'.tsx',
	'.ts',
	'.jsx',
	'.js',
	'.mjs',
	'.json',
] as const;

export function resolvePresentationAliasTargets(
	options: PresentationAliasOptions = {}
): PresentationAliasTargets {
	return {
		uiKitWeb: options.uiKitWeb ?? '@contractspec/lib.ui-kit-web',
		uiKitNative: options.uiKitNative ?? '@contractspec/lib.ui-kit',
		presentationReact:
			options.presentationReact ??
			'@contractspec/lib.presentation-runtime-react',
		presentationNative:
			options.presentationNative ??
			'@contractspec/lib.presentation-runtime-react-native',
	};
}

export function createPresentationAliasMap(
	options: PresentationAliasOptions = {}
): Record<string, string> {
	const targets = resolvePresentationAliasTargets(options);

	return {
		[targets.uiKitNative]: targets.uiKitWeb,
		[targets.presentationNative]: targets.presentationReact,
	};
}

export function prependUniqueExtensions(
	preferred: readonly string[],
	existing: readonly string[]
): string[] {
	const seen = new Set<string>();
	const merged: string[] = [];

	for (const extension of [...preferred, ...existing]) {
		if (seen.has(extension)) {
			continue;
		}

		seen.add(extension);
		merged.push(extension);
	}

	return merged;
}

export function createTurbopackResolveExtensions(
	existing?: readonly string[]
): string[] {
	return prependUniqueExtensions(
		TURBOPACK_WEB_EXTENSIONS,
		existing ?? TURBOPACK_DEFAULT_EXTENSIONS
	);
}
