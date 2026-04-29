export * from './context';
export * from './engine';
export * from './guards';
export * from './opa-adapter';
export * from './registry';
export * from './requirements';
export * from './spec';
export * from './validation';

import type { PolicySpec } from './spec';

/**
 * Helper to define a Policy.
 */
export const definePolicy = (spec: PolicySpec): PolicySpec => spec;
