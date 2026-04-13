/**
 * Bridge Server for ContractSpec JetBrains Plugin
 *
 * Handles JSON-RPC communication with the Kotlin plugin,
 * delegating to ContractSpec workspace services.
 */

import * as workspace from '@contractspec/bundle.workspace';
import { Connection } from 'vscode-languageserver/node';
import {
	InitializeParams,
	InitializeResult,
	TextDocumentChangeEvent,
} from 'vscode-languageserver-protocol';

interface BridgeSpec {
	filePath: string;
	specType: string;
	key?: string;
	version?: string;
	kind?: string;
	exportName?: string;
	declarationLine?: number;
	[key: string]: unknown;
}

interface BridgeValidationResult {
	spec: BridgeSpec;
	valid: boolean;
	errors: string[];
	warnings: string[];
	code?: string;
}

type BridgeWorkspaceModule = typeof workspace & {
	createNodeAdapters: (options?: {
		cwd?: string;
		silent?: boolean;
	}) => {
		fs: unknown;
		git: unknown;
		watcher: unknown;
		ai: unknown;
		logger: unknown;
	};
	loadWorkspaceConfig: (fs: unknown, cwd?: string) => Promise<Record<string, any>>;
	discoverSpecs: (
		adapters: { fs: unknown },
		options?: {
			config?: Record<string, any>;
			paths?: string[];
			pattern?: string;
			cwd?: string;
			type?: string | string[];
		}
	) => Promise<BridgeSpec[]>;
	validateDiscoveredSpecs: (
		specs: BridgeSpec[],
		options?: { skipStructure?: boolean }
	) => Promise<BridgeValidationResult[]>;
	cleanArtifacts: (
		adapters: { fs: unknown; logger: unknown },
		options?: { dryRun?: boolean; outputDir?: string }
	) => Promise<{
		removed: Array<{ path: string; size: number }>;
		skipped: Array<{ path: string; reason: string }>;
	}>;
	analyzeDeps: (
		adapters: { fs: unknown },
		options?: Record<string, unknown>
	) => Promise<{
		graph: Map<string, { file: string; dependencies: string[] }>;
		cycles: string[][];
		missing: Array<{ contract: string; missing: string[] }>;
		total: number;
	}>;
	runSetup: (fs: unknown, options: Record<string, unknown>) => Promise<unknown>;
	runDoctor: (
		adapters: { fs: unknown; logger: unknown },
		options: Record<string, unknown>
	) => Promise<unknown>;
	exportOpenApi: (
		options: Record<string, unknown>,
		adapters: { fs: unknown; logger: unknown }
	) => Promise<unknown>;
	importFromOpenApiService: (
		config: Record<string, unknown>,
		options: Record<string, unknown>,
		adapters: { fs: unknown; logger: unknown }
	) => Promise<unknown>;
	validateAgainstOpenApiService: (
		options: Record<string, unknown>,
		adapters: { fs: unknown; logger: unknown }
	) => Promise<unknown>;
	listFromRegistry: (
		options: Record<string, unknown>,
		adapters: { logger: unknown }
	) => Promise<unknown[]>;
	addToRegistry: (
		specPath: string,
		options: Record<string, unknown>,
		adapters: { logger: unknown }
	) => Promise<void>;
	searchRegistry: (
		query: string,
		options: Record<string, unknown>,
		adapters: { logger: unknown }
	) => Promise<unknown[]>;
	watchSpecs: (
		adapters: { watcher: unknown; fs: unknown; logger: unknown },
		config: Record<string, unknown>,
		options: { pattern: string; runBuild?: boolean; runValidate?: boolean }
	) => {
		on(handler: (event: unknown) => void | Promise<void>): void;
		close(): Promise<void>;
	};
};

const bridgeWorkspace = workspace as unknown as BridgeWorkspaceModule;

const {
	analyzeIntegrity,
	buildSpec,
	compareSpecs,
	createNodeAdapters,
	getWorkspaceInfo,
	loadWorkspaceConfig,
	syncSpecs,
} = bridgeWorkspace;
const discoverSpecs = bridgeWorkspace.discoverSpecs;
const validateDiscoveredSpecs = bridgeWorkspace.validateDiscoveredSpecs;
const cleanArtifacts = bridgeWorkspace.cleanArtifacts;
const analyzeDeps = bridgeWorkspace.analyzeDeps;
const exportOpenApi = bridgeWorkspace.exportOpenApi;
const importFromOpenApiService = bridgeWorkspace.importFromOpenApiService;
const listFromRegistry = bridgeWorkspace.listFromRegistry;
const addToRegistry = bridgeWorkspace.addToRegistry;
const searchRegistry = bridgeWorkspace.searchRegistry;
const runDoctor = bridgeWorkspace.runDoctor;
const runSetup = bridgeWorkspace.runSetup;
const validateAgainstOpenApiService =
	bridgeWorkspace.validateAgainstOpenApiService;
const watchSpecs = bridgeWorkspace.watchSpecs;

interface BridgeUnsupportedResult {
	supported: false;
	error: string;
}

function unsupported(feature: string): BridgeUnsupportedResult {
	return {
		supported: false,
		error: `${feature} is not implemented in the JetBrains bridge yet.`,
	};
}

function normalizeWorkspaceRoot(value?: string | null): string | null {
	if (!value) {
		return null;
	}

	return value.replace('file://', '');
}

function mapBridgeSpec(spec: Awaited<ReturnType<typeof discoverSpecs>>[number]) {
	return {
		...spec,
		name: spec.key ?? spec.exportName ?? spec.filePath,
	};
}

export class BridgeServer {
	private connection: Connection;
	private workspaceAdapters: ReturnType<typeof createNodeAdapters> | null = null;
	private workspaceConfig: Awaited<ReturnType<typeof loadWorkspaceConfig>> | null =
		null;
	private workspaceRoot: string | null = null;
	private activeWatcher: ReturnType<typeof watchSpecs> | null = null;

	constructor(connection: Connection) {
		this.connection = connection;
		this.setupMethodHandlers();
	}

	onInitialize(params: InitializeParams): InitializeResult {
		// Extract workspace root from initialization params
		const workspaceRoot = normalizeWorkspaceRoot(
			params.rootUri || params.rootPath
		);
		this.workspaceRoot = workspaceRoot;

		if (workspaceRoot) {
			// Initialize workspace adapters
			this.workspaceAdapters = createNodeAdapters({
				cwd: workspaceRoot,
				silent: true,
			});

			// Load workspace config
			this.loadWorkspaceConfig();
		}

		return {
			capabilities: {
				textDocumentSync: {
					openClose: true,
					change: 1, // TextDocumentSyncKind.Full
				},
			},
			serverInfo: {
				name: 'ContractSpec Bridge Server',
				version: '0.0.1',
			},
		};
	}

	onInitialized(): void {
		this.connection.console.log('ContractSpec Bridge Server initialized');
	}

	onDidOpenTextDocument(event: TextDocumentChangeEvent): void {
		// Handle document open events if needed
		this.connection.console.log(`Document opened: ${event.document.uri}`);
	}

	onDidChangeTextDocument(event: TextDocumentChangeEvent): void {
		// Handle document change events if needed
		this.connection.console.log(`Document changed: ${event.document.uri}`);
	}

	onDidCloseTextDocument(event: TextDocumentChangeEvent): void {
		// Handle document close events if needed
		this.connection.console.log(`Document closed: ${event.document.uri}`);
	}

	private setupMethodHandlers(): void {
		// Validation methods
		this.connection.onRequest(
			'contractspec/validateSpec',
			this.handleValidateSpec.bind(this)
		);
		this.connection.onRequest(
			'contractspec/validateSpecs',
			this.handleValidateSpecs.bind(this)
		);
		this.connection.onRequest(
			'contractspec/listSpecs',
			this.handleListSpecs.bind(this)
		);

		// Build methods
		this.connection.onRequest(
			'contractspec/buildSpec',
			this.handleBuildSpec.bind(this)
		);
		this.connection.onRequest(
			'contractspec/syncSpecs',
			this.handleSyncSpecs.bind(this)
		);
		this.connection.onRequest(
			'contractspec/watchSpecs',
			this.handleWatchSpecs.bind(this)
		);
		this.connection.onRequest(
			'contractspec/cleanGeneratedFiles',
			this.handleCleanGeneratedFiles.bind(this)
		);

		// Analysis methods
		this.connection.onRequest(
			'contractspec/analyzeDependencies',
			this.handleAnalyzeDependencies.bind(this)
		);
		this.connection.onRequest(
			'contractspec/compareSpecs',
			this.handleCompareSpecs.bind(this)
		);
		this.connection.onRequest(
			'contractspec/compareWithGit',
			this.handleCompareWithGit.bind(this)
		);
		this.connection.onRequest(
			'contractspec/analyzeIntegrity',
			this.handleAnalyzeIntegrity.bind(this)
		);

		// OpenAPI methods
		this.connection.onRequest(
			'contractspec/exportToOpenApi',
			this.handleExportToOpenApi.bind(this)
		);
		this.connection.onRequest(
			'contractspec/importFromOpenApi',
			this.handleImportFromOpenApi.bind(this)
		);
		this.connection.onRequest(
			'contractspec/validateAgainstOpenApi',
			this.handleValidateAgainstOpenApi.bind(this)
		);

		// Registry methods
		this.connection.onRequest(
			'contractspec/browseRegistry',
			this.handleBrowseRegistry.bind(this)
		);
		this.connection.onRequest(
			'contractspec/searchRegistry',
			this.handleSearchRegistry.bind(this)
		);
		this.connection.onRequest(
			'contractspec/addFromRegistry',
			this.handleAddFromRegistry.bind(this)
		);

		// Examples methods
		this.connection.onRequest(
			'contractspec/browseExamples',
			this.handleBrowseExamples.bind(this)
		);
		this.connection.onRequest(
			'contractspec/initExample',
			this.handleInitExample.bind(this)
		);

		// Setup methods
		this.connection.onRequest(
			'contractspec/runSetupWizard',
			this.handleRunSetupWizard.bind(this)
		);
		this.connection.onRequest(
			'contractspec/runQuickSetup',
			this.handleRunQuickSetup.bind(this)
		);
		this.connection.onRequest(
			'contractspec/runDoctorCheck',
			this.handleRunDoctorCheck.bind(this)
		);

		// Workspace methods
		this.connection.onRequest(
			'contractspec/getWorkspaceInfo',
			this.handleGetWorkspaceInfo.bind(this)
		);

		// LLM methods
		this.connection.onRequest(
			'contractspec/exportForLLM',
			this.handleExportForLLM.bind(this)
		);
		this.connection.onRequest(
			'contractspec/generateImplementationGuide',
			this.handleGenerateImplementationGuide.bind(this)
		);
		this.connection.onRequest(
			'contractspec/verifyImplementation',
			this.handleVerifyImplementation.bind(this)
		);
	}

	private async loadWorkspaceConfig(): Promise<void> {
		if (!this.workspaceAdapters) return;

		try {
			this.workspaceConfig = await loadWorkspaceConfig(
				this.workspaceAdapters.fs
			);
		} catch (error) {
			this.connection.console.error(
				`Failed to load workspace config: ${error}`
			);
		}
	}

	// Validation handlers
	private async handleValidateSpec(params: { filePath: string }): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		const specs = await discoverSpecs(this.workspaceAdapters, {
			config: this.workspaceConfig ?? undefined,
			paths: [params.filePath],
		});
		const results = await validateDiscoveredSpecs(specs);
		return {
			results: results.map((result) => ({
				...result,
				spec: mapBridgeSpec(result.spec),
			})),
		};
	}

	private async handleValidateSpecs(params: {
		filePaths: string[];
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		const specs = await discoverSpecs(this.workspaceAdapters, {
			config: this.workspaceConfig ?? undefined,
			paths: params.filePaths,
		});
		const results = await validateDiscoveredSpecs(specs);
		return {
			results: results.map((result) => ({
				...result,
				spec: mapBridgeSpec(result.spec),
			})),
		};
	}

	private async handleListSpecs(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return {
			specs: (
				await discoverSpecs(this.workspaceAdapters, {
					config: this.workspaceConfig ?? undefined,
				})
			).map(mapBridgeSpec),
		};
	}

	// Build handlers
	private async handleBuildSpec(params: { filePath: string }): Promise<any> {
		if (!this.workspaceAdapters || !this.workspaceConfig) {
			throw new Error('Workspace not properly initialized');
		}

		return await buildSpec(
			params.filePath,
			this.workspaceAdapters as any,
			this.workspaceConfig as any
		).then((result) => {
			const successful = result.results.filter((item) => item.success);
			const failed = result.results.filter(
				(item) => !item.success && !item.skipped
			);
			return {
				success: failed.length === 0,
				outputPath: successful[0]?.outputPath,
				artifacts: successful.map((item) => item.outputPath),
				errors: failed.map(
					(item) => item.error ?? `${item.target} generation failed`
				),
				specPath: result.specPath,
			};
		});
	}

	private async handleSyncSpecs(): Promise<any> {
		if (!this.workspaceAdapters || !this.workspaceConfig) {
			throw new Error('Workspace not properly initialized');
		}

			const result = await syncSpecs(
				this.workspaceAdapters as any,
				this.workspaceConfig as any
			);
		const failedRuns = result.runs.filter((run) => Boolean(run.error));
		return {
			specsProcessed: result.runs.length,
			specsBuilt: result.runs.length - failedRuns.length,
			specsFailed: failedRuns.length,
			errors: failedRuns.map((run) =>
				`${run.specPath}: ${run.error?.message ?? 'unknown sync error'}`
			),
		};
	}

	private async handleWatchSpecs(params: { enabled: boolean }): Promise<any> {
		if (!this.workspaceAdapters || !this.workspaceConfig) {
			throw new Error('Workspace not properly initialized');
		}

		if (!params.enabled) {
			if (this.activeWatcher) {
				await this.activeWatcher.close();
				this.activeWatcher = null;
			}
			return { enabled: false };
		}

		if (!this.activeWatcher) {
			this.activeWatcher = watchSpecs(
				{
					watcher: this.workspaceAdapters.watcher,
					fs: this.workspaceAdapters.fs,
					logger: this.workspaceAdapters.logger,
				},
				this.workspaceConfig,
				{
					pattern: '**/*.{command,query,operation,operations,event,presentation,feature,workflow,data-view,form,migration,telemetry,experiment,app-config,integration,knowledge,policy,test-spec}.ts',
					runBuild: true,
				}
			);
		}

		return { enabled: true };
	}

	private async handleCleanGeneratedFiles(params: {
		dryRun?: boolean;
	}): Promise<any> {
		if (!this.workspaceAdapters || !this.workspaceConfig) {
			throw new Error('Workspace not properly initialized');
		}

			const result = await cleanArtifacts(this.workspaceAdapters as any, {
			// Bridge adapters are created by bundle.workspace; cast locally to
			// satisfy the bridge package’s isolated type surface.
			dryRun: params.dryRun || false,
			outputDir: this.workspaceConfig.outputDir,
		} as any);
		return {
			dryRun: params.dryRun || false,
			filesRemoved: result.removed.map((item) => item.path),
			filesSkipped: result.skipped.map(
				(item) => `${item.path}${item.reason ? ` (${item.reason})` : ''}`
			),
		};
	}

	// Analysis handlers
	private async handleAnalyzeDependencies(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		const result = await analyzeDeps(
			{ fs: this.workspaceAdapters.fs }
		);

		return {
			dependencies: Object.fromEntries(
				Array.from(result.graph.entries()).map(([key, node]) => [
					key,
					node.dependencies,
				])
			),
			circularDeps: result.cycles,
			specs: Array.from(result.graph.entries()).map(([key, node]) => ({
				name: key,
				filePath: node.file,
			})),
		};
	}

	private async handleCompareSpecs(params: {
		leftPath: string;
		rightPath: string;
		semantic?: boolean;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return await compareSpecs(
			params.leftPath,
			params.rightPath,
			{
				fs: this.workspaceAdapters.fs as any,
				git: this.workspaceAdapters.git as any,
			},
			{}
		);
	}

	private async handleCompareWithGit(params: {
		filePath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return unsupported('compareWithGit');
	}

	private async handleAnalyzeIntegrity(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

			return await analyzeIntegrity(this.workspaceAdapters as any);
	}

	// OpenAPI handlers
	private async handleExportToOpenApi(params: {
		specPath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return await exportOpenApi(
			{ registryPath: params.specPath },
			{
				fs: this.workspaceAdapters.fs,
				logger: this.workspaceAdapters.logger,
			}
		);
	}

	private async handleImportFromOpenApi(params: {
		openApiPath: string;
		outputPath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters || !this.workspaceConfig)
			throw new Error('Workspace adapters not initialized');

		return await importFromOpenApiService(
			this.workspaceConfig,
			{
				source: params.openApiPath,
				outputDir: params.outputPath,
			},
			{
				fs: this.workspaceAdapters.fs,
				logger: this.workspaceAdapters.logger,
			}
		);
	}

	private async handleValidateAgainstOpenApi(params: {
		specPath: string;
		openApiPath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return await validateAgainstOpenApiService(
			{
				specPath: params.specPath,
				openApiSource: params.openApiPath,
			},
			{
				fs: this.workspaceAdapters.fs,
				logger: this.workspaceAdapters.logger,
			}
		);
	}

	// Registry handlers
	private async handleBrowseRegistry(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return {
			items: await listFromRegistry(
				{},
				{ logger: this.workspaceAdapters.logger }
			),
		};
	}

	private async handleSearchRegistry(params: { query: string }): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return {
			items: await searchRegistry(
				params.query,
				{},
				{ logger: this.workspaceAdapters.logger }
			),
		};
	}

	private async handleAddFromRegistry(params: {
		specId: string;
		outputPath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		await addToRegistry(
			params.specId,
			{},
			{ logger: this.workspaceAdapters.logger }
		);
		return {
			added: true,
			specPath: params.specId,
			outputPath: params.outputPath,
		};
	}

	// Examples handlers
	private async handleBrowseExamples(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return unsupported('browseExamples');
	}

	private async handleInitExample(params: {
		exampleId: string;
		outputPath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return unsupported('initExample');
	}

	// Setup handlers
	private async handleRunSetupWizard(
		params: {
			preset?: 'core' | 'connect' | 'builder-managed' | 'builder-local' | 'builder-hybrid';
			projectName?: string;
			builderApiBaseUrl?: string;
			builderLocalRuntimeId?: string;
			builderLocalGrantedTo?: string;
		} = {}
	): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return await runSetup(this.workspaceAdapters.fs, {
			interactive: false,
			targets: [],
			workspaceRoot: this.workspaceRoot ?? process.cwd(),
			preset: params.preset,
			projectName: params.projectName,
			builderApiBaseUrl: params.builderApiBaseUrl,
			builderLocalRuntimeId: params.builderLocalRuntimeId,
			builderLocalGrantedTo: params.builderLocalGrantedTo,
		});
	}

	private async handleRunQuickSetup(
		params: {
			preset?: 'core' | 'connect' | 'builder-managed' | 'builder-local' | 'builder-hybrid';
		} = {}
	): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return await runSetup(this.workspaceAdapters.fs, {
			interactive: false,
			targets: [],
			workspaceRoot: this.workspaceRoot ?? process.cwd(),
			preset: params.preset ?? 'core',
		});
	}

	private async handleRunDoctorCheck(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return await runDoctor(
			{
				fs: this.workspaceAdapters.fs as any,
				logger: this.workspaceAdapters.logger as any,
			},
			{
				workspaceRoot: this.workspaceRoot ?? process.cwd(),
			}
		);
	}

	// Workspace handlers
	private async handleGetWorkspaceInfo(): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		return getWorkspaceInfo(this.workspaceRoot ?? process.cwd());
	}

	// LLM handlers
	private async handleExportForLLM(params: {
		specPath: string;
		format?: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		void params;
		return unsupported('exportForLLM');
	}

	private async handleGenerateImplementationGuide(params: {
		specPath: string;
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		void params;
		return unsupported('generateImplementationGuide');
	}

	private async handleVerifyImplementation(params: {
		specPath: string;
		implementationPaths: string[];
	}): Promise<any> {
		if (!this.workspaceAdapters)
			throw new Error('Workspace adapters not initialized');

		void params;
		return unsupported('verifyImplementation');
	}
}
