/**
 * Contracts MCP service interface.
 *
 * Defines the dependency-injection boundary so `bundle.library` stays
 * decoupled from `bundle.workspace`. The app layer wires real impls.
 */

export interface ContractInfo {
	specType: string;
	filePath: string;
	key?: string;
	version?: string;
	kind?: string;
	description?: string;
}

export interface ContractsMcpServices {
	listSpecs(options?: {
		pattern?: string;
		type?: string;
	}): Promise<ContractInfo[]>;

	getSpec(
		path: string
	): Promise<{ content: string; info: ContractInfo } | null>;

	validateSpec(
		path: string
	): Promise<{ valid: boolean; errors: string[]; warnings: string[] }>;

	buildSpec(
		path: string,
		options?: { dryRun?: boolean }
	): Promise<{ results: unknown[] }>;

	updateSpec(
		path: string,
		options: { content?: string; fields?: unknown[] }
	): Promise<{ updated: boolean; errors: string[]; warnings: string[] }>;

	deleteSpec(
		path: string,
		options?: { clean?: boolean }
	): Promise<{ deleted: boolean; cleanedFiles: string[]; errors: string[] }>;

	fetchRegistryManifest(): Promise<unknown>;

	searchAdoptionCatalog(options: {
		family?: string;
		platform?: string;
		query: string;
	}): Promise<unknown[]>;

	resolveAdoption(options: {
		family: string;
		paths?: string[];
		platform?: string;
		query: string;
		runtime?: string;
	}): Promise<unknown>;

	syncAdoptionCatalog(): Promise<{ catalogPath: string; total: number }>;
}
