/**
 * Bridge Server for ContractSpec JetBrains Plugin
 *
 * Handles JSON-RPC communication with the Kotlin plugin,
 * delegating to ContractSpec workspace services.
 */

import { Connection } from 'vscode-languageserver/node';
import {
  InitializeParams,
  InitializeResult,
  TextDocumentChangeEvent,
} from 'vscode-languageserver-protocol';

import {
  addFromRegistry,
  analyzeDependencies,
  analyzeIntegrity,
  browseExamples,
  browseRegistry,
  buildSpec,
  cleanGeneratedFiles,
  compareSpecs,
  compareWithGit,
  createNodeAdapters,
  exportForLLM,
  exportToOpenApi,
  generateImplementationGuide,
  getWorkspaceInfo,
  importFromOpenApi,
  initExample,
  listSpecs,
  loadWorkspaceConfig,
  runDoctorCheck,
  runQuickSetup,
  runSetupWizard,
  searchRegistry,
  syncSpecs,
  validateAgainstOpenApi,
  validateSpec,
  validateSpecs,
  verifyImplementation,
  watchSpecs,
  type WorkspaceAdapters,
  type WorkspaceConfig,
} from '@lssm/bundle.contractspec-workspace';

export class BridgeServer {
  private connection: Connection;
  private workspaceAdapters: WorkspaceAdapters | null = null;
  private workspaceConfig: WorkspaceConfig | null = null;

  constructor(connection: Connection) {
    this.connection = connection;
    this.setupMethodHandlers();
  }

  onInitialize(params: InitializeParams): InitializeResult {
    // Extract workspace root from initialization params
    const workspaceRoot = params.rootUri || params.rootPath;

    if (workspaceRoot) {
      // Initialize workspace adapters
      this.workspaceAdapters = createNodeAdapters({
        cwd: workspaceRoot.replace('file://', ''),
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

    return await validateSpec(params.filePath, this.workspaceAdapters);
  }

  private async handleValidateSpecs(params: {
    filePaths: string[];
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await validateSpecs(params.filePaths, this.workspaceAdapters);
  }

  private async handleListSpecs(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await listSpecs(this.workspaceAdapters);
  }

  // Build handlers
  private async handleBuildSpec(params: { filePath: string }): Promise<any> {
    if (!this.workspaceAdapters || !this.workspaceConfig) {
      throw new Error('Workspace not properly initialized');
    }

    return await buildSpec(
      params.filePath,
      this.workspaceAdapters,
      this.workspaceConfig
    );
  }

  private async handleSyncSpecs(): Promise<any> {
    if (!this.workspaceAdapters || !this.workspaceConfig) {
      throw new Error('Workspace not properly initialized');
    }

    return await syncSpecs(this.workspaceAdapters, this.workspaceConfig);
  }

  private async handleWatchSpecs(params: { enabled: boolean }): Promise<any> {
    if (!this.workspaceAdapters || !this.workspaceConfig) {
      throw new Error('Workspace not properly initialized');
    }

    return await watchSpecs(
      params.enabled,
      this.workspaceAdapters,
      this.workspaceConfig
    );
  }

  private async handleCleanGeneratedFiles(params: {
    dryRun?: boolean;
  }): Promise<any> {
    if (!this.workspaceAdapters || !this.workspaceConfig) {
      throw new Error('Workspace not properly initialized');
    }

    return await cleanGeneratedFiles(
      params.dryRun || false,
      this.workspaceAdapters,
      this.workspaceConfig
    );
  }

  // Analysis handlers
  private async handleAnalyzeDependencies(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await analyzeDependencies(this.workspaceAdapters);
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
      params.semantic || true,
      this.workspaceAdapters
    );
  }

  private async handleCompareWithGit(params: {
    filePath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await compareWithGit(params.filePath, this.workspaceAdapters);
  }

  private async handleAnalyzeIntegrity(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await analyzeIntegrity(this.workspaceAdapters);
  }

  // OpenAPI handlers
  private async handleExportToOpenApi(params: {
    specPath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await exportToOpenApi(params.specPath, this.workspaceAdapters);
  }

  private async handleImportFromOpenApi(params: {
    openApiPath: string;
    outputPath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await importFromOpenApi(
      params.openApiPath,
      params.outputPath,
      this.workspaceAdapters
    );
  }

  private async handleValidateAgainstOpenApi(params: {
    specPath: string;
    openApiPath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await validateAgainstOpenApi(
      params.specPath,
      params.openApiPath,
      this.workspaceAdapters
    );
  }

  // Registry handlers
  private async handleBrowseRegistry(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await browseRegistry(this.workspaceAdapters);
  }

  private async handleSearchRegistry(params: { query: string }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await searchRegistry(params.query, this.workspaceAdapters);
  }

  private async handleAddFromRegistry(params: {
    specId: string;
    outputPath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await addFromRegistry(
      params.specId,
      params.outputPath,
      this.workspaceAdapters
    );
  }

  // Examples handlers
  private async handleBrowseExamples(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await browseExamples(this.workspaceAdapters);
  }

  private async handleInitExample(params: {
    exampleId: string;
    outputPath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await initExample(
      params.exampleId,
      params.outputPath,
      this.workspaceAdapters
    );
  }

  // Setup handlers
  private async handleRunSetupWizard(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await runSetupWizard(this.workspaceAdapters);
  }

  private async handleRunQuickSetup(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await runQuickSetup(this.workspaceAdapters);
  }

  private async handleRunDoctorCheck(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await runDoctorCheck(this.workspaceAdapters);
  }

  // Workspace handlers
  private async handleGetWorkspaceInfo(): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await getWorkspaceInfo(this.workspaceAdapters);
  }

  // LLM handlers
  private async handleExportForLLM(params: {
    specPath: string;
    format?: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await exportForLLM(
      params.specPath,
      params.format,
      this.workspaceAdapters
    );
  }

  private async handleGenerateImplementationGuide(params: {
    specPath: string;
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await generateImplementationGuide(
      params.specPath,
      this.workspaceAdapters
    );
  }

  private async handleVerifyImplementation(params: {
    specPath: string;
    implementationPaths: string[];
  }): Promise<any> {
    if (!this.workspaceAdapters)
      throw new Error('Workspace adapters not initialized');

    return await verifyImplementation(
      params.specPath,
      params.implementationPaths,
      this.workspaceAdapters
    );
  }
}
