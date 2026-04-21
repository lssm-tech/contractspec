import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { examplesCommand } from './index';

describe('examples command catalog flows', () => {
	const originalCwd = process.cwd();
	const originalConsoleLog = console.log;
	let tempDir = '';
	let logs: string[] = [];

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-examples-cli-'));
		logs = [];
		console.log = ((value?: unknown) => {
			logs.push(String(value ?? ''));
		}) as typeof console.log;
		process.chdir(tempDir);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		console.log = originalConsoleLog;
		await rm(tempDir, { force: true, recursive: true });
	});

	test('lists examples as catalog JSON', async () => {
		await examplesCommand.parseAsync(['list', '--json'], { from: 'user' });

		const examples = JSON.parse(logs.at(-1) ?? '[]') as Array<{
			meta: { key: string };
		}>;
		expect(examples.some((example) => example.meta.key === 'minimal')).toBe(
			true
		);
	});

	test('shows a single catalog manifest', async () => {
		await examplesCommand.parseAsync(['show', 'minimal'], { from: 'user' });

		const example = JSON.parse(logs.at(-1) ?? '{}') as {
			entrypoints: { packageName: string };
		};
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.minimal'
		);
	});

	test('initializes a lightweight example stub', async () => {
		await examplesCommand.parseAsync(['init', 'minimal'], { from: 'user' });

		const readme = await readFile(
			join(tempDir, '.contractspec', 'examples', 'minimal', 'README.md'),
			'utf8'
		);
		expect(readme).toContain('@contractspec/example.minimal');
	});
});
