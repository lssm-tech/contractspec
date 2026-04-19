import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { runCiCommand } from './index';

const tempRoots: string[] = [];
const originalCwd = process.cwd();
const originalConsoleLog = console.log;
const originalProcessExit = process.exit;
let capturedExitCode: number | undefined;

beforeEach(() => {
	console.log = (() => {}) as typeof console.log;
	capturedExitCode = undefined;
	process.exit = ((code?: number) => {
		capturedExitCode = code ?? 0;
		return undefined as never;
	}) as typeof process.exit;
});

afterEach(() => {
	console.log = originalConsoleLog;
	process.exit = originalProcessExit;
	process.chdir(originalCwd);
	for (const root of tempRoots.splice(0)) {
		rmSync(root, { force: true, recursive: true });
	}
});

describe('runCiCommand policy integration', () => {
	it('emits package declaration failures in JSON output', async () => {
		const root = createWorkspace({
			packageJson: {
				workspaces: { packages: ['packages/libs/*'] },
			},
			contractsrc: {
				ci: {
					packageDeclarations: {
						severity: 'error',
					},
				},
			},
			files: {
				'packages/libs/logger/package.json': {
					name: '@contractspec/lib.logger',
					description: 'Logger',
				},
				'packages/libs/logger/src/index.ts': 'export {};\n',
			},
		});

		const output = await captureJsonRun(root, { checks: 'policy' }, true);
		expect(output.success).toBe(false);
		expect(output.checks[0]?.name).toBe('policy-package-declaration');
	});

	it('downgrades allowlisted declaration gaps to warnings without failing', async () => {
		const root = createWorkspace({
			packageJson: {
				workspaces: { packages: ['packages/apps/*'] },
			},
			contractsrc: {
				ci: {
					packageDeclarations: {
						severity: 'error',
						allowMissing: ['packages/apps/cli-database'],
					},
				},
			},
			files: {
				'packages/apps/cli-database/package.json': {
					name: '@contractspec/app.cli-database',
					description: 'CLI database',
				},
				'packages/apps/cli-database/src/index.ts': 'export {};\n',
			},
		});

		const output = await captureJsonRun(root, { checks: 'policy' }, false);
		expect(output.success).toBe(true);
		expect(output.checks[0]?.status).toBe('warn');
	});

	it('still reports handler-level contract-first failures when package coverage passes', async () => {
		const root = createWorkspace({
			packageJson: {
				workspaces: { packages: ['packages/apps/*'] },
			},
			contractsrc: {
				conventions: {
					operations: 'contracts',
				},
				ci: {
					packageDeclarations: {
						severity: 'error',
					},
				},
			},
			files: {
				'packages/apps/api-demo/package.json': {
					name: '@contractspec/app.api-demo',
					description: 'API demo',
				},
				'packages/apps/api-demo/src/index.ts': 'export * from "./blueprint";\n',
				'packages/apps/api-demo/src/blueprint.ts':
					"import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';\nexport const ApiDemoBlueprint = defineAppConfig({ meta: { key: 'apps.api-demo', version: '1.0.0', appId: 'api-demo', title: 'Api Demo', description: 'Api Demo', domain: 'api-demo', owners: ['@contractspec-core'], tags: ['package'], stability: 'experimental' }, capabilities: { enabled: [] } });\n",
				'packages/apps/api-demo/src/routes/demo.route.ts':
					'import { Elysia } from "elysia";\nexport const demoRoute = new Elysia().get("/", () => "ok");\n',
			},
		});

		const output = await captureJsonRun(root, { checks: 'policy' }, true);
		expect(
			output.checks.map((issue: { name: string }) => issue.name)
		).toContain('policy-contract-first');
	});
});

async function captureJsonRun(
	root: string,
	options: Partial<Parameters<typeof runCiCommand>[0]>,
	expectFailure: boolean
) {
	process.chdir(root);
	const outputPath = join(root, 'ci-output.json');

	try {
		await runCiCommand({
			format: 'json',
			output: outputPath,
			...options,
		});
		if (expectFailure) {
			expect(capturedExitCode).toBe(1);
		} else {
			expect(capturedExitCode).toBeUndefined();
		}
	} catch (error) {
		throw error;
	}

	return JSON.parse(readFileSync(outputPath, 'utf8')) as {
		success: boolean;
		checks: Array<{ name: string; status: string }>;
	};
}

function createWorkspace(input: {
	packageJson: Record<string, unknown>;
	contractsrc: Record<string, unknown>;
	files: Record<string, string | Record<string, unknown>>;
}) {
	const root = mkdtempSync(join(tmpdir(), 'contractspec-ci-policy-'));
	tempRoots.push(root);
	writeJson(join(root, 'package.json'), input.packageJson);
	writeJson(join(root, '.contractsrc.json'), input.contractsrc);

	for (const [relativePath, value] of Object.entries(input.files)) {
		if (typeof value === 'string') {
			writeFile(join(root, relativePath), value);
		} else {
			writeJson(join(root, relativePath), value);
		}
	}

	return root;
}

function writeJson(path: string, value: unknown) {
	writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeFile(path: string, content: string) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content, 'utf8');
}
