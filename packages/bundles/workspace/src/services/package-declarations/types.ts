import type {
	PackageDeclarationConfig,
	PackageDeclarationRequiredByKind,
	PackageDeclarationTarget,
	ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';

export type WorkspacePackageKind =
	| 'libs'
	| 'modules'
	| 'integrations'
	| 'bundles'
	| 'apps'
	| 'appsRegistry'
	| 'examples';

export interface WorkspacePackageDeclarationRequirement {
	kind: WorkspacePackageKind;
	target: PackageDeclarationTarget;
}

export interface WorkspacePackageInfo {
	workspaceRoot: string;
	relativePackageRoot: string;
	packageRoot: string;
	packageName: string;
	packageDirName: string;
	description?: string;
	kind: WorkspacePackageKind;
	target: PackageDeclarationTarget;
	canonicalDeclarationRelativePath: string;
	canonicalDeclarationPath: string;
	indexPath: string;
	indexExportPath: string;
}

export interface PackageDeclarationAuditResult extends WorkspacePackageInfo {
	exists: boolean;
	matchesExpectedTarget: boolean;
	detectedSpecType?: string;
}

export interface PackageDeclarationSyncEntry
	extends PackageDeclarationAuditResult {
	action: 'created' | 'updated' | 'skipped';
	declarationCreated: boolean;
	indexUpdated: boolean;
	packageJsonUpdated: boolean;
	dependenciesUpdated: string[];
}

export interface PackageDeclarationAuditOptions {
	config?: ResolvedContractsrcConfig;
	workspaceRoot?: string;
}

export interface PackageDeclarationSyncOptions
	extends PackageDeclarationAuditOptions {
	dryRun?: boolean;
	force?: boolean;
}

export interface PackageDeclarationSyncResult {
	packages: PackageDeclarationSyncEntry[];
	createdFiles: string[];
	updatedFiles: string[];
}

export const DEFAULT_PACKAGE_DECLARATION_REQUIRED_BY_KIND: Required<PackageDeclarationRequiredByKind> =
	{
		libs: 'feature',
		modules: 'feature',
		integrations: 'integration',
		bundles: 'module-bundle',
		apps: 'app-config',
		appsRegistry: 'app-config',
		examples: 'example',
	};

export const WORKSPACE_PACKAGE_KIND_BY_PREFIX: Readonly<
	Record<string, WorkspacePackageKind>
> = {
	'packages/libs/': 'libs',
	'packages/modules/': 'modules',
	'packages/integrations/': 'integrations',
	'packages/bundles/': 'bundles',
	'packages/apps/': 'apps',
	'packages/apps-registry/': 'appsRegistry',
	'packages/examples/': 'examples',
};

export function resolvePackageDeclarationConfig(
	config?: ResolvedContractsrcConfig
): PackageDeclarationConfig {
	return {
		severity: config?.ci?.packageDeclarations?.severity ?? 'error',
		requiredByKind: {
			...DEFAULT_PACKAGE_DECLARATION_REQUIRED_BY_KIND,
			...(config?.ci?.packageDeclarations?.requiredByKind ?? {}),
		},
		allowMissing: config?.ci?.packageDeclarations?.allowMissing ?? [],
	};
}
