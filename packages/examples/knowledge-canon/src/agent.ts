import type { ResolvedAppConfig } from '@contractspec/lib.contracts-spec/app-config/runtime';
import {
	createStaticRetriever,
	type KnowledgeRetriever,
	type RetrievalResult,
} from '@contractspec/lib.knowledge';

const DEFAULT_KNOWLEDGE_CONTENT: Record<string, string> = {
	'knowledge.product-canon': [
		'Product Canon: How do I rotate a key? Rotate API keys from Settings > API.',
		'Product Canon: Support agents should cite reviewed canon content only.',
	].join('\n'),
};

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

export function createExampleKnowledgeRetriever(
	content: Record<string, string> = DEFAULT_KNOWLEDGE_CONTENT
): KnowledgeRetriever {
	return createStaticRetriever(content);
}

export async function answerWithKnowledge(
	resolved: ResolvedAppConfig,
	question: string,
	{
		workflowId,
		agentId,
		retriever = createExampleKnowledgeRetriever(),
	}: {
		workflowId?: string;
		agentId?: string;
		retriever?: KnowledgeRetriever;
	}
): Promise<string> {
	const bindings = selectKnowledgeBindings(resolved, { workflowId, agentId });
	if (bindings.length === 0) {
		return 'No knowledge space available for this request.';
	}

	const results = await Promise.all(
		bindings.map(({ space }) =>
			retriever.retrieve(question, {
				spaceKey: space.meta.key,
				topK: 2,
			})
		)
	);
	const matches = results.flat();
	if (matches.length === 0) {
		return 'No matching knowledge content found for this request.';
	}

	const summaries = bindings.map(
		({ space }) =>
			`• ${space.meta.title ?? space.meta.description ?? space.meta.key}`
	);
	const evidence = formatEvidence(matches);
	return [
		`Q: ${question}`,
		'Routed to knowledge spaces:',
		...summaries,
		'',
		'Retrieved evidence:',
		...evidence,
	].join('\n');
}

function formatEvidence(results: RetrievalResult[]): string[] {
	return results.map((result) => `- (${result.source}) ${result.content}`);
}
