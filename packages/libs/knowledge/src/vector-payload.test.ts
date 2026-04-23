import { describe, expect, it } from 'bun:test';
import {
	buildKnowledgeVectorPayload,
	extractKnowledgePayloadText,
} from './vector-payload';

describe('vector payload helpers', () => {
	it('prefers fragment metadata over config metadata', () => {
		expect(
			buildKnowledgeVectorPayload(
				{
					id: 'fragment-1',
					documentId: 'doc-1',
					text: 'Hello',
					metadata: {
						locale: 'fr',
						shared: 'fragment',
					},
				},
				{
					tenantId: 'tenant-acme',
					shared: 'config',
				}
			)
		).toEqual({
			tenantId: 'tenant-acme',
			shared: 'fragment',
			locale: 'fr',
			documentId: 'doc-1',
			text: 'Hello',
		});
	});

	it('extracts text, then content, then JSON, then empty string', () => {
		expect(extractKnowledgePayloadText({ text: 'canonical' })).toBe(
			'canonical'
		);
		expect(extractKnowledgePayloadText({ content: 'legacy' })).toBe('legacy');
		expect(extractKnowledgePayloadText({ a: 1 })).toBe('{"a":1}');
		expect(extractKnowledgePayloadText(undefined)).toBe('');
	});
});
