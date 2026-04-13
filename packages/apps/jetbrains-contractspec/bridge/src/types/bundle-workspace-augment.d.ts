import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';

declare module '@contractspec/module.workspace' {
	interface SpecScanResult {
		exportName?: string;
		declarationLine?: number;
		discoveryId?: string;
	}
}

declare module '@contractspec/bundle.workspace' {
	function discoverSpecs(
		adapters: { fs: unknown },
		options?: {
			config?: ResolvedContractsrcConfig;
			paths?: string[];
			pattern?: string;
			cwd?: string;
			type?: string | string[];
		}
	): Promise<import('@contractspec/module.workspace').SpecScanResult[]>;

	function validateDiscoveredSpecs(
		specs: import('@contractspec/module.workspace').SpecScanResult[],
		options?: { skipStructure?: boolean }
	): Promise<
		Array<{
			spec: import('@contractspec/module.workspace').SpecScanResult;
			valid: boolean;
			errors: string[];
			warnings: string[];
			code?: string;
		}>
	>;
}
