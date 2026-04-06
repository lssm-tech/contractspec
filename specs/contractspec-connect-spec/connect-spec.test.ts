import { describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
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

function runCli(workspace: string, args: string[], input?: string) {
	const result = spawnSync('bun', [CLI_ENTRY, ...args], {
		cwd: workspace,
		encoding: 'utf8',
		input,
	});

	return {
		code: result.status,
		stderr: result.stderr,
		stdout: result.stdout,
	};
}
