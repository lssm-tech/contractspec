import { tool, type Tool } from 'ai';
import * as z from 'zod';
import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';
import type { AgentKnowledgeRef } from '../spec/spec';
import { createAgentI18n } from '../i18n';

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
  knowledgeRefs: AgentKnowledgeRef[],
  locale?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Tool<any, any> | null {
  const i18n = createAgentI18n(locale);

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
    .map(
      (k) =>
        `- ${k.key}: ${k.instructions ?? i18n.t('tool.knowledge.spaceDefault')}`
    )
    .join('\n');

  return tool({
    description: `${i18n.t('tool.knowledge.description')}\n\n${i18n.t('tool.knowledge.availableSpaces')}\n${spaceDescriptions}`,
    // AI SDK v6 uses inputSchema instead of parameters
    inputSchema: z.object({
      query: z.string().describe(i18n.t('tool.knowledge.param.query')),
      spaceKey: z
        .enum(optionalSpaces as [string, ...string[]])
        .optional()
        .describe(i18n.t('tool.knowledge.param.spaceKey')),
      topK: z
        .number()
        .optional()
        .default(5)
        .describe(i18n.t('tool.knowledge.param.topK')),
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
          console.warn(i18n.t('log.knowledge.queryFailed', { space }), error);
        }
      }

      if (allResults.length === 0) {
        return i18n.t('tool.knowledge.noResults');
      }

      // Sort by score and format results
      allResults.sort((a, b) => b.score - a.score);
      const topResults = allResults.slice(0, topK ?? 5);

      return topResults
        .map(
          (r, i) =>
            `${i18n.t('tool.knowledge.sourceLabel', { index: i + 1, space: r.space, score: (r.score * 100).toFixed(0) })}\n${r.content}`
        )
        .join('\n\n---\n\n');
    },
  });
}
