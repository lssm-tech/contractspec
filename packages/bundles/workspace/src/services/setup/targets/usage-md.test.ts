import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { setupUsageMd } from './usage-md';

const MANAGED_BLOCK_START = '<!-- contractspec:init:usage:start -->';
const MANAGED_BLOCK_END = '<!-- contractspec:init:usage:end -->';

describe('setupUsageMd', () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		await Promise.all(
			tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true }))
		);
	});

	it('creates USAGE.md with ContractSpec usage guidance', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-usage-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		const result = await setupUsageMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['usage-md'],
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

		const filePath = join(root, 'USAGE.md');
		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('created');
		expect(content).toContain(MANAGED_BLOCK_START);
		expect(content).toContain(MANAGED_BLOCK_END);
		expect(content).toContain('demo-app');
		expect(content).toContain('contractspec onboard');
	});

	it('merges existing USAGE.md in non-interactive mode without changing user content', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-usage-'));
		tempDirs.push(root);
		const filePath = join(root, 'USAGE.md');
		const fs = createNodeFsAdapter(root);
		const customGuide = '# Local Notes\n\nKeep this content.\n';

		await writeFile(filePath, customGuide, 'utf8');

		const result = await setupUsageMd(
			fs,
			{
				workspaceRoot: root,
				targets: ['usage-md'],
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
		expect(content).toContain('# ContractSpec Usage Guide');
	});
});
