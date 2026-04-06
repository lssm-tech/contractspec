import { afterAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { WorkspaceConfigSchema } from '../../src/core/config.js';
import { PackLoader } from '../../src/core/pack-loader.js';
import { ClaudeCodeTarget } from '../../src/targets/claude-code.js';
import { CodexCliTarget } from '../../src/targets/codex-cli.js';
import { CursorTarget } from '../../src/targets/cursor.js';

const REPO_ROOT = resolve(import.meta.dir, '../../../../..');
const PACK_PATH = resolve(REPO_ROOT, 'packs/contractspec-contracts-spec');
const TEST_DIR = mkdtempSync(join(tmpdir(), 'contractspec-contracts-spec-pack-'));

afterAll(() => {
	rmSync(TEST_DIR, { recursive: true, force: true });
});

function loadFeatures() {
	const config = WorkspaceConfigSchema.parse({
		packs: [PACK_PATH],
		features: '*',
	});
	const loader = new PackLoader(TEST_DIR, config);
	const { packs } = loader.loadAll();
	expect(packs).toHaveLength(1);
	return packs[0]!;
}

describe('contractspec-contracts-spec pack', () => {
	test('generates Cursor hooks that call connect hook commands', () => {
		const pack = loadFeatures();
		const target = new CursorTarget();
		const result = target.generate({
			projectRoot: TEST_DIR,
			baseDir: '.',
			features: {
				rules: pack.rules,
				commands: pack.commands,
				agents: pack.agents,
				skills: pack.skills,
				hooks: pack.hooks ? [pack.hooks] : [],
				plugins: [],
				mcpServers: pack.mcp?.servers ?? {},
				ignorePatterns: [],
				models: null,
			},
			enabledFeatures: ['rules', 'commands', 'agents', 'skills', 'hooks', 'mcp'],
			deleteExisting: true,
			global: false,
			verbose: false,
		});

		expect(result.filesWritten.some((file) => file.endsWith('.cursor/hooks.json'))).toBe(true);
		const hooks = JSON.parse(readFileSync(join(TEST_DIR, '.cursor', 'hooks.json'), 'utf-8'));
		expect(hooks.hooks.beforeFileEdit[0].command).toContain(
			'contractspec connect hook contracts-spec before-file-edit --stdin'
		);
		expect(hooks.hooks.beforeShellExecution[0].command).toContain(
			'contractspec connect hook contracts-spec before-shell-execution --stdin'
		);
		expect(hooks.hooks.afterFileEdit[0].command).toContain(
			'contractspec connect hook contracts-spec after-file-edit --stdin'
		);
	});

	test('generates Claude settings hooks that call connect hook commands', () => {
		const pack = loadFeatures();
		const target = new ClaudeCodeTarget();
		target.generate({
			projectRoot: TEST_DIR,
			baseDir: '.',
			features: {
				rules: pack.rules,
				commands: pack.commands,
				agents: pack.agents,
				skills: pack.skills,
				hooks: pack.hooks ? [pack.hooks] : [],
				plugins: [],
				mcpServers: pack.mcp?.servers ?? {},
				ignorePatterns: [],
				models: null,
			},
			enabledFeatures: ['rules', 'commands', 'agents', 'skills', 'hooks', 'mcp'],
			deleteExisting: true,
			global: false,
			verbose: false,
		});

		const settings = JSON.parse(
			readFileSync(join(TEST_DIR, '.claude', 'settings.json'), 'utf-8')
		);
		expect(settings.hooks.PreToolUse).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					command:
						'contractspec connect hook contracts-spec before-file-edit --stdin',
					matcher: 'Write|Edit|MultiEdit',
				}),
				expect.objectContaining({
					command:
						'contractspec connect hook contracts-spec before-shell-execution --stdin',
					matcher: 'Bash',
				}),
			])
		);
		expect(settings.hooks.PostToolUse).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					command:
						'contractspec connect hook contracts-spec after-file-edit --stdin',
					matcher: 'Write|Edit|MultiEdit',
				}),
			])
		);
	});

	test('generates Codex hooks and MCP for the contracts-spec pack', () => {
		const pack = loadFeatures();
		const target = new CodexCliTarget();
		target.generate({
			projectRoot: TEST_DIR,
			baseDir: '.',
			features: {
				rules: pack.rules,
				commands: pack.commands,
				agents: pack.agents,
				skills: pack.skills,
				hooks: pack.hooks ? [pack.hooks] : [],
				plugins: [],
				mcpServers: pack.mcp?.servers ?? {},
				ignorePatterns: [],
				models: null,
			},
			enabledFeatures: ['rules', 'skills', 'hooks', 'mcp'],
			deleteExisting: true,
			global: false,
			verbose: false,
		});

		const hooks = JSON.parse(readFileSync(join(TEST_DIR, '.codex', 'hooks.json'), 'utf-8'));
		const mcp = JSON.parse(readFileSync(join(TEST_DIR, '.codex', 'mcp.json'), 'utf-8'));
		expect(hooks.hooks.beforeFileEdit[0].command).toContain(
			'contractspec connect hook contracts-spec before-file-edit --stdin'
		);
		expect(mcp.mcpServers['contractspec-contracts']).toBeDefined();
	});
});
