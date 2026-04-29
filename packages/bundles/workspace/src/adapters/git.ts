/**
 * Node.js git adapter implementation.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import type {
	GitAdapter,
	GitChangedFile,
	GitCleanOptions,
	GitLogEntry,
} from '../ports/git';

/**
 * Create a Node.js git adapter.
 */
export function createNodeGitAdapter(cwd?: string): GitAdapter {
	const baseCwd = cwd ?? process.cwd();

	return {
		async currentBranch(): Promise<string | undefined> {
			try {
				const branch =
					runGit(['rev-parse', '--abbrev-ref', 'HEAD'], baseCwd).trim() ||
					readBranchFromGitHead(baseCwd);

				return branch.length > 0 ? branch : undefined;
			} catch {
				return undefined;
			}
		},

		async showFile(ref: string, filePath: string): Promise<string> {
			try {
				const content = runGit(['show', `${ref}:${filePath}`], baseCwd);
				if (content.length > 0 || ref !== 'HEAD') {
					return content;
				}
				return readWorkingTreeFile(baseCwd, filePath) ?? content;
			} catch (error) {
				throw new Error(
					`Could not load ${filePath} at ref ${ref}: ${
						error instanceof Error ? error.message : String(error)
					}`
				);
			}
		},

		async clean(options?: GitCleanOptions): Promise<void> {
			const flags: string[] = [];
			if (options?.force) flags.push('-f');
			if (options?.directories) flags.push('-d');
			if (options?.ignored) flags.push('-x');
			if (options?.dryRun) flags.push('--dry-run');

			runGit(['clean', ...flags], baseCwd, { inherit: true });
		},

		async isGitRepo(path?: string): Promise<boolean> {
			const targetPath = path ? resolve(baseCwd, path) : baseCwd;
			try {
				await access(resolve(targetPath, '.git'));
				return true;
			} catch {
				return false;
			}
		},

		async log(baseline?: string): Promise<GitLogEntry[]> {
			const ref = baseline ?? 'HEAD~10';
			const format = '--format=%H|||%s|||%an|||%aI';

			try {
				const output = runGit(['log', `${ref}..HEAD`, format], baseCwd);

				const entries: GitLogEntry[] = [];

				for (const line of output.trim().split('\n')) {
					if (!line) continue;
					const [hash, message, author, date] = line.split('|||');
					if (hash && message) {
						entries.push({ hash, message, author, date });
					}
				}

				return entries;
			} catch {
				// Return empty if git log fails (e.g., not enough commits)
				return [];
			}
		},

		async diffFiles(baseline: string, patterns?: string[]): Promise<string[]> {
			try {
				const pathSpecs =
					patterns && patterns.length > 0 ? ['--', ...patterns] : [];

				const output = runGit(
					['diff', '--name-only', `${baseline}...HEAD`, ...pathSpecs],
					baseCwd
				);

				return output.trim().split('\n').filter(Boolean);
			} catch {
				// Return empty array if diff fails (e.g., baseline doesn't exist)
				return [];
			}
		},

		async statusFiles(patterns?: string[]): Promise<GitChangedFile[]> {
			try {
				const pathSpecs =
					patterns && patterns.length > 0 ? ['--', ...patterns] : [];
				const output = runGit(
					['status', '--short', '--untracked-files=all', ...pathSpecs],
					baseCwd
				);

				return parseStatusOutput(output);
			} catch {
				return [];
			}
		},

		async diffNameStatus(
			baseline: string,
			patterns?: string[]
		): Promise<GitChangedFile[]> {
			try {
				const pathSpecs =
					patterns && patterns.length > 0 ? ['--', ...patterns] : [];
				const output = runGit(
					['diff', '--name-status', `${baseline}..HEAD`, ...pathSpecs],
					baseCwd
				);

				return parseNameStatusOutput(output);
			} catch {
				return [];
			}
		},
	};
}

function readBranchFromGitHead(cwd: string): string {
	const headPath = resolve(cwd, '.git', 'HEAD');
	if (!existsSync(headPath)) {
		return '';
	}
	const head = readFileSync(headPath, 'utf8').trim();
	const prefix = 'ref: refs/heads/';
	return head.startsWith(prefix) ? head.slice(prefix.length) : head;
}

function readWorkingTreeFile(
	cwd: string,
	filePath: string
): string | undefined {
	const absolutePath = resolve(cwd, filePath);
	if (!existsSync(absolutePath)) {
		return undefined;
	}
	return readFileSync(absolutePath, 'utf8');
}

function runGit(
	args: string[],
	cwd: string,
	options: { inherit?: boolean } = {}
): string {
	const result = spawnSync('git', args, {
		cwd,
		encoding: 'utf-8',
		stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
	});
	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		throw new Error(
			typeof result.stderr === 'string' && result.stderr.length > 0
				? result.stderr
				: `git ${args.join(' ')} failed with status ${result.status ?? 'unknown'}`
		);
	}
	return typeof result.stdout === 'string' ? result.stdout : '';
}

function parseStatusOutput(output: string): GitChangedFile[] {
	return output
		.split('\n')
		.map((line) => line.trimEnd())
		.filter(Boolean)
		.map((line) => {
			const status = line.slice(0, 2).trim() || line.slice(0, 1);
			const pathPart = line.slice(3);
			const [previousPath, path] = pathPart.includes(' -> ')
				? pathPart.split(' -> ')
				: [undefined, pathPart];
			return {
				status,
				path: path ?? pathPart,
				previousPath,
			};
		});
}

function parseNameStatusOutput(output: string): GitChangedFile[] {
	return output
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [status = '', firstPath = '', secondPath] = line.split('\t');
			return {
				status,
				path: secondPath ?? firstPath,
				previousPath: secondPath ? firstPath : undefined,
			};
		});
}
