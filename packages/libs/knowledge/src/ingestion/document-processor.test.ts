import { describe, expect, it } from 'bun:test';
import { DocumentProcessor } from './document-processor';

describe('DocumentProcessor', () => {
	it('extracts text/plain and preserves metadata', async () => {
		const processor = new DocumentProcessor();

		await expect(
			processor.process({
				id: 'doc-1',
				mimeType: 'text/plain',
				data: new TextEncoder().encode('Hello world'),
				metadata: { locale: 'en' },
			})
		).resolves.toEqual([
			{
				id: 'doc-1:0',
				documentId: 'doc-1',
				text: 'Hello world',
				metadata: { locale: 'en' },
			},
		]);
	});

	it('pretty-prints JSON and annotates contentType', async () => {
		const processor = new DocumentProcessor();
		const fragments = await processor.process({
			id: 'doc-2',
			mimeType: 'application/json',
			data: new TextEncoder().encode(JSON.stringify({ ok: true })),
			metadata: { source: 'test' },
		});

		expect(fragments[0]).toEqual({
			id: 'doc-2:0',
			documentId: 'doc-2',
			text: '{\n  "ok": true\n}',
			metadata: {
				source: 'test',
				contentType: 'application/json',
			},
		});
	});

	it('falls back to plain text for invalid JSON', async () => {
		const processor = new DocumentProcessor();

		await expect(
			processor.process({
				id: 'doc-3',
				mimeType: 'application/json',
				data: new TextEncoder().encode('{not-json'),
			})
		).resolves.toEqual([
			{
				id: 'doc-3:0',
				documentId: 'doc-3',
				text: '{not-json',
				metadata: undefined,
			},
		]);
	});

	it('supports wildcard extractors and stable empty fragment fallbacks', async () => {
		const processor = new DocumentProcessor();
		processor.registerExtractor('*/*', async (document) => [
			{
				id: `${document.id}:custom`,
				documentId: document.id,
				text: 'custom',
			},
		]);

		await expect(
			processor.process({
				id: 'doc-4',
				mimeType: 'application/pdf',
				data: new Uint8Array(),
			})
		).resolves.toEqual([
			{
				id: 'doc-4:custom',
				documentId: 'doc-4',
				text: 'custom',
			},
		]);

		processor.registerExtractor('application/xml', async () => []);
		await expect(
			processor.process({
				id: 'doc-5',
				mimeType: 'application/xml',
				data: new Uint8Array(),
				metadata: { format: 'xml' },
			})
		).resolves.toEqual([
			{
				id: 'doc-5:0',
				documentId: 'doc-5',
				text: '',
				metadata: { format: 'xml' },
			},
		]);
	});

	it('throws when no extractor is registered', async () => {
		const processor = new DocumentProcessor();

		await expect(
			processor.process({
				id: 'doc-6',
				mimeType: 'application/pdf',
				data: new Uint8Array(),
			})
		).rejects.toThrow('No extractor registered for mime type application/pdf');
	});
});
