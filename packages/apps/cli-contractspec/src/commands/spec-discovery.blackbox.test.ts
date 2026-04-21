import { afterEach, describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const CLI_ENTRY = resolve(import.meta.dir, '../cli.ts');
const CONTRACTS_SPEC_ROOT = resolve(
	import.meta.dir,
	'../../../../libs/contracts-spec/src'
);

describe('spec-centric discovery black-box', () => {
	const tempDirs: string[] = [];

	afterEach(() => {
		for (const dir of tempDirs.splice(0)) {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it(
		'lists and validates one entry per exported spec',
		() => {
			const workspace = createWorkspace(tempDirs);

			const list = runCli(workspace, ['list', '--json']);
			expect(list.code).toBe(0);
			const listed = JSON.parse(list.stdout) as Array<{
				key?: string;
				exportName?: string;
				type: string;
			}>;
			expect(listed).toHaveLength(3);
			expect(listed.map((item) => item.key)).toEqual([
				'audit.get',
				'audit.recorded',
				'audit.run',
			]);

			const deepList = runCli(workspace, ['list', '--deep', '--json']);
			expect(deepList.code).toBe(0);
			const deepListed = JSON.parse(deepList.stdout) as Array<{
				key?: string;
				exportName?: string;
				kind?: string;
			}>;
			expect(deepListed).toHaveLength(3);
			expect(deepListed).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						key: 'audit.recorded',
						exportName: 'auditRecorded',
						kind: 'event',
					}),
					expect.objectContaining({
						key: 'audit.run',
						exportName: 'runAudit',
						kind: 'command',
					}),
					expect.objectContaining({
						key: 'audit.get',
						exportName: 'getAudit',
						kind: 'query',
					}),
				])
			);

			const validate = runCli(workspace, [
				'validate',
				'packages/modules/*/src/contracts/**/*.ts',
			]);
			expect(validate.code).toBe(0);
			expect(validate.stdout).toContain('Found 3 specs to validate.');
			expect(validate.stdout).not.toContain('contracts files to validate');
		},
		{ timeout: 10_000 }
	);
});

function createWorkspace(tempDirs: string[]) {
	const dir = mkdtempSync(join(tmpdir(), 'contractspec-spec-discovery-'));
	tempDirs.push(dir);

	const contractsDir = join(
		dir,
		'packages',
		'modules',
		'audit',
		'src',
		'contracts'
	);
	const packageDir = join(
		dir,
		'node_modules',
		'@contractspec',
		'lib.contracts-spec'
	);
	const operationsDir = join(packageDir, 'operations');
	mkdirSync(contractsDir, { recursive: true });
	mkdirSync(operationsDir, { recursive: true });

	writeFileSync(
		join(dir, 'package.json'),
		JSON.stringify({ name: 'spec-discovery-fixture', type: 'module' }, null, 2),
		'utf8'
	);

	writeFileSync(
		join(dir, '.contractsrc.json'),
		JSON.stringify(
			{
				packages: ['packages/modules/*'],
				conventions: {
					models: 'src/contracts/models',
					operations: 'src/contracts/commands|src/contracts/queries',
					events: 'src/contracts/events',
					presentations: 'src/contracts/presentations',
					forms: 'src/contracts/forms',
					groupByFeature: true,
				},
			},
			null,
			2
		),
		'utf8'
	);

	writeFileSync(
		join(packageDir, 'package.json'),
		JSON.stringify(
			{
				name: '@contractspec/lib.contracts-spec',
				type: 'module',
				exports: {
					'.': './index.ts',
					'./events': './events.ts',
					'./operations/operation': './operations/operation.ts',
				},
			},
			null,
			2
		),
		'utf8'
	);

	writeFileSync(
		join(packageDir, 'index.ts'),
		`export { defineCommand, defineQuery } from "${join(CONTRACTS_SPEC_ROOT, 'operations/operation.ts').replaceAll('\\', '/')}";\nexport { defineEvent } from "${join(CONTRACTS_SPEC_ROOT, 'events.ts').replaceAll('\\', '/')}";\n`,
		'utf8'
	);
	writeFileSync(
		join(packageDir, 'events.ts'),
		`export { defineEvent } from "${join(CONTRACTS_SPEC_ROOT, 'events.ts').replaceAll('\\', '/')}";\n`,
		'utf8'
	);
	writeFileSync(
		join(operationsDir, 'operation.ts'),
		`export { defineCommand, defineQuery } from "${join(CONTRACTS_SPEC_ROOT, 'operations/operation.ts').replaceAll('\\', '/')}";\n`,
		'utf8'
	);

	writeFileSync(
		join(contractsDir, 'ai-contracts.ts'),
		`
import { defineCommand, defineEvent, defineQuery } from "@contractspec/lib.contracts-spec";

export const auditRecorded = defineEvent({
  meta: {
    key: "audit.recorded",
    version: "1.0.0",
    description: "Audit recorded",
    stability: "stable",
    owners: ["@team.audit"],
    tags: ["audit"],
  },
  payload: {},
});

export const runAudit = defineCommand({
  meta: {
    key: "audit.run",
    version: "1.0.0",
    description: "Run the audit",
    stability: "stable",
    owners: ["@team.audit"],
    tags: ["audit"],
  },
  io: {},
  policy: {},
});

export const getAudit = defineQuery({
  meta: {
    key: "audit.get",
    version: "1.0.0",
    description: "Get audit",
    stability: "stable",
    owners: ["@team.audit"],
    tags: ["audit"],
  },
  io: {},
  policy: {},
});
`.trim(),
		'utf8'
	);

	return dir;
}

function runCli(cwd: string, args: string[]) {
	const result = spawnSync('bun', ['--no-env-file', CLI_ENTRY, ...args], {
		cwd,
		encoding: 'utf8',
		env: createSubprocessEnv(),
	});

	return {
		code: result.status ?? -1,
		stderr: result.stderr.trim(),
		stdout: result.stdout.trim(),
	};
}

function createSubprocessEnv(
	extraEnv: Record<string, string> = {}
): Record<string, string> {
	const env: Record<string, string> = {};
	for (const key of [
		'BUN_INSTALL',
		'HOME',
		'PATH',
		'SHELL',
		'TEMP',
		'TMP',
		'TMPDIR',
		'USER',
	] as const) {
		const value = process.env[key];
		if (value) {
			env[key] = value;
		}
	}
	return { ...env, FORCE_COLOR: '0', NO_COLOR: '1', ...extraEnv };
}
