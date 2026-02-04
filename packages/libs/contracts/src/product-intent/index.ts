/**
 * Bundle module combining the product intent spec, registry, runtime
 * and utility functions. This file re‑exports everything in one
 * convenient place so that consumers can import from a single
 * module rather than pulling pieces from different packages.
 */

// Core contracts layer exports
export * from './types';
export * from './spec';
export * from './registry';
export * from './runtime';
