import { afterEach, describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { resolveAdoption, syncAdoptionCatalog } from './index';

let tempDir: string | null = null;

describe('adoption resolver', () => {
	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('prefers a local workspace UI component over ContractSpec packages', async () => {
		const workspace = createWorkspace();
		writeFileSync(join(workspace, 'components', 'Button.tsx'), 'export {};\n');

		const result = await resolveAdoption(
			{ fs: createNodeFsAdapter(workspace) },
			createInput(workspace, {
				family: 'ui',
				currentTarget: 'src/screens/Home.tsx',
				query: 'button component',
			})
		);

		expect(result.selected?.candidate.source).toBe('workspace');
		expect(result.verdict).toBe('rewrite');
	});

	it('recommends ContractSpec runtime adapters when no local runtime match exists', async () => {
		const workspace = createWorkspace();
		const result = await resolveAdoption(
			{ fs: createNodeFsAdapter(workspace) },
			createInput(workspace, {
				family: 'runtime',
				query: 'mcp server tools resources prompts',
			})
		);

		expect(result.selected?.candidate.source).toBe('contractspec');
		expect(result.selected?.candidate.packageRef).toBe(
			'@contractspec/lib.contracts-runtime-server-mcp'
		);
		expect(result.verdict).toBe('rewrite');
	});

	it('requires review when local candidates are ambiguous', async () => {
		const workspace = createWorkspace();
		mkdirSync(join(workspace, 'src', 'components'), { recursive: true });
		writeFileSync(join(workspace, 'components', 'button.tsx'), 'export {};\n');
		writeFileSync(
			join(workspace, 'src', 'components', 'button.tsx'),
			'export {};\n'
		);

		const result = await resolveAdoption(
			{ fs: createNodeFsAdapter(workspace) },
			createInput(workspace, {
				family: 'ui',
				query: 'button',
			})
		);

		expect(result.ambiguous).toBe(true);
		expect(result.verdict).toBe('require_review');
	});

	it('syncs the bundled adoption catalog locally', async () => {
		const workspace = createWorkspace();
		const result = await syncAdoptionCatalog(
			{ fs: createNodeFsAdapter(workspace) },
			createInput(workspace, {})
		);

		expect(result.catalogPath).toContain('.contractspec/adoption/catalog.json');
		expect(
			result.catalog.entries.some((entry) => entry.family === 'contracts')
		).toBe(true);
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-adoption-'));
	mkdirSync(join(tempDir, 'src', 'screens'), { recursive: true });
	mkdirSync(join(tempDir, 'components'), { recursive: true });
	writeFileSync(join(tempDir, 'package.json'), '{"name":"adoption-test"}\n');
	return tempDir;
}

function createInput(
	workspace: string,
	overrides: Partial<Parameters<typeof resolveAdoption>[1]> = {}
) {
	return {
		config: {
			...DEFAULT_CONTRACTSRC,
			connect: {
				...DEFAULT_CONTRACTSRC.connect,
				adoption: {
					...DEFAULT_CONTRACTSRC.connect?.adoption,
					enabled: true,
				},
				enabled: true,
			},
		},
		cwd: workspace,
		family: 'sharedLibs' as const,
		packageRoot: workspace,
		query: 'shared library',
		workspaceRoot: workspace,
		...overrides,
	};
}
