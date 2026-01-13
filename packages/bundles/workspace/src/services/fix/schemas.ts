import { z } from 'zod';

/**
 * Schema for parsing CI output JSON file.
 * Handles both direct array and nested { issues: [...] } formats.
 */
export const CiOutputSchema = z.union([
  z.array(z.unknown()),
  z.object({ issues: z.array(z.unknown()) }).transform((data) => data.issues),
]);

export type CiOutput = z.infer<typeof CiOutputSchema>;
