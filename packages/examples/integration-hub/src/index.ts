/**
 * Integration Hub Example
 *
 * Demonstrates a complete integration platform with connections and sync.
 */

export * from './connection';
export {
	createIntegrationHandlers,
	type IntegrationHandlers,
} from './handlers/integration.handlers';
// Domain exports
export * from './integration';
// MCP example exports
export * from './mcp-example';
export * from './sync';

// Sync engine exports
export * from './sync-engine';
export * from './ui';
