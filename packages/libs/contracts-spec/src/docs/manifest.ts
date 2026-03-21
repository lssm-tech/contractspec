import type { DocBlock } from "./types";

export interface DocBlockManifestEntry {
	id: string;
	exportName: string;
	sourceModule: string;
	block: DocBlock;
}

export interface PackageDocManifest {
	packageName: string;
	generatedAt: string;
	blocks: DocBlockManifestEntry[];
}

export interface WorkspaceDocManifest {
	generatedAt: string;
	packages: PackageDocManifest[];
}

export function packageDocBlocks(manifest: PackageDocManifest): DocBlock[] {
	return manifest.blocks.map(({ block }) => block);
}

export function workspaceDocBlocks(manifest: WorkspaceDocManifest): DocBlock[] {
	return manifest.packages.flatMap((entry) => packageDocBlocks(entry));
}
