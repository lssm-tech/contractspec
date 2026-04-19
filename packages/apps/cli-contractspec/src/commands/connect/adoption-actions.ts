import { adoption } from '@contractspec/bundle.workspace';
import { printConnectResult } from './artifacts';
import {
	parseJsonOrText,
	readRequiredStdin,
	requireNonEmptyString,
} from './io';
import { createConnectCommandContext } from './runtime';

export async function runConnectAdoptionSyncCommand(options: {
	json?: boolean;
}) {
	const ctx = await createConnectCommandContext(options);
	const result = await adoption.syncAdoptionCatalog(
		{ fs: ctx.adapters.fs },
		{
			config: ctx.config,
			cwd: ctx.cwd,
			packageRoot: ctx.config.packageRoot,
			workspaceRoot: ctx.config.workspaceRoot,
		}
	);
	printConnectResult(
		options.json,
		result,
		`Adoption catalog synced: ${result.catalogPath}`
	);
	return 0;
}

export async function runConnectAdoptionResolveCommand(options: {
	family: adoption.AdoptionFamily;
	json?: boolean;
	paths?: string[];
}) {
	const ctx = await createConnectCommandContext(options);
	const parsed = parseJsonOrText(await readRequiredStdin());
	const query =
		typeof parsed === 'string'
			? parsed
			: requireNonEmptyString(
					String(parsed['query'] ?? options.family),
					'Adoption query'
				);
	const result = await adoption.resolveAdoption(
		{ fs: ctx.adapters.fs },
		{
			config: ctx.config,
			cwd: ctx.cwd,
			family: options.family,
			packageRoot: ctx.config.packageRoot,
			paths:
				typeof parsed === 'string'
					? options.paths
					: Array.isArray(parsed['paths'])
						? (parsed['paths'] as string[])
						: options.paths,
			platform:
				typeof parsed === 'string'
					? undefined
					: typeof parsed['platform'] === 'string'
						? parsed['platform']
						: undefined,
			query,
			runtime:
				typeof parsed === 'string'
					? undefined
					: typeof parsed['runtime'] === 'string'
						? parsed['runtime']
						: undefined,
			symbol:
				typeof parsed === 'string'
					? undefined
					: typeof parsed['symbol'] === 'string'
						? parsed['symbol']
						: undefined,
			workspaceRoot: ctx.config.workspaceRoot,
		}
	);
	printConnectResult(
		options.json,
		result,
		result.selected
			? `${result.verdict}: ${result.selected.candidate.title}`
			: result.reason
	);
	return result.verdict;
}
