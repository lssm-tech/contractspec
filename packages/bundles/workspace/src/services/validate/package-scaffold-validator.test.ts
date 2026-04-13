import { afterEach, describe, expect, it } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createNodeAdapters } from '../../adapters';
import { validatePackageScaffold } from './package-scaffold-validator';

const tempRoots: string[] = [];
const surfaceRuntimeSpecIndex = resolve(
	dirname(import.meta.dir),
	'../../../../libs/surface-runtime/src/spec/index.ts'
);

describe('validatePackageScaffold', () => {
	it('accepts a valid module bundle', async () => {
		const specPath = await writePackageTarget(
			'packages/bundles/valid-bundle/src/bundles/ValidBundle.ts',
			`import { defineModuleBundle } from "${surfaceRuntimeSpecIndex}";

export const ValidBundle = defineModuleBundle({
  meta: {
    key: "valid.bundle",
    version: "1.0.0",
    title: "Valid Bundle",
  },
  routes: [{ routeId: "home", path: "/", defaultSurface: "main" }],
  surfaces: {
    main: {
      surfaceId: "main",
      kind: "workbench",
      title: "Main",
      slots: [
        {
          slotId: "primary",
          role: "primary",
          accepts: ["action-bar"],
          cardinality: "one",
        },
      ],
      layouts: [{ layoutId: "default", root: { type: "slot", slotId: "primary" } }],
      data: [],
      verification: {
        dimensions: {
          guidance: "Guidance support is available.",
          density: "Density controls are available.",
          dataDepth: "Data depth controls are available.",
          control: "Control posture is available.",
          media: "Media support is available.",
          pace: "Pacing support is available.",
          narrative: "Narrative support is available.",
        },
      },
    },
  },
});
`
		);

		const result = await validatePackageScaffold(
			createSpecScanResult(specPath, 'module-bundle'),
			createAdapters(specPath).fs
		);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('reports invalid module bundle slot references', async () => {
		const specPath = await writePackageTarget(
			'packages/bundles/broken-bundle/src/bundles/BrokenBundle.ts',
			`import { defineModuleBundle } from "${surfaceRuntimeSpecIndex}";

export const BrokenBundle = defineModuleBundle({
  meta: {
    key: "broken.bundle",
    version: "1.0.0",
    title: "Broken Bundle",
  },
  routes: [{ routeId: "home", path: "/", defaultSurface: "main" }],
  surfaces: {
    main: {
      surfaceId: "main",
      kind: "workbench",
      title: "Main",
      slots: [
        {
          slotId: "primary",
          role: "primary",
          accepts: ["action-bar"],
          cardinality: "one",
        },
      ],
      layouts: [{ layoutId: "default", root: { type: "slot", slotId: "missing" } }],
      data: [],
      verification: {
        dimensions: {
          guidance: "Guidance support is available.",
          density: "Density controls are available.",
          dataDepth: "Data depth controls are available.",
          control: "Control posture is available.",
          media: "Media support is available.",
          pace: "Pacing support is available.",
          narrative: "Narrative support is available.",
        },
      },
    },
  },
});
`
		);

		const result = await validatePackageScaffold(
			createSpecScanResult(specPath, 'module-bundle'),
			createAdapters(specPath).fs
		);

		expect(result.valid).toBe(false);
		expect(result.errors.join('\n')).toContain('undeclared slot');
	});

	it('accepts a valid builder-spec export', async () => {
		const specPath = await writePackageTarget(
			'packages/libs/builder-demo/src/builder-demo.builder-spec.ts',
			`import type { BuilderWorkspace } from "@contractspec/lib.builder-spec";

export const DemoWorkspace: BuilderWorkspace = {
  id: "workspace-1",
  tenantId: "tenant-1",
  name: "Workspace",
  status: "draft",
  appClass: "dashboard",
  defaultRuntimeMode: "managed",
  mobileParityRequired: false,
  ownerIds: ["owner-1"],
  defaultLocale: "en",
  defaultChannelPolicy: {},
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};
`
		);

		const result = await validatePackageScaffold(
			createSpecScanResult(specPath, 'builder-spec'),
			createAdapters(specPath).fs
		);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('accepts a valid provider-spec export', async () => {
		const specPath = await writePackageTarget(
			'packages/libs/provider-demo/src/provider-demo.provider-spec.ts',
			`import type { ProviderRoutingPolicy } from "@contractspec/lib.provider-spec";

export const DemoRoutingPolicy: ProviderRoutingPolicy = {
  id: "routing-1",
  workspaceId: "workspace-1",
  taskRules: [
    {
      taskType: "draft_blueprint",
      preferredProviders: ["provider-1"],
      fallbackProviders: [],
    },
  ],
  riskRules: [],
  runtimeModeRules: [],
  comparisonRules: [],
  fallbackRules: [],
  updatedAt: "2026-01-01T00:00:00.000Z",
};
`
		);

		const result = await validatePackageScaffold(
			createSpecScanResult(specPath, 'provider-spec'),
			createAdapters(specPath).fs
		);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('warns when no recognized package-target exports exist', async () => {
		const specPath = await writePackageTarget(
			'packages/libs/unknown-builder/src/unknown-builder.builder-spec.ts',
			'export const notRecognized = 42;\n'
		);

		const result = await validatePackageScaffold(
			createSpecScanResult(specPath, 'builder-spec'),
			createAdapters(specPath).fs
		);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
		expect(result.warnings.join('\n')).toContain(
			'No recognized builder exports were found for builder-spec deep validation.'
		);
	});
});

afterEach(async () => {
	while (tempRoots.length > 0) {
		const root = tempRoots.pop();
		if (root) {
			await rm(root, { recursive: true, force: true });
		}
	}
});

function createAdapters(specPath: string) {
	const packageMarker = '/packages/';
	const markerIndex = specPath.indexOf(packageMarker);
	const cwd =
		markerIndex === -1 ? process.cwd() : specPath.slice(0, markerIndex);
	return createNodeAdapters({ cwd, silent: true });
}

function createSpecScanResult(
	filePath: string,
	specType: 'module-bundle' | 'builder-spec' | 'provider-spec'
) {
	return {
		filePath,
		specType,
		hasMeta: true,
		hasIo: false,
		hasPolicy: false,
		hasPayload: false,
		hasContent: false,
		hasDefinition: true,
	};
}

async function writePackageTarget(relativePath: string, source: string) {
	const root = await mkdtemp(join(tmpdir(), 'contractspec-target-'));
	tempRoots.push(root);

	const absolutePath = join(root, relativePath);
	const packageRoot = absolutePath.slice(0, absolutePath.lastIndexOf('/src/'));

	await mkdir(join(packageRoot, 'src'), { recursive: true });
	await mkdir(absolutePath.replace(/\/[^/]+$/, ''), { recursive: true });

	await writeFile(
		join(packageRoot, 'package.json'),
		JSON.stringify({ name: '@demo/package-target', type: 'module' }, null, 2)
	);
	await writeFile(join(packageRoot, 'README.md'), '# Demo\n');
	await writeFile(join(packageRoot, 'src', 'index.ts'), 'export {};\n');
	await writeFile(absolutePath, source);

	return absolutePath;
}
