/**
 * OpenAPI export utilities.
 *
 * @deprecated Import from @contractspec/lib.contracts-transformers/openapi instead.
 * This file is kept for backwards compatibility.
 */

import type { AnySchemaModel } from '@contractspec/lib.schema';
import { compareVersions } from 'compare-versions';
import { defaultRestPath, jsonSchemaForSpec } from './jsonschema';
import type { AnyOperationSpec, OperationSpec } from './operations/';
import type { OperationSpecRegistry } from './operations/registry';

import type { DocBlock } from './docs/types';
export interface OpenApiServer {
	url: string;
	description?: string;
}

export interface OpenApiExportOptions {
	title?: string;
	version?: string;
	description?: string;
	servers?: OpenApiServer[];
}

type OpenApiSchemaObject = Record<string, unknown>;

export interface OpenApiDocument {
	openapi: '3.1.0';
	info: {
		title: string;
		version: string;
		description?: string;
	};
	servers?: OpenApiServer[];
	paths: Record<string, Record<string, unknown>>;
	components: {
		schemas: Record<string, OpenApiSchemaObject>;
	};
}

function toOperationId(name: string, version: string) {
	return `${name.replace(/\./g, '_')}_v${version}`;
}

function toSchemaName(
	prefix: 'Input' | 'Output',
	name: string,
	version: string
) {
	return `${prefix}_${toOperationId(name, version)}`;
}

function toHttpMethod(kind: 'command' | 'query', override?: 'GET' | 'POST') {
	const method = override ?? (kind === 'query' ? 'GET' : 'POST');
	return method.toLowerCase();
}

function toRestPath(spec: AnyOperationSpec): string {
	const path =
		spec.transport?.rest?.path ??
		defaultRestPath(spec.meta.key, spec.meta.version);
	return path.startsWith('/') ? path : `/${path}`;
}

export function openApiForRegistry(
	registry: OperationSpecRegistry,
	options: OpenApiExportOptions = {}
): OpenApiDocument {
	const specs = registry
		.list()
		.filter(
			(s): s is AnyOperationSpec =>
				s.meta.kind === 'command' || s.meta.kind === 'query'
		)
		.slice()
		.sort((a, b) => {
			const byName = a.meta.key.localeCompare(b.meta.key);
			return byName !== 0
				? byName
				: compareVersions(a.meta.version, b.meta.version);
		});

	const doc: OpenApiDocument = {
		openapi: '3.1.0',
		info: {
			title: options.title ?? 'ContractSpec API',
			version: options.version ?? '0.0.0',
			...(options.description ? { description: options.description } : {}),
		},
		...(options.servers ? { servers: options.servers } : {}),
		paths: {},
		components: { schemas: {} },
	};

	for (const spec of specs) {
		const schema = jsonSchemaForSpec(
			spec as unknown as OperationSpec<AnySchemaModel, AnySchemaModel>
		);
		const method = toHttpMethod(spec.meta.kind, spec.transport?.rest?.method);
		const path = toRestPath(spec);

		const operationId = toOperationId(spec.meta.key, spec.meta.version);

		const pathItem = (doc.paths[path] ??= {});
		const op: Record<string, unknown> = {
			operationId,
			summary: spec.meta.description ?? spec.meta.key,
			description: spec.meta.description,
			tags: spec.meta.tags ?? [],
			'x-contractspec': {
				name: spec.meta.key,
				version: spec.meta.version,
				kind: spec.meta.kind,
			},
			responses: {},
		};

		if (schema.input) {
			const inputName = toSchemaName('Input', spec.meta.key, spec.meta.version);
			doc.components.schemas[inputName] = schema.input as OpenApiSchemaObject;
			op['requestBody'] = {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: `#/components/schemas/${inputName}` },
					},
				},
			};
		}

		const responses: Record<string, unknown> = {};
		if (schema.output) {
			const outputName = toSchemaName(
				'Output',
				spec.meta.key,
				spec.meta.version
			);
			doc.components.schemas[outputName] = schema.output as OpenApiSchemaObject;
			responses['200'] = {
				description: 'OK',
				content: {
					'application/json': {
						schema: { $ref: `#/components/schemas/${outputName}` },
					},
				},
			};
		} else {
			responses['200'] = { description: 'OK' };
		}
		op['responses'] = responses;

		pathItem[method] = op;
	}

	return doc;
}

export const tech_contracts_openapi_export_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.openapi-export',
		title: 'OpenAPI export (OpenAPI 3.1) from OperationSpecRegistry',
		summary:
			'Generate a deterministic OpenAPI document from a OperationSpecRegistry using jsonSchemaForSpec + REST transport metadata.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/openapi-export',
		tags: ['contracts', 'openapi', 'rest'],
		body: `## OpenAPI export (OpenAPI 3.1) from OperationSpecRegistry

### Purpose

ContractSpec specs can be exported into an **OpenAPI 3.1** document for tooling (SDK generation, docs, gateways).

The export is **spec-first**:

- Uses \`jsonSchemaForSpec(spec)\` for input/output JSON Schema (from SchemaModel → zod → JSON Schema)
- Uses \`spec.transport.rest.method/path\` when present
- Falls back to deterministic defaults:
  - Method: \`POST\` for commands, \`GET\` for queries
  - Path: \`defaultRestPath(name, version)\` → \`/<dot/name>/v<version>\`

### Library API

- Function: \`openApiForRegistry(registry, options?)\`
- Location: \`@contractspec/lib.contracts-spec/openapi\`

### CLI

Export OpenAPI from a registry module:

\`\`\`bash
contractspec openapi --registry ./src/registry.ts --out ./openapi.json
\`\`\`

The registry module must export one of:

- \`registry: OperationSpecRegistry\`
- \`default(): OperationSpecRegistry | Promise<OperationSpecRegistry>\`
- \`createRegistry(): OperationSpecRegistry | Promise<OperationSpecRegistry>\`

### Notes / limitations (current)

- Responses are generated as a basic \`200\` response (plus schemas when available).
- Query (GET) inputs are currently represented as a JSON request body when an input schema exists.
- Errors are not yet expanded into OpenAPI responses; that will be added when we standardize error envelopes.`,
	},
];
