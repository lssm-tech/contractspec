import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { setupCliConfig } from './cli-config';

describe('setupCliConfig', () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		await Promise.all(
			tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
		);
	});

	it('enables connect when the connect preset is applied onto an existing config', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-cli-config-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);
		const configPath = join(root, '.contractsrc.json');

		await writeFile(
			configPath,
			JSON.stringify(
				{
					connect: {
						enabled: false,
					},
				},
				null,
				2
			)
		);

		await setupCliConfig(
			fs,
			{
				workspaceRoot: root,
				interactive: false,
				targets: ['cli-config'],
				preset: 'connect',
			},
			{
				confirm: async () => true,
				select: (async <T extends string>() => 'connect' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const written = JSON.parse(await readFile(configPath, 'utf8')) as {
			connect?: {
				adapters?: { cursor?: { packageRef?: string } };
				adoption?: { enabled?: boolean };
				enabled?: boolean;
			};
		};
		expect(written.connect?.enabled).toBe(true);
		expect(written.connect?.adoption?.enabled).toBe(true);
		expect(written.connect?.adapters?.cursor?.packageRef).toBe(
			'contractspec-adoption'
		);
	});

	it('writes a bundled schema reference at workspace scope', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-cli-config-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		await setupCliConfig(
			fs,
			{
				workspaceRoot: root,
				interactive: false,
				targets: ['cli-config'],
			},
			{
				confirm: async () => true,
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const written = JSON.parse(
			await readFile(join(root, '.contractsrc.json'), 'utf8')
		) as { $schema?: string };
		expect(written.$schema).toBe(
			'./node_modules/contractspec/contractsrc.schema.json'
		);
	});

	it('writes a monorepo-aware bundled schema reference at package scope', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-cli-config-'));
		const packageRoot = join(root, 'packages', 'demo');
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		await fs.mkdir(packageRoot);

		await setupCliConfig(
			fs,
			{
				workspaceRoot: root,
				packageRoot,
				isMonorepo: true,
				scope: 'package',
				interactive: false,
				targets: ['cli-config'],
			},
			{
				confirm: async () => true,
				select: (async <T extends string>() => 'core' as T) as never,
				multiSelect: async () => [],
				input: async () => '',
			}
		);

		const written = JSON.parse(
			await readFile(join(packageRoot, '.contractsrc.json'), 'utf8')
		) as { $schema?: string };
		expect(written.$schema).toBe(
			'../../node_modules/contractspec/contractsrc.schema.json'
		);
	});
});
