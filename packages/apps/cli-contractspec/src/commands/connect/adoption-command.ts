import { Command } from 'commander';
import {
	runConnectAdoptionResolveCommand,
	runConnectAdoptionSyncCommand,
} from './adoption-actions';
import { runConnectAdoptionHookCommand } from './hook-actions';
import { exitCodeForVerdict } from './io';

export function createAdoptionCommand(input: {
	assertStdin(enabled: boolean | undefined): void;
	runSafely(run: () => Promise<number>): Promise<void>;
}) {
	return new Command('adoption')
		.description('Resolve and sync ContractSpec adoption guidance artifacts')
		.addCommand(
			new Command('sync')
				.description('Mirror the bundled ContractSpec adoption catalog locally')
				.option('--json', 'Output JSON')
				.action((options) =>
					input.runSafely(() => runConnectAdoptionSyncCommand(options))
				)
		)
		.addCommand(
			new Command('resolve')
				.description('Resolve the best adoption candidate for one family')
				.requiredOption(
					'--family <family>',
					'Adoption family: ui, contracts, integrations, runtime, sharedLibs, or solutions'
				)
				.option('--paths <paths...>', 'Relevant workspace paths')
				.option('--stdin', 'Read the adoption query from stdin')
				.option('--json', 'Output JSON')
				.action((options) =>
					input.runSafely(async () => {
						input.assertStdin(options.stdin);
						const verdict = await runConnectAdoptionResolveCommand(options);
						return exitCodeForVerdict(verdict);
					})
				)
		);
}

export function createAdoptionHookCommandGroup(input: {
	assertStdin(enabled: boolean | undefined): void;
	runSafely(run: () => Promise<number>): Promise<void>;
}) {
	return new Command('adoption')
		.description('Runtime interception hooks for adoption-aware reuse checks')
		.addCommand(createAdoptionHookEventCommand(input, 'before-file-edit'))
		.addCommand(createAdoptionHookEventCommand(input, 'before-shell-execution'))
		.addCommand(createAdoptionHookEventCommand(input, 'after-file-edit'));
}

function createAdoptionHookEventCommand(
	input: {
		assertStdin(enabled: boolean | undefined): void;
		runSafely(run: () => Promise<number>): Promise<void>;
	},
	event: 'before-file-edit' | 'before-shell-execution' | 'after-file-edit'
) {
	return new Command(event)
		.description(`Run the adoption ${event} hook`)
		.option('--stdin', 'Read hook payload from stdin')
		.option('--json', 'Output JSON')
		.action((options) =>
			input.runSafely(async () => {
				input.assertStdin(options.stdin);
				return runConnectAdoptionHookCommand({
					event,
					json: options.json,
				});
			})
		);
}
