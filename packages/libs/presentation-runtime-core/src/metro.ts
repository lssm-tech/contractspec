export interface MetroAliasOptions {
	monorepoRoot?: string;
	uiKitWeb?: string;
	uiKitNative?: string;
	presentationReact?: string;
	presentationNative?: string;
	lucideReact?: string;
	lucideReactNative?: string;
	tslibEsm?: string;
}

export type MetroResolveResult = unknown;

export interface MetroResolveContextLike {
	resolveRequest: MetroResolveRequestLike;
	[key: string]: unknown;
}

export type MetroResolveRequestLike = (
	ctx: MetroResolveContextLike,
	moduleName: string,
	platform: string
) => MetroResolveResult;

export interface MetroResolverLike {
	unstable_enablePackageExports?: boolean;
	unstable_conditionsByPlatform?: Record<string, string[]>;
	platforms?: string[];
	resolveRequest?: MetroResolveRequestLike;
	[key: string]: unknown;
}

export interface MetroConfigLike {
	resolver?: MetroResolverLike;
	[key: string]: unknown;
}

function isNativeMetroPlatform(platform: string): boolean {
	return platform === 'ios' || platform === 'android' || platform === 'native';
}

function mergeConditions(
	existing: string[] | undefined,
	required: readonly string[]
): string[] {
	const merged = [...(existing ?? [])];

	for (const condition of required) {
		if (!merged.includes(condition)) {
			merged.push(condition);
		}
	}

	return merged;
}

export function withPresentationMetroAliases<T extends MetroConfigLike>(
	config: T,
	opts: MetroAliasOptions = {}
): T {
	const uiKitWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
	const uiKitNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
	const presentationReact =
		opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
	const presentationNative =
		opts.presentationNative ??
		'@contractspec/lib.presentation-runtime-react-native';
	const lucideReact = opts.lucideReact ?? 'lucide-react';
	const lucideReactNative = opts.lucideReactNative ?? 'lucide-react-native';
	const tslibEsm = opts.tslibEsm ?? 'tslib/tslib.es6.js';
	const resolver = config.resolver ?? {};

	resolver.unstable_enablePackageExports = true;
	resolver.unstable_conditionsByPlatform = {
		...(resolver.unstable_conditionsByPlatform ?? {}),
		ios: mergeConditions(resolver.unstable_conditionsByPlatform?.ios, [
			'ios',
			'react-native',
		]),
		android: mergeConditions(resolver.unstable_conditionsByPlatform?.android, [
			'android',
			'react-native',
		]),
		native: mergeConditions(resolver.unstable_conditionsByPlatform?.native, [
			'react-native',
		]),
		web: mergeConditions(resolver.unstable_conditionsByPlatform?.web, [
			'browser',
		]),
	};
	resolver.platforms = [
		'ios',
		'android',
		'native',
		'web',
		...(resolver.platforms ?? []),
	];

	const original = resolver.resolveRequest;
	resolver.resolveRequest = (ctx, moduleName, platform) => {
		const resolveRequest = original ?? ctx.resolveRequest;

		if (isNativeMetroPlatform(platform)) {
			if (
				typeof moduleName === 'string' &&
				moduleName.startsWith(`${uiKitWeb}/ui`)
			) {
				const mapped = moduleName.replace(
					`${uiKitWeb}/ui`,
					`${uiKitNative}/ui`
				);
				return resolveRequest(ctx, mapped, platform);
			}

			if (moduleName === presentationReact) {
				return resolveRequest(ctx, presentationNative, platform);
			}

			if (moduleName === lucideReact) {
				return resolveRequest(ctx, lucideReactNative, platform);
			}

			if (moduleName === 'tslib') {
				return resolveRequest(ctx, tslibEsm, platform);
			}
		}

		return resolveRequest(ctx, moduleName, platform);
	};

	config.resolver = resolver;

	return config;
}
