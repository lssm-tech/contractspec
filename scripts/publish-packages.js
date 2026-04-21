#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'crypto';

import {
	CLI_SMOKE_PACKAGE_NAMES,
	discoverPublishablePackages,
	getPackageNameSelection,
	getPreparationPackageNames,
	shouldIncludeMissingRegistryPackages,
} from './release-package-utils.js';

const repoRoot = process.cwd();
const NPM_NOT_FOUND_ERROR_RE =
	/E404|404 Not Found|npm ERR! code E404|No match found|is not in this registry/i;
const RETRYABLE_NPM_ERROR_RE =
	/ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ECONNREFUSED|EHOSTUNREACH|EPIPE|socket hang up|fetch failed|network connectivity|502 Bad Gateway|503 Service Unavailable|504 Gateway Timeout|Invalid response body while trying to fetch/i;
const DEFAULT_DIST_TAG_RETRY_COUNT = 3;
const DEFAULT_DIST_TAG_RETRY_DELAY_MS = 5000;

function parseBoolean(value) {
	if (typeof value !== 'string') return false;
	return value === '1' || value.toLowerCase() === 'true';
}

function parseArgs(argv) {
	const options = {
		dryRun: undefined,
		npmTag: undefined,
		releaseDir: undefined,
		manifestPath: undefined,
		packageNames: [],
		packageNamesSpecified: false,
		allPackages: false,
		includeMissingPackages: undefined,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === '--dry-run') {
			options.dryRun = true;
			continue;
		}
		if (arg === '--all') {
			options.allPackages = true;
			options.packageNames = [];
			options.packageNamesSpecified = false;
			continue;
		}
		if (arg === '--include-missing') {
			options.includeMissingPackages = true;
			continue;
		}
		if (arg === '--no-include-missing') {
			options.includeMissingPackages = false;
			continue;
		}
		if (arg === '--tag' && argv[index + 1]) {
			options.npmTag = argv[index + 1];
			index += 1;
			continue;
		}
		if (arg === '--release-dir' && argv[index + 1]) {
			options.releaseDir = argv[index + 1];
			index += 1;
			continue;
		}
		if (arg === '--manifest' && argv[index + 1]) {
			options.manifestPath = argv[index + 1];
			index += 1;
			continue;
		}
		if ((arg === '--package' || arg === '--packages') && argv[index + 1]) {
			options.packageNamesSpecified = true;
			options.packageNames.push(
				...argv[index + 1]
					.split(',')
					.map((name) => name.trim())
					.filter(Boolean)
			);
			index += 1;
		}
	}

	return options;
}

function shouldUsePublishExports() {
	return (
		process.env.CONTRACTSPEC_USE_PUBLISH_EXPORTS === 'true' ||
		process.env.CONTRACTSPEC_USE_PUBLISH_EXPORTS === '1'
	);
}

function sanitizePackageName(name) {
	return name.replace(/^@/, '').replace(/\//g, '-');
}

function ensureDir(dirPath) {
	fs.mkdirSync(dirPath, { recursive: true });
}

function sleepMs(delayMs) {
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}

function parseInteger(value, fallback) {
	const parsed = Number.parseInt(`${value ?? ''}`, 10);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function isNpmNotFoundError(output) {
	return NPM_NOT_FOUND_ERROR_RE.test(output);
}

function isRetryableNpmError(output) {
	return isNpmNotFoundError(output) || RETRYABLE_NPM_ERROR_RE.test(output);
}

function createNpmEnvironment(npmCacheDir) {
	return {
		...process.env,
		NPM_CONFIG_CACHE: npmCacheDir,
		npm_config_cache: npmCacheDir,
	};
}

function runCommand(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: options.cwd ?? repoRoot,
		env: options.env ?? process.env,
		encoding: 'utf8',
		stdio: options.capture ? 'pipe' : 'inherit',
	});

	if (options.capture) {
		const stdout = result.stdout ?? '';
		const stderr = result.stderr ?? '';
		if (options.echoCaptured && stdout) process.stdout.write(stdout);
		if (options.echoCaptured && stderr) process.stderr.write(stderr);
	}

	if (!options.allowFailure && result.status !== 0) {
		const detail = options.capture
			? `${result.stdout ?? ''}${result.stderr ?? ''}`
			: `${command} ${args.join(' ')}`;
		throw new Error(
			`Command failed (${command} ${args.join(' ')}): ${detail.trim()}`
		);
	}

	return result;
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function computeSha256(filePath) {
	const hash = createHash('sha256');
	hash.update(fs.readFileSync(filePath));
	return hash.digest('hex');
}

function withPreparedManifest(descriptor, callback) {
	const pkgDir = path.join(repoRoot, descriptor.dir);
	const manifestPath = path.join(pkgDir, 'package.json');
	const originalManifestRaw = fs.readFileSync(manifestPath, 'utf8');
	const manifest = JSON.parse(originalManifestRaw);
	let manifestRewritten = false;

	try {
		if (
			shouldUsePublishExports() &&
			manifest.publishConfig?.exports &&
			typeof manifest.publishConfig.exports === 'object'
		) {
			manifest.exports = manifest.publishConfig.exports;
			fs.writeFileSync(
				manifestPath,
				`${JSON.stringify(manifest, null, 2)}\n`,
				'utf8'
			);
			manifestRewritten = true;
			console.log(
				`[publish] Using publishConfig.exports for ${descriptor.name}@${manifest.version}`
			);
		}

		return callback({ manifest, manifestPath, pkgDir });
	} finally {
		if (manifestRewritten) {
			fs.writeFileSync(manifestPath, originalManifestRaw, 'utf8');
			console.log(
				`[publish] Restored package manifest for ${descriptor.name}@${manifest.version}`
			);
		}
	}
}

function packTarball({ name, version, pkgDir, tarballDir }) {
	ensureDir(tarballDir);

	const tarballName = `${sanitizePackageName(name)}-${version}.tgz`;
	const tarballPath = path.join(tarballDir, tarballName);

	if (fs.existsSync(tarballPath)) {
		fs.rmSync(tarballPath, { force: true });
	}

	runCommand(
		'bun',
		['pm', 'pack', '--filename', tarballPath, '--ignore-scripts', '--quiet'],
		{ cwd: pkgDir }
	);

	return { tarballName, tarballPath };
}

function npmViewVersionExists(name, version, npmEnv) {
	const result = runCommand(
		'npm',
		['view', `${name}@${version}`, 'version', '--json'],
		{
			capture: true,
			allowFailure: true,
			env: npmEnv,
		}
	);

	if (result.status === 0) {
		return true;
	}

	const combinedOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`;
	if (isNpmNotFoundError(combinedOutput)) {
		return false;
	}

	throw new Error(
		`[publish] Failed to query ${name}@${version}: ${combinedOutput.trim()}`
	);
}

function getDistTags(name, npmEnv, options = {}) {
	const result = runCommand('npm', ['view', name, 'dist-tags', '--json'], {
		capture: true,
		allowFailure: true,
		env: npmEnv,
	});

	if (result.status !== 0) {
		const combinedOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`;
		if (options.allowMissing && isNpmNotFoundError(combinedOutput)) {
			return {};
		}
		throw new Error(
			`[publish] Failed to read dist-tags for ${name}: ${combinedOutput.trim()}`
		);
	}

	const stdout = (result.stdout ?? '').trim();
	if (!stdout) return {};
	return JSON.parse(stdout);
}

function getDistTagRetrySettings(options = {}) {
	return {
		retryCount: parseInteger(
			options.retryCount ?? process.env.CONTRACTSPEC_RELEASE_VERIFY_RETRY_COUNT,
			DEFAULT_DIST_TAG_RETRY_COUNT
		),
		retryDelayMs: parseInteger(
			options.retryDelayMs ??
				process.env.CONTRACTSPEC_RELEASE_VERIFY_RETRY_DELAY_MS,
			DEFAULT_DIST_TAG_RETRY_DELAY_MS
		),
	};
}

function ensureDistTag(name, version, tag, npmEnv) {
	const { retryCount, retryDelayMs } = getDistTagRetrySettings();
	let lastErrorMessage = '';

	for (let attempt = 0; attempt < retryCount; attempt += 1) {
		if (attempt > 0) {
			const delayMs = retryDelayMs * attempt;
			console.log(
				`[publish] Waiting ${delayMs}ms before retrying dist-tag verification for ${name}@${version} (${attempt + 1}/${retryCount})`
			);
			sleepMs(delayMs);
		}

		try {
			const currentDistTags = getDistTags(name, npmEnv, {
				allowMissing: true,
			});
			if (currentDistTags[tag] === version) {
				return version;
			}

			console.log(
				`[publish] Updating dist-tag ${tag} -> ${name}@${version} (was ${currentDistTags[tag] ?? 'unset'})`
			);
			runCommand('npm', ['dist-tag', 'add', `${name}@${version}`, tag], {
				env: npmEnv,
			});

			const updatedDistTags = getDistTags(name, npmEnv, {
				allowMissing: true,
			});
			if (updatedDistTags[tag] === version) {
				return version;
			}

			lastErrorMessage = `[publish] Dist-tag ${tag} for ${name} is ${updatedDistTags[tag] ?? 'unset'} after publish; expected ${version}.`;
		} catch (error) {
			lastErrorMessage = error instanceof Error ? error.message : String(error);
			if (
				attempt === retryCount - 1 ||
				!isRetryableNpmError(lastErrorMessage)
			) {
				throw error;
			}
		}
	}

	throw new Error(
		lastErrorMessage ||
			`[publish] Failed to verify dist-tag ${tag} for ${name}@${version}.`
	);
}

function publishTarball({ tarballPath, tag, dryRun, npmEnv }) {
	const args = ['publish', tarballPath, '--access', 'public', '--tag', tag];
	if (dryRun) {
		args.push('--dry-run');
	} else {
		args.push('--provenance');
	}
	runCommand('npm', args, { env: npmEnv });
}

function writeManifest(manifestPath, manifest) {
	ensureDir(path.dirname(manifestPath));
	fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
	console.log(`[publish] Wrote release manifest to ${manifestPath}`);
}

function summarizeResults(results) {
	return results.reduce(
		(summary, result) => {
			summary.total += 1;
			summary[result.status] = (summary[result.status] ?? 0) + 1;
			return summary;
		},
		{ total: 0 }
	);
}

function preparePackageTarball(descriptor, context) {
	return withPreparedManifest(descriptor, ({ manifest, pkgDir }) => {
		const name = manifest.name;
		const version = manifest.version;
		const { tarballName, tarballPath } = packTarball({
			name,
			version,
			pkgDir,
			tarballDir: context.tarballDir,
		});
		const sha256 = computeSha256(tarballPath);
		const npmUrl = `https://www.npmjs.com/package/${encodeURIComponent(
			name
		)}/v/${encodeURIComponent(version)}`;

		return {
			name,
			version,
			directory: descriptor.dir,
			tarballName,
			tarballPath,
			sha256,
			npmUrl,
		};
	});
}

function publishPreparedPackage(preparedPackage, context) {
	const checkVersionExists =
		context.npmViewVersionExists ?? npmViewVersionExists;
	const finalizeDistTag = context.ensureDistTag ?? ensureDistTag;
	const publish = context.publishTarball ?? publishTarball;

	console.log(
		`\n[publish] ${preparedPackage.name}@${preparedPackage.version} (tag: ${context.npmTag})`
	);

	const alreadyPublished = checkVersionExists(
		preparedPackage.name,
		preparedPackage.version,
		context.npmEnv
	);

	if (context.dryRun) {
		if (alreadyPublished) {
			console.log(
				`[publish] Skipping npm publish dry-run for ${preparedPackage.name}@${preparedPackage.version}; version already exists on npm.`
			);
		} else {
			publishTarball({
				tarballPath: preparedPackage.tarballPath,
				tag: context.npmTag,
				dryRun: true,
				npmEnv: context.npmEnv,
			});
		}

		return {
			...preparedPackage,
			distTag: context.npmTag,
			existingVersion: alreadyPublished,
			status: 'dry-run',
		};
	}

	if (alreadyPublished) {
		const verifiedTag = finalizeDistTag(
			preparedPackage.name,
			preparedPackage.version,
			context.npmTag,
			context.npmEnv
		);

		return {
			...preparedPackage,
			distTag: context.npmTag,
			verifiedTag,
			status: 'existing',
		};
	}

	publish({
		tarballPath: preparedPackage.tarballPath,
		tag: context.npmTag,
		dryRun: false,
		npmEnv: context.npmEnv,
	});

	const verifiedTag = finalizeDistTag(
		preparedPackage.name,
		preparedPackage.version,
		context.npmTag,
		context.npmEnv
	);

	return {
		...preparedPackage,
		distTag: context.npmTag,
		verifiedTag,
		status: 'published',
	};
}

export { publishPreparedPackage };

export function resolveRequestedPackageNames({
	selectedPackageNames,
	packageNamesSpecified,
	packagesByName,
	npmTag = 'latest',
	npmEnv = process.env,
	includeMissingPackages,
	npmViewVersionExists: checkVersionExists = npmViewVersionExists,
	log = console.log,
}) {
	const requestedPackageNames = packageNamesSpecified
		? selectedPackageNames
		: Array.from(packagesByName.keys());

	if (
		!shouldIncludeMissingRegistryPackages({ includeMissingPackages }, npmTag)
	) {
		return requestedPackageNames;
	}

	const requestedPackageSet = new Set(requestedPackageNames);
	const missingPackageNames = [];

	for (const descriptor of packagesByName.values()) {
		if (requestedPackageSet.has(descriptor.name)) {
			continue;
		}

		const versionExists = checkVersionExists(
			descriptor.name,
			descriptor.version,
			npmEnv
		);
		if (!versionExists) {
			missingPackageNames.push(descriptor.name);
		}
	}

	if (missingPackageNames.length > 0) {
		log(
			`[publish] Including ${missingPackageNames.length} package(s) missing from npm: ${missingPackageNames.join(', ')}`
		);
	}

	return [...requestedPackageNames, ...missingPackageNames];
}

function shouldRunCliSmoke(preparedPackages) {
	const names = new Set(preparedPackages.map((pkg) => pkg.name));
	return (
		names.has(CLI_SMOKE_PACKAGE_NAMES[0]) ||
		names.has(CLI_SMOKE_PACKAGE_NAMES[1])
	);
}

function runCliSmoke(tarballDir, smokeSummaryPath) {
	runCommand(
		'node',
		[
			'scripts/run-packaged-cli-smoke.mjs',
			'--tarball-dir',
			tarballDir,
			'--output',
			smokeSummaryPath,
		],
		{
			cwd: repoRoot,
		}
	);

	return readJson(smokeSummaryPath);
}

export async function publishPackages(options = {}) {
	const npmTag = options.npmTag ?? process.env.NPM_TAG ?? 'latest';
	const dryRun =
		options.dryRun !== undefined
			? options.dryRun
			: parseBoolean(process.env.DRY_RUN);
	const { packageNames: selectedPackageNames, packageNamesSpecified } =
		getPackageNameSelection(options);
	if (
		packageNamesSpecified &&
		selectedPackageNames.length === 0 &&
		!shouldIncludeMissingRegistryPackages(options, npmTag)
	) {
		console.log(
			'[publish] Skip npm publish: no package targets were resolved.'
		);
		return [];
	}
	const packagesByName = new Map(
		discoverPublishablePackages(repoRoot).map((pkg) => [pkg.name, pkg])
	);
	const releaseRoot = path.resolve(
		options.releaseDir ??
			process.env.CONTRACTSPEC_RELEASE_DIR ??
			path.join(os.tmpdir(), 'contractspec-release', `${npmTag}-${Date.now()}`)
	);
	const tarballDir = path.join(releaseRoot, 'tarballs');
	const manifestPath = path.resolve(
		options.manifestPath ??
			process.env.CONTRACTSPEC_RELEASE_MANIFEST_PATH ??
			path.join(releaseRoot, `release-manifest-${npmTag}.json`)
	);
	const npmCacheDir = path.join(releaseRoot, '.npm-cache');
	const smokeSummaryPath = path.resolve(
		process.env.CONTRACTSPEC_RELEASE_SMOKE_SUMMARY_PATH ??
			path.join(releaseRoot, 'release-smoke.json')
	);
	const npmEnv = createNpmEnvironment(npmCacheDir);
	const requestedPackageNames = resolveRequestedPackageNames({
		selectedPackageNames,
		packageNamesSpecified,
		packagesByName,
		npmTag,
		npmEnv,
		includeMissingPackages: options.includeMissingPackages,
	});
	const requestedPackageSet = new Set(requestedPackageNames);
	const preparationPackageNames = getPreparationPackageNames(
		requestedPackageNames,
		packagesByName
	);

	ensureDir(tarballDir);
	ensureDir(npmCacheDir);

	const results = [];
	const preparedPackages = [];

	for (const packageName of preparationPackageNames) {
		const descriptor = packagesByName.get(packageName);

		if (!descriptor) {
			console.warn(
				`[publish] Package ${packageName} is not in the release map.`
			);
			results.push({
				name: packageName,
				distTag: npmTag,
				status: 'failed',
				errorMessage: 'Package is not in the release map.',
			});
			continue;
		}

		try {
			const preparedPackage = preparePackageTarball(descriptor, {
				tarballDir,
			});
			preparedPackages.push(preparedPackage);
			console.log(
				`[publish] ✓ prepared ${preparedPackage.name}@${preparedPackage.version}`
			);
		} catch (error) {
			console.error(
				`[publish] ✗ Failed to prepare ${descriptor.name}@${descriptor.version}`
			);
			console.error(error instanceof Error ? error.message : String(error));
			results.push({
				name: descriptor.name,
				version: descriptor.version,
				directory: descriptor.dir,
				distTag: npmTag,
				status: 'failed',
				errorMessage: error instanceof Error ? error.message : String(error),
			});
		}
	}

	let smokeSummary;
	if (results.some((result) => result.status === 'failed')) {
		const manifest = {
			version: '1.0.0',
			generatedAt: new Date().toISOString(),
			npmTag,
			dryRun,
			releaseRoot,
			smoke: undefined,
			packages: results,
			summary: summarizeResults(results),
		};
		writeManifest(manifestPath, manifest);
		process.exitCode = 1;
		return results;
	}

	try {
		if (shouldRunCliSmoke(preparedPackages)) {
			smokeSummary = runCliSmoke(tarballDir, smokeSummaryPath);
			console.log('[publish] ✓ packaged CLI smoke passed');
		}
	} catch (error) {
		const manifest = {
			version: '1.0.0',
			generatedAt: new Date().toISOString(),
			npmTag,
			dryRun,
			releaseRoot,
			smoke: {
				status: 'failed',
				errorMessage: error instanceof Error ? error.message : String(error),
			},
			packages: preparedPackages.map((preparedPackage) => ({
				...preparedPackage,
				status: 'prepared',
			})),
			summary: summarizeResults(
				preparedPackages.map((preparedPackage) => ({
					...preparedPackage,
					status: 'prepared',
				}))
			),
		};
		writeManifest(manifestPath, manifest);
		process.exitCode = 1;
		return results;
	}

	for (const preparedPackage of preparedPackages) {
		if (!requestedPackageSet.has(preparedPackage.name)) {
			continue;
		}

		try {
			const result = publishPreparedPackage(preparedPackage, {
				dryRun,
				npmTag,
				npmEnv,
			});
			results.push(result);
			console.log(
				`[publish] ✓ ${result.status} ${result.name}@${result.version} (${result.distTag})`
			);
		} catch (error) {
			console.error(
				`[publish] ✗ Failed to publish ${preparedPackage.name}@${preparedPackage.version}`
			);
			console.error(error instanceof Error ? error.message : String(error));
			results.push({
				name: preparedPackage.name,
				version: preparedPackage.version,
				directory: preparedPackage.directory,
				distTag: npmTag,
				status: 'failed',
				errorMessage: error instanceof Error ? error.message : String(error),
			});
		}
	}

	const manifest = {
		version: '1.0.0',
		generatedAt: new Date().toISOString(),
		npmTag,
		dryRun,
		releaseRoot,
		smoke: smokeSummary,
		packages: results,
		summary: summarizeResults(results),
	};

	writeManifest(manifestPath, manifest);

	console.log('\n[publish] === Summary ===');
	for (const result of results) {
		if (result.status === 'failed') {
			console.log(
				`  ✗ ${result.name}${result.version ? `@${result.version}` : ''}`
			);
			continue;
		}
		console.log(
			`  ✓ ${result.status} ${result.name}@${result.version} (${result.distTag})`
		);
	}

	if (results.some((result) => result.status === 'failed')) {
		process.exitCode = 1;
	}

	return results;
}

const cliOptions = parseArgs(process.argv.slice(2));

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	publishPackages(cliOptions).catch((error) => {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	});
}
