/**
 * Integration Hub Example
 *
 * Demonstrates a complete integration platform with connections and sync.
 */

// Domain exports
export * from './integration';
export * from './connection';
export * from './sync';
export { createIntegrationHandlers, type IntegrationHandlers } from './handlers/integration.handlers';
export * from './ui';

// Sync engine exports
export * from './sync-engine';
