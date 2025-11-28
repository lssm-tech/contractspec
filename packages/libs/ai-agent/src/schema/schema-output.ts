import { Output } from 'ai';
import { z, type ZodType } from 'zod';
import { jsonSchemaToZod } from './json-schema-to-zod';

/**
 * Bridge between ContractSpec SchemaModel and AI SDK Output.
 *
 * This module provides utilities to convert ContractSpec schema definitions
 * to AI SDK v6 Output.* structured output configurations.
 */

// Extract return types from Output functions for explicit type annotations
type ObjectOutputReturn = ReturnType<typeof Output.object>;
type ArrayOutputReturn = ReturnType<typeof Output.array>;
type ChoiceOutputReturn = ReturnType<typeof Output.choice>;
type TextOutputReturn = ReturnType<typeof Output.text>;

/**
 * Create an AI SDK Output.object from a JSON Schema.
 *
 * @param schema - JSON Schema object
 * @returns AI SDK Output configuration
 */
export function jsonSchemaToOutput(
  schema: Record<string, unknown>
): ObjectOutputReturn {
  const zodSchema = jsonSchemaToZod(schema);
  return Output.object({
    schema: zodSchema,
  });
}

/**
 * Create an AI SDK Output.array from a JSON Schema items definition.
 *
 * @param itemSchema - JSON Schema for array items
 * @returns AI SDK Output configuration
 */
export function jsonSchemaToArrayOutput(
  itemSchema: Record<string, unknown>
): ArrayOutputReturn {
  const zodSchema = jsonSchemaToZod(itemSchema);
  return Output.array({
    element: zodSchema,
  });
}

/**
 * Create an AI SDK Output.choice from enum values.
 *
 * @param choices - Array of choice values
 * @returns AI SDK Output configuration
 */
export function enumToChoiceOutput(choices: string[]): ChoiceOutputReturn {
  return Output.choice({
    options: choices as [string, ...string[]],
  });
}

/**
 * Create an AI SDK Output from a Zod schema directly.
 *
 * @param schema - Zod schema
 * @returns AI SDK Output configuration
 */
export function zodToOutput<T extends ZodType>(schema: T): ObjectOutputReturn {
  return Output.object({
    schema,
  });
}

/**
 * Create a simple text output configuration.
 *
 * @returns AI SDK Output configuration for text
 */
export function textOutput(): TextOutputReturn {
  return Output.text();
}

/**
 * Output builder that can be used fluently.
 */
export const SchemaOutput = {
  /**
   * Create an object output from JSON Schema.
   */
  fromJsonSchema: jsonSchemaToOutput,

  /**
   * Create an array output from JSON Schema.
   */
  arrayFromJsonSchema: jsonSchemaToArrayOutput,

  /**
   * Create a choice output from enum.
   */
  fromEnum: enumToChoiceOutput,

  /**
   * Create an output from Zod schema.
   */
  fromZod: zodToOutput,

  /**
   * Create a text output.
   */
  text: textOutput,
} as const;
