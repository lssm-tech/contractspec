#!/usr/bin/env node

const path = require('node:path');
const { spawnSync, execSync } = require('node:child_process');

const PLATFORM_BINARIES = {
	win32: {
		x64: '@biomejs/cli-win32-x64/biome.exe',
		arm64: '@biomejs/cli-win32-arm64/biome.exe',
	},
	darwin: {
		x64: '@biomejs/cli-darwin-x64/biome',
		arm64: '@biomejs/cli-darwin-arm64/biome',
	},
	linux: {
		x64: '@biomejs/cli-linux-x64/biome',
		arm64: '@biomejs/cli-linux-arm64/biome',
	},
	'linux-musl': {
		x64: '@biomejs/cli-linux-x64-musl/biome',
		arm64: '@biomejs/cli-linux-arm64-musl/biome',
	},
};

function isMusl() {
	try {
		return execSync('ldd --version', { stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.includes('musl');
	} catch (error) {
		return String(error.stderr ?? '').includes('musl');
	}
}

function detectPackageManager() {
	const userAgent = process.env.npm_config_user_agent;
	if (!userAgent) {
		return null;
	}

	return userAgent.split(' ')[0] ?? null;
}

function resolveBiomeBinary() {
	if (process.env.BIOME_BINARY) {
		return process.env.BIOME_BINARY;
	}

	const runtimePlatform =
		process.platform === 'linux' && isMusl() ? 'linux-musl' : process.platform;
	const platformBinaries = PLATFORM_BINARIES[runtimePlatform];

	if (!platformBinaries) {
		return null;
	}

	const biomePackageJson = require.resolve('@biomejs/biome/package.json', {
		paths: [process.cwd(), path.resolve(__dirname, '..')],
	});
	const resolvePaths = [path.dirname(biomePackageJson)];
	const archCandidates = [
		process.arch,
		...Object.keys(platformBinaries).filter(
			(candidate) => candidate !== process.arch
		),
	];

	for (const archCandidate of archCandidates) {
		const target = platformBinaries[archCandidate];
		if (!target) {
			continue;
		}

		try {
			return require.resolve(target, { paths: resolvePaths });
		} catch {
			continue;
		}
	}

	return null;
}

const binPath = resolveBiomeBinary();

if (!binPath) {
	console.error(
		'Unable to resolve a compatible Biome binary from installed optional dependencies.'
	);
	process.exit(1);
}

const packageManager = detectPackageManager();
const result = spawnSync(binPath, process.argv.slice(2), {
	stdio: 'inherit',
	env: {
		...process.env,
		JS_RUNTIME_NAME: process.release.name,
		JS_RUNTIME_VERSION: process.version,
		...(packageManager ? { NODE_PACKAGE_MANAGER: packageManager } : {}),
	},
});

if (result.error) {
	throw result.error;
}

process.exit(result.status ?? 1);
