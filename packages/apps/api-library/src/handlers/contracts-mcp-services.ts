/**
 * Wires bundle.workspace services into the ContractsMcpServices interface
 * expected by the contracts MCP handler in bundle.library.
 */

import type { ContractsMcpServices } from '@contractspec/bundle.library/application/mcp/contractsMcpTypes';
import {
	buildSpec,
	createNodeAdapters,
	deleteSpec,
	listSpecs,
	module,
	RegistryClient,
	resolveRegistryUrl,
	updateSpec,
	validateSpec,
} from '@contractspec/bundle.workspace';
import {
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';

export function createContractsMcpServices(
	config?: ResolvedContractsrcConfig
): ContractsMcpServices {
	const adapters = createNodeAdapters({ config });
	const resolvedConfig = config ?? DEFAULT_CONTRACTSRC;

	return {
		async listSpecs(options) {
			const specs = await listSpecs(adapters, {
				pattern: options?.pattern,
				type: options?.type,
			});
			return specs.map((s) => ({
				specType: s.specType,
				filePath: s.filePath,
				key: s.key,
				version: s.version,
				kind: s.kind,
				description: s.description,
			}));
		},

		async getSpec(path) {
			const exists = await adapters.fs.exists(path);
			if (!exists) return null;

			const content = await adapters.fs.readFile(path);
			const info = module.scanSpecSource(content, path);

			return {
				content,
				info: {
					specType: info.specType,
					filePath: info.filePath,
					key: info.key,
					version: info.version,
					kind: info.kind,
					description: info.description,
				},
			};
		},

		async validateSpec(path) {
			const result = await validateSpec(path, adapters);
			return {
				valid: result.valid,
				errors: result.errors,
				warnings: result.warnings,
			};
		},

		async buildSpec(path, options) {
			const result = await buildSpec(path, adapters, resolvedConfig, {
				dryRun: options?.dryRun,
			});
			return { results: result.results };
		},

		async updateSpec(path, options) {
			const result = await updateSpec(path, adapters, {
				content: options.content,
				fields: Array.isArray(options.fields)
					? (options.fields as { key: string; value: string }[])
					: undefined,
			});
			return {
				updated: result.updated,
				errors: result.errors,
				warnings: result.warnings,
			};
		},

		async deleteSpec(path, options) {
			const result = await deleteSpec(path, adapters, {
				clean: options?.clean,
			});
			return {
				deleted: result.deleted,
				cleanedFiles: result.cleanedFiles,
				errors: result.errors,
			};
		},

		async fetchRegistryManifest() {
			const url = resolveRegistryUrl();
			const client = new RegistryClient({ registryUrl: url });
			return client.getJson('/r/contractspec.json');
		},
	};
}
