#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

export const CLI_SMOKE_PACKAGE_NAMES = [
	'contractspec',
	'@contractspec/app.cli-contractspec',
];
const RELEASE_PREPARATION_DEPENDENCY_SECTIONS = [
	'dependencies',
	'optionalDependencies',
	'peerDependencies',
];

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function findPackageJsonFiles(dir, files = []) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (
			entry.name === 'node_modules' ||
			entry.name === '.turbo' ||
			entry.name === '.next'
		) {
			continue;
		}

		if (entry.isDirectory()) {
			findPackageJsonFiles(fullPath, files);
		} else if (entry.name === 'package.json') {
			files.push(fullPath);
		}
	}

	return files;
}

export function parsePackageNames(value) {
	if (typeof value !== 'string') {
		return [];
	}

	return value
		.split(',')
		.map((name) => name.trim())
		.filter(Boolean);
}

export function getPackageNameSelection(options = {}) {
	if (Array.isArray(options.packageNames) && options.packageNames.length > 0) {
		return {
			packageNames: options.packageNames,
			packageNamesSpecified: true,
		};
	}

	if (options.packageNamesSpecified) {
		return {
			packageNames: Array.isArray(options.packageNames)
				? options.packageNames
				: [],
			packageNamesSpecified: true,
		};
	}

	if (
		Object.prototype.hasOwnProperty.call(
			process.env,
			'CONTRACTSPEC_RELEASE_PACKAGE_NAMES'
		)
	) {
		return {
			packageNames: parsePackageNames(
				process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES
			),
			packageNamesSpecified: true,
		};
	}

	return {
		packageNames: [],
		packageNamesSpecified: false,
	};
}

export function getPreparationPackageNames(requestedPackageNames) {
	const packageMetadata = arguments[1];
	const packagesByName = Array.isArray(packageMetadata)
		? new Map(packageMetadata.map((pkg) => [pkg.name, pkg]))
		: packageMetadata instanceof Map
			? packageMetadata
			: new Map();
	const requestedSet = new Set(requestedPackageNames);
	const needsCliSmoke = CLI_SMOKE_PACKAGE_NAMES.some((name) =>
		requestedSet.has(name)
	);
	const preparationPackageNames = [...requestedPackageNames];
	for (const packageName of CLI_SMOKE_PACKAGE_NAMES) {
		if (!needsCliSmoke || requestedSet.has(packageName)) {
			continue;
		}
		preparationPackageNames.push(packageName);
	}

	const visited = new Set();
	const resolved = [];
	const queue = [...preparationPackageNames];

	while (queue.length > 0) {
		const packageName = queue.shift();
		if (!packageName || visited.has(packageName)) {
			continue;
		}

		visited.add(packageName);
		resolved.push(packageName);

		const dependencies =
			packagesByName.get(packageName)?.internalWorkspaceDependencies ?? [];
		for (const dependencyName of dependencies) {
			if (!visited.has(dependencyName)) {
				queue.push(dependencyName);
			}
		}
	}

	return resolved;
}

function getInternalWorkspaceDependencies(manifest, publishableNames) {
	const dependencies = new Set();

	for (const section of RELEASE_PREPARATION_DEPENDENCY_SECTIONS) {
		const values = manifest[section];
		if (!values || typeof values !== 'object') {
			continue;
		}

		for (const [dependencyName, specifier] of Object.entries(values)) {
			if (
				typeof specifier === 'string' &&
				specifier.startsWith('workspace:') &&
				publishableNames.has(dependencyName)
			) {
				dependencies.add(dependencyName);
			}
		}
	}

	return Array.from(dependencies).sort((left, right) =>
		left.localeCompare(right)
	);
}

export function discoverPublishablePackages(
	repoRoot = process.cwd(),
	options = {}
) {
	const packages = [];
	const log = options.log ?? console.log;
	const warn = options.warn ?? console.warn;
	const discoveredManifests = [];

	const rootManifestPath = path.join(repoRoot, 'package.json');
	try {
		const rootManifest = readJson(rootManifestPath);
		if (
			rootManifest.name &&
			rootManifest.version &&
			rootManifest.private !== true &&
			rootManifest.scripts?.['publish:pkg']
		) {
			discoveredManifests.push({
				name: rootManifest.name,
				dir: '.',
				version: rootManifest.version,
				hasBuildScript: Boolean(rootManifest.scripts?.build),
				manifest: rootManifest,
			});
			log(
				`[discover] Including root package: ${rootManifest.name}@${rootManifest.version}`
			);
		}
	} catch (error) {
		warn(
			`[discover] Error reading root package.json: ${error instanceof Error ? error.message : String(error)}`
		);
	}

	const packagesRoot = path.join(repoRoot, 'packages');
	const packageJsonFiles = findPackageJsonFiles(packagesRoot);

	for (const fullPath of packageJsonFiles) {
		const pkgDir = path.relative(repoRoot, path.dirname(fullPath));

		try {
			const manifest = readJson(fullPath);
			if (manifest.private === true) {
				log(`[discover] Skipping private package: ${manifest.name || pkgDir}`);
				continue;
			}
			if (!manifest.name) {
				log(`[discover] Skipping package without name: ${pkgDir}`);
				continue;
			}

			discoveredManifests.push({
				name: manifest.name,
				dir: pkgDir,
				version: manifest.version,
				hasBuildScript: Boolean(manifest.scripts?.build),
				manifest,
			});
		} catch (error) {
			warn(
				`[discover] Error reading ${fullPath}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	const publishableNames = new Set(
		discoveredManifests.map((pkg) => pkg.manifest.name)
	);
	for (const pkg of discoveredManifests) {
		packages.push({
			name: pkg.name,
			dir: pkg.dir,
			version: pkg.version,
			hasBuildScript: pkg.hasBuildScript,
			internalWorkspaceDependencies: getInternalWorkspaceDependencies(
				pkg.manifest,
				publishableNames
			),
		});
	}

	log(`\n[discover] Found ${packages.length} publishable packages:\n`);
	packages.forEach((pkg) => {
		log(`  - ${pkg.name}@${pkg.version} (${pkg.dir})`);
	});
	log('');

	return packages;
}
