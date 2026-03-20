import { readFile, writeFile } from 'node:fs/promises';

const PLATFORM_SUFFIXES = ['bun', 'node', 'browser', 'web', 'native'];
const CONDITION_KEYS = [
	'types',
	'browser',
	'react-native',
	'bun',
	'node',
	'default',
];

function removeExtension(relativePath) {
	return relativePath.replace(/\.[^/.]+$/, '');
}

function stripPlatformSuffix(pathWithoutExtension) {
	for (const suffix of PLATFORM_SUFFIXES) {
		const suffixToken = `.${suffix}`;
		if (pathWithoutExtension.endsWith(suffixToken)) {
			return {
				pathWithoutSuffix: pathWithoutExtension.slice(0, -suffixToken.length),
				suffix,
			};
		}
	}

	return {
		pathWithoutSuffix: pathWithoutExtension,
		suffix: 'base',
	};
}

function normalizeExportPath(pathWithoutExtension) {
	if (pathWithoutExtension.startsWith('src/')) {
		return pathWithoutExtension.slice(4);
	}

	return pathWithoutExtension;
}

function toExportKey(pathWithoutExtension) {
	const normalizedPath = normalizeExportPath(pathWithoutExtension);

	if (normalizedPath === 'index') {
		return '.';
	}

	if (normalizedPath.endsWith('/index')) {
		return `./${normalizedPath.slice(0, -6)}`;
	}

	return `./${normalizedPath}`;
}

function toExactExportKey(pathWithoutExtension) {
	const normalizedPath = normalizeExportPath(pathWithoutExtension);
	if (normalizedPath === 'index') {
		return '.';
	}

	return `./${normalizedPath}`;
}

function stripBuildRoot(pathWithoutExtension, root) {
	if (!root || root === '.') {
		return pathWithoutExtension;
	}

	if (pathWithoutExtension === root) {
		return 'index';
	}

	if (pathWithoutExtension.startsWith(`${root}/`)) {
		return pathWithoutExtension.slice(root.length + 1);
	}

	return pathWithoutExtension;
}

function toOutputPath(sourceRelativePath, target, targetRoots) {
	const withoutExtension = removeExtension(sourceRelativePath);
	const outputRoot =
		target === 'types'
			? (targetRoots.types ?? targetRoots.bun ?? '.')
			: (targetRoots[target] ?? targetRoots.bun ?? '.');
	const outputRelativePath = stripBuildRoot(withoutExtension, outputRoot);

	const extension = target === 'types' ? 'd.ts' : 'js';
	const outputBaseDir =
		target === 'bun' || target === 'types' ? 'dist' : `dist/${target}`;

	return `./${outputBaseDir}/${outputRelativePath}.${extension}`;
}

function toSourcePath(sourceRelativePath) {
	return `./${sourceRelativePath}`;
}

function pickTypesVariant(variants) {
	return (
		variants.base ??
		variants.bun ??
		variants.node ??
		variants.browser ??
		variants.web ??
		variants.native ??
		null
	);
}

function pickVariant(variants, mode) {
	if (mode === 'bun') {
		return (
			variants.bun ??
			variants.node ??
			variants.base ??
			variants.browser ??
			variants.web ??
			null
		);
	}

	if (mode === 'node') {
		return variants.node ?? variants.base ?? variants.bun ?? null;
	}

	if (mode === 'browser') {
		return variants.browser ?? variants.web ?? variants.base ?? null;
	}

	if (mode === 'react-native') {
		return variants.native ?? null;
	}

	return (
		variants.bun ??
		variants.node ??
		variants.base ??
		variants.browser ??
		variants.web ??
		null
	);
}

function createConditionMap(values) {
	const entry = {};

	for (const key of CONDITION_KEYS) {
		const value = values[key];
		if (typeof value === 'string' && value.length > 0) {
			entry[key] = value;
		}
	}

	return Object.keys(entry).length > 0 ? entry : null;
}

function hasNonBaseVariant(variants) {
	return Object.keys(variants).some((key) => key !== 'base');
}

function buildDevCanonicalExportEntry(variants) {
	if (!hasNonBaseVariant(variants) && typeof variants.base === 'string') {
		return toSourcePath(variants.base);
	}

	const typesSource = pickTypesVariant(variants);
	const browserSource =
		variants.browser || variants.web ? pickVariant(variants, 'browser') : null;
	const nativeSource = pickVariant(variants, 'react-native');
	const bunSource = variants.bun ?? null;
	const nodeSource = variants.node ?? null;
	const defaultSource = pickVariant(variants, 'default');

	return createConditionMap({
		types: typesSource ? toSourcePath(typesSource) : null,
		browser: browserSource ? toSourcePath(browserSource) : null,
		'react-native': nativeSource ? toSourcePath(nativeSource) : null,
		bun: bunSource ? toSourcePath(bunSource) : null,
		node: nodeSource ? toSourcePath(nodeSource) : null,
		default: defaultSource ? toSourcePath(defaultSource) : null,
	});
}

function buildPublishExportEntry(variants, targets, targetRoots, options = {}) {
	const typesSource = pickTypesVariant(variants);
	const bunSource = pickVariant(variants, 'bun');
	const nodeSource = targets.node ? pickVariant(variants, 'node') : null;
	const browserSource = targets.browser
		? pickVariant(variants, 'browser')
		: null;
	const nativeSource = pickVariant(variants, 'react-native');
	const defaultSource =
		pickVariant(variants, 'default') ??
		(options.allowNativeDefault === true ? nativeSource : null);
	const defaultTarget =
		options.allowNativeDefault === true && defaultSource === nativeSource
			? 'native'
			: 'bun';

	return createConditionMap({
		types: typesSource ? toOutputPath(typesSource, 'types', targetRoots) : null,
		browser: browserSource
			? toOutputPath(browserSource, 'browser', targetRoots)
			: null,
		'react-native': nativeSource
			? toOutputPath(nativeSource, 'native', targetRoots)
			: null,
		bun: bunSource ? toOutputPath(bunSource, 'bun', targetRoots) : null,
		node: nodeSource ? toOutputPath(nodeSource, 'node', targetRoots) : null,
		default: defaultSource
			? toOutputPath(defaultSource, defaultTarget, targetRoots)
			: null,
	});
}

function sortExportMap(exportMap) {
	const sorted = {};
	if (exportMap['.']) {
		sorted['.'] = exportMap['.'];
	}

	const keys = Object.keys(exportMap)
		.filter((key) => key !== '.')
		.sort((a, b) => a.localeCompare(b));
	for (const key of keys) {
		sorted[key] = exportMap[key];
	}

	return sorted;
}

export function buildExportMaps(entries, targets, targetRoots) {
	const descriptors = new Map();

	for (const entry of entries) {
		const withoutExtension = removeExtension(entry);
		const { pathWithoutSuffix, suffix } = stripPlatformSuffix(withoutExtension);
		const canonicalKey = toExportKey(pathWithoutSuffix);
		const exactKey = toExactExportKey(withoutExtension);

		if (!descriptors.has(canonicalKey)) {
			descriptors.set(canonicalKey, {
				kind: 'canonical',
				variants: {},
			});
		}

		const canonicalDescriptor = descriptors.get(canonicalKey);
		if (!canonicalDescriptor.variants[suffix]) {
			canonicalDescriptor.variants[suffix] = entry;
		}

		if (suffix !== 'base' && !descriptors.has(exactKey)) {
			descriptors.set(exactKey, {
				kind: 'exact',
				suffix,
				source: entry,
			});
		}
	}

	const devExports = {};
	const publishExports = {};

	for (const [key, descriptor] of descriptors.entries()) {
		if (descriptor.kind === 'canonical') {
			const devExportEntry = buildDevCanonicalExportEntry(descriptor.variants);
			if (devExportEntry) {
				devExports[key] = devExportEntry;
			}

			const publishExportEntry = buildPublishExportEntry(
				descriptor.variants,
				targets,
				targetRoots
			);
			if (publishExportEntry) {
				publishExports[key] = publishExportEntry;
			}
			continue;
		}

		devExports[key] = toSourcePath(descriptor.source);

		const publishExportEntry = buildPublishExportEntry(
			{ [descriptor.suffix]: descriptor.source },
			targets,
			targetRoots,
			{ allowNativeDefault: descriptor.suffix === 'native' }
		);
		if (publishExportEntry) {
			publishExports[key] = publishExportEntry;
		}
	}

	return {
		devExports: sortExportMap(devExports),
		publishExports: sortExportMap(publishExports),
	};
}

export async function rewritePackageExports(
	packageJsonPath,
	entries,
	targets,
	targetRoots
) {
	const packageJsonContent = await readFile(packageJsonPath, 'utf8');
	const packageJson = JSON.parse(packageJsonContent);
	const { devExports, publishExports } = buildExportMaps(
		entries,
		targets,
		targetRoots
	);

	packageJson.exports = devExports;
	packageJson.publishConfig = {
		...(packageJson.publishConfig ?? {}),
		exports: publishExports,
	};

	if (publishExports['.']?.types) {
		packageJson.types = publishExports['.']?.types;
	}

	await writeFile(
		packageJsonPath,
		`${JSON.stringify(packageJson, null, '\t')}\n`,
		'utf8'
	);
}
