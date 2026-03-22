import { describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';

describe('ContractSpec DocBlock snippet', () => {
	it('creates a same-file DocBlock without runtime registration', () => {
		const snippetsPath = path.join(
			process.cwd(),
			'snippets',
			'contractspec.json'
		);
		const snippets = JSON.parse(
			fs.readFileSync(snippetsPath, 'utf8')
		) as Record<string, { body: string[] }>;
		const snippet = snippets['ContractSpec DocBlock'];
		const body = snippet.body.join('\n');

		expect(body).toContain('satisfies DocBlock;');
		expect(body).not.toContain('registerDocBlocks');
		expect(body).not.toContain('DocBlock[]');
	});
});
