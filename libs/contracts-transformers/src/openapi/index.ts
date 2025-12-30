/**
 * OpenAPI transformation module.
 * Import/export between ContractSpec and OpenAPI 3.x.
 */

// Types
export type {
  OpenApiDocument,
  OpenApiOperation,
  OpenApiSchema,
  OpenApiParameter,
  OpenApiServer,
  OpenApiExportOptions,
  OpenApiParseOptions,
  OpenApiVersion,
  HttpMethod,
  ParameterLocation,
  ParsedOperation,
  ParsedParameter,
  ParseResult,
  OpenApiTransportHints,
  OpenApiSource,
  ContractSpecOpenApiDocument,
} from './types';

// Parser
export {
  parseOpenApi,
  parseOpenApiString,
  parseOpenApiDocument,
  detectFormat,
  detectVersion,
} from './parser';

// Exporter
export {
  openApiForRegistry,
  openApiToJson,
  openApiToYaml,
  defaultRestPath,
  // New unified export functions
  exportContractSpec,
  contractSpecToJson,
  contractSpecToYaml,
  type ContractSpecRegistries,
} from './exporter';

// Modular exporters
export * from './exporter/index';

// Importer
export { importFromOpenApi, importOperation } from './importer';

// Schema converter
export {
  jsonSchemaToType,
  generateSchemaModelCode,
  generateImports,
  getScalarType,
  type TypescriptType,
  type SchemaField,
  type GeneratedModel,
} from './schema-converter';

// Differ
export {
  diffSpecVsOperation,
  diffSpecs,
  createSpecDiff,
  diffAll,
  formatDiffChanges,
  type DiffOptions,
} from './differ';
