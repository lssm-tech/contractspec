import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { onboardCommand } from './index';

describe('onboard command', () => {
	const originalCwd = process.cwd();
	const originalConsoleLog = console.log;
	let tempDir = '';
	let logs: string[] = [];

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-onboard-cli-'));
		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify({ name: 'onboard-fixture', type: 'module' }, null, 2)
		);
		logs = [];
		console.log = ((value?: unknown) => {
			logs.push(String(value ?? ''));
		}) as typeof console.log;
		process.chdir(tempDir);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		console.log = originalConsoleLog;
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it('supports dry-run JSON output in an empty repo', async () => {
		await onboardCommand.parseAsync(['--dry-run', '--json'], { from: 'user' });

		const body = JSON.parse(logs.at(-1) ?? '{}') as {
			files: Array<{ action: string }>;
			recommendations: Array<{ track: string }>;
		};

		expect(body.files.map((item) => item.action)).toEqual([
			'planned',
			'planned',
		]);
		expect(body.recommendations.length).toBe(5);
		expect(await fileExists(join(tempDir, 'AGENTS.md'))).toBeFalse();
		expect(await fileExists(join(tempDir, 'USAGE.md'))).toBeFalse();
	});

	it('merges existing AGENTS.md and USAGE.md in non-interactive mode', async () => {
		await writeFile(join(tempDir, 'AGENTS.md'), '# Team Guide\n', 'utf8');
		await writeFile(join(tempDir, 'USAGE.md'), '# Human Notes\n', 'utf8');

		await onboardCommand.parseAsync(['--yes'], { from: 'user' });

		expect(await readFile(join(tempDir, 'AGENTS.md'), 'utf8')).toContain(
			'ContractSpec Onboarding Guide'
		);
		expect(await readFile(join(tempDir, 'USAGE.md'), 'utf8')).toContain(
			'ContractSpec Repo Onboarding'
		);
	});

	it('initializes an explicit example stub and Connect artifacts', async () => {
		await writeFile(
			join(tempDir, '.contractsrc.json'),
			JSON.stringify(
				{
					connect: {
						enabled: true,
					},
				},
				null,
				2
			),
			'utf8'
		);

		await onboardCommand.parseAsync(
			['knowledge', '--example', 'knowledge-canon', '--yes'],
			{
				from: 'user',
			}
		);

		expect(
			await fileExists(
				join(
					tempDir,
					'.contractspec',
					'examples',
					'knowledge-canon',
					'README.md'
				)
			)
		).toBeTrue();
		expect(
			await fileExists(
				join(tempDir, '.contractspec', 'connect', 'context-pack.json')
			)
		).toBeTrue();
		expect(
			await fileExists(
				join(tempDir, '.contractspec', 'connect', 'plan-packet.json')
			)
		).toBeTrue();
	});
});

async function fileExists(path: string) {
	try {
		await readFile(path, 'utf8');
		return true;
	} catch {
		return false;
	}
}
