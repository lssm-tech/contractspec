import type {
	ConnectAdoptionConfig,
	ConnectAdoptionFamily,
	ConnectVerdict,
	ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import type { FsAdapter } from '../../ports/fs';

export type AdoptionFamily = ConnectAdoptionFamily;
export type AdoptionVerdict = ConnectVerdict;

export type AdoptionSource = 'workspace' | 'contractspec' | 'ecosystem';
export type AdoptionPackageKind =
	| 'primitive'
	| 'adapter'
	| 'module'
	| 'bundle'
	| 'app'
	| 'example';

export interface AdoptionImportHint {
	from: string;
	to: string;
	note?: string;
}

export interface AdoptionCatalogEntry {
	id: string;
	source: Exclude<AdoptionSource, 'workspace'>;
	packageRef: string;
	family: AdoptionFamily;
	packageKind: AdoptionPackageKind;
	title: string;
	description: string;
	capabilityTags: string[];
	preferredUseCases: string[];
	avoidWhen?: string[];
	platforms?: string[];
	runtimes?: string[];
	replacementImportHints?: AdoptionImportHint[];
	resolutionPriority: number;
}

export interface AdoptionWorkspaceCandidate {
	id: string;
	source: 'workspace';
	family: AdoptionFamily;
	title: string;
	description: string;
	filePath?: string;
	packageRef?: string;
	packageKind?: AdoptionPackageKind;
	capabilityTags: string[];
	preferredUseCases: string[];
	resolutionPriority: number;
}

export type AdoptionCandidate =
	| AdoptionCatalogEntry
	| AdoptionWorkspaceCandidate;

export interface AdoptionCatalogDocument {
	version: 1;
	generatedAt: string;
	entries: AdoptionCatalogEntry[];
}

export interface AdoptionWorkspaceIndex {
	packageCandidates: AdoptionWorkspaceCandidate[];
	fileCandidates: AdoptionWorkspaceCandidate[];
}

export interface AdoptionResolveInput {
	family: AdoptionFamily;
	query?: string;
	symbol?: string;
	paths?: string[];
	platform?: string;
	runtime?: string;
	currentTarget?: string;
	config?: ResolvedContractsrcConfig;
	cwd?: string;
	workspaceRoot?: string;
	packageRoot?: string;
}

export interface AdoptionResolutionCandidate {
	candidate: AdoptionCandidate;
	score: number;
	matchReasons: string[];
}

export interface AdoptionResolution {
	family: AdoptionFamily;
	verdict: AdoptionVerdict;
	selected: AdoptionResolutionCandidate | null;
	candidates: AdoptionResolutionCandidate[];
	ambiguous: boolean;
	exhausted: boolean;
	reason: string;
	currentTarget?: string;
	query: string;
}

export interface AdoptionSyncInput {
	config?: ResolvedContractsrcConfig;
	cwd?: string;
	workspaceRoot?: string;
	packageRoot?: string;
}

export interface AdoptionSyncResult {
	catalogPath: string;
	catalog: AdoptionCatalogDocument;
}

export interface AdoptionResolvedWorkspace {
	cwd: string;
	workspaceRoot: string;
	packageRoot: string;
	config: ResolvedContractsrcConfig;
	adoption: NonNullable<ConnectAdoptionConfig>;
}

export interface AdoptionResolverRuntime {
	fs: FsAdapter;
}
