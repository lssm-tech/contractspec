/**
 * @lssm/lib.contracts-transformers
 *
 * Contract format transformations: bidirectional import/export between
 * ContractSpec and external API specification formats.
 *
 * @example
 * ```typescript
 * // Export to OpenAPI
 * import { openApiForRegistry } from '@lssm/lib.contracts-transformers/openapi';
 *
 * // Import from OpenAPI
 * import { parseOpenApi, importFromOpenApi } from '@lssm/lib.contracts-transformers/openapi';
 * ```
 */

// Re-export all modules
export * from './openapi';
export * from './common';
