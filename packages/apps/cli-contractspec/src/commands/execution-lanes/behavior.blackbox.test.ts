import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const CLI_ENTRY = resolve(import.meta.dir, '../../cli.ts');
const describeBlackbox =
	process.env.RUN_CLI_BLACKBOX === '1' ? describe : describe.skip;
let workspaceRoot = '';

describeBlackbox('execution-lanes command behavior', () => {
	beforeEach(() => {
		workspaceRoot = createGitWorkspace();
	});

	afterEach(() => {
		if (workspaceRoot) {
			rmSync(workspaceRoot, { force: true, recursive: true });
			workspaceRoot = '';
		}
	});

	it('creates a completed clarify lane run', () => {
		const result = runCli([
			'execution-lanes',
			'clarify',
			'Clarify the rollout',
			'--json',
		]);
		expect(result.code).toBe(0);
		const output = JSON.parse(result.stdout);
		expect(output.run.lane).toBe('clarify');
		expect(output.run.status).toBe('completed');
		expect(output.run.recommendedNextLane).toBe('plan.consensus');
	});

	it('creates a persisted plan lane run from stdin json', () => {
		const result = runCli(
			['execution-lanes', 'plan', '--stdin', '--json'],
			JSON.stringify({
				request: 'Ship execution lanes',
				objective: 'Ship execution lanes with durable team support',
				constraints: ['Keep exports stable.'],
				assumptions: ['Authority refs are already configured.'],
				authorityContext: {
					policyRefs: ['policy.execution-lanes'],
					ruleContextRefs: ['rules.execution-lanes'],
				},
				nextLane: 'team.coordinated',
			})
		);
		expect(result.code).toBe(0);
		const output = JSON.parse(result.stdout);
		expect(output.run.lane).toBe('plan.consensus');
		expect(output.run.status).toBe('completed');
		expect(output.run.recommendedNextLane).toBe('team.coordinated');
		expect(
			output.artifacts.some(
				(artifact: { artifactType: string }) =>
					artifact.artifactType === 'plan_pack'
			)
		).toBe(true);
	});

	it('rejects invalid complete stdin payloads', () => {
		const result = runCli(
			['execution-lanes', 'complete', '--stdin', '--json'],
			JSON.stringify({
				planPack: {
					meta: {
						id: 'plan-invalid',
						createdAt: new Date().toISOString(),
						sourceRequest: 'broken',
						scopeClass: 'medium',
					},
					objective: '',
					constraints: [],
					assumptions: [],
					nonGoals: [],
					tradeoffs: [],
					staffing: {
						availableRoleProfiles: ['executor'],
						recommendedLanes: [],
						handoffRecommendation: {
							nextLane: 'complete.persistent',
							launchHints: [],
						},
					},
					planSteps: [],
					verification: {
						requiredEvidence: [],
						requiredApprovals: [],
						blockingRisks: [],
					},
					authorityContext: {
						policyRefs: [],
						ruleContextRefs: [],
					},
				},
			})
		);
		expect(result.code).not.toBe(0);
		expect(result.stderr).toContain('Invalid completion plan pack');
	});

	it('starts the persistent completion lane from stdin plan packs', () => {
		const result = runCli(
			['execution-lanes', 'complete', '--stdin', '--json'],
			JSON.stringify({
				planPack: createPlanPack(),
				contextSnapshot: { source: 'stdin' },
			})
		);
		expect(result.code).toBe(0);
		const output = JSON.parse(result.stdout);
		expect(output.run.lane).toBe('complete.persistent');
		expect(output.run.currentPhase).toBe('working');
		expect(output.completion.phase).toBe('working');
		expect(
			output.artifacts.some(
				(artifact: { artifactType: string }) =>
					artifact.artifactType === 'plan_pack'
			)
		).toBe(true);
	});

	it('starts the persistent completion lane from task strings', () => {
		const result = runCli([
			'execution-lanes',
			'complete',
			'Close the execution-lane rollout',
			'--json',
		]);
		expect(result.code).toBe(0);
		const output = JSON.parse(result.stdout);
		expect(output.run.lane).toBe('complete.persistent');
		expect(output.completion.phase).toBe('working');
		expect(
			output.artifacts.some(
				(artifact: { artifactType: string }) =>
					artifact.artifactType === 'plan_pack'
			)
		).toBe(true);
	});

	it('starts coordinated team runs from stdin plan packs', () => {
		const result = runCli(
			['execution-lanes', 'team', '--stdin', '--json'],
			JSON.stringify({
				planPack: createPlanPack('team.coordinated'),
			})
		);
		expect(result.code).toBe(0);
		const output = JSON.parse(result.stdout);
		expect(output.run.lane).toBe('team.coordinated');
		expect(output.team.status).toBe('running');
		expect(
			output.team.workers.every(
				(worker: { status: string }) => worker.status === 'running'
			)
		).toBe(true);
	});

	it('starts coordinated team runs from task strings', () => {
		const result = runCli([
			'execution-lanes',
			'team',
			'Parallelize the execution-lane rollout',
			'--json',
		]);
		expect(result.code).toBe(0);
		const output = JSON.parse(result.stdout);
		expect(output.run.lane).toBe('team.coordinated');
		expect(output.team.status).toBe('running');
		expect(
			output.artifacts.some(
				(artifact: { artifactType: string }) =>
					artifact.artifactType === 'plan_pack'
			)
		).toBe(true);
	});
});

function createPlanPack(
	nextLane: 'complete.persistent' | 'team.coordinated' = 'complete.persistent'
) {
	return {
		meta: {
			id: `plan-${nextLane}`,
			createdAt: new Date().toISOString(),
			sourceRequest: 'Ship execution lanes',
			scopeClass: 'medium',
		},
		objective: 'Ship execution lanes',
		constraints: ['Keep exports stable.'],
		assumptions: ['Authority refs are already configured.'],
		nonGoals: ['Do not bypass policy gates.'],
		tradeoffs: [
			{
				topic: 'execution lane',
				tension: 'throughput vs closure',
				chosenDirection: nextLane,
				rejectedAlternatives:
					nextLane === 'team.coordinated'
						? ['complete.persistent']
						: ['team.coordinated'],
			},
		],
		staffing: {
			availableRoleProfiles: ['planner', 'executor', 'verifier'],
			recommendedLanes: [{ lane: nextLane, why: 'Matches the rollout.' }],
			handoffRecommendation: {
				nextLane,
				launchHints: ['Start the matching execution lane.'],
			},
		},
		planSteps: [
			{
				id: 'implement',
				title: 'Implement execution lanes',
				description: 'Ship the launch paths and runtime wiring.',
				acceptanceCriteria: ['Tests pass.'],
				roleHints: ['executor'],
			},
			{
				id: 'verify',
				title: 'Verify execution lanes',
				description: 'Collect evidence and approvals.',
				acceptanceCriteria: ['Verification results are attached.'],
				dependencies: ['implement'],
				roleHints: ['verifier'],
			},
		],
		verification: {
			requiredEvidence: ['verification_results'],
			requiredApprovals: ['verifier'],
			blockingRisks: [],
		},
		authorityContext: {
			policyRefs: ['policy.execution-lanes'],
			ruleContextRefs: ['rules.execution-lanes'],
		},
	};
}

function runCli(args: string[], stdin?: string) {
	const result = spawnSync('bun', ['--no-env-file', CLI_ENTRY, ...args], {
		cwd: workspaceRoot,
		encoding: 'utf8',
		env: createSubprocessEnv({
			CHANNEL_RUNTIME_STORAGE: 'memory',
			CHANNEL_RUNTIME_DATABASE_URL: '',
			DATABASE_URL: '',
		}),
		input: stdin,
	});

	return {
		code: result.status ?? -1,
		stderr: result.stderr.trim(),
		stdout: result.stdout.trim(),
	};
}

function createGitWorkspace(): string {
	const root = mkdtempSync(join(tmpdir(), 'contractspec-lanes-cli-'));
	writeFileSync(join(root, 'package.json'), '{"name":"lanes-cli"}\n', 'utf8');
	execFileSync('git', ['init', '-q'], { cwd: root, stdio: 'ignore' });
	execFileSync('git', ['config', 'user.name', 'ContractSpec Test'], {
		cwd: root,
		stdio: 'ignore',
	});
	execFileSync('git', ['config', 'user.email', 'test@example.com'], {
		cwd: root,
		stdio: 'ignore',
	});
	execFileSync('git', ['add', 'package.json'], { cwd: root, stdio: 'ignore' });
	execFileSync('git', ['commit', '-m', 'seed', '--quiet'], {
		cwd: root,
		stdio: 'ignore',
	});
	return root;
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
