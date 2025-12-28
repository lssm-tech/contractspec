import type { ResolvedAppConfig } from '@contractspec/lib.contracts/app-config/runtime';

/**
 * Selects knowledge bindings that apply to a workflow or agent identifier.
 */
export function selectKnowledgeBindings(
  resolved: ResolvedAppConfig,
  options: { workflowId?: string; agentId?: string }
) {
  return resolved.knowledge.filter(({ binding }) => {
    if (!binding.scope) return true;
    if (
      options.workflowId &&
      binding.scope.workflows?.includes(options.workflowId)
    )
      return true;
    if (options.agentId && binding.scope.agents?.includes(options.agentId))
      return true;
    return false;
  });
}

/**
 * Pseudo implementation of an assistant lookup that routes prompts to the appropriate
 * knowledge sources. In a real system this would call the ingestion/search services.
 */
export async function answerWithKnowledge(
  resolved: ResolvedAppConfig,
  question: string,
  { workflowId, agentId }: { workflowId?: string; agentId?: string }
): Promise<string> {
  const bindings = selectKnowledgeBindings(resolved, { workflowId, agentId });
  if (bindings.length === 0) {
    return 'No knowledge space available for this request.';
  }

  const summaries = bindings.map(
    ({ space }) => `• ${space.meta.title || space.meta.description}`
  );
  return [
    `Q: ${question}`,
    'Routed to knowledge spaces:',
    ...summaries,
    '',
    'TODO: invoke knowledge search service and synthesize response.',
  ].join('\n');
}
