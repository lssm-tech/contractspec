import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { downloadExampleSource, type RunCommand } from './download';

describe('downloadExampleSource', () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		await Promise.all(
			tempDirs.map((dir) => rm(dir, { force: true, recursive: true }))
		);
		tempDirs.length = 0;
	});

	test('downloads a single example via sparse git argv and copies its source', async () => {
		const cwd = await mkdtemp(join(tmpdir(), 'contractspec-download-test-'));
		tempDirs.push(cwd);
		const calls: Array<{ command: string; args: readonly string[] }> = [];
		const runCommand: RunCommand = async (command, args) => {
			calls.push({ command, args });
			if (args[0] === '-C') {
				const checkoutRoot = String(args[1]);
				const exampleDir = join(
					checkoutRoot,
					'packages',
					'examples',
					'minimal'
				);
				await mkdir(exampleDir, { recursive: true });
				await writeFile(
					join(exampleDir, 'package.json'),
					'{"name":"@contractspec/example.minimal"}\n',
					'utf8'
				);
			}
		};

		const result = await downloadExampleSource({
			key: 'minimal',
			outDir: 'downloaded-minimal',
			cwd,
			runCommand,
		});

		expect(result.key).toBe('minimal');
		expect(calls).toEqual([
			{
				command: 'git',
				args: [
					'clone',
					'--depth',
					'1',
					'--filter=blob:none',
					'--sparse',
					'--branch',
					'main',
					'https://github.com/lssm-tech/contractspec.git',
					expect.any(String),
				],
			},
			{
				command: 'git',
				args: [
					'-C',
					expect.any(String),
					'sparse-checkout',
					'set',
					'packages/examples/minimal',
				],
			},
		]);
		await expect(
			readFile(join(cwd, 'downloaded-minimal', 'package.json'), 'utf8')
		).resolves.toContain('@contractspec/example.minimal');
	});

	test('fails for unknown examples before invoking git', async () => {
		const calls: string[] = [];

		await expect(
			downloadExampleSource({
				key: 'missing-example',
				runCommand: async (command) => {
					calls.push(command);
				},
			})
		).rejects.toThrow('Example not found: missing-example');
		expect(calls).toEqual([]);
	});

	test('surfaces missing git executable errors', async () => {
		await expect(
			downloadExampleSource({
				key: 'minimal',
				runCommand: async () => {
					throw new Error('git executable not found');
				},
			})
		).rejects.toThrow('git executable not found');
	});
});
