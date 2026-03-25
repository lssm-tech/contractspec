import { afterEach, describe, expect, it } from 'bun:test';
import { execFileSync } from 'node:child_process';
import {
	existsSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeGitAdapter } from './git';

const GIT_TEST_TIMEOUT_MS = 15_000;

function createRepo(): string {
	const repoDir = mkdtempSync(join(tmpdir(), 'contractspec-git-adapter-'));
	execFileSync('git', ['init', '-q'], { cwd: repoDir, stdio: 'ignore' });
	execFileSync('git', ['config', 'user.name', 'Codex Test'], {
		cwd: repoDir,
		stdio: 'ignore',
	});
	execFileSync('git', ['config', 'user.email', 'codex@example.com'], {
		cwd: repoDir,
		stdio: 'ignore',
	});
	return repoDir;
}

function commitFile(
	repoDir: string,
	filePath: string,
	content: string,
	message: string
): void {
	writeFileSync(join(repoDir, filePath), content, 'utf8');
	execFileSync('git', ['add', filePath], { cwd: repoDir, stdio: 'ignore' });
	execFileSync('git', ['commit', '-m', message, '--quiet'], {
		cwd: repoDir,
		stdio: 'ignore',
	});
}

describe('Git Adapter', () => {
	let repoDir: string | null = null;

	afterEach(() => {
		if (repoDir) {
			rmSync(repoDir, { recursive: true, force: true });
			repoDir = null;
		}
	});

	it(
		'should return file content from git show',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'file.ts', 'content', 'initial');
			const adapter = createNodeGitAdapter(repoDir);

			const content = await adapter.showFile('HEAD', 'file.ts');

			expect(content).toContain('content');
		},
		GIT_TEST_TIMEOUT_MS
	);

	it(
		'should throw on missing file in showFile',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'file.ts', 'content', 'initial');
			const adapter = createNodeGitAdapter(repoDir);

			expect(adapter.showFile('HEAD', 'missing.ts')).rejects.toThrow(
				'Could not load missing.ts'
			);
		},
		GIT_TEST_TIMEOUT_MS
	);

	it('should detect git repositories', async () => {
		repoDir = createRepo();
		const adapter = createNodeGitAdapter(repoDir);

		expect(await adapter.isGitRepo()).toBe(true);
	});

	it('should return false when .git is missing', async () => {
		repoDir = mkdtempSync(join(tmpdir(), 'contractspec-git-adapter-plain-'));
		const adapter = createNodeGitAdapter(repoDir);

		expect(await adapter.isGitRepo()).toBe(false);
	});

	it(
		'should clean untracked files',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'tracked.txt', 'tracked', 'initial');
			writeFileSync(join(repoDir, 'untracked.txt'), 'tmp', 'utf8');
			const adapter = createNodeGitAdapter(repoDir);

			await adapter.clean({ force: true });

			expect(await adapter.isGitRepo()).toBe(true);
			expect(existsSync(join(repoDir, 'untracked.txt'))).toBe(false);
		},
		GIT_TEST_TIMEOUT_MS
	);

	it(
		'should support dry run clean',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'tracked.txt', 'tracked', 'initial');
			writeFileSync(join(repoDir, 'untracked.txt'), 'tmp', 'utf8');
			const adapter = createNodeGitAdapter(repoDir);

			await adapter.clean({ dryRun: true });

			expect(readFileSync(join(repoDir, 'untracked.txt'), 'utf8')).toBe('tmp');
		},
		GIT_TEST_TIMEOUT_MS
	);

	it(
		'should return parsed log entries',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'file.ts', 'one', 'first');
			commitFile(repoDir, 'file.ts', 'two', 'second');
			const adapter = createNodeGitAdapter(repoDir);

			const entries = await adapter.log('HEAD~1');

			expect(Array.isArray(entries)).toBe(true);
		},
		GIT_TEST_TIMEOUT_MS
	);

	it(
		'should handle empty log output',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'file.ts', 'one', 'first');
			const adapter = createNodeGitAdapter(repoDir);

			const entries = await adapter.log('HEAD');

			expect(entries).toEqual([]);
		},
		GIT_TEST_TIMEOUT_MS
	);

	it(
		'should return empty array on invalid baseline',
		async () => {
			repoDir = createRepo();
			commitFile(repoDir, 'file.ts', 'one', 'first');
			const adapter = createNodeGitAdapter(repoDir);

			const entries = await adapter.log('missing-ref');

			expect(entries).toEqual([]);
		},
		GIT_TEST_TIMEOUT_MS
	);
});
