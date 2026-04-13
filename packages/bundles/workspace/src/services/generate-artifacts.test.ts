import { afterEach, describe, expect, it } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import { createNodeAdapters } from '../adapters';
import { generateArtifacts } from './generate-artifacts';

const tempDirs: string[] = [];

describe('Generate Artifacts Service', () => {
	it('generates docs plus registry-backed materializations', async () => {
		const root = await seedWorkspace();
		const adapters = createNodeAdapters({ cwd: root, silent: true });

		const result = await generateArtifacts(adapters, root, 'generated', root, {
			config: DEFAULT_CONTRACTSRC,
			specPattern: '**/*.ts',
			includeRuntimeTests: true,
		});

		expect(result.specsCount).toBeGreaterThanOrEqual(2);
		expect(result.docsCount).toBeGreaterThanOrEqual(2);
		expect(result.materializedCount).toBeGreaterThanOrEqual(2);
	});

	it('respects connect-aware generated roots', async () => {
		const root = await seedWorkspace();
		const adapters = createNodeAdapters({ cwd: root, silent: true });
		const config: ResolvedContractsrcConfig = {
			...DEFAULT_CONTRACTSRC,
			connect: {
				...DEFAULT_CONTRACTSRC.connect,
				enabled: true,
				policy: {
					...DEFAULT_CONTRACTSRC.connect?.policy,
					generatedPaths: ['artifacts/docs/**'],
				},
			},
		};

		await generateArtifacts(adapters, root, 'generated', root, {
			config,
			specPattern: '**/*.ts',
		});

		expect(await adapters.fs.exists(join(root, 'artifacts', 'docs'))).toBe(
			true
		);
	});
});

afterEach(async () => {
	while (tempDirs.length > 0) {
		const dir = tempDirs.pop();
		if (dir) {
			await rm(dir, { recursive: true, force: true });
		}
	}
});

async function seedWorkspace() {
	const root = await mkdtemp(join(tmpdir(), 'contractspec-generate-'));
	tempDirs.push(root);

	await writeFile(join(root, 'package.json'), '{"name":"@demo/generate"}\n');
	await mkdir(join(root, 'contracts'), { recursive: true });
	await mkdir(
		join(root, 'packages', 'bundles', 'workspace', 'src', 'bundles'),
		{ recursive: true }
	);
	await writeFile(
		join(root, 'contracts', 'users.create.contracts.ts'),
		`export const createUser = defineCommand({
  meta: { key: "users.create", version: "1.0.0" },
});
`
	);
	await writeFile(
		join(
			root,
			'packages',
			'bundles',
			'workspace',
			'src',
			'bundles',
			'WorkspaceBundle.ts'
		),
		`import { defineModuleBundle } from "@contractspec/lib.surface-runtime/spec";

export const WorkspaceBundle = defineModuleBundle({
  meta: {
    key: "workspace.bundle",
    version: "1.0.0",
    title: "Workspace",
  },
  routes: [{ routeId: "home", path: "/", defaultSurface: "main" }],
  surfaces: {
    main: {
      surfaceId: "main",
      kind: "workbench",
      title: "Workspace",
      slots: [],
      layouts: [],
      data: [],
      verification: { level: "basic" },
    },
  },
});
`
	);

	return root;
}
