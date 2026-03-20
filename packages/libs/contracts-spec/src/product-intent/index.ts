/**
 * Bundle module combining the product intent spec, registry, runtime
 * and utility functions. This file re-exports everything in one
 * convenient place so that consumers can import from a single
 * module rather than pulling pieces from different packages.
 */

export * from './findings';
export * from './problems';
export * from './registry';
export * from './runtime';
export * from './spec';
export * from './tickets';
// Core contracts layer exports
export * from './types';
