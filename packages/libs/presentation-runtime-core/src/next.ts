import {
	createPresentationAliasMap,
	createTurbopackResolveExtensions,
	type PresentationAliasOptions,
	type TurbopackAliasTarget,
	WEBPACK_WEB_EXTENSIONS,
} from './presentation-aliases';

/** @deprecated Use PresentationAliasOptions. */
export type NextAliasOptions = PresentationAliasOptions;

export interface WebpackResolveLike {
	alias?: Record<string, unknown>;
	extensions?: string[];
	[key: string]: unknown;
}

export interface WebpackConfigLike {
	resolve?: WebpackResolveLike;
	[key: string]: unknown;
}

export interface TurbopackConfigLike {
	resolveAlias?: Record<string, TurbopackAliasTarget>;
	resolveExtensions?: string[];
	[key: string]: unknown;
}

export interface NextConfigLike {
	turbopack?: TurbopackConfigLike;
	[key: string]: unknown;
}

export function withPresentationWebpackAliases<T extends WebpackConfigLike>(
	config: T,
	opts: PresentationAliasOptions = {}
) {
	const resolve = config.resolve ?? {};

	resolve.alias = {
		...(resolve.alias ?? {}),
		...createPresentationAliasMap(opts),
	};
	resolve.extensions = [
		...WEBPACK_WEB_EXTENSIONS,
		...(resolve.extensions ?? []),
	];
	config.resolve = resolve;

	return config;
}

export function withPresentationTurbopackAliases<T extends NextConfigLike>(
	nextConfig: T,
	opts: PresentationAliasOptions = {}
) {
	const turbopack = nextConfig.turbopack ?? {};

	turbopack.resolveAlias = {
		...(turbopack.resolveAlias ?? {}),
		...createPresentationAliasMap(opts),
	};
	turbopack.resolveExtensions = createTurbopackResolveExtensions(
		turbopack.resolveExtensions
	);
	nextConfig.turbopack = turbopack;

	return nextConfig;
}
