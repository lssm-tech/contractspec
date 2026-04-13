import { afterEach, describe, expect, it } from 'bun:test';
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { initConnectWorkspace } from './init';

describe('connect init', () => {
	let tempDir: string | null = null;

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('merges connect config and creates storage at package scope', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-init-'));
		const workspaceRoot = tempDir;
		const packageRoot = join(tempDir, 'packages', 'demo');
		mkdirSync(packageRoot, { recursive: true });
		writeFileSync(
			join(workspaceRoot, 'package.json'),
			'{"name":"workspace-root"}\n',
			'utf8'
		);
		writeFileSync(
			join(packageRoot, 'package.json'),
			'{"name":"demo-pkg"}\n',
			'utf8'
		);
		writeFileSync(
			join(packageRoot, '.contractsrc.json'),
			JSON.stringify({ outputDir: 'generated' }, null, 2),
			'utf8'
		);
		const fs = createNodeFsAdapter(tempDir);

		const result = await initConnectWorkspace(fs, {
			config: DEFAULT_CONTRACTSRC,
			cwd: packageRoot,
			packageRoot,
			scope: 'package',
			workspaceRoot,
		});

		const configPath = join(packageRoot, '.contractsrc.json');
		const written = JSON.parse(readFileSync(configPath, 'utf8')) as {
			outputDir?: string;
			connect?: { enabled?: boolean };
		};

		expect(result.action).toBe('merged');
		expect(result.configPath).toBe(configPath);
		expect(result.gitignore.action).toBe('created');
		expect(written.outputDir).toBe('generated');
		expect(written.connect?.enabled).toBe(true);
		expect(readFileSync(join(workspaceRoot, '.gitignore'), 'utf8')).toContain(
			'**/.contractspec/connect/'
		);
		expect(readFileSync(join(workspaceRoot, '.gitignore'), 'utf8')).toContain(
			'**/.contractspec/verification-cache.json'
		);
		expect(
			await fs.exists(
				join(packageRoot, '.contractspec', 'connect', 'review-packets')
			)
		).toBe(true);
	});

	it('skips gitignore updates when disabled', async () => {
		tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-init-'));
		const workspaceRoot = tempDir;
		writeFileSync(
			join(workspaceRoot, 'package.json'),
			'{"name":"workspace-root"}\n',
			'utf8'
		);
		const fs = createNodeFsAdapter(tempDir);

		const result = await initConnectWorkspace(fs, {
			config: DEFAULT_CONTRACTSRC,
			cwd: workspaceRoot,
			gitignoreBehavior: 'skip',
			workspaceRoot,
		});

		expect(result.gitignore.action).toBe('skipped');
		expect(await fs.exists(join(workspaceRoot, '.gitignore'))).toBe(false);
	});
});
