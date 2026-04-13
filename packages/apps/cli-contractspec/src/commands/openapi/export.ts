import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadAuthoredModuleValue } from '@contractspec/bundle.workspace';
import {
	type OpenApiServer,
	openApiForRegistry,
} from '@contractspec/lib.contracts-spec/openapi';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations';
import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';

interface ExportOptions {
	registry?: string;
	out?: string;
	format?: string;
	title?: string;
	version?: string;
	description?: string;
	server?: string;
	json?: boolean;
}

async function loadRegistry(
	modulePath: string
): Promise<OperationSpecRegistry> {
	return loadAuthoredModuleValue(modulePath, {
		description: 'OperationSpecRegistry',
		isValue: (value): value is OperationSpecRegistry =>
			value instanceof OperationSpecRegistry,
		instanceKeys: ['registry'],
		factoryKeys: ['createRegistry', 'default'],
	});
}

/**
 * Export ContractSpec specs to OpenAPI document.
 */
export const exportCommand = new Command('export')
	.description('Export specs to an OpenAPI 3.1 document')
	.option(
		'--registry <path>',
		'Path to a module exporting a OperationSpecRegistry (or factory)'
	)
	.option('--out <path>', 'Write output to a file')
	.option('--format <format>', 'Output format: json or yaml', 'json')
	.option('--title <title>', 'OpenAPI title')
	.option('--version <version>', 'OpenAPI version')
	.option('--description <description>', 'OpenAPI description')
	.option('--server <url>', 'Add a single server URL')
	.option('--json', 'Print JSON to stdout (also writes file if --out is set)')
	.action(async (options: ExportOptions) => {
		try {
			const config = await loadConfig();
			const exportConfig = config.openapi?.export;

			// Registry path is required
			const registryPath = options.registry;
			if (!registryPath) {
				console.error(
					chalk.red('Error: --registry option is required for export')
				);
				process.exit(1);
			}

			const registry = await loadRegistry(resolve(process.cwd(), registryPath));

			// Merge config with CLI options
			const serverUrl = options.server ?? exportConfig?.servers?.[0]?.url;
			const servers: OpenApiServer[] | undefined = serverUrl
				? [{ url: serverUrl }]
				: undefined;

			const doc = openApiForRegistry(registry, {
				title: options.title ?? exportConfig?.title ?? 'ContractSpec API',
				version: options.version ?? exportConfig?.version ?? '1.0.0',
				description: options.description ?? exportConfig?.description,
				servers,
			});

			const format = options.format ?? exportConfig?.format ?? 'json';
			const content =
				format === 'yaml'
					? jsonToYaml(doc)
					: JSON.stringify(doc, null, 2) + '\n';

			const outPath =
				options.out ?? exportConfig?.outputPath ?? './openapi.json';
			const resolvedPath = resolve(process.cwd(), outPath);

			await writeFile(resolvedPath, content, 'utf8');
			console.log(chalk.green(`✅ OpenAPI written to ${resolvedPath}`));

			if (options.json) {
				console.log(content);
			}
		} catch (error) {
			console.error(
				chalk.red(`OpenAPI export failed: ${getErrorMessage(error)}`)
			);
			process.exit(1);
		}
	});

/**
 * Simple JSON to YAML conversion.
 */
function jsonToYaml(obj: unknown, indent = 0): string {
	const spaces = '  '.repeat(indent);
	let yaml = '';

	if (Array.isArray(obj)) {
		for (const item of obj) {
			if (typeof item === 'object' && item !== null) {
				yaml += `${spaces}-\n${jsonToYaml(item, indent + 1)}`;
			} else {
				yaml += `${spaces}- ${JSON.stringify(item)}\n`;
			}
		}
	} else if (typeof obj === 'object' && obj !== null) {
		for (const [key, value] of Object.entries(obj)) {
			if (Array.isArray(value)) {
				yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
			} else if (typeof value === 'object' && value !== null) {
				yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
			} else {
				yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
			}
		}
	}

	return yaml;
}
