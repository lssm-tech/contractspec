import { afterEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { MANAGED_BLOCK_END, MANAGED_BLOCK_START } from './constants';

const CLI_ENTRY = resolve(import.meta.dir, '../../cli.ts');

describe('completion command black-box', () => {
	const tempDirs: string[] = [];

	afterEach(() => {
		for (const dir of tempDirs.splice(0)) {
			rmSync(dir, { force: true, recursive: true });
		}
	});

	it(
		'renders bash, zsh, and fish completion scripts',
		() => {
			for (const shell of ['bash', 'zsh', 'fish'] as const) {
				const result = runCli(['completion', 'script', shell]);
				expect(result.code).toBe(0);
				expect(result.stdout).toContain('contractspec');
			}
		},
		{ timeout: 15_000 }
	);

	it('installs completion files without mutating profiles by default', () => {
		const { homeDir, xdgDir } = createEnv(tempDirs);
		const result = runCli(['completion', 'install', 'bash'], {
			HOME: homeDir,
			XDG_CONFIG_HOME: xdgDir,
		});
		const scriptPath = join(
			xdgDir,
			'contractspec',
			'completions',
			'contractspec.bash'
		);

		expect(result.code).toBe(0);
		expect(existsSync(scriptPath)).toBe(true);
		expect(existsSync(join(homeDir, '.bashrc'))).toBe(false);
	});

	it(
		'writes the managed profile block once when requested',
		() => {
			const { homeDir, xdgDir } = createEnv(tempDirs);
			const env = { HOME: homeDir, XDG_CONFIG_HOME: xdgDir };

			expect(
				runCli(['completion', 'install', 'zsh', '--write-profile'], env).code
			).toBe(0);
			expect(
				runCli(['completion', 'install', 'zsh', '--write-profile'], env).code
			).toBe(0);

			const profilePath = join(homeDir, '.zshrc');
			const profileContent = readFileSync(profilePath, 'utf8');

			expect(
				profileContent.match(new RegExp(MANAGED_BLOCK_START, 'g'))
			).toHaveLength(1);
			expect(profileContent).toContain(MANAGED_BLOCK_END);
		},
		{ timeout: 15_000 }
	);

	it('keeps fish config untouched without the profile flag', () => {
		const { xdgDir } = createEnv(tempDirs);
		const env = {
			HOME: join(xdgDir, '..', 'home'),
			XDG_CONFIG_HOME: xdgDir,
		};
		const result = runCli(['completion', 'install', 'fish'], env);

		expect(result.code).toBe(0);
		expect(
			existsSync(
				join(xdgDir, 'contractspec', 'completions', 'contractspec.fish')
			)
		).toBe(true);
		expect(existsSync(join(xdgDir, 'fish', 'config.fish'))).toBe(false);
	});
});

function createEnv(tempDirs: string[]) {
	const rootDir = mkdtempSync(
		join(tmpdir(), 'contractspec-completion-blackbox-')
	);
	tempDirs.push(rootDir);
	return {
		homeDir: join(rootDir, 'home'),
		xdgDir: join(rootDir, 'xdg'),
	};
}

function runCli(args: string[], env?: Record<string, string>) {
	const result = Bun.spawnSync([process.execPath, CLI_ENTRY, ...args], {
		cwd: resolve(import.meta.dir, '../../../..'),
		env: {
			...process.env,
			FORCE_COLOR: '0',
			NO_COLOR: '1',
			...env,
		},
		stderr: 'pipe',
		stdout: 'pipe',
	});

	return {
		code: result.exitCode,
		stderr: new TextDecoder().decode(result.stderr).trim(),
		stdout: new TextDecoder().decode(result.stdout).trim(),
	};
}
