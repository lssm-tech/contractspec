import { describe, expect, it } from 'bun:test';
import { KnowledgeFeature } from './knowledge.feature';

describe('KnowledgeFeature', () => {
	it('locks the package feature metadata', () => {
		expect(KnowledgeFeature.meta).toMatchObject({
			key: 'libs.knowledge',
			version: '1.0.0',
			title: 'Knowledge',
			domain: 'knowledge',
		});
	});
});
