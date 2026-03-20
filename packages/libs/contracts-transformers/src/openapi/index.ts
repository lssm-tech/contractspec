/**
 * OpenAPI transformation module.
 * Import/export between ContractSpec and OpenAPI 3.x.
 */

// Differ
export {
	createSpecDiff,
	type DiffOptions,
	diffAll,
	diffSpecs,
	diffSpecVsOperation,
	formatDiffChanges,
} from './differ';
// Exporter
export {
	type ContractSpecRegistries,
	contractSpecToJson,
	contractSpecToYaml,
	defaultRestPath,
	// New unified export functions
	exportContractSpec,
	openApiForRegistry,
	openApiToJson,
	openApiToYaml,
} from './exporter';
// Modular exporters
export * from './exporter/index';
// Importer
export { importFromOpenApi, importOperation } from './importer';
// Parser
export {
	detectFormat,
	detectVersion,
	parseOpenApi,
	parseOpenApiDocument,
	parseOpenApiString,
} from './parser';

// Schema converter
export {
	type GeneratedModel,
	generateImports,
	generateSchemaModelCode,
	getScalarType,
	jsonSchemaToType,
	type SchemaField,
	type TypescriptType,
} from './schema-converter';
// Types
export type {
	ContractSpecOpenApiDocument,
	HttpMethod,
	OpenApiDocument,
	OpenApiExportOptions,
	OpenApiOperation,
	OpenApiParameter,
	OpenApiParseOptions,
	OpenApiSchema,
	OpenApiServer,
	OpenApiSource,
	OpenApiTransportHints,
	OpenApiVersion,
	ParameterLocation,
	ParsedOperation,
	ParsedParameter,
	ParseResult,
} from './types';
