import {
	createNodeAdapters,
	createPackageTargetSpecSource,
	ensurePackageScaffold,
} from '@contractspec/bundle.workspace';
import {
	formatFiles,
	getAuthoringTargetDefinition,
} from '@contractspec/module.workspace';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';

type PackageTarget = 'module-bundle' | 'builder-spec' | 'provider-spec';

export async function createModuleBundleSpec(
	options: CreateOptions,
	config: Config
) {
	await createPackageTarget('module-bundle', options, config);
}

export async function createBuilderSpecPackage(
	options: CreateOptions,
	config: Config
) {
	await createPackageTarget('builder-spec', options, config);
}

export async function createProviderSpecPackage(
	options: CreateOptions,
	config: Config
) {
	await createPackageTarget('provider-spec', options, config);
}

async function createPackageTarget(
	target: PackageTarget,
	options: CreateOptions,
	config: Config
) {
	if (options.ai) {
		console.log(
			chalk.yellow(
				`⚠️  AI-assisted ${target} scaffolding is not available yet. Switching to interactive prompts.`
			)
		);
	}

	const definition = getAuthoringTargetDefinition(target);
	const key = await input({
		message: `${definition.title} key:`,
		validate: (value) => value.trim().length > 0 || 'Key is required',
	});
	const title = await input({
		message: `${definition.title} title:`,
		default: key
			.split(/[./-]+/)
			.filter(Boolean)
			.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
			.join(' '),
	});
	const description = await input({
		message: `${definition.title} description:`,
		default: `Scaffolded ${definition.title.toLowerCase()} for ${key}.`,
	});

	const exportName = `${toPascalCase(key)}${target === 'module-bundle' ? 'Bundle' : 'Spec'}`;
	const packageDirName = toKebabCase(key.split('.').pop() ?? key);
	const baseDir = options.outputDir || definition.defaultBaseDir || '.';
	const packageRoot = `${baseDir}/${packageDirName}`;
	const specFilePath =
		target === 'module-bundle'
			? `${packageRoot}/src/bundles/${exportName}.ts`
			: `${packageRoot}/src/${packageDirName}${definition.defaultExtension}`;

	const specCode = createPackageTargetSpecSource({
		target,
		key,
		title,
		description,
		exportName,
	});

	const adapters = createNodeAdapters({ config, silent: true });
	const result = await ensurePackageScaffold(adapters.fs, {
		target,
		specPath: specFilePath,
		specCode,
		overwrite: false,
	});

	if (!options.noFormat) {
		await formatFiles(
			result.created.filter((filePath) => filePath.endsWith('.ts')),
			config.formatter,
			{ type: options.formatter, silent: true }
		);
	}

	console.log(chalk.green(`Scaffold created: ${result.packageRoot}`));
}

function toKebabCase(value: string) {
	return value
		.replace(/\./g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function toPascalCase(value: string) {
	return toKebabCase(value)
		.split('-')
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}
