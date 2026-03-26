import { describe, expect, it } from 'bun:test';
import fs from 'node:fs';

describe('ContractSpec DocBlock snippet', () => {
	it('creates a same-file DocBlock without runtime registration', () => {
		const snippets = JSON.parse(
			fs.readFileSync(
				new URL('../snippets/contractspec.json', import.meta.url),
				'utf8'
			)
		) as Record<string, { body: string[] }>;
		const snippet = snippets['ContractSpec DocBlock'];
		const body = snippet.body.join('\n');

		expect(body).toContain('satisfies DocBlock;');
		expect(body).not.toContain('registerDocBlocks');
		expect(body).not.toContain('DocBlock[]');
	});
});
