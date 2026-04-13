import { afterEach, describe, expect, it } from 'bun:test';
import { spawn, spawnSync } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Elysia } from 'elysia';
import { channelControlPlaneHandler } from '../../../../api-library/src/handlers/channel-control-plane-handler';
import {
	getChannelRuntimeResources,
	resetChannelRuntimeResourcesForTests,
} from '../../../../api-library/src/handlers/channel-runtime-resources';

const CLI_ENTRY = resolve(import.meta.dir, '../../cli.ts');
const CONNECT_BLACKBOX_TIMEOUT_MS = 45000;

describe('connect command black-box', () => {
	const tempDirs: string[] = [];

	afterEach(() => {
		resetChannelRuntimeResourcesForTests();
		for (const key of [
			'CHANNEL_RUNTIME_STORAGE',
			'CHANNEL_RUNTIME_ASYNC_PROCESSING',
			'CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS',
			'CONTROL_PLANE_API_TOKEN',
			'CONTROL_PLANE_API_CAPABILITY_GRANTS',
		] as const) {
			Reflect.deleteProperty(process.env, key);
		}
		for (const dir of tempDirs.splice(0)) {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it(
		'runs init, context, plan, verify, and replay with local fallback',
		() => {
			const workspace = createWorkspace(tempDirs);

			const init = runCli(workspace, [
				'connect',
				'init',
				'--scope',
				'workspace',
				'--json',
			]);
			expect(init.code).toBe(0);
			const initResult = JSON.parse(init.stdout);
			expect(initResult.configPath).toContain('.contractsrc.json');
			expect(initResult.gitignore.filePath).toContain('.gitignore');
			expect(initResult.gitignore.action).toBe('created');

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
		},
		CONNECT_BLACKBOX_TIMEOUT_MS
	);

	it(
		'runs verify, review list, and eval in local fallback mode',
		() => {
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
		},
		CONNECT_BLACKBOX_TIMEOUT_MS
	);

	it(
		'exposes plan review/revise/denied states and terminal review/deny flows',
		() => {
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
		},
		CONNECT_BLACKBOX_TIMEOUT_MS
	);

	it(
		'denies destructive terminal commands by default',
		() => {
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
		},
		CONNECT_BLACKBOX_TIMEOUT_MS
	);

	it(
		'auto-syncs review packets to the Studio bridge and supports idempotent manual sync',
		async () => {
			const workspace = createWorkspace(tempDirs);
			const server = startConnectReviewBridgeServer();
			try {
				writeConnectConfig(workspace, {
					policy: {
						protectedPaths: ['src/**'],
						smokeChecks: [],
					},
					studio: {
						enabled: true,
						endpoint: server.baseUrl,
						mode: 'review-bridge',
						queue: 'connect-review',
					},
				});

				const verify = await runCliAsync(
					workspace,
					[
						'connect',
						'verify',
						'--task',
						'task-review-sync',
						'--tool',
						'acp.fs.access',
						'--stdin',
						'--json',
					],
					JSON.stringify({
						operation: 'edit',
						path: 'src/demo.command.ts',
					}),
					{
						CONTROL_PLANE_API_TOKEN: 'control-plane-token',
					}
				);
				expect(verify.code).toBe(20);
				const reviewVerdict = JSON.parse(verify.stdout);

				const envelope = JSON.parse(
					readFileSync(
						join(
							workspace,
							'.contractspec',
							'connect',
							'decisions',
							reviewVerdict.decisionId,
							'decision-envelope.json'
						),
						'utf8'
					)
				);
				expect(envelope.reviewBridge.status).toBe('synced');
				expect(envelope.reviewBridge.queue).toBe('connect-review');

				const sync = await runCliAsync(
					workspace,
					[
						'connect',
						'review',
						'sync',
						'--decision',
						reviewVerdict.decisionId,
						'--json',
					],
					undefined,
					{
						CONTROL_PLANE_API_TOKEN: 'control-plane-token',
					}
				);
				expect(sync.code).toBe(0);
				expect(JSON.parse(sync.stdout)).toMatchObject([
					{
						decisionId: reviewVerdict.decisionId,
						queue: 'connect-review',
						status: 'synced',
					},
				]);

				const runtime = await getChannelRuntimeResources();
				const syncedReviews = await runtime.connectReviewService.list({
					queue: 'connect-review',
				});
				expect(syncedReviews).toHaveLength(1);
				expect(syncedReviews[0]?.sourceDecisionId).toBe(
					reviewVerdict.decisionId
				);
			} finally {
				server.stop();
			}
		},
		CONNECT_BLACKBOX_TIMEOUT_MS
	);

	it(
		'runs contracts-spec hook commands for file, shell, and post-edit flows',
		() => {
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
		},
		CONNECT_BLACKBOX_TIMEOUT_MS
	);
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
		studio?: {
			enabled?: boolean;
			endpoint?: string;
			mode?: 'off' | 'review-bridge';
			queue?: string;
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

function runCli(
	cwd: string,
	args: string[],
	stdin?: string,
	extraEnv: Record<string, string> = {}
) {
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
			...extraEnv,
		},
		input: stdin,
	});

	return {
		code: result.status ?? -1,
		stderr: result.stderr.trim(),
		stdout: result.stdout.trim(),
	};
}

async function runCliAsync(
	cwd: string,
	args: string[],
	stdin?: string,
	extraEnv: Record<string, string> = {}
) {
	return await new Promise<{ code: number; stderr: string; stdout: string }>(
		(resolveResult, reject) => {
			const child = spawn(process.execPath, [CLI_ENTRY, ...args], {
				cwd,
				env: {
					...process.env,
					CHANNEL_RUNTIME_DATABASE_URL: '',
					CHANNEL_RUNTIME_STORAGE: 'postgres',
					DATABASE_URL: '',
					FORCE_COLOR: '0',
					NO_COLOR: '1',
					...extraEnv,
				},
				stdio: 'pipe',
			});
			const stdout: Buffer[] = [];
			const stderr: Buffer[] = [];
			child.stdout.on('data', (chunk) => stdout.push(Buffer.from(chunk)));
			child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));
			child.on('error', reject);
			child.on('close', (code) =>
				resolveResult({
					code: code ?? -1,
					stderr: Buffer.concat(stderr).toString('utf8').trim(),
					stdout: Buffer.concat(stdout).toString('utf8').trim(),
				})
			);
			if (stdin) {
				child.stdin.write(stdin);
			}
			child.stdin.end();
		}
	);
}

function startConnectReviewBridgeServer() {
	resetChannelRuntimeResourcesForTests();
	process.env.CHANNEL_RUNTIME_STORAGE = 'memory';
	process.env.CHANNEL_RUNTIME_ASYNC_PROCESSING = '0';
	process.env.CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS =
		'control-plane.approval.request';
	process.env.CONTROL_PLANE_API_TOKEN = 'control-plane-token';
	process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS = 'control-plane.audit';

	const app = new Elysia().use(channelControlPlaneHandler);
	const server = Bun.serve({
		fetch: app.fetch,
		hostname: '127.0.0.1',
		port: 0,
	});
	const baseUrl = `http://127.0.0.1:${server.port}`;
	return {
		baseUrl,
		stop() {
			server.stop(true);
			resetChannelRuntimeResourcesForTests();
		},
	};
}
