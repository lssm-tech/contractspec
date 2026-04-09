import { describe, expect, it } from 'bun:test';
import { spawn, spawnSync } from 'node:child_process';
import {
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import { Elysia } from 'elysia';
import { channelControlPlaneHandler } from '../../packages/apps/api-library/src/handlers/channel-control-plane-handler';
import { resetChannelRuntimeResourcesForTests } from '../../packages/apps/api-library/src/handlers/channel-runtime-resources';
import { ContractsrcSchema } from '../../packages/libs/contracts-spec/src/workspace-config/contractsrc-schema';

const SPEC_DIR = import.meta.dir;
const CLI_ENTRY = resolve(
	SPEC_DIR,
	'../../packages/apps/cli-contractspec/src/cli.ts'
);

function readJson<T>(relativePath: string): T {
	return JSON.parse(readFileSync(join(SPEC_DIR, relativePath), 'utf8')) as T;
}

function validateExample(schemaPath: string, examplePath: string) {
	const ajv = new Ajv2020({ allErrors: true, strict: false });
	const validate = ajv.compile(readJson<object>(schemaPath));
	const valid = validate(readJson<object>(examplePath));
	expect(
		valid,
		`${examplePath} failed schema validation: ${JSON.stringify(validate.errors)}`
	).toBe(true);
}

describe('contractspec-connect-spec examples', () => {
	it('accepts the .contractsrc connect example', () => {
		const result = ContractsrcSchema.safeParse(
			readJson<object>('examples/contractsrc.connect.example.json')
		);
		expect(result.success).toBe(true);
	});

	it('validates the context pack example', () => {
		validateExample(
			'schemas/context-pack.schema.json',
			'examples/context-pack.example.json'
		);
	});

	it('validates the plan packet example', () => {
		validateExample(
			'schemas/plan-packet.schema.json',
			'examples/plan-packet.example.json'
		);
	});

	it('validates the patch verdict example', () => {
		validateExample(
			'schemas/patch-verdict.schema.json',
			'examples/patch-verdict.example.json'
		);
	});

	it('validates the review packet example', () => {
		validateExample(
			'schemas/review-packet.schema.json',
			'examples/review-packet.example.json'
		);
	});

	it('validates real CLI-generated artifacts and enriched audit records', () => {
		const workspace = createWorkspace();

		try {
			const context = runCli(workspace, [
				'connect',
				'context',
				'--task',
				'task-runtime',
				'--paths',
				'src/runtime/foo.ts',
				'--json',
			]);
			const plan = runCli(
				workspace,
				['connect', 'plan', '--task', 'task-runtime', '--stdin', '--json'],
				JSON.stringify({
					objective: 'Update runtime path',
					touchedPaths: ['src/runtime/foo.ts'],
					commands: ['bun test'],
				})
			);
			const verify = runCli(
				workspace,
				[
					'connect',
					'verify',
					'--task',
					'task-runtime-review',
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

			expect(context.code).toBe(0);
			expect(plan.code).toBe(0);
			expect(verify.code).toBe(20);

			validateJson(
				'schemas/context-pack.schema.json',
				JSON.parse(context.stdout)
			);
			const planPacket = JSON.parse(plan.stdout);
			expect(planPacket.riskScore).toBeLessThanOrEqual(1);
			validateJson('schemas/plan-packet.schema.json', planPacket);

			const patchVerdict = JSON.parse(verify.stdout);
			validateJson('schemas/patch-verdict.schema.json', patchVerdict);

			const reviewPacketPath = join(
				workspace,
				'.contractspec',
				'connect',
				'review-packets',
				readdirSync(
					join(workspace, '.contractspec', 'connect', 'review-packets')
				)[0]
			);
			validateJson(
				'schemas/review-packet.schema.json',
				JSON.parse(readFileSync(reviewPacketPath, 'utf8'))
			);

			const [auditRecord] = readAuditRecords(workspace);
			expect(auditRecord).toMatchObject({
				eventType: 'connect.verify',
				repoId: '@demo/connect-spec',
				actor: {
					id: 'cli:task-runtime-review',
					type: 'human',
				},
				adapter: {
					channel: 'cli',
					source: 'connect',
					tool: 'acp.fs.access',
				},
			});
			expect(auditRecord.refs.contextPack).toContain('/context-pack.json');
			expect(auditRecord.refs.planPacket).toContain('/plan-packet.json');
			expect(auditRecord.refs.patchVerdict).toContain('/patch-verdict.json');
			expect(auditRecord.refs.reviewPacket).toContain('/review-packet.json');
		} finally {
			rmSync(workspace, { recursive: true, force: true });
		}
	}, 20000);

	it('syncs a real CLI review packet through the Studio review bridge', async () => {
		const workspace = createWorkspace();
		const server = startConnectReviewBridgeServer();

		try {
			writeFileSync(
				join(workspace, '.contractsrc.json'),
				JSON.stringify(
					{
						connect: {
							enabled: true,
							policy: {
								protectedPaths: ['src/**'],
							},
							studio: {
								enabled: true,
								mode: 'review-bridge',
								endpoint: server.baseUrl,
								queue: 'connect-review',
							},
						},
					},
					null,
					2
				)
			);

			const verify = await runCliAsync(
				workspace,
				[
					'connect',
					'verify',
					'--task',
					'task-review-bridge',
					'--tool',
					'acp.fs.access',
					'--stdin',
					'--json',
				],
				JSON.stringify({
					operation: 'edit',
					path: 'src/runtime/foo.ts',
				}),
				{
					CONTROL_PLANE_API_TOKEN: 'control-plane-token',
				}
			);
			expect(verify.code).toBe(20);

			const reviewVerdict = JSON.parse(verify.stdout) as { decisionId: string };
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

			const response = await fetch(
				`${server.baseUrl}/internal/control-plane/connect/reviews`,
				{
					headers: {
						authorization: 'Bearer control-plane-token',
					},
				}
			);
			expect(response.status).toBe(200);
			const listJson = (await response.json()) as {
				items: Array<{ sourceDecisionId: string }>;
				ok: boolean;
			};
			expect(listJson.ok).toBe(true);
			expect(listJson.items[0]?.sourceDecisionId).toBe(
				reviewVerdict.decisionId
			);
		} finally {
			server.stop();
			rmSync(workspace, { recursive: true, force: true });
		}
	}, 20000);
});

function validateJson(schemaPath: string, value: object) {
	const ajv = new Ajv2020({ allErrors: true, strict: false });
	const validate = ajv.compile(readJson<object>(schemaPath));
	const valid = validate(value);
	expect(
		valid,
		`${schemaPath} failed schema validation: ${JSON.stringify(validate.errors)}`
	).toBe(true);
}

function createWorkspace() {
	const dir = mkdtempSync(join(tmpdir(), 'contractspec-connect-spec-'));
	mkdirSync(join(dir, 'src', 'runtime'), { recursive: true });
	writeFileSync(
		join(dir, 'package.json'),
		'{"name":"@demo/connect-spec","type":"module"}\n'
	);
	writeFileSync(
		join(dir, '.contractsrc.json'),
		'{"connect":{"enabled":true}}\n'
	);
	writeFileSync(join(dir, 'src', 'runtime', 'foo.ts'), 'export {};\n');
	return dir;
}

function readAuditRecords(workspace: string): Array<Record<string, any>> {
	return readFileSync(
		join(workspace, '.contractspec', 'connect', 'audit.ndjson'),
		'utf8'
	)
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as Record<string, any>);
}

function runCli(
	workspace: string,
	args: string[],
	input?: string,
	extraEnv: Record<string, string> = {}
) {
	const result = spawnSync('bun', [CLI_ENTRY, ...args], {
		cwd: workspace,
		encoding: 'utf8',
		env: {
			...process.env,
			CHANNEL_RUNTIME_DATABASE_URL: '',
			CHANNEL_RUNTIME_STORAGE: 'postgres',
			DATABASE_URL: '',
			...extraEnv,
		},
		input,
	});

	return {
		code: result.status,
		stderr: result.stderr,
		stdout: result.stdout,
	};
}

async function runCliAsync(
	workspace: string,
	args: string[],
	input?: string,
	extraEnv: Record<string, string> = {}
) {
	return await new Promise<{ code: number; stderr: string; stdout: string }>(
		(resolveResult, reject) => {
			const child = spawn('bun', [CLI_ENTRY, ...args], {
				cwd: workspace,
				env: {
					...process.env,
					CHANNEL_RUNTIME_DATABASE_URL: '',
					CHANNEL_RUNTIME_STORAGE: 'postgres',
					DATABASE_URL: '',
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
					stderr: Buffer.concat(stderr).toString('utf8'),
					stdout: Buffer.concat(stdout).toString('utf8'),
				})
			);
			if (input) {
				child.stdin.write(input);
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
	return {
		baseUrl: `http://127.0.0.1:${server.port}`,
		stop() {
			server.stop(true);
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
		},
	};
}
