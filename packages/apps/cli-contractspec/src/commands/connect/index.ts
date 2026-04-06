import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';
import chalk from 'chalk';
import { Command } from 'commander';
import {
	runConnectContextCommand,
	runConnectEvalCommand,
	runConnectInitCommand,
	runConnectPlanCommand,
	runConnectReplayCommand,
	runConnectReviewListCommand,
	runConnectVerifyCommand,
} from './actions';
import { runConnectContractsSpecHookCommand } from './hook-actions';
import { connectErrorExitCode, exitCodeForVerdict } from './io';

export const connectCommand = new Command('connect')
	.description('Emit and inspect local Connect adapter artifacts')
	.addCommand(createInitCommand())
	.addCommand(createContextCommand())
	.addCommand(createPlanCommand())
	.addCommand(createVerifyCommand())
	.addCommand(createHookCommand())
	.addCommand(createReviewCommand())
	.addCommand(createReplayCommand())
	.addCommand(createEvalCommand());

function createInitCommand() {
	return new Command('init')
		.description(
			'Enable Connect in .contractsrc.json and create local artifact directories'
		)
		.option('--scope <scope>', 'Configuration scope: workspace or package')
		.option('--json', 'Output JSON')
		.action((options) => runSafely(() => runConnectInitCommand(options)));
}

function createContextCommand() {
	return new Command('context')
		.description(
			'Project a task-scoped ContextPack from current workspace state'
		)
		.requiredOption('--task <taskId>', 'Task identifier')
		.option('--baseline <ref>', 'Git baseline for changed-path resolution')
		.option('--paths <paths...>', 'Explicit changed paths')
		.option('--actor-id <actorId>', 'Actor id')
		.option('--actor-type <actorType>', 'Actor type')
		.option('--session-id <sessionId>', 'Session id')
		.option('--trace-id <traceId>', 'Trace id')
		.option('--json', 'Output JSON')
		.action((options) => runSafely(() => runConnectContextCommand(options)));
}

function createPlanCommand() {
	return new Command('plan')
		.description('Compile a Connect PlanPacket from stdin text or JSON')
		.requiredOption('--task <taskId>', 'Task identifier')
		.option('--baseline <ref>', 'Git baseline for changed-path resolution')
		.option('--paths <paths...>', 'Explicit changed paths')
		.option('--actor-id <actorId>', 'Actor id')
		.option('--actor-type <actorType>', 'Actor type')
		.option('--session-id <sessionId>', 'Session id')
		.option('--trace-id <traceId>', 'Trace id')
		.option('--stdin', 'Read candidate input from stdin')
		.option('--json', 'Output JSON')
		.action((options) =>
			runSafely(async () => {
				assertStdin(options.stdin);
				return runConnectPlanCommand(options);
			})
		);
}

function createVerifyCommand() {
	return new Command('verify')
		.description('Verify one ACP-normalized file or command mutation candidate')
		.requiredOption('--task <taskId>', 'Task identifier')
		.requiredOption(
			'--tool <tool>',
			'ACP tool key: acp.fs.access or acp.terminal.exec'
		)
		.option('--baseline <ref>', 'Git baseline for impact detection')
		.option(
			'--paths <paths...>',
			'Explicit changed paths for command verification'
		)
		.option('--actor-id <actorId>', 'Actor id')
		.option('--actor-type <actorType>', 'Actor type')
		.option('--session-id <sessionId>', 'Session id')
		.option('--trace-id <traceId>', 'Trace id')
		.option('--stdin', 'Read mutation candidate from stdin')
		.option('--json', 'Output JSON')
		.action((options) =>
			runSafely(async () => {
				assertStdin(options.stdin);
				const verdict = await runConnectVerifyCommand(options);
				return exitCodeForVerdict(verdict);
			})
		);
}

function createHookCommand() {
	return new Command('hook')
		.description('Run host-facing Connect interception flows')
		.addCommand(
			new Command('contracts-spec')
				.description('Runtime interception hooks for contracts-spec work')
				.addCommand(createContractsSpecHookEventCommand('before-file-edit'))
				.addCommand(
					createContractsSpecHookEventCommand('before-shell-execution')
				)
				.addCommand(createContractsSpecHookEventCommand('after-file-edit'))
		);
}

function createContractsSpecHookEventCommand(
	event: 'before-file-edit' | 'before-shell-execution' | 'after-file-edit'
) {
	return new Command(event)
		.description(`Run the contracts-spec ${event} hook`)
		.option('--stdin', 'Read hook payload from stdin')
		.option('--json', 'Output JSON')
		.action((options) =>
			runSafely(async () => {
				assertStdin(options.stdin);
				return runConnectContractsSpecHookCommand({
					event,
					json: options.json,
				});
			})
		);
}

function createReviewCommand() {
	return new Command('review')
		.description('Inspect local review packets')
		.addCommand(
			new Command('list')
				.description('List pending local review packets')
				.option('--json', 'Output JSON')
				.action((options) =>
					runSafely(() => runConnectReviewListCommand(options))
				)
		);
}

function createReplayCommand() {
	return new Command('replay')
		.argument('<decisionId>')
		.description(
			'Reconstruct a stored Connect decision and optional trace replay'
		)
		.option('--json', 'Output JSON')
		.action((decisionId, options) =>
			runSafely(() => runConnectReplayCommand(decisionId, options))
		);
}

function createEvalCommand() {
	return new Command('eval')
		.argument('<decisionId>')
		.description('Run harness evaluation for one stored Connect decision')
		.requiredOption('--registry <path>', 'Path to the harness registry module')
		.option('--scenario <key>', 'Harness scenario key')
		.option('--suite <key>', 'Harness suite key')
		.option('--version <version>', 'Scenario or suite version')
		.option('--json', 'Output JSON')
		.action((decisionId, options) =>
			runSafely(() => runConnectEvalCommand(decisionId, options))
		);
}

async function runSafely(run: () => Promise<number>) {
	try {
		const code = await run();
		if (code !== 0) {
			process.exit(code);
		}
	} catch (error) {
		console.error(
			chalk.red('\n❌ Error:'),
			error instanceof Error ? error.message : String(error)
		);
		process.exit(connectErrorExitCode(error));
	}
}

function assertStdin(enabled: boolean | undefined) {
	if (!enabled) {
		throw new Error('Pass --stdin to provide input through stdin.');
	}
}

export const connectCommandDocBlock = {
	id: 'cli.connect',
	title: 'contractspec connect Command',
	kind: 'usage',
	visibility: 'public',
	route: '/docs/cli/connect',
	tags: ['cli', 'connect', 'operators'],
	body: '# contractspec connect\n\nEmit task context, plans, verdicts, review packets, replay/evaluation artifacts, and host hook flows through the main CLI.\n\n```bash\ncontractspec connect init --scope workspace\ncontractspec connect context --task task-1 --paths src/foo.ts --json\ncontractspec connect plan --task task-1 --stdin --json\ncontractspec connect verify --task task-1 --tool acp.fs.access --stdin --json\ncontractspec connect hook contracts-spec before-file-edit --stdin\ncontractspec connect review list --json\ncontractspec connect replay <decisionId> --json\ncontractspec connect eval <decisionId> --registry ./harness-registry.ts --scenario connect.safe-refactor --json\n```',
} satisfies DocBlock;

registerDocBlocks([connectCommandDocBlock]);
