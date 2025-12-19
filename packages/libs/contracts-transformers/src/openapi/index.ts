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
  OpenApiImportOptions,
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
} from './exporter';

// Importer
export { importFromOpenApi, importOperation } from './importer';

// Schema converter
export {
  jsonSchemaToType,
  jsonSchemaToField,
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
