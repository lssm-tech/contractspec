export interface MetroAliasOptions {
	monorepoRoot?: string;
	uiKitWeb?: string;
	uiKitNative?: string;
	presentationReact?: string;
	presentationNative?: string;
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
	platforms?: string[];
	resolveRequest?: MetroResolveRequestLike;
	[key: string]: unknown;
}

export interface MetroConfigLike {
	resolver?: MetroResolverLike;
	[key: string]: unknown;
}

function isNativeMetroPlatform(platform: string): boolean {
	return (
		platform === 'ios' ||
		platform === 'android' ||
		platform === 'native' ||
		platform === 'mobile'
	);
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
	const resolver = config.resolver ?? {};

	resolver.unstable_enablePackageExports = true;
	resolver.platforms = [
		'ios',
		'android',
		'native',
		'mobile',
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
		}

		return resolveRequest(ctx, moduleName, platform);
	};

	config.resolver = resolver;

	return config;
}
