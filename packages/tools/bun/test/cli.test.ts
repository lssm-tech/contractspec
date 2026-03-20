import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { formatUsage, parseCliArgs } from '../lib/cli.mjs';

const binPath = path.join(
	import.meta.dir,
	'..',
	'bin',
	'contractspec-bun-build.mjs'
);
const bunExecutable = process.execPath;
const tempDirs: string[] = [];

async function createTempDir() {
	const tempDir = await mkdtemp(
		path.join(os.tmpdir(), 'contractspec-bun-cli-')
	);
	tempDirs.push(tempDir);
	return tempDir;
}

afterEach(async () => {
	await Promise.all(
		tempDirs
			.splice(0, tempDirs.length)
			.map((tempDir) => rm(tempDir, { recursive: true, force: true }))
	);
});

describe('contractspec-bun-build cli parsing', () => {
	test('defaults to build when no command is provided', () => {
		expect(parseCliArgs([])).toEqual({
			ok: true,
			help: false,
			command: 'build',
			allTargets: false,
			noBundle: false,
			error: null,
		});
	});

	test('treats help tokens anywhere in argv as help requests', () => {
		expect(parseCliArgs(['build', '--help']).help).toBe(true);
		expect(parseCliArgs(['help']).help).toBe(true);
		expect(parseCliArgs(['-h']).help).toBe(true);
	});

	test('formats a stable usage block', () => {
		expect(formatUsage()).toContain('Usage: contractspec-bun-build');
		expect(formatUsage()).toContain('help       Show this help message');
		expect(formatUsage()).toContain('--all-targets');
		expect(formatUsage()).toContain('--no-bundle');
	});
});

describe('contractspec-bun-build help output', () => {
	test('prints help without requiring a package context', async () => {
		const cwd = await createTempDir();
		const subprocess = Bun.spawnSync({
			cmd: [bunExecutable, binPath, '--help'],
			cwd,
			stdout: 'pipe',
			stderr: 'pipe',
		});

		expect(subprocess.exitCode).toBe(0);
		expect(await new Response(subprocess.stdout).text()).toContain(
			'Usage: contractspec-bun-build'
		);
		expect(await new Response(subprocess.stderr).text()).toBe('');
	});

	test('supports help aliases', async () => {
		const cwd = await createTempDir();

		for (const args of [['help'], ['-h'], ['build', '--help']] as const) {
			const subprocess = Bun.spawnSync({
				cmd: [bunExecutable, binPath, ...args],
				cwd,
				stdout: 'pipe',
				stderr: 'pipe',
			});

			expect(subprocess.exitCode).toBe(0);
			expect(await new Response(subprocess.stdout).text()).toContain(
				'Usage: contractspec-bun-build'
			);
		}
	});

	test('prints usage alongside unknown command errors', async () => {
		const cwd = await createTempDir();
		const subprocess = Bun.spawnSync({
			cmd: [bunExecutable, binPath, 'wat'],
			cwd,
			stdout: 'pipe',
			stderr: 'pipe',
		});

		expect(subprocess.exitCode).toBe(1);
		const stderr = await new Response(subprocess.stderr).text();
		expect(stderr).toContain('Unknown contractspec-bun-build command: wat');
		expect(stderr).toContain('Usage: contractspec-bun-build');
	});
});
