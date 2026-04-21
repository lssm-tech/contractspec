import { spawnSync } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
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

function formatJsonSchemaContent(content: string): string {
	const tempDir = mkdtempSync(join(tmpdir(), 'contractsrc-schema-'));
	const tempPath = join(tempDir, 'contractsrc.schema.json');

	try {
		writeFileSync(tempPath, content, 'utf8');
		const formatResult = spawnSync(
			'node',
			[join(REPO_ROOT, 'scripts/biome.cjs'), 'check', '--write', tempPath],
			{
				cwd: REPO_ROOT,
				stdio: 'ignore',
			}
		);

		if (formatResult.status !== 0) {
			throw new Error('Failed to format generated ContractSpec schema.');
		}

		return readFileSync(tempPath, 'utf8');
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
}

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
	const content = formatJsonSchemaContent(
		`${JSON.stringify(buildContractsrcJsonSchema(), null, '\t')}\n`
	);

	for (const relativePath of OUTPUT_PATHS) {
		const absolutePath = join(REPO_ROOT, relativePath);
		const current = existsSync(absolutePath)
			? readFileSync(absolutePath, 'utf8')
			: null;
		if (current === content) {
			continue;
		}
		mkdirSync(dirname(absolutePath), { recursive: true });
		writeFileSync(absolutePath, content, 'utf8');
	}
}

if (import.meta.main) {
	writeContractsrcJsonSchemaFiles();
}
