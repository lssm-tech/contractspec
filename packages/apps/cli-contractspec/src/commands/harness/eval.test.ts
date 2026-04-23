import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import {
	existsSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runHarnessEvalCommand } from './index';
import { createHarnessCliApprovalGateway } from './runtime';

let previousCwd: string;
let tempDir: string | null = null;

beforeEach(() => {
	previousCwd = process.cwd();
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-harness-cli-'));
	process.chdir(tempDir);
	writeFileSync(
		join(tempDir, 'package.json'),
		'{"name":"harness-cli-fixture","type":"module"}\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'harness-registry.ts'),
		createRegistryModule(),
		'utf8'
	);
});

afterEach(() => {
	process.chdir(previousCwd);
	if (tempDir) {
		rmSync(tempDir, { recursive: true, force: true });
		tempDir = null;
	}
});

describe('harness eval command', () => {
	it('requires exactly one scenario or suite', async () => {
		await expect(
			runHarnessEvalCommand({
				json: true,
				registry: './harness-registry.ts',
			})
		).rejects.toThrow(/Provide exactly one/);

		await expect(
			runHarnessEvalCommand({
				json: true,
				registry: './harness-registry.ts',
				scenario: 'harness.cli.scenario',
				suite: 'harness.cli.suite',
			})
		).rejects.toThrow(/Provide exactly one/);
	});

	it('outputs JSON and writes replay evidence under .contractspec/harness', async () => {
		if (!tempDir) throw new Error('tempDir missing');
		const output: string[] = [];
		const originalLog = console.log;
		console.log = (value?: unknown) => {
			output.push(String(value ?? ''));
		};
		try {
			const exitCode = await runHarnessEvalCommand({
				json: true,
				registry: './harness-registry.ts',
				scenario: 'harness.cli.scenario',
			});

			expect(exitCode).toBe(0);
			const payload = JSON.parse(output.join('\n'));
			expect(payload.status).toBe('passed');
			expect(payload.run.scenarioKey).toBe('harness.cli.scenario');
		} finally {
			console.log = originalLog;
		}

		const runsDir = join(tempDir, '.contractspec', 'harness', 'runs');
		expect(existsSync(runsDir)).toBe(true);
		const runDirs = readdirSync(runsDir);
		expect(runDirs.length).toBeGreaterThan(0);
		const replayPath = join(runsDir, runDirs[0] ?? '', 'replay-bundle.json');
		expect(readFileSync(replayPath, 'utf8')).toContain('harness.cli.scenario');
	});

	it('applies suite target and browser options through harness eval', async () => {
		const output: string[] = [];
		const originalLog = console.log;
		console.log = (value?: unknown) => {
			output.push(String(value ?? ''));
		};
		try {
			const exitCode = await runHarnessEvalCommand({
				authProfile: 'operator',
				browserEngine: 'both',
				json: true,
				registry: './harness-registry.ts',
				suite: 'harness.cli.suite',
				targetUrl: 'https://custom.example.test',
			});

			expect(exitCode).toBe(0);
			const payload = JSON.parse(output.join('\n'));
			expect(payload.summary.totalScenarios).toBe(1);
			expect(payload.evaluations[0].run.target.baseUrl).toBe(
				'https://custom.example.test'
			);
		} finally {
			console.log = originalLog;
		}
	});

	it('auto-approves local login and form-submit but not remote or high-risk actions', async () => {
		const gateway = createHarnessCliApprovalGateway({
			allowlistedDomains: ['approved.example.com'],
		});
		const localTarget = {
			targetId: 'target-1',
			kind: 'preview' as const,
			isolation: 'preview' as const,
			environment: 'preview',
			baseUrl: 'http://127.0.0.1:3000',
		};
		const remoteTarget = {
			...localTarget,
			baseUrl: 'https://remote.example.com',
		};
		const sharedTarget = {
			...localTarget,
			kind: 'shared' as const,
			isolation: 'shared' as const,
			baseUrl: 'http://127.0.0.1:3000',
		};

		await expect(
			gateway.approve({
				actionClass: 'login',
				context: {},
				reasons: [],
				runId: 'run-1',
				stepKey: 'login',
				target: localTarget,
			})
		).resolves.toMatchObject({ approved: true });
		await expect(
			gateway.approve({
				actionClass: 'form-submit',
				context: {},
				reasons: [],
				runId: 'run-1',
				stepKey: 'submit',
				target: { ...remoteTarget, baseUrl: 'https://approved.example.com' },
			})
		).resolves.toMatchObject({ approved: true });
		await expect(
			gateway.approve({
				actionClass: 'login',
				context: {},
				reasons: [],
				runId: 'run-1',
				stepKey: 'login',
				target: remoteTarget,
			})
		).resolves.toMatchObject({ approved: false });
		await expect(
			gateway.approve({
				actionClass: 'login',
				context: {},
				reasons: [],
				runId: 'run-1',
				stepKey: 'login',
				target: sharedTarget,
			})
		).resolves.toMatchObject({ approved: false });
		await expect(
			gateway.approve({
				actionClass: 'secret-input',
				context: {},
				reasons: [],
				runId: 'run-1',
				stepKey: 'secret',
				target: localTarget,
			})
		).resolves.toMatchObject({ approved: false });
	});
});

function createRegistryModule() {
	return `export const scenarios = [{
  meta: { key: 'harness.cli.scenario', version: '1.0.0', title: 'Harness CLI Scenario', description: 'Validate harness CLI evidence output', domain: 'harness', owners: ['platform.harness'], tags: ['qa'], stability: 'experimental' },
  target: { isolation: 'sandbox', preferredTargets: ['sandbox'], allowlistedDomains: ['sandbox.contractspec.local'] },
  allowedModes: ['code-execution'],
  steps: [{ key: 'validate', description: 'Validate harness eval', mode: 'code-execution', actionClass: 'code-exec-read', intent: 'Return ok', input: { script: 'return { ok: true };' } }],
  assertions: [{ key: 'validate-completed', type: 'step-status', source: 'validate', match: 'completed' }]
}];
export const suites = [{
  meta: { key: 'harness.cli.suite', version: '1.0.0', title: 'Harness CLI Suite', description: 'Suite', domain: 'harness', owners: ['platform.harness'], tags: ['qa'], stability: 'experimental' },
  scenarios: [{ scenario: { key: 'harness.cli.scenario', version: '1.0.0' } }]
}];
`;
}
