/**
 * Quickstart dependencies configuration.
 *
 * Defines the minimal and full sets of packages needed
 * for ContractSpec to work.
 */

import type { QuickstartDependency } from './types';

/**
 * Minimal dependencies required for ContractSpec to work.
 *
 * This is the absolute minimum needed to define and use contracts.
 */
export const MINIMAL_DEPENDENCIES: QuickstartDependency[] = [
  {
    name: '@contractspec/lib.contracts',
    description:
      'Core ContractSpec library for defining commands, queries, and events',
  },
  {
    name: 'zod',
    description: 'Schema validation library (peer dependency)',
  },
];

/**
 * Full dependencies for a complete ContractSpec setup.
 *
 * Includes development tools and extended libraries.
 */
export const FULL_DEPENDENCIES: QuickstartDependency[] = [
  // Core dependencies (from minimal)
  ...MINIMAL_DEPENDENCIES,
  // Extended schema utilities
  {
    name: '@contractspec/lib.schema',
    description: 'Extended schema utilities and common types',
  },
  // Development tools
  {
    name: '@contractspec/app.cli-contractspec',
    dev: true,
    description:
      'ContractSpec CLI for validation, scaffolding, and code generation',
  },
  {
    name: 'typescript',
    dev: true,
    description: 'TypeScript compiler for type checking',
  },
];

/**
 * Get dependencies for the specified mode.
 */
export function getDependencies(
  mode: 'minimal' | 'full'
): QuickstartDependency[] {
  return mode === 'minimal' ? MINIMAL_DEPENDENCIES : FULL_DEPENDENCIES;
}

/**
 * Get production dependencies (non-dev).
 */
export function getProductionDependencies(
  dependencies: QuickstartDependency[]
): QuickstartDependency[] {
  return dependencies.filter((dep) => !dep.dev);
}

/**
 * Get development dependencies.
 */
export function getDevDependencies(
  dependencies: QuickstartDependency[]
): QuickstartDependency[] {
  return dependencies.filter((dep) => dep.dev);
}
