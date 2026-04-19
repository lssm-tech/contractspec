import {
	type DocBlock,
	registerDocBlocks,
} from '@contractspec/lib.contracts-spec/docs';
import chalk from 'chalk';
import { Command } from 'commander';
import {
	runBuilderComparisonStatusCommand,
	runBuilderInitCommand,
	runBuilderLocalRegisterCommand,
	runBuilderLocalStatusCommand,
	runBuilderMobileStatusCommand,
	runBuilderStatusCommand,
} from './actions';

function handleBuilderCommandError(error: unknown): never {
	const message = error instanceof Error ? error.message : String(error);
	console.error(chalk.red('\n❌ Builder command failed:'), message);
	process.exit(1);
}

function withBuilderCommandErrorHandling<T>(
	handler: (options: T) => Promise<void>
) {
	return async (options: T) => {
		try {
			await handler(options);
		} catch (error) {
			handleBuilderCommandError(error);
		}
	};
}

export const builderCommand = new Command('builder')
	.description(
		'Bootstrap and inspect Builder workspaces through the Builder control-plane API'
	)
	.addCommand(
		new Command('init')
			.description('Apply the canonical Builder workspace bootstrap preset')
			.requiredOption('--workspace-id <workspaceId>', 'Workspace id')
			.option('--preset <preset>', 'Bootstrap preset', 'managed-mvp')
			.option('--json', 'Output JSON')
			.action(
				withBuilderCommandErrorHandling(async (options) => {
					await runBuilderInitCommand(options);
				})
			)
	)
	.addCommand(
		new Command('status')
			.description('Inspect Builder bootstrap, preview, and export status')
			.requiredOption('--workspace-id <workspaceId>', 'Workspace id')
			.option('--json', 'Output JSON')
			.action(
				withBuilderCommandErrorHandling(async (options) => {
					await runBuilderStatusCommand(options);
				})
			)
	)
	.addCommand(
		new Command('mobile-status')
			.description(
				'Inspect mobile parity coverage and channel-vs-deep-link posture'
			)
			.requiredOption('--workspace-id <workspaceId>', 'Workspace id')
			.option('--json', 'Output JSON')
			.action(
				withBuilderCommandErrorHandling(async (options) => {
					await runBuilderMobileStatusCommand(options);
				})
			)
	)
	.addCommand(
		new Command('comparison-status')
			.description(
				'Inspect comparison policy posture and recent comparison activity'
			)
			.requiredOption('--workspace-id <workspaceId>', 'Workspace id')
			.option('--json', 'Output JSON')
			.action(
				withBuilderCommandErrorHandling(async (options) => {
					await runBuilderComparisonStatusCommand(options);
				})
			)
	)
	.addCommand(
		new Command('local')
			.description('Register and inspect local daemon runtime targets')
			.addCommand(
				new Command('register')
					.description('Register a local daemon runtime target')
					.requiredOption('--workspace-id <workspaceId>', 'Workspace id')
					.option('--runtime-id <runtimeId>', 'Runtime target id')
					.option('--granted-to <grantedTo>', 'Lease target identifier')
					.option('--provider <provider...>', 'Available provider ids')
					.option('--json', 'Output JSON')
					.action(
						withBuilderCommandErrorHandling(async (options) => {
							await runBuilderLocalRegisterCommand(options);
						})
					)
			)
			.addCommand(
				new Command('status')
					.description('Inspect local daemon runtime status')
					.requiredOption('--workspace-id <workspaceId>', 'Workspace id')
					.option('--json', 'Output JSON')
					.action(
						withBuilderCommandErrorHandling(async (options) => {
							await runBuilderLocalStatusCommand(options);
						})
					)
			)
	);

export const builderCommandDocBlock = {
	id: 'cli.builder',
	title: 'contractspec builder Command',
	kind: 'usage',
	visibility: 'public',
	route: '/docs/cli/builder',
	tags: ['cli', 'builder', 'operators'],
	body: '# contractspec builder\n\nBootstrap and inspect Builder workspaces through the Builder control-plane API.\n\nBuilder commands resolve the API base URL from `CONTRACTSPEC_API_BASE_URL`, then `.contractsrc.json` `builder.api.baseUrl`, then `https://api.contractspec.io`. Authentication comes from the configured control-plane token environment variable.\n\n```bash\ncontractspec builder init --workspace-id ws-demo --preset managed-mvp\ncontractspec builder status --workspace-id ws-demo\ncontractspec builder mobile-status --workspace-id ws-demo\ncontractspec builder local register --workspace-id ws-demo --runtime-id rt-local-1 --granted-to operator_1\ncontractspec builder local status --workspace-id ws-demo\ncontractspec builder comparison-status --workspace-id ws-demo\n```',
} satisfies DocBlock;

registerDocBlocks([builderCommandDocBlock]);
