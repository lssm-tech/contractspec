import { execFileSync } from 'node:child_process';

export interface GitWorkspaceSnapshot {
	cwd: string;
	status: string;
}

export function captureGitWorkspaceSnapshot(
	cwd = process.cwd()
): GitWorkspaceSnapshot {
	return {
		cwd,
		status: readGitStatus(cwd),
	};
}

export function assertGitWorkspaceSnapshotUnchanged(
	baseline: unknown
): asserts baseline is GitWorkspaceSnapshot {
	if (!isGitWorkspaceSnapshot(baseline)) {
		throw new Error('Missing git workspace snapshot baseline.');
	}
	const current = readGitStatus(baseline.cwd);
	if (current === baseline.status) {
		return;
	}
	throw new Error(
		'Consensus planning mutated the workspace while running in read-only mode.'
	);
}

function readGitStatus(cwd: string): string {
	try {
		return execFileSync(
			'git',
			['-C', cwd, 'status', '--porcelain=v1', '--untracked-files=all'],
			{
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'pipe'],
			}
		).trim();
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Unable to capture git status.';
		throw new Error(
			`Read-only planning requires a git workspace snapshot. ${message}`
		);
	}
}

function isGitWorkspaceSnapshot(value: unknown): value is GitWorkspaceSnapshot {
	return (
		typeof value === 'object' &&
		value !== null &&
		'cwd' in value &&
		'status' in value
	);
}
