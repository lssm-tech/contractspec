import { afterEach, describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const CLI_ENTRY = resolve(import.meta.dir, '../../cli.ts');

describe('connect command black-box', () => {
	const tempDirs: string[] = [];

	afterEach(() => {
		for (const dir of tempDirs.splice(0)) {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('runs init, context, plan, verify, and replay with local fallback', () => {
		const workspace = createWorkspace(tempDirs);

		const init = runCli(workspace, [
			'connect',
			'init',
			'--scope',
			'workspace',
			'--json',
		]);
		expect(init.code).toBe(0);
		expect(JSON.parse(init.stdout).configPath).toContain('.contractsrc.json');

		const context = runCli(workspace, [
			'connect',
			'context',
			'--task',
			'task-1',
			'--paths',
			'src/demo.command.ts',
			'--json',
		]);
		expect(context.code).toBe(0);
		expect(JSON.parse(context.stdout).impactedContracts[0].key).toBe(
			'demo.command'
		);

		const plan = runCli(
			workspace,
			['connect', 'plan', '--task', 'task-1', '--stdin', '--json'],
			JSON.stringify({
				objective: 'Update demo command',
				touchedPaths: ['src/demo.command.ts'],
			})
		);
		expect(plan.code).toBe(0);
		expect(JSON.parse(plan.stdout).objective).toBe('Update demo command');

		const verify = runCli(
			workspace,
			[
				'connect',
				'verify',
				'--task',
				'task-1',
				'--tool',
				'acp.fs.access',
				'--stdin',
				'--json',
			],
			JSON.stringify({
				operation: 'edit',
				path: 'src/demo.command.ts',
			})
		);
		expect(verify.code).toBe(0);
		const verdict = JSON.parse(verify.stdout);
		expect(verdict.verdict).toBe('permit');
		expect(verdict.controlPlane.decisionId).toBeUndefined();
		expect(
			existsSync(
				join(workspace, '.contractspec', 'connect', 'patch-verdict.json')
			)
		).toBe(true);

		const replay = runCli(workspace, [
			'connect',
			'replay',
			verdict.decisionId,
			'--json',
		]);
		expect(replay.code).toBe(0);
		expect(JSON.parse(replay.stdout).source).toBe('local');
	}, 20000);

	it('runs verify, review list, and eval in local fallback mode', () => {
		const workspace = createWorkspace(tempDirs);
		runCli(workspace, ['connect', 'init', '--scope', 'workspace', '--json']);
		writeFileSync(
			join(workspace, 'harness-registry.ts'),
			createRegistryModule(),
			'utf8'
		);

		const reviewVerify = runCli(
			workspace,
			[
				'connect',
				'verify',
				'--task',
				'task-review',
				'--tool',
				'acp.fs.access',
				'--stdin',
				'--json',
			],
			JSON.stringify({
				operation: 'edit',
				path: 'src/unknown.ts',
			})
		);
		const reviewVerdict = JSON.parse(reviewVerify.stdout);
		expect(reviewVerify.code).toBe(20);
		expect(reviewVerdict.verdict).toBe('require_review');
		expect(reviewVerdict.controlPlane.decisionId).toBeUndefined();

		const reviewList = runCli(workspace, [
			'connect',
			'review',
			'list',
			'--json',
		]);
		expect(reviewList.code).toBe(0);
		expect(JSON.parse(reviewList.stdout)).toHaveLength(1);

		const evaluation = runCli(workspace, [
			'connect',
			'eval',
			reviewVerdict.decisionId,
			'--registry',
			join(workspace, 'harness-registry.ts'),
			'--scenario',
			'connect.safe-refactor',
			'--json',
		]);
		expect(evaluation.code).toBe(0);
		expect(JSON.parse(evaluation.stdout).status).toBe('passed');
		expect(
			existsSync(
				join(
					workspace,
					'.contractspec',
					'connect',
					'decisions',
					reviewVerdict.decisionId,
					'evaluation-result.json'
				)
			)
		).toBe(true);
	}, 20000);

	it('exposes plan review/revise/denied states and terminal review/deny flows', () => {
		const workspace = createWorkspace(tempDirs);
		writeConnectConfig(workspace, {
			commands: {
				deny: ['git push --force'],
				review: ['git push'],
			},
			policy: {
				generatedPaths: ['src/**'],
				immutablePaths: ['.changeset/**'],
				reviewThresholds: {
					contractDrift: 'rewrite',
				},
				smokeChecks: [],
			},
		});

		const reviewPlan = runCli(
			workspace,
			['connect', 'plan', '--task', 'task-plan-review', '--stdin', '--json'],
			JSON.stringify({
				objective: 'Update unknown file',
				touchedPaths: ['src/unknown.ts'],
			})
		);
		const revisePlan = runCli(
			workspace,
			['connect', 'plan', '--task', 'task-plan-revise', '--stdin', '--json'],
			JSON.stringify({
				objective: 'Edit generated command file',
				touchedPaths: ['src/demo.command.ts'],
			})
		);
		const deniedPlan = runCli(
			workspace,
			['connect', 'plan', '--task', 'task-plan-denied', '--stdin', '--json'],
			JSON.stringify({
				objective: 'Force push branch',
				steps: [
					{ summary: 'Push', commands: ['git push --force origin HEAD'] },
				],
			})
		);
		const reviewCommand = runCli(
			workspace,
			[
				'connect',
				'verify',
				'--task',
				'task-command-review',
				'--tool',
				'acp.terminal.exec',
				'--paths',
				'src/demo.command.ts',
				'--stdin',
				'--json',
			],
			'git push origin HEAD'
		);
		const deniedCommand = runCli(
			workspace,
			[
				'connect',
				'verify',
				'--task',
				'task-command-deny',
				'--tool',
				'acp.terminal.exec',
				'--paths',
				'src/demo.command.ts',
				'--stdin',
				'--json',
			],
			'git push --force origin HEAD'
		);

		expect(reviewPlan.code).toBe(0);
		expect(JSON.parse(reviewPlan.stdout).verificationStatus).toBe('review');
		expect(revisePlan.code).toBe(0);
		expect(JSON.parse(revisePlan.stdout).verificationStatus).toBe('revise');
		expect(deniedPlan.code).toBe(0);
		expect(JSON.parse(deniedPlan.stdout).verificationStatus).toBe('denied');
		expect(reviewCommand.code).toBe(20);
		expect(JSON.parse(reviewCommand.stdout)).toMatchObject({
			verdict: 'require_review',
			controlPlane: {
				verdict: 'assist',
				requiresApproval: true,
			},
		});
		expect(deniedCommand.code).toBe(30);
		expect(JSON.parse(deniedCommand.stdout)).toMatchObject({
			verdict: 'deny',
			controlPlane: {
				verdict: 'blocked',
				requiresApproval: false,
			},
		});
	}, 20000);

	it('denies destructive terminal commands by default', () => {
		const workspace = createWorkspace(tempDirs);
		runCli(workspace, ['connect', 'init', '--scope', 'workspace', '--json']);

		const destructiveCommand = runCli(
			workspace,
			[
				'connect',
				'verify',
				'--task',
				'task-command-destructive',
				'--tool',
				'acp.terminal.exec',
				'--stdin',
				'--json',
			],
			'rm -rf generated'
		);

		expect(destructiveCommand.code).toBe(30);
		expect(JSON.parse(destructiveCommand.stdout)).toMatchObject({
			verdict: 'deny',
			controlPlane: {
				verdict: 'blocked',
				requiresApproval: false,
			},
		});
	}, 20000);

	it('runs contracts-spec hook commands for file, shell, and post-edit flows', () => {
		const workspace = createWorkspace(tempDirs);
		writeConnectConfig(workspace, {
			commands: {
				review: ['contractspec impact'],
			},
			policy: {
				protectedPaths: ['packages/libs/contracts-spec/**'],
				smokeChecks: [],
			},
		});

		const beforeFile = runCli(
			workspace,
			[
				'connect',
				'hook',
				'contracts-spec',
				'before-file-edit',
				'--stdin',
				'--json',
			],
			JSON.stringify({
				path: 'packages/libs/contracts-spec/index.ts',
			})
		);
		const beforeShell = runCli(
			workspace,
			[
				'connect',
				'hook',
				'contracts-spec',
				'before-shell-execution',
				'--stdin',
				'--json',
			],
			JSON.stringify({
				command: 'contractspec impact --baseline main',
				touchedPaths: ['packages/libs/contracts-spec/index.ts'],
			})
		);
		const afterFile = runCli(
			workspace,
			[
				'connect',
				'hook',
				'contracts-spec',
				'after-file-edit',
				'--stdin',
				'--json',
			],
			JSON.stringify({
				path: 'packages/libs/contracts-spec/index.ts',
			})
		);

		expect(beforeFile.code).toBe(20);
		expect(JSON.parse(beforeFile.stdout)).toMatchObject({
			verdict: 'require_review',
		});
		expect(beforeShell.code).toBe(20);
		expect(JSON.parse(beforeShell.stdout)).toMatchObject({
			verdict: 'require_review',
		});
		expect(afterFile.code).toBe(0);
		expect(JSON.parse(afterFile.stdout)).toMatchObject({
			reviewCount: expect.any(Number),
		});
	}, 20000);
});

function createWorkspace(tempDirs: string[]) {
	const dir = mkdtempSync(join(tmpdir(), 'contractspec-connect-cli-'));
	tempDirs.push(dir);
	mkdirSync(join(dir, 'src'), { recursive: true });
	mkdirSync(join(dir, 'generated', 'docs'), { recursive: true });
	mkdirSync(join(dir, 'packages', 'libs', 'contracts-spec'), {
		recursive: true,
	});
	writeFileSync(
		join(dir, 'package.json'),
		'{"name":"connect-cli-fixture","type":"module"}\n',
		'utf8'
	);
	writeFileSync(
		join(dir, 'src', 'demo.command.ts'),
		"export const op = defineCommand({ meta: { key: 'demo.command', version: '1.0.0' } });\n",
		'utf8'
	);
	writeFileSync(
		join(dir, 'packages', 'libs', 'contracts-spec', 'index.ts'),
		'export {};\n',
		'utf8'
	);
	writeFileSync(
		join(dir, 'generated', 'docs', 'connect.md'),
		'generated\n',
		'utf8'
	);
	return dir;
}

function writeConnectConfig(
	cwd: string,
	connect: {
		commands?: { allow?: string[]; deny?: string[]; review?: string[] };
		policy?: {
			protectedPaths?: string[];
			generatedPaths?: string[];
			immutablePaths?: string[];
			reviewThresholds?: {
				contractDrift?: 'rewrite' | 'require_review' | 'deny' | 'permit';
			};
			smokeChecks?: string[];
		};
	}
) {
	writeFileSync(
		join(cwd, '.contractsrc.json'),
		JSON.stringify(
			{
				connect: {
					adapters: {
						codex: { enabled: true, mode: 'wrapper' },
						cursor: { enabled: true, mode: 'plugin' },
					},
					enabled: true,
					...connect,
				},
			},
			null,
			2
		),
		'utf8'
	);
}

function createRegistryModule() {
	return `export const scenarios = [{
  meta: { key: 'connect.safe-refactor', version: '1.0.0', title: 'Connect Safe Refactor', description: 'Validate local replay bundle', domain: 'harness', owners: ['platform.harness'], tags: ['qa'], stability: 'experimental' },
  target: {},
  allowedModes: ['code-execution'],
  steps: [{ key: 'validate', description: 'Validate replay context', mode: 'code-execution', actionClass: 'code-exec-read', intent: 'Return ok', input: { script: 'return { ok: true };' } }],
  assertions: [{ key: 'validate-completed', type: 'step-status', source: 'validate', match: 'completed' }]
}];
export const suites = [{
  meta: { key: 'connect.safe-suite', version: '1.0.0', title: 'Connect Safe Suite', description: 'Suite', domain: 'harness', owners: ['platform.harness'], tags: ['qa'], stability: 'experimental' },
  scenarios: [{ scenario: { key: 'connect.safe-refactor', version: '1.0.0' } }]
}];
`;
}

function runCli(cwd: string, args: string[], stdin?: string) {
	const result = spawnSync(process.execPath, [CLI_ENTRY, ...args], {
		cwd,
		encoding: 'utf8',
		env: {
			...process.env,
			CHANNEL_RUNTIME_DATABASE_URL: '',
			CHANNEL_RUNTIME_STORAGE: 'postgres',
			DATABASE_URL: '',
			FORCE_COLOR: '0',
			NO_COLOR: '1',
		},
		input: stdin,
	});

	return {
		code: result.status ?? -1,
		stderr: result.stderr.trim(),
		stdout: result.stdout.trim(),
	};
}
