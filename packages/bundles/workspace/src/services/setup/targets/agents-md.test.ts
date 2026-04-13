import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { generateAgentsGuide } from '../config-generators';
import type { SetupOptions } from '../types';
import { setupAgentsMd } from './agents-md';

const MANAGED_BLOCK_START = '<!-- contractspec:init:agents:start -->';
const MANAGED_BLOCK_END = '<!-- contractspec:init:agents:end -->';

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
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const filePath = join(root, 'AGENTS.md');
		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('created');
		expect(content).toContain(MANAGED_BLOCK_START);
		expect(content).toContain(MANAGED_BLOCK_END);
		expect(content).toContain(
			'Content outside these markers is user-owned and preserved.'
		);
		expect(content).toContain('demo-app');
		expect(content).toContain('contractspec validate');
	});

	it('merges existing AGENTS.md in non-interactive mode without changing user content', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		tempDirs.push(root);
		const filePath = join(root, 'AGENTS.md');
		const fs = createNodeFsAdapter(root);
		const customGuide = '# Team Guide\n\nCustom rules.\n';

		await writeFile(filePath, customGuide, 'utf8');

		const result = await setupAgentsMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['agents-md'],
				interactive: false,
			},
			{
				confirm: async () => true,
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('merged');
		expect(content.startsWith(`${MANAGED_BLOCK_START}\n`)).toBe(true);
		expect(content.endsWith(customGuide)).toBe(true);
		expect(content).toContain('# ContractSpec AI Guide');
	});

	it('updates only the managed block when AGENTS.md already contains one', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		tempDirs.push(root);
		const filePath = join(root, 'AGENTS.md');
		const fs = createNodeFsAdapter(root);
		const customGuide = '\n# Local Notes\n\nKeep this.\n';

		await setupAgentsMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['agents-md'],
				interactive: false,
				projectName: 'legacy-app',
			},
			{
				confirm: async () => true,
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);
		await writeFile(
			filePath,
			(await readFile(filePath, 'utf8')) + customGuide,
			'utf8'
		);

		const result = await setupAgentsMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['agents-md'],
				interactive: false,
				projectName: 'updated-app',
			},
			{
				confirm: async () => true,
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('merged');
		expect(content).toContain('updated-app');
		expect(content).not.toContain('legacy-app');
		expect(content.endsWith(customGuide)).toBe(true);
		expect(countOccurrences(content, MANAGED_BLOCK_START)).toBe(1);
		expect(countOccurrences(content, MANAGED_BLOCK_END)).toBe(1);
	});

	it('converts a legacy exact generated AGENTS.md into the managed-block format', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		tempDirs.push(root);
		const filePath = join(root, 'AGENTS.md');
		const fs = createNodeFsAdapter(root);
		const options: SetupOptions = {
			workspaceRoot: root,
			targets: ['agents-md'],
			interactive: false,
			projectName: 'demo-app',
		};

		await writeFile(filePath, generateAgentsGuide(options), 'utf8');

		const result = await setupAgentsMd(fs, options, {
			confirm: async () => true,
			select: (async <T extends string>() => 'core' as T) as never,
			multiSelect: async () => [],
			input: async () => '',
		});

		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('merged');
		expect(content).toContain(MANAGED_BLOCK_START);
		expect(countOccurrences(content, '# ContractSpec AI Guide')).toBe(1);
		expect(content).not.toContain(
			`${MANAGED_BLOCK_END}\n# ContractSpec AI Guide`
		);
	});

	it('uses the package root when package scope is selected in a monorepo and preserves package-local content', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-agents-'));
		const packageRoot = join(root, 'packages', 'demo');
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);
		const customGuide = '# Package guide\n\nKeep package notes.\n';

		await fs.writeFile(join(packageRoot, 'AGENTS.md'), customGuide);

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
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const filePath = join(packageRoot, 'AGENTS.md');
		const content = await readFile(filePath, 'utf8');

		expect(result.filePath).toBe(filePath);
		expect(result.action).toBe('merged');
		expect(content.startsWith(`${MANAGED_BLOCK_START}\n`)).toBe(true);
		expect(content).toContain('@demo/pkg package');
		expect(content).toContain('This guide is scoped to the current package.');
		expect(content.endsWith(customGuide)).toBe(true);
	});
});

function countOccurrences(content: string, value: string): number {
	return content.split(value).length - 1;
}
