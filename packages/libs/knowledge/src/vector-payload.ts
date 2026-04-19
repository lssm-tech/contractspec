import type { DocumentFragment } from './ingestion/document-processor';

export function buildKnowledgeVectorPayload(
	fragment: DocumentFragment | undefined,
	metadata?: Record<string, string>
): Record<string, unknown> {
	return {
		...(metadata ?? {}),
		...(fragment?.metadata ?? {}),
		documentId: fragment?.documentId,
		text: fragment?.text,
	};
}

export function extractKnowledgePayloadText(
	payload: Record<string, unknown> | undefined
): string {
	if (!payload) return '';
	if (typeof payload.text === 'string') return payload.text;
	if (typeof payload.content === 'string') return payload.content;
	return JSON.stringify(payload);
}
