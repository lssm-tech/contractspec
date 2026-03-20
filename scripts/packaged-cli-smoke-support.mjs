import fs from 'node:fs';
import path from 'node:path';

export function sanitizePackageName(name) {
	return name.replace(/^@/, '').replace(/\//g, '-');
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function findPackageJsonFiles(dir, files = []) {
	if (!fs.existsSync(dir)) {
		return files;
	}

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
			continue;
		}

		if (entry.name === 'package.json') {
			files.push(fullPath);
		}
	}

	return files;
}

export function discoverPreparedTarballs({ repoRoot, tarballDir }) {
	const resolvedRepoRoot = path.resolve(repoRoot);
	const resolvedTarballDir = path.resolve(tarballDir);
	const packageJsonFiles = findPackageJsonFiles(
		path.join(resolvedRepoRoot, 'packages')
	);
	const tarballs = {};

	for (const packageJsonPath of packageJsonFiles) {
		const manifest = readJson(packageJsonPath);

		if (
			manifest.private === true ||
			typeof manifest.name !== 'string' ||
			typeof manifest.version !== 'string'
		) {
			continue;
		}

		const tarballPath = path.join(
			resolvedTarballDir,
			`${sanitizePackageName(manifest.name)}-${manifest.version}.tgz`
		);

		if (fs.existsSync(tarballPath)) {
			tarballs[manifest.name] = tarballPath;
		}
	}

	return tarballs;
}

function toFileSpecifier(filePath) {
	return `file:${path.resolve(filePath)}`;
}

export function buildSmokeInstallManifest({
	contractspecTarball,
	cliTarball,
	overrideTarballs,
}) {
	const resolvedTarballs = {
		...overrideTarballs,
		contractspec: contractspecTarball,
		'@contractspec/app.cli-contractspec': cliTarball,
	};

	const overrides = Object.fromEntries(
		Object.entries(resolvedTarballs).map(([name, tarballPath]) => [
			name,
			toFileSpecifier(tarballPath),
		])
	);

	return {
		name: 'contractspec-smoke',
		private: true,
		version: '0.0.0',
		devDependencies: {
			'@contractspec/app.cli-contractspec':
				overrides['@contractspec/app.cli-contractspec'],
			contractspec: overrides.contractspec,
		},
		overrides,
	};
}
