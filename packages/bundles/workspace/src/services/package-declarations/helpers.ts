import type { PackageDeclarationTarget } from '@contractspec/lib.contracts-spec/workspace-config';
import type { WorkspacePackageKind } from './types';
import { WORKSPACE_PACKAGE_KIND_BY_PREFIX } from './types';

export function inferWorkspacePackageKind(
	relativePackageRoot: string
): WorkspacePackageKind | null {
	const normalized = normalizePath(relativePackageRoot);

	for (const [prefix, kind] of Object.entries(
		WORKSPACE_PACKAGE_KIND_BY_PREFIX
	)) {
		if (normalized.startsWith(prefix)) {
			return kind;
		}
	}

	return null;
}

export function getCanonicalDeclarationRelativePath(
	kind: WorkspacePackageKind,
	packageDirName: string
): string {
	switch (kind) {
		case 'libs':
		case 'modules':
			return `src/${packageDirName}.feature.ts`;
		case 'integrations':
			return 'src/integration.ts';
		case 'apps':
		case 'appsRegistry':
			return 'src/blueprint.ts';
		case 'bundles':
			return `src/bundles/${toPascalCase(packageDirName)}Bundle.ts`;
		case 'examples':
			return 'src/example.ts';
	}
}

export function getIndexExportPath(
	kind: WorkspacePackageKind,
	packageDirName: string
): string {
	switch (kind) {
		case 'libs':
		case 'modules':
			return `./${packageDirName}.feature`;
		case 'integrations':
			return './integration';
		case 'apps':
		case 'appsRegistry':
			return './blueprint';
		case 'bundles':
			return `./bundles/${toPascalCase(packageDirName)}Bundle`;
		case 'examples':
			return './example';
	}
}

export function buildPackageDeclarationKey(
	relativePackageRoot: string
): string {
	return normalizePath(relativePackageRoot)
		.replace(/^packages\//, '')
		.replace(/\//g, '.');
}

export function buildPackageTitle(packageDirName: string): string {
	return packageDirName
		.split(/[-_.]/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
}

export function buildDomain(packageDirName: string): string {
	return packageDirName.replace(/[^a-zA-Z0-9-]/g, '-');
}

export function buildDeclarationTags(
	packageDirName: string,
	kind: WorkspacePackageKind,
	defaultTags: string[]
): string[] {
	return [...new Set([...defaultTags, 'package', kind, packageDirName])];
}

export function matchesAllowMissing(
	allowMissing: string[],
	relativePackageRoot: string,
	packageName: string
): boolean {
	return allowMissing.some((entry) => {
		const normalizedEntry = normalizePath(entry);
		return (
			normalizedEntry === normalizePath(relativePackageRoot) ||
			normalizedEntry === packageName
		);
	});
}

export function normalizePath(value: string): string {
	return value.replaceAll('\\', '/').replace(/\/+$/, '');
}

export function toPascalCase(value: string): string {
	return value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}

export function buildExportName(
	target: PackageDeclarationTarget,
	packageDirName: string
): string {
	const baseName = toPascalCase(packageDirName);
	switch (target) {
		case 'feature':
			return `${baseName}Feature`;
		case 'integration':
			return `${baseName}IntegrationSpec`;
		case 'app-config':
			return `${baseName}Blueprint`;
		case 'module-bundle':
			return `${baseName}Bundle`;
		case 'example':
			return `${baseName}Example`;
	}
}
