import * as z from 'zod';
import { type OwnerShipMeta } from './ownership';

export type PromptStability = 'experimental' | 'beta' | 'stable' | 'deprecated';

/** Parameter definition for a prompt argument. */
export interface PromptArg {
  name: string;
  description?: string;
  required?: boolean;
  schema: z.ZodType; // zod schema for this argument
  completeWith?: string; // optional completion source name
}

/**
 * Rendered content part for a prompt. Clients (MCP) can fetch referenced resources.
 */
export type PromptContentPart =
  | { type: 'text'; text: string }
  | { type: 'resource'; uri: string; title?: string };

/** Prompt metadata for discoverability and governance. */
export type PromptMeta = OwnerShipMeta;

/** Policy constraints for prompts (flags, PII paths, rate limits). */
export interface PromptPolicy {
  flags?: string[];
  pii?: string[]; // JSON-like paths within args to redact in logs/prompts
  rateLimit?: { rpm: number; key: 'user' | 'org' | 'global' };
}

/** Full prompt specification including args schema and render function. */
export interface PromptSpec<I extends z.ZodType> {
  meta: PromptMeta;
  args: PromptArg[];
  input: I; // full args object schema (zod)
  policy?: PromptPolicy;

  /** Render MCP-friendly content parts. DO NOT perform side effects here. */
  render: (
    args: z.infer<I>,
    ctx: {
      userId?: string | null;
      orgId?: string | null;
      locale?: string;
      link: (template: string, vars: Record<string, string | number>) => string;
    }
  ) => Promise<PromptContentPart[]>;
}

/** Identity helper that preserves generic inference when declaring prompts. */
export function definePrompt<I extends z.ZodType>(
  spec: PromptSpec<I>
): PromptSpec<I> {
  return spec;
}
