import { z } from 'zod';

/**
 * Validate that a string is a valid TypeScript identifier
 */
export function isValidIdentifier(str: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
}

/**
 * Validate that a string is a valid dot-notation name (e.g., "user.signup")
 */
export function isValidDotName(str: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(str);
}

/**
 * Validate version number
 */
export function isValidVersion(version: number): boolean {
  return Number.isInteger(version) && version > 0;
}

/**
 * Validate email format
 */
export const emailSchema = z.string().email();

/**
 * Validate URL format
 */
export const urlSchema = z.string().url();

/**
 * Common validation schemas
 */
export const validators = {
  specName: z.string().refine(isValidDotName, {
    message: 'Must be valid dot notation (e.g., "domain.operation")',
  }),
  version: z.number().int().positive(),
  identifier: z.string().refine(isValidIdentifier, {
    message: 'Must be a valid TypeScript identifier',
  }),
  owner: z.string().startsWith('@'),
  tag: z.string().min(1),
};

