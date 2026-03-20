#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
	buildSmokeInstallManifest,
	discoverPreparedTarballs,
} from './packaged-cli-smoke-support.mjs';

function parseArgs(argv) {
	const options = { tarballDir: '', outputPath: '' };

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === '--tarball-dir' && argv[index + 1]) {
			options.tarballDir = argv[index + 1];
			index += 1;
			continue;
		}
		if (arg === '--output' && argv[index + 1]) {
			options.outputPath = argv[index + 1];
			index += 1;
		}
	}

	return options;
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: options.cwd,
		env: options.env,
		encoding: 'utf8',
		stdio: 'pipe',
	});

	if (result.status !== 0) {
		throw new Error(
			`Command failed (${command} ${args.join(' ')}): ${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
		);
	}

	return (result.stdout ?? '').trim();
}

function sha256(filePath) {
	return crypto
		.createHash('sha256')
		.update(fs.readFileSync(filePath))
		.digest('hex');
}

function listFiles(rootDir, relativeDir = '.') {
	const absoluteDir = path.join(rootDir, relativeDir);
	const results = [];

	for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
		const relativePath = path.join(relativeDir, entry.name);
		if (entry.isDirectory()) {
			results.push(...listFiles(rootDir, relativePath));
			continue;
		}
		results.push(relativePath.replace(/\\/g, '/'));
	}

	return results.sort();
}

function snapshotFiles(rootDir, relativePaths) {
	return Object.fromEntries(
		relativePaths.map((relativePath) => {
			return [relativePath, sha256(path.join(rootDir, relativePath))];
		})
	);
}

function assertStableHashes(label, before, after) {
	if (JSON.stringify(before) !== JSON.stringify(after)) {
		throw new Error(`${label} produced non-deterministic file hashes`);
	}
}

function createScenarioEnv(cacheDir) {
	fs.mkdirSync(cacheDir, { recursive: true });
	fs.mkdirSync(path.join(cacheDir, 'bun-install-cache'), { recursive: true });

	return {
		...process.env,
		TMPDIR: cacheDir,
		TEMP: cacheDir,
		TMP: cacheDir,
		BUN_INSTALL_CACHE_DIR: path.join(cacheDir, 'bun-install-cache'),
		TURBO_TELEMETRY_DISABLED: '1',
		DO_NOT_TRACK: '1',
	};
}

function writeInstallManifest(workspaceDir, tarballs) {
	const manifest = buildSmokeInstallManifest({
		contractspecTarball: tarballs.contractspec,
		cliTarball: tarballs.cli,
		overrideTarballs: tarballs.overrides,
	});

	fs.writeFileSync(
		path.join(workspaceDir, 'package.json'),
		`${JSON.stringify(manifest, null, 2)}\n`,
		'utf8'
	);
}

function runContractspec(workspaceDir, env, args) {
	const binary = path.join(
		workspaceDir,
		'node_modules',
		'.bin',
		'contractspec'
	);
	run(binary, args, { cwd: workspaceDir, env });
}

function installContractspec(workspaceDir, env, tarballs) {
	writeInstallManifest(workspaceDir, tarballs);
	run('bun', ['install'], { cwd: workspaceDir, env });
}

function runQuickstartScenario(baseDir, env, tarballs) {
	const workspaceDir = fs.mkdtempSync(path.join(baseDir, 'quickstart-'));
	installContractspec(workspaceDir, env, tarballs);
	fs.mkdirSync(path.join(workspaceDir, '.contractspec-ci'), {
		recursive: true,
	});

	runContractspec(workspaceDir, env, ['--version']);
	runContractspec(workspaceDir, env, ['quickstart', '--yes', '--full']);
	runContractspec(workspaceDir, env, [
		'init',
		'--yes',
		'--targets',
		'cli-config,vscode-settings,mcp-cursor,cursor-rules,agents-md',
	]);
	runContractspec(workspaceDir, env, [
		'doctor',
		'--checks',
		'cli,config,workspace,layers',
		'--format',
		'json',
		'--output',
		'.contractspec-ci/doctor.json',
	]);

	const expectedFiles = [
		'.contractsrc.json',
		'.vscode/settings.json',
		'.cursor/mcp.json',
		'.cursor/rules/contractspec.mdc',
		'AGENTS.md',
		'.contractspec-ci/doctor.json',
	];

	expectedFiles.forEach((file) => {
		if (!fs.existsSync(path.join(workspaceDir, file))) {
			throw new Error(`Quickstart smoke missing file: ${file}`);
		}
	});

	const firstHashes = snapshotFiles(workspaceDir, expectedFiles);
	runContractspec(workspaceDir, env, [
		'init',
		'--yes',
		'--targets',
		'cli-config,vscode-settings,mcp-cursor,cursor-rules,agents-md',
	]);
	const secondHashes = snapshotFiles(workspaceDir, expectedFiles);
	assertStableHashes('quickstart init', firstHashes, secondHashes);

	return { scenario: 'quickstart', hashes: secondHashes, files: expectedFiles };
}

function runBrownfieldScenario(baseDir, env, tarballs) {
	const workspaceDir = fs.mkdtempSync(path.join(baseDir, 'brownfield-'));
	installContractspec(workspaceDir, env, tarballs);
	fs.mkdirSync(path.join(workspaceDir, '.contractspec-ci'), {
		recursive: true,
	});
	fs.writeFileSync(
		path.join(workspaceDir, 'openapi.yaml'),
		[
			'openapi: 3.1.0',
			'info:',
			'  title: Smoke API',
			'  version: 1.0.0',
			'paths:',
			'  /users:',
			'    get:',
			'      operationId: listUsers',
			'      responses:',
			"        '200':",
			'          description: OK',
			'          content:',
			'            application/json:',
			'              schema:',
			'                type: object',
			'                required: [users]',
			'                properties:',
			'                  users:',
			'                    type: array',
			'                    items:',
			'                      type: object',
			'                      required: [id, email]',
			'                      properties:',
			'                        id: { type: string }',
			'                        email: { type: string, format: email }',
		].join('\n'),
		'utf8'
	);

	runContractspec(workspaceDir, env, [
		'init',
		'--yes',
		'--targets',
		'cli-config,vscode-settings,mcp-cursor,cursor-rules,agents-md',
	]);
	runContractspec(workspaceDir, env, ['openapi', 'import', 'openapi.yaml']);
	runContractspec(workspaceDir, env, [
		'ci',
		'--checks',
		'structure,integrity,deps',
		'--format',
		'json',
		'--output',
		'.contractspec-ci/results.json',
	]);

	const generatedFiles = listFiles(workspaceDir, 'src/contracts');
	if (generatedFiles.length === 0) {
		throw new Error('Brownfield smoke produced no generated contract files');
	}

	const firstHashes = snapshotFiles(workspaceDir, generatedFiles);
	runContractspec(workspaceDir, env, ['openapi', 'import', 'openapi.yaml']);
	const secondFiles = listFiles(workspaceDir, 'src/contracts');
	if (JSON.stringify(generatedFiles) !== JSON.stringify(secondFiles)) {
		throw new Error(
			'OpenAPI import produced a different generated file set on rerun'
		);
	}
	const secondHashes = snapshotFiles(workspaceDir, secondFiles);
	assertStableHashes('openapi import', firstHashes, secondHashes);

	return {
		scenario: 'brownfield',
		hashes: secondHashes,
		files: generatedFiles,
		ciSummary: JSON.parse(
			fs.readFileSync(
				path.join(workspaceDir, '.contractspec-ci', 'results.json'),
				'utf8'
			)
		).summary,
	};
}

function runExamplesScenario(baseDir, env, tarballs) {
	const workspaceDir = fs.mkdtempSync(path.join(baseDir, 'examples-'));
	installContractspec(workspaceDir, env, tarballs);
	runContractspec(workspaceDir, env, ['examples', 'init', 'crm-pipeline']);

	const expectedFiles = [
		'.contractspec/examples/crm-pipeline/example.json',
		'.contractspec/examples/crm-pipeline/README.md',
	];

	expectedFiles.forEach((file) => {
		if (!fs.existsSync(path.join(workspaceDir, file))) {
			throw new Error(`Examples smoke missing file: ${file}`);
		}
	});

	return {
		scenario: 'examples',
		hashes: snapshotFiles(workspaceDir, expectedFiles),
		files: expectedFiles,
	};
}

export function runPackagedCliSmoke(options = {}) {
	const repoRoot = path.resolve(options.repoRoot ?? process.cwd());
	const tarballDir = path.resolve(options.tarballDir);
	const overrideTarballs = discoverPreparedTarballs({ repoRoot, tarballDir });
	const contractspecTarball = overrideTarballs.contractspec;
	const cliTarball = overrideTarballs['@contractspec/app.cli-contractspec'];

	if (!contractspecTarball || !cliTarball) {
		throw new Error(
			`Missing required smoke tarballs in ${tarballDir}. Expected contractspec and @contractspec/app.cli-contractspec.`
		);
	}

	const smokeRoot = fs.mkdtempSync(
		path.join(os.tmpdir(), 'contractspec-release-smoke-')
	);
	const env = createScenarioEnv(smokeRoot);
	const tarballs = {
		contractspec: contractspecTarball,
		cli: cliTarball,
		overrides: overrideTarballs,
	};

	const summary = {
		schemaVersion: '1.0',
		generatedAt: new Date().toISOString(),
		tarballDir,
		tarballs: {
			contractspec: contractspecTarball,
			cli: cliTarball,
		},
		localOverrideCount: Object.keys(overrideTarballs).length,
		scenarios: [
			runQuickstartScenario(smokeRoot, env, tarballs),
			runBrownfieldScenario(smokeRoot, env, tarballs),
			runExamplesScenario(smokeRoot, env, tarballs),
		],
	};

	if (options.outputPath) {
		fs.mkdirSync(path.dirname(options.outputPath), { recursive: true });
		fs.writeFileSync(
			`${options.outputPath}`,
			`${JSON.stringify(summary, null, 2)}\n`
		);
	}

	return summary;
}

const cliOptions = parseArgs(process.argv.slice(2));

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	try {
		runPackagedCliSmoke({
			tarballDir: cliOptions.tarballDir,
			outputPath: cliOptions.outputPath,
		});
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}
