import { afterEach, describe, expect, it } from 'bun:test';
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import { createNodeAdapters } from '../../adapters/factory';
import {
	auditPackageDeclarations,
	discoverWorkspacePackages,
	syncPackageDeclarations,
} from './index';

const tempRoots: string[] = [];

afterEach(() => {
	for (const root of tempRoots.splice(0)) {
		rmSync(root, { force: true, recursive: true });
	}
});

describe('package declaration sync', () => {
	it('discovers canonical package declaration locations by workspace package kind', async () => {
		const root = createWorkspace();
		writeJson(join(root, 'package.json'), {
			workspaces: { packages: ['packages/libs/*', 'packages/apps/*'] },
		});
		writeJson(join(root, 'packages', 'libs', 'logger', 'package.json'), {
			name: '@contractspec/lib.logger',
		});
		writeJson(
			join(root, 'packages', 'apps', 'registry-server', 'package.json'),
			{
				name: '@contractspec/app.registry-server',
			}
		);

		const adapters = createNodeAdapters({ cwd: root, silent: true });
		const packages = await discoverWorkspacePackages(adapters.fs, {
			workspaceRoot: root,
		});

		expect(packages.map((pkg) => pkg.canonicalDeclarationRelativePath)).toEqual(
			['src/blueprint.ts', 'src/logger.feature.ts']
		);
	});

	it('creates missing declarations, updates index exports, and adds required dependencies', async () => {
		const root = createWorkspace();
		writeJson(join(root, 'package.json'), {
			workspaces: {
				packages: [
					'packages/libs/*',
					'packages/apps/*',
					'packages/integrations/*',
				],
			},
		});

		writeJson(join(root, 'packages', 'libs', 'logger', 'package.json'), {
			name: '@contractspec/lib.logger',
			description: 'Logger library',
			exports: {
				'.': './src/index.ts',
			},
		});
		writeFile(
			join(root, 'packages', 'libs', 'logger', 'src', 'index.ts'),
			'export {};\n'
		);
		writeFile(
			join(
				root,
				'packages',
				'libs',
				'logger',
				'src',
				'events',
				'logger.event.ts'
			),
			"import { defineEvent } from '@contractspec/lib.contracts-spec';\nexport const LoggerRecordedEvent = defineEvent({ meta: { key: 'logger.recorded', version: '1.0.0', description: 'logger', owners: ['@team'], tags: ['logger'] }, payload: {} as never });\n"
		);

		writeJson(
			join(root, 'packages', 'apps', 'action-validation', 'package.json'),
			{
				name: '@contractspec/action.validation',
				description: 'Validation action',
			}
		);

		writeJson(
			join(root, 'packages', 'integrations', 'runtime-local', 'package.json'),
			{
				name: '@contractspec/integration.runtime.local',
				description: 'Local runtime wrapper',
				exports: {
					'.': './src/index.ts',
				},
			}
		);
		writeFile(
			join(
				root,
				'packages',
				'integrations',
				'runtime-local',
				'src',
				'index.ts'
			),
			'export {};\n'
		);

		const adapters = createNodeAdapters({ cwd: root, silent: true });
		const result = await syncPackageDeclarations(adapters.fs, {
			workspaceRoot: root,
			config: {
				...DEFAULT_CONTRACTSRC,
				defaultOwners: ['@contractspec-core'],
				defaultTags: ['workspace'],
			},
		});

		expect(
			result.packages.filter((pkg) => pkg.action !== 'skipped')
		).toHaveLength(3);

		const loggerFeature = read(
			root,
			'packages/libs/logger/src/logger.feature.ts'
		);
		expect(loggerFeature).toContain('defineFeature');
		expect(loggerFeature).toContain('logger.recorded');

		const actionBlueprint = read(
			root,
			'packages/apps/action-validation/src/blueprint.ts'
		);
		expect(actionBlueprint).toContain('defineAppConfig');
		expect(actionBlueprint).toContain("appId: 'action-validation'");

		const runtimeIntegration = read(
			root,
			'packages/integrations/runtime-local/src/integration.ts'
		);
		expect(runtimeIntegration).toContain('defineIntegration');

		expect(read(root, 'packages/libs/logger/src/index.ts')).toContain(
			'export * from "./logger.feature";'
		);
		expect(
			read(root, 'packages/apps/action-validation/src/index.ts')
		).toContain('export * from "./blueprint";');

		const loggerPackageJson = JSON.parse(
			read(root, 'packages/libs/logger/package.json')
		) as Record<string, unknown>;
		expect(
			(loggerPackageJson.dependencies as Record<string, string>)[
				'@contractspec/lib.contracts-spec'
			]
		).toBe('workspace:*');

		const audits = await auditPackageDeclarations(adapters.fs, {
			workspaceRoot: root,
		});
		expect(
			audits.every((audit) => audit.exists && audit.matchesExpectedTarget)
		).toBe(true);
	});
});

function createWorkspace() {
	const root = mkdtempSync(
		join(tmpdir(), 'contractspec-package-declarations-')
	);
	tempRoots.push(root);
	return root;
}

function writeJson(path: string, value: unknown) {
	writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeFile(path: string, content: string) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content, 'utf8');
}

function read(root: string, relativePath: string) {
	return readFileSync(join(root, relativePath), 'utf8');
}
