'use strict';

const WEBPACK_WEB_EXTENSIONS = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx'];
const TURBOPACK_WEB_EXTENSIONS = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js'];
const TURBOPACK_DEFAULT_EXTENSIONS = [
	'.tsx',
	'.ts',
	'.jsx',
	'.js',
	'.mjs',
	'.json',
];

function createPresentationAliasMap(opts = {}) {
	const uiWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
	const uiNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
	const presReact =
		opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
	const presNative =
		opts.presentationNative ??
		'@contractspec/lib.presentation-runtime-react-native';

	return {
		[uiNative]: uiWeb,
		[presNative]: presReact,
	};
}

function prependUniqueExtensions(preferred, existing) {
	const seen = new Set();
	const merged = [];

	for (const extension of [...preferred, ...existing]) {
		if (seen.has(extension)) {
			continue;
		}

		seen.add(extension);
		merged.push(extension);
	}

	return merged;
}

function withPresentationWebpackAliases(config, opts = {}) {
	const aliasMap = createPresentationAliasMap(opts);

	config.resolve = config.resolve || {};
	config.resolve.alias = {
		...(config.resolve.alias || {}),
		...aliasMap,
	};
	config.resolve.extensions = [
		...WEBPACK_WEB_EXTENSIONS,
		...(config.resolve.extensions || []),
	];
	return config;
}

function withPresentationTurbopackAliases(nextConfig, opts = {}) {
	const aliasMap = createPresentationAliasMap(opts);

	nextConfig.turbopack = nextConfig.turbopack || {};
	nextConfig.turbopack.resolveAlias = {
		...(nextConfig.turbopack.resolveAlias || {}),
		...aliasMap,
	};
	nextConfig.turbopack.resolveExtensions = prependUniqueExtensions(
		TURBOPACK_WEB_EXTENSIONS,
		nextConfig.turbopack.resolveExtensions || TURBOPACK_DEFAULT_EXTENSIONS
	);
	return nextConfig;
}

export { withPresentationTurbopackAliases, withPresentationWebpackAliases };
