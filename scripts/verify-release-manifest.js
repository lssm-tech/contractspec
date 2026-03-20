#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_DIST_TAG_RETRY_COUNT = 3;
const DEFAULT_DIST_TAG_RETRY_DELAY_MS = 5000;
const RETRYABLE_NPM_ERROR_RE =
	/ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ECONNREFUSED|EHOSTUNREACH|EPIPE|socket hang up|fetch failed|network connectivity|502 Bad Gateway|503 Service Unavailable|504 Gateway Timeout|Invalid response body while trying to fetch/i;

function parseArgs(argv) {
	const options = {
		manifestPath: process.env.CONTRACTSPEC_RELEASE_MANIFEST_PATH,
		allowDryRun: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === '--manifest' && argv[index + 1]) {
			options.manifestPath = argv[index + 1];
			index += 1;
			continue;
		}
		if (arg === '--allow-dry-run') {
			options.allowDryRun = true;
		}
	}

	return options;
}

function ensureManifestPath(manifestPath) {
	if (!manifestPath) {
		throw new Error(
			'Missing release manifest path. Pass --manifest or CONTRACTSPEC_RELEASE_MANIFEST_PATH.'
		);
	}
	return path.resolve(manifestPath);
}

function readManifest(manifestPath) {
	return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function createNpmEnvironment() {
	const cacheDir =
		process.env.NPM_CONFIG_CACHE ??
		path.join(os.tmpdir(), 'contractspec-release-verify-cache');
	fs.mkdirSync(cacheDir, { recursive: true });

	return {
		...process.env,
		NPM_CONFIG_CACHE: cacheDir,
		npm_config_cache: cacheDir,
	};
}

function parseInteger(value, fallback) {
	const parsed = Number.parseInt(`${value ?? ''}`, 10);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function readDistTagsOnce(name, npmEnv, runCommand = spawnSync) {
	const result = runCommand('npm', ['view', name, 'dist-tags', '--json'], {
		encoding: 'utf8',
		env: npmEnv,
		stdio: 'pipe',
	});

	if (result.status !== 0) {
		throw new Error(
			`Failed to read dist-tags for ${name}: ${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
		);
	}

	return JSON.parse((result.stdout ?? '{}').trim() || '{}');
}

export function isRetryableNpmError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return RETRYABLE_NPM_ERROR_RE.test(message);
}

export async function getDistTags(name, npmEnv, options = {}) {
	const retryCount = parseInteger(
		options.retryCount ?? process.env.CONTRACTSPEC_RELEASE_VERIFY_RETRY_COUNT,
		DEFAULT_DIST_TAG_RETRY_COUNT
	);
	const retryDelayMs = parseInteger(
		options.retryDelayMs ??
			process.env.CONTRACTSPEC_RELEASE_VERIFY_RETRY_DELAY_MS,
		DEFAULT_DIST_TAG_RETRY_DELAY_MS
	);
	const sleep =
		options.sleep ??
		((delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs)));
	const log = options.log ?? ((message) => console.warn(message));
	let attempt = 0;

	for (;;) {
		try {
			return readDistTagsOnce(name, npmEnv, options.runCommand);
		} catch (error) {
			if (
				!(error instanceof Error) ||
				!isRetryableNpmError(error) ||
				attempt >= retryCount
			) {
				throw error;
			}

			attempt += 1;
			const delayMs = retryDelayMs * attempt;
			log(
				`[release:verify] Transient npm registry error for ${name}; retry ${attempt}/${retryCount} in ${delayMs}ms.`
			);
			await sleep(delayMs);
		}
	}
}

function requiresCliSmoke(packages) {
	const names = new Set(packages.map((entry) => entry.name));
	return (
		names.has('contractspec') || names.has('@contractspec/app.cli-contractspec')
	);
}

function verifyCliSmoke(manifest) {
	const scenarios = Array.isArray(manifest.smoke?.scenarios)
		? manifest.smoke.scenarios
		: [];
	const names = new Set(
		scenarios
			.map((scenario) => scenario?.scenario)
			.filter((scenario) => typeof scenario === 'string')
	);

	if (
		!names.has('quickstart') ||
		!names.has('brownfield') ||
		!names.has('examples')
	) {
		throw new Error(
			'Release manifest is missing the required packaged CLI smoke scenarios.'
		);
	}
}

export async function verifyReleaseManifest(options = {}) {
	const manifestPath = ensureManifestPath(options.manifestPath);
	const manifest = readManifest(manifestPath);
	const packages = Array.isArray(manifest.packages) ? manifest.packages : [];

	if (packages.length === 0) {
		throw new Error(`Release manifest has no package entries: ${manifestPath}`);
	}

	const failed = packages.filter((entry) => entry.status === 'failed');
	if (failed.length > 0) {
		const names = failed
			.map(
				(entry) => `${entry.name}${entry.version ? `@${entry.version}` : ''}`
			)
			.join(', ');
		throw new Error(`Release manifest contains failed packages: ${names}`);
	}

	if (manifest.dryRun) {
		if (!options.allowDryRun) {
			throw new Error(
				`Manifest ${manifestPath} is a dry-run manifest. Pass --allow-dry-run to validate it.`
			);
		}

		const invalidDryRunEntries = packages.filter(
			(entry) =>
				entry.status !== 'dry-run' ||
				typeof entry.tarballName !== 'string' ||
				typeof entry.sha256 !== 'string' ||
				entry.sha256.length !== 64
		);

		if (invalidDryRunEntries.length > 0) {
			const names = invalidDryRunEntries.map((entry) => entry.name).join(', ');
			throw new Error(
				`Dry-run manifest has incomplete tarball metadata for: ${names}`
			);
		}

		if (requiresCliSmoke(packages)) {
			verifyCliSmoke(manifest);
		}

		console.log(
			`[release:verify] Dry-run manifest is valid (${packages.length} package(s)).`
		);
		return;
	}

	const npmEnv = createNpmEnvironment();
	const lookupDistTags =
		options.getDistTags ??
		((name, env) =>
			getDistTags(name, env, {
				retryCount: options.retryCount,
				retryDelayMs: options.retryDelayMs,
				sleep: options.sleep,
				log: options.log,
				runCommand: options.runCommand,
			}));
	if (requiresCliSmoke(packages)) {
		verifyCliSmoke(manifest);
	}
	const unexpectedStatuses = packages.filter(
		(entry) => entry.status !== 'published' && entry.status !== 'existing'
	);

	if (unexpectedStatuses.length > 0) {
		const names = unexpectedStatuses
			.map((entry) => `${entry.name}@${entry.version} (${entry.status})`)
			.join(', ');
		throw new Error(`Unexpected package statuses in manifest: ${names}`);
	}

	for (const entry of packages) {
		const distTags = await lookupDistTags(entry.name, npmEnv);
		const actualVersion = distTags[entry.distTag];
		if (actualVersion !== entry.version) {
			throw new Error(
				`Dist-tag mismatch for ${entry.name}: expected ${entry.distTag} -> ${entry.version}, got ${actualVersion ?? 'unset'}`
			);
		}
	}

	console.log(
		`[release:verify] Verified ${packages.length} package(s) for dist-tag ${manifest.npmTag}.`
	);
}

const cliOptions = parseArgs(process.argv.slice(2));

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	verifyReleaseManifest(cliOptions).catch((error) => {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	});
}
