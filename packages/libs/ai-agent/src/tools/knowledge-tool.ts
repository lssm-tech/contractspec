import { tool, type Tool } from 'ai';
import { z } from 'zod';
import type { KnowledgeRetriever } from '@lssm/lib.knowledge/retriever';
import type { AgentKnowledgeRef } from '../spec/spec';

/**
 * Create a knowledge query tool for dynamic RAG.
 *
 * This tool allows the agent to query optional knowledge spaces
 * at runtime. Required knowledge is injected statically via
 * the knowledge injector.
 *
 * @param retriever - The knowledge retriever to use
 * @param knowledgeRefs - Knowledge references from the agent spec
 * @returns AI SDK CoreTool for knowledge queries
 */
export function createKnowledgeQueryTool(
  retriever: KnowledgeRetriever,
  knowledgeRefs: AgentKnowledgeRef[]
): Tool<any, any> | null {
  // Only include optional (non-required) knowledge spaces
  const optionalSpaces = knowledgeRefs
    .filter((k) => !k.required)
    .map((k) => k.key)
    .filter((key) => retriever.supportsSpace(key));

  if (optionalSpaces.length === 0) {
    return null;
  }

  // Build space descriptions for the tool
  const spaceDescriptions = knowledgeRefs
    .filter((k) => !k.required && retriever.supportsSpace(k.key))
    .map((k) => `- ${k.key}: ${k.instructions ?? 'Knowledge space'}`)
    .join('\n');

  return tool({
    description: `Query knowledge bases for relevant information. Use this tool when you need to look up specific information that may not be in your context.

Available knowledge spaces:
${spaceDescriptions}`,
    // AI SDK v6 uses inputSchema instead of parameters
    inputSchema: z.object({
      query: z
        .string()
        .describe('The question or search query to find relevant information'),
      spaceKey: z
        .enum(optionalSpaces as [string, ...string[]])
        .optional()
        .describe(
          'Specific knowledge space to query. If omitted, searches all available spaces.'
        ),
      topK: z
        .number()
        .optional()
        .default(5)
        .describe('Maximum number of results to return'),
    }),
    execute: async ({ query, spaceKey, topK }) => {
      const spacesToSearch = spaceKey ? [spaceKey] : optionalSpaces;
      const allResults: { space: string; content: string; score: number }[] =
        [];

      for (const space of spacesToSearch) {
        try {
          const results = await retriever.retrieve(query, {
            spaceKey: space,
            topK: topK ?? 5,
          });

          for (const result of results) {
            allResults.push({
              space,
              content: result.content,
              score: result.score,
            });
          }
        } catch (error) {
          // Log but don't fail on individual space errors
          console.warn(`Failed to query knowledge space ${space}:`, error);
        }
      }

      if (allResults.length === 0) {
        return 'No relevant information found in the knowledge bases.';
      }

      // Sort by score and format results
      allResults.sort((a, b) => b.score - a.score);
      const topResults = allResults.slice(0, topK ?? 5);

      return topResults
        .map(
          (r, i) =>
            `[Source ${i + 1} - ${r.space}] (relevance: ${(r.score * 100).toFixed(0)}%)\n${r.content}`
        )
        .join('\n\n---\n\n');
    },
  });
}
