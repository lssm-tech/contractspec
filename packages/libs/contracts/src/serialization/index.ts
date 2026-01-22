/**
 * Serialization types for Server -> Client Component transfer.
 *
 * These types represent plain JSON-serializable versions of spec types,
 * suitable for passing from Server Components to Client Components in Next.js.
 * They strip away class instances (like SchemaModel) and keep only
 * the essential data needed for display.
 */

export * from './types';
export * from './serializers';
