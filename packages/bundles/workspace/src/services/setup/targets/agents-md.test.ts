import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { setupAgentsMd } from './agents-md';

describe('setupAgentsMd', () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		await Promise.all(
			tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true }))
		);
	});

	it('creates AGENTS.md with ContractSpec guidance', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		const result = await setupAgentsMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['agents-md'],
				interactive: false,
				projectName: 'demo-app',
			},
			{
				confirm: async () => true,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const filePath = join(root, 'AGENTS.md');
		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('created');
		expect(content).toContain('# ContractSpec AI Guide');
		expect(content).toContain('demo-app');
		expect(content).toContain('contractspec validate');
	});

	it('skips overwriting existing AGENTS.md in non-interactive mode', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		tempDirs.push(root);
		const filePath = join(root, 'AGENTS.md');
		const fs = createNodeFsAdapter(root);

		await writeFile(filePath, 'custom guide\n', 'utf8');

		const result = await setupAgentsMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['agents-md'],
				interactive: false,
			},
			{
				confirm: async () => true,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		expect(result.action).toBe('skipped');
		expect(await readFile(filePath, 'utf8')).toBe('custom guide\n');
	});

	it('uses the package root when package scope is selected in a monorepo', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		const packageRoot = join(root, 'packages', 'demo');
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		const result = await setupAgentsMd(
			fs,
			{
				workspaceRoot: root,
				packageRoot,
				packageName: '@demo/pkg',
				interactive: false,
				isMonorepo: true,
				scope: 'package',
				targets: ['agents-md'],
			},
			{
				confirm: async () => true,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const filePath = join(packageRoot, 'AGENTS.md');
		const content = await readFile(filePath, 'utf8');

		expect(result.filePath).toBe(filePath);
		expect(content).toContain('@demo/pkg package');
		expect(content).toContain('This guide is scoped to the current package.');
	});
});
