import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as z from 'zod';
import { ContractsrcSchema } from '../packages/libs/contracts-spec/src/workspace-config/contractsrc-schema';

type JsonSchemaObject = Record<string, unknown>;

const OUTPUT_PATHS = [
	'packages/apps/cli-contractspec/contractsrc.schema.json',
	'packages/apps-registry/contractspec/contractsrc.schema.json',
	'packages/apps/api-library/src/schemas/contractsrc.json',
];
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..');

export function buildContractsrcJsonSchema(): JsonSchemaObject {
	const schema = z.toJSONSchema(ContractsrcSchema) as JsonSchemaObject;
	const properties =
		(schema.properties as Record<string, unknown> | undefined) ?? {};

	return {
		...schema,
		properties: {
			...properties,
			$schema: {
				type: 'string',
				format: 'uri-reference',
				description:
					'JSON Schema location for editor validation and completions.',
			},
		},
		title: 'ContractSpec CLI Configuration',
		description:
			'Configuration file for ContractSpec CLI and tooling. Supports single projects, monorepos, and meta-repos.',
	};
}

export function writeContractsrcJsonSchemaFiles(): void {
	const content = `${JSON.stringify(buildContractsrcJsonSchema(), null, '\t')}\n`;

	for (const relativePath of OUTPUT_PATHS) {
		const absolutePath = join(REPO_ROOT, relativePath);
		mkdirSync(dirname(absolutePath), { recursive: true });
		writeFileSync(absolutePath, content, 'utf8');
	}

	const formatResult = spawnSync(
		'node',
		[join(REPO_ROOT, 'scripts/biome.cjs'), 'check', '--write', ...OUTPUT_PATHS],
		{
			cwd: REPO_ROOT,
			stdio: 'inherit',
		}
	);

	if (formatResult.status !== 0) {
		throw new Error('Failed to format generated ContractSpec schema files.');
	}
}

if (import.meta.main) {
	writeContractsrcJsonSchemaFiles();
}
