import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { mergeGitignoreContent, setupGitignore } from './gitignore';

describe('setupGitignore', () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		await Promise.all(
			tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true }))
		);
	});

	it('creates a managed block when .gitignore is missing', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-gitignore-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		const result = await setupGitignore(fs, {
			interactive: false,
			patterns: ['**/.contractspec/verification-cache.json'],
			root,
		});

		const content = await readFile(join(root, '.gitignore'), 'utf8');

		expect(result.action).toBe('created');
		expect(content).toContain('# contractspec:init:gitignore:start');
		expect(content).toContain('**/.contractspec/verification-cache.json');
	});

	it('merges into an existing .gitignore without clobbering user content', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-gitignore-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);
		const filePath = join(root, '.gitignore');
		await writeFile(filePath, 'node_modules/\n', 'utf8');

		const result = await setupGitignore(fs, {
			interactive: false,
			patterns: [
				'**/.contractspec/connect/',
				'**/.contractspec/verification-cache.json',
			],
			root,
		});

		const content = await readFile(filePath, 'utf8');

		expect(result.action).toBe('merged');
		expect(content).toContain('node_modules/');
		expect(content).toContain('**/.contractspec/connect/');
		expect(content).toContain('**/.contractspec/verification-cache.json');
	});

	it('does not duplicate entries when rerun', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-gitignore-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		await setupGitignore(fs, {
			interactive: false,
			patterns: ['**/.contractspec/connect/'],
			root,
		});
		const result = await setupGitignore(fs, {
			interactive: false,
			patterns: ['**/.contractspec/connect/'],
			root,
		});
		const content = await readFile(join(root, '.gitignore'), 'utf8');

		expect(result.action).toBe('skipped');
		expect(content.match(/\*\*\/\.contractspec\/connect\//g)).toHaveLength(1);
	});

	it('preserves content outside the managed block when updating the block', () => {
		const merged = mergeGitignoreContent(
			'# user rule\n\n# contractspec:init:gitignore:start\n# Managed by `contractspec init` and `contractspec connect init`.\n**/.contractspec/connect/\n# contractspec:init:gitignore:end\n\n.env\n',
			['**/.contractspec/verification-cache.json']
		);

		expect(merged).toContain('# user rule');
		expect(merged).toContain('.env');
		expect(merged).toContain('**/.contractspec/verification-cache.json');
		expect(merged).not.toContain(
			'**/.contractspec/connect/\n# contractspec:init:gitignore:end'
		);
	});

	it('respects skip behavior', async () => {
		const root = await mkdtemp(join(tmpdir(), 'contractspec-gitignore-'));
		tempDirs.push(root);
		const fs = createNodeFsAdapter(root);

		const result = await setupGitignore(fs, {
			behavior: 'skip',
			interactive: false,
			patterns: ['**/.contractspec/connect/'],
			root,
		});

		expect(result.action).toBe('skipped');
		expect(await fs.exists(join(root, '.gitignore'))).toBe(false);
	});
});
