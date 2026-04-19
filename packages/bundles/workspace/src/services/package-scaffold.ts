import type { AuthoringTargetId } from '@contractspec/module.workspace';
import { getAuthoringTargetDefinition } from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';

export interface PackageScaffoldOptions {
	target: Extract<
		AuthoringTargetId,
		'module-bundle' | 'builder-spec' | 'provider-spec'
	>;
	specPath: string;
	specCode: string;
	overwrite?: boolean;
}

export interface PackageScaffoldResult {
	packageRoot: string;
	files: string[];
	created: string[];
	skipped: string[];
}

const PACKAGE_DESCRIPTION: Record<PackageScaffoldOptions['target'], string> = {
	'module-bundle': 'AI-native module bundle scaffold',
	'builder-spec': 'Builder contract scaffold',
	'provider-spec': 'Provider contract scaffold',
};

export async function ensurePackageScaffold(
	fs: FsAdapter,
	options: PackageScaffoldOptions
): Promise<PackageScaffoldResult> {
	const packageRoot = resolvePackageRoot(fs, options.specPath);
	const packageName = inferPackageName(fs, options.target, packageRoot);
	const packageJsonPath = fs.join(packageRoot, 'package.json');
	const readmePath = fs.join(packageRoot, 'README.md');
	const srcRoot = fs.join(packageRoot, 'src');
	const indexPath = fs.join(srcRoot, 'index.ts');
	const specImportPath = normalize(
		fs.relative(srcRoot, options.specPath)
	).replace(/\.[^.]+$/, '');

	await fs.mkdir(srcRoot);

	const fileEntries = [
		[
			packageJsonPath,
			JSON.stringify(
				{
					name: packageName,
					version: '0.1.0',
					description: PACKAGE_DESCRIPTION[options.target],
					type: 'module',
					exports: {
						'.': './src/index.ts',
					},
				},
				null,
				2
			) + '\n',
		],
		[
			readmePath,
			`# ${packageName}\n\n${PACKAGE_DESCRIPTION[options.target]}.\n`,
		],
		[
			indexPath,
			`export * from "./${specImportPath.startsWith('.') ? specImportPath : `./${specImportPath}`}";\n`,
		],
		[options.specPath, options.specCode],
	] as const;

	const result: PackageScaffoldResult = {
		packageRoot,
		files: fileEntries.map(([file]) => file),
		created: [],
		skipped: [],
	};

	for (const [filePath, content] of fileEntries) {
		const exists = await fs.exists(filePath);
		if (exists && !options.overwrite) {
			result.skipped.push(filePath);
			continue;
		}
		await fs.writeFile(filePath, content);
		result.created.push(filePath);
	}

	return result;
}

export function createPackageTargetSpecSource(input: {
	target: PackageScaffoldOptions['target'];
	key: string;
	title: string;
	description: string;
	exportName: string;
}) {
	switch (input.target) {
		case 'module-bundle':
			return `import { defineModuleBundle } from "@contractspec/lib.surface-runtime/spec";

export const ${input.exportName} = defineModuleBundle({
  meta: {
    key: "${input.key}",
    version: "1.0.0",
    title: "${input.title}",
    description: "${input.description}",
  },
  routes: [
    {
      routeId: "default",
      path: "/",
      defaultSurface: "main",
    },
  ],
  surfaces: {
    main: {
      surfaceId: "main",
      kind: "workbench",
      title: "${input.title}",
      slots: [],
      layouts: [],
      data: [],
      verification: {
        dimensions: {
          guidance: "Scaffolded guidance profile for ${input.title}.",
          density: "Scaffolded density profile for ${input.title}.",
          dataDepth: "Scaffolded data-depth profile for ${input.title}.",
          control: "Scaffolded control profile for ${input.title}.",
          media: "Scaffolded media profile for ${input.title}.",
          pace: "Scaffolded pace profile for ${input.title}.",
          narrative: "Scaffolded narrative profile for ${input.title}.",
        },
      },
    },
  },
});
`;
		case 'builder-spec':
			return `import type { BuilderWorkspace } from "@contractspec/lib.builder-spec";

export const ${input.exportName}: BuilderWorkspace = {
  id: "${input.key}",
  tenantId: "default",
  name: "${input.title}",
  status: "draft",
  appClass: "custom",
  defaultRuntimeMode: "managed",
  mobileParityRequired: false,
  ownerIds: [],
  defaultLocale: "en",
  defaultChannelPolicy: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
`;
		case 'provider-spec':
			return `import type { ProviderCapabilityProfile } from "@contractspec/lib.provider-spec";

export const ${input.exportName}: ProviderCapabilityProfile = {
  providerId: "${input.key}",
  supportsRepoScopedPatch: true,
  supportsStructuredDiff: true,
  supportsLongContext: true,
  supportsFunctionCalling: true,
  supportsSTT: false,
  supportsVision: false,
  supportsStreaming: true,
  supportsLocalExecution: false,
  supportedArtifactTypes: ["patch"],
  knownConstraints: [],
};
`;
	}
}

function resolvePackageRoot(fs: FsAdapter, specPath: string) {
	const normalized = normalize(specPath);
	const srcMarker = '/src/';
	const markerIndex = normalized.lastIndexOf(srcMarker);
	if (markerIndex === -1) {
		return fs.dirname(specPath);
	}
	return normalized.slice(0, markerIndex);
}

function inferPackageName(
	fs: FsAdapter,
	target: PackageScaffoldOptions['target'],
	packageRoot: string
) {
	const definition = getAuthoringTargetDefinition(target);
	const dirName = normalize(fs.basename(packageRoot));
	const prefix =
		definition.defaultPackagePrefix ??
		(target === 'module-bundle'
			? '@contractspec/bundle.'
			: '@contractspec/lib.');
	return `${prefix}${dirName}`;
}

function normalize(path: string) {
	return path.replaceAll('\\', '/').replace(/\/$/, '');
}
