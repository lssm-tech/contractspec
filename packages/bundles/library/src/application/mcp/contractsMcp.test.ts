import { describe, expect, it } from 'bun:test';
import { buildContractsResources } from './contractsMcpResources';
import { buildContractsOps } from './contractsMcpTools';
import type { ContractsMcpServices } from './contractsMcpTypes';

const services: ContractsMcpServices = {
	async buildSpec() {
		return { results: [] };
	},
	async deleteSpec() {
		return { cleanedFiles: [], deleted: true, errors: [] };
	},
	async fetchRegistryManifest() {
		return {};
	},
	async getSpec() {
		return null;
	},
	async listSpecs() {
		return [];
	},
	async resolveAdoption(options) {
		return {
			ambiguous: false,
			candidates: [],
			exhausted: false,
			family: options.family,
			query: options.query,
			reason: `Resolved ${options.family}`,
			selected: null,
			verdict: 'rewrite',
		};
	},
	async searchAdoptionCatalog() {
		return [{ packageRef: '@contractspec/lib.contracts-spec' }];
	},
	async syncAdoptionCatalog() {
		return { catalogPath: '.contractspec/adoption/catalog.json', total: 1 };
	},
	async updateSpec() {
		return { errors: [], updated: true, warnings: [] };
	},
	async validateSpec() {
		return { errors: [], valid: true, warnings: [] };
	},
};

describe('contracts MCP adoption extensions', () => {
	it('registers adoption tools alongside contract tools', () => {
		const registry = buildContractsOps(services);
		const keys = registry.list().map((spec) => spec.meta.key);

		expect(keys).toContain('adoption.catalog_search');
		expect(keys).toContain('adoption.resolve');
		expect(keys).toContain('adoption.sync');
	});

	it('registers adoption resources', () => {
		const resources = buildContractsResources(services);
		const uris = resources.listTemplates().map((tmpl) => tmpl.meta.uriTemplate);

		expect(uris).toContain('adoption://catalog');
		expect(uris).toContain('adoption://policy/{family}');
	});
});
