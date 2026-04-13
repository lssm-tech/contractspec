import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { initCommand } from './index';

const MANAGED_BLOCK_START = '<!-- contractspec:init:agents:start -->';
const GITIGNORE_BLOCK_START = '# contractspec:init:gitignore:start';

describe('init command', () => {
	const originalCwd = process.cwd();
	const originalConsoleLog = console.log;
	const originalConsoleWarn = console.warn;
	let tempDir = '';

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-init-'));
		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify({ name: 'init-fixture', type: 'module' }, null, 2)
		);
		console.log = (() => {}) as typeof console.log;
		console.warn = (() => {}) as typeof console.warn;
		process.chdir(tempDir);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		console.log = originalConsoleLog;
		console.warn = originalConsoleWarn;
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it('writes builder-local defaults when preset is provided non-interactively', async () => {
		await initCommand.parseAsync(['--yes', '--preset', 'builder-local'], {
			from: 'user',
		});

		const written = JSON.parse(
			await readFile(join(tempDir, '.contractsrc.json'), 'utf8')
		) as {
			builder?: {
				enabled?: boolean;
				runtimeMode?: string;
				bootstrapPreset?: string;
				localRuntime?: { runtimeId?: string; grantedTo?: string };
			};
			connect?: { enabled?: boolean };
		};

		expect(written.builder?.enabled).toBe(true);
		expect(written.builder?.runtimeMode).toBe('local');
		expect(written.builder?.bootstrapPreset).toBe('local_daemon_mvp');
		expect(written.builder?.localRuntime?.runtimeId).toBe('rt_local_daemon');
		expect(written.builder?.localRuntime?.grantedTo).toBe('local:operator');
		expect(written.connect?.enabled).toBeUndefined();

		const gitignore = await readFile(join(tempDir, '.gitignore'), 'utf8');
		expect(gitignore).toContain(GITIGNORE_BLOCK_START);
		expect(gitignore).toContain('**/.contractspec/verification-cache.json');
		expect(gitignore).not.toContain('**/.contractspec/connect/');
	});

	it('adds connect ignore rules for the connect preset in non-interactive mode', async () => {
		await initCommand.parseAsync(['--yes', '--preset', 'connect'], {
			from: 'user',
		});

		const gitignore = await readFile(join(tempDir, '.gitignore'), 'utf8');
		expect(gitignore).toContain('**/.contractspec/connect/');
		expect(gitignore).toContain('**/.contractspec/verification-cache.json');
	});

	it('skips gitignore updates when --no-gitignore is passed', async () => {
		await writeFile(join(tempDir, '.gitignore'), 'dist/\n', 'utf8');

		await initCommand.parseAsync(['--yes', '--no-gitignore'], {
			from: 'user',
		});

		expect(await readFile(join(tempDir, '.gitignore'), 'utf8')).toBe('dist/\n');
	});

	it('merges an existing AGENTS.md in non-interactive mode', async () => {
		const customGuide = '# Local Guide\n\nKeep this content.\n';
		await writeFile(join(tempDir, 'AGENTS.md'), customGuide, 'utf8');

		await initCommand.parseAsync(['--yes'], {
			from: 'user',
		});

		const agentsGuide = await readFile(join(tempDir, 'AGENTS.md'), 'utf8');

		expect(agentsGuide.startsWith(`${MANAGED_BLOCK_START}\n`)).toBe(true);
		expect(agentsGuide.endsWith(customGuide)).toBe(true);
		expect(agentsGuide).toContain('# ContractSpec AI Guide');
	});
});
