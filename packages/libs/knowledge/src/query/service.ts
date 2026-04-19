import type {
	EmbeddingProvider,
	LLMMessage,
	LLMProvider,
	LLMResponse,
	VectorSearchResult,
	VectorStoreProvider,
} from '@contractspec/lib.contracts-integrations';
import type { KnowledgeI18n } from '../i18n/messages';
import { createKnowledgeI18n, getDefaultI18n } from '../i18n/messages';
import { extractKnowledgePayloadText } from '../vector-payload';

export interface KnowledgeQueryConfig {
	collection: string;
	namespace?: string;
	topK?: number;
	systemPrompt?: string;
	/** Locale for LLM prompts and context labels */
	locale?: string;
}

export interface KnowledgeAnswer {
	answer: string;
	references: (VectorSearchResult & {
		text?: string;
	})[];
	usage?: LLMResponse['usage'];
}

export class KnowledgeQueryService {
	private readonly embeddings: EmbeddingProvider;
	private readonly vectorStore: VectorStoreProvider;
	private readonly llm: LLMProvider;
	private readonly config: KnowledgeQueryConfig;
	private readonly i18n: KnowledgeI18n;

	constructor(
		embeddings: EmbeddingProvider,
		vectorStore: VectorStoreProvider,
		llm: LLMProvider,
		config: KnowledgeQueryConfig
	) {
		this.embeddings = embeddings;
		this.vectorStore = vectorStore;
		this.llm = llm;
		this.config = config;
		this.i18n = config.locale
			? createKnowledgeI18n(config.locale)
			: getDefaultI18n();
	}

	async query(question: string): Promise<KnowledgeAnswer> {
		const embedding = await this.embeddings.embedQuery(question);
		const results = await this.vectorStore.search({
			collection: this.config.collection,
			vector: embedding.vector,
			topK: this.config.topK ?? 5,
			namespace: this.config.namespace,
			filter: undefined,
		});
		const context = buildContext(results, this.i18n);
		const messages = this.buildMessages(question, context);
		const response = await this.llm.chat(messages);
		return {
			answer: response.message.content
				.map((part) => ('text' in part ? part.text : ''))
				.join(''),
			references: results.map((result) => ({
				...result,
				text: extractKnowledgePayloadText(result.payload),
			})),
			usage: response.usage,
		};
	}

	private buildMessages(question: string, context: string): LLMMessage[] {
		const systemPrompt =
			this.config.systemPrompt ?? this.i18n.t('query.systemPrompt');
		return [
			{
				role: 'system',
				content: [{ type: 'text', text: systemPrompt }],
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: this.i18n.t('query.userMessage', { question, context }),
					},
				],
			},
		];
	}
}

function buildContext(
	results: VectorSearchResult[],
	i18n: KnowledgeI18n
): string {
	if (results.length === 0) {
		return i18n.t('query.noResults');
	}
	return results
		.map((result, index) => {
			const text = extractKnowledgePayloadText(result.payload);
			const label = i18n.t('query.sourceLabel', {
				index: index + 1,
				score: result.score.toFixed(3),
			});
			return `${label}\n${text}`;
		})
		.join('\n\n');
}
