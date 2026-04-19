import {
	type ContractRegistryItem,
	isContractSpecType,
} from '@contractspec/lib.contracts-spec';
import {
	type AuthoringContractSpecType,
	getAuthoringTargetDefaultExtension,
	getAuthoringTargetDefaultFileName,
	getAuthoringTargetDefaultSubdirectory,
} from '@contractspec/module.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import { join, resolve } from 'path';
import { type Config, loadConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';
import { ensureDir, writeFileSafe } from '../../utils/fs';
import { RegistryClient, resolveRegistryUrl } from './client';

function stripJsonSuffix(nameOrNameJson: string): string {
	return nameOrNameJson.endsWith('.json')
		? nameOrNameJson.slice(0, -'.json'.length)
		: nameOrNameJson;
}

function toKebab(value: string): string {
	return value
		.replace(/\./g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function isRegistryFileTarget(
	specType: string
): specType is AuthoringContractSpecType {
	return (
		isContractSpecType(specType) &&
		specType !== 'type' &&
		specType !== 'knowledge-space'
	);
}

function defaultOutDirForType(
	specType: string,
	config: Pick<Config, 'outputDir' | 'conventions'>,
	kind: 'command' | 'query'
): string {
	const base = config.outputDir || './src';
	if (isRegistryFileTarget(specType)) {
		return join(
			base,
			getAuthoringTargetDefaultSubdirectory(specType, config.conventions, {
				operationKind: kind,
			})
		);
	}

	return join(base, specType);
}

function defaultFileNameForType(
	specType: string,
	key: string,
	kind: 'command' | 'query'
): string {
	if (isRegistryFileTarget(specType)) {
		return getAuthoringTargetDefaultFileName(specType, key, {
			operationKind: kind,
		});
	}

	if (specType === 'template') {
		return `${toKebab(key)}.template.json`;
	}

	return `${toKebab(key)}${getAuthoringTargetDefaultExtension('example')}`;
}

interface RegistryAddOptions {
	registryUrl?: string;
	outDir?: string;
	kind?: 'command' | 'query';
}

export const registryAddCommand = new Command('add')
	.description('Add a registry item to the current project')
	.argument('<type>', 'Item type (operation, event, template, ...)')
	.argument('<name>', 'Item name (e.g., user.signup)')
	.option('--registry-url <url>', 'Registry server base URL')
	.option('--out-dir <dir>', 'Override output directory')
	.option(
		'--kind <kind>',
		'For operations only: command | query (default: command)'
	)
	.action(async (type: string, name: string, options: RegistryAddOptions) => {
		try {
			const config = await loadConfig();
			const registryUrl = resolveRegistryUrl(
				options.registryUrl as string | undefined
			);
			const client = new RegistryClient({ registryUrl });

			const item = await client.getJson<ContractRegistryItem>(
				`/r/contractspec/${type}/${stripJsonSuffix(name)}.json`
			);

			const kind =
				(options.kind as 'command' | 'query' | undefined) ?? 'command';

			const outDir =
				(options.outDir as string | undefined) ??
				defaultOutDirForType(type, config, kind);

			const absoluteOutDir = resolve(process.cwd(), outDir);
			await ensureDir(absoluteOutDir);

			// If registry provides explicit targets, honor them. Otherwise:
			// - if single file: write a deterministic spec filename
			// - if multi file: write into .contractspec/registry/<type>/<name> to avoid collisions
			const filesWithContent = item.files.filter(
				(f): f is { path: string; type: string; content: string } =>
					typeof f.content === 'string'
			);

			if (filesWithContent.length === 0) {
				throw new Error(
					`Registry item ${type}/${name} has no inline file contents to install`
				);
			}

			if (filesWithContent[0]) {
				const fileName = defaultFileNameForType(type, item.key, kind);
				const target = join(absoluteOutDir, fileName);
				await writeFileSafe(target, filesWithContent[0].content);

				console.log(
					chalk.green(`✅ Installed ${type}/${item.key} → ${target}`)
				);
				return;
			}

			const multiRoot = resolve(
				process.cwd(),
				'.contractspec/registry',
				type,
				item.key.replace(/\./g, '-')
			);
			await ensureDir(multiRoot);

			for (const f of filesWithContent) {
				const base = f.path.split('/').pop() || 'file.ts';
				const target = join(multiRoot, base);
				await writeFileSafe(target, f.content);
			}

			console.log(
				chalk.green(
					`✅ Installed ${type}/${item.key} (${filesWithContent.length} files) → ${multiRoot}`
				)
			);

			console.log(
				chalk.gray(
					'Note: multi-file items are staged under .contractspec/registry/; you can move them into your app structure.'
				)
			);
		} catch (error) {
			console.error(
				chalk.red(`Registry add failed: ${getErrorMessage(error)}`)
			);
			process.exit(1);
		}
	});
