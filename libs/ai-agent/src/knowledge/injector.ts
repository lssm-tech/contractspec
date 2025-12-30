import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';
import type { AgentKnowledgeRef } from '../spec/spec';

/**
 * Inject static knowledge into agent instructions.
 *
 * This function handles the "required" knowledge that should be
 * injected into the system prompt at agent initialization time.
 * Optional knowledge is handled by the knowledge query tool.
 *
 * @param instructions - Base agent instructions
 * @param knowledgeRefs - Knowledge references from the agent spec
 * @param retriever - Optional knowledge retriever
 * @returns Instructions with injected knowledge
 */
export async function injectStaticKnowledge(
  instructions: string,
  knowledgeRefs: AgentKnowledgeRef[],
  retriever?: KnowledgeRetriever
): Promise<string> {
  if (!retriever) return instructions;

  const requiredRefs = knowledgeRefs.filter((ref) => ref.required);
  if (requiredRefs.length === 0) return instructions;

  const blocks: string[] = [];

  for (const ref of requiredRefs) {
    if (!retriever.supportsSpace(ref.key)) {
      console.warn(`Required knowledge space "${ref.key}" is not available`);
      continue;
    }

    try {
      const content = await retriever.getStatic(ref.key);
      if (content) {
        const header = ref.instructions
          ? `## ${ref.key}\n${ref.instructions}`
          : `## ${ref.key}`;
        blocks.push(`${header}\n\n${content}`);
      }
    } catch (error) {
      console.warn(`Failed to load required knowledge "${ref.key}":`, error);
    }
  }

  if (blocks.length === 0) return instructions;

  return `${instructions}

---

# Reference Knowledge

The following information is provided for your reference. Use it to inform your responses.

${blocks.join('\n\n---\n\n')}`;
}

/**
 * Create a knowledge injector instance for reuse.
 */
export function createKnowledgeInjector(retriever?: KnowledgeRetriever) {
  return {
    /**
     * Inject static knowledge into instructions.
     */
    inject: (instructions: string, knowledgeRefs: AgentKnowledgeRef[]) =>
      injectStaticKnowledge(instructions, knowledgeRefs, retriever),

    /**
     * Check if a knowledge space is available.
     */
    hasSpace: (spaceKey: string) => retriever?.supportsSpace(spaceKey) ?? false,

    /**
     * List available knowledge spaces.
     */
    listSpaces: () => retriever?.listSpaces() ?? [],
  };
}
