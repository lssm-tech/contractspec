import type { FsAdapter } from '../../ports/fs';
import { tokenize, uniqueTokens } from './tokens';
import type {
	AdoptionFamily,
	AdoptionResolvedWorkspace,
	AdoptionWorkspaceCandidate,
} from './types';

const PACKAGE_JSON_GLOBS = ['package.json', 'packages/*/package.json'];

export async function scanWorkspaceAdoptionCandidates(
	fs: FsAdapter,
	workspace: AdoptionResolvedWorkspace
) {
	const [packageCandidates, fileCandidates] = await Promise.all([
		scanWorkspacePackages(fs, workspace),
		scanWorkspaceFiles(fs, workspace),
	]);

	return {
		fileCandidates,
		packageCandidates,
	};
}

export async function hasLocalShadcnRegistry(
	fs: FsAdapter,
	workspace: AdoptionResolvedWorkspace
): Promise<boolean> {
	const configPath = fs.join(workspace.workspaceRoot, 'components.json');
	if (await fs.exists(configPath)) {
		return true;
	}
	const registryFiles = await fs.glob({
		patterns: ['components/ui/**/*.{ts,tsx,js,jsx}', 'registry/**/*.json'],
		cwd: workspace.workspaceRoot,
		ignore: workspace.adoption.workspaceScan?.exclude,
		absolute: false,
	});
	return registryFiles.length > 0;
}

async function scanWorkspacePackages(
	fs: FsAdapter,
	workspace: AdoptionResolvedWorkspace
): Promise<AdoptionWorkspaceCandidate[]> {
	const manifests = await fs.glob({
		patterns: PACKAGE_JSON_GLOBS,
		cwd: workspace.workspaceRoot,
		ignore: workspace.adoption.workspaceScan?.exclude,
		absolute: false,
	});
	const candidates: AdoptionWorkspaceCandidate[] = [];

	for (const relativePath of manifests) {
		try {
			const manifest = JSON.parse(
				await fs.readFile(fs.join(workspace.workspaceRoot, relativePath))
			) as { name?: string; description?: string };
			const family = inferFamilyFromPath(relativePath);
			if (!family) continue;
			const title = manifest.name ?? fs.dirname(relativePath);
			candidates.push({
				id: `workspace.package.${title}`,
				source: 'workspace',
				family,
				title,
				description:
					manifest.description ?? `Local reusable package at ${relativePath}.`,
				packageKind: inferPackageKind(relativePath),
				packageRef: title,
				capabilityTags: uniqueTokens([title, relativePath]),
				preferredUseCases: [relativePath],
				resolutionPriority: 120,
			});
		} catch {
			continue;
		}
	}

	return candidates;
}

async function scanWorkspaceFiles(
	fs: FsAdapter,
	workspace: AdoptionResolvedWorkspace
): Promise<AdoptionWorkspaceCandidate[]> {
	const files = await fs.glob({
		patterns: workspace.adoption.workspaceScan?.include,
		cwd: workspace.workspaceRoot,
		ignore: workspace.adoption.workspaceScan?.exclude,
		absolute: false,
	});
	return files.flatMap((relativePath) => {
		const family = inferFamilyFromPath(relativePath);
		if (!family) {
			return [];
		}
		const title =
			relativePath
				.split('/')
				.pop()
				?.replace(/\.[^.]+$/, '') ?? relativePath;
		return [
			{
				id: `workspace.file.${relativePath}`,
				source: 'workspace' as const,
				family,
				title,
				description: `Local reusable source at ${relativePath}.`,
				filePath: relativePath,
				capabilityTags: tokenize(relativePath),
				preferredUseCases: [relativePath],
				resolutionPriority: inferFilePriority(family, relativePath),
			},
		];
	});
}

export function inferFamilyFromPath(path: string): AdoptionFamily | null {
	const normalized = path.replaceAll('\\', '/').toLowerCase();
	if (
		/\b(contract|contracts|spec|specs|operation|event|presentation|form)\b/.test(
			normalized
		)
	) {
		return 'contracts';
	}
	if (
		/\b(component|components|ui|screen|view|page)\b/.test(normalized) &&
		/\.(tsx|jsx)$/.test(normalized)
	) {
		return 'ui';
	}
	if (
		/\b(integration|integrations|provider|providers|adapter|adapters|bridge)\b/.test(
			normalized
		)
	) {
		return 'integrations';
	}
	if (
		/\b(runtime|mcp|graphql|rest|harness|render|presentation-runtime)\b/.test(
			normalized
		)
	) {
		return 'runtime';
	}
	if (
		/\b(example|examples|template|templates|module|bundle|app)\b/.test(
			normalized
		)
	) {
		return 'solutions';
	}
	if (
		/\b(lib|libs|shared|core|utils|logger|schema|testing|identity|accessibility)\b/.test(
			normalized
		)
	) {
		return 'sharedLibs';
	}
	return null;
}

function inferFilePriority(family: AdoptionFamily, path: string): number {
	return family === 'ui' && /\/components\//.test(path) ? 180 : 140;
}

function inferPackageKind(path: string) {
	if (path.startsWith('packages/modules/')) return 'module' as const;
	if (path.startsWith('packages/bundles/')) return 'bundle' as const;
	if (path.startsWith('packages/apps/')) return 'app' as const;
	if (path.startsWith('packages/examples/')) return 'example' as const;
	if (path.startsWith('packages/integrations/')) return 'adapter' as const;
	return 'primitive' as const;
}
