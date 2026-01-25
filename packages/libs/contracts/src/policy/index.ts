export * from './engine';
export * from './opa-adapter';
export * from './spec';
export * from './registry';
export * from './context';
export * from './guards';
export * from './validation';

import type { PolicySpec } from './spec';

/**
 * Helper to define a Policy.
 */
export const definePolicy = (spec: PolicySpec): PolicySpec => spec;
