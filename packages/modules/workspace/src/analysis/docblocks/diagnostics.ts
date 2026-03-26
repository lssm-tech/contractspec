import path from 'node:path';

export type DocBlockDiagnosticSeverity = 'error' | 'warning';

export interface DocBlockDiagnostic {
	ruleId: string;
	message: string;
	severity: DocBlockDiagnosticSeverity;
	file: string;
	line?: number;
	column?: number;
	context?: Record<string, unknown>;
}

const OWNER_SUFFIX_PATTERNS = [
	'.feature',
	'.command',
	'.query',
	'.operation',
	'.event',
	'.form',
	'.view',
	'.presentation',
	'.capability',
	'.dataView',
	'.data-view',
	'.service',
];

export function isAllowedDocOwnerModule(
	filePath: string,
	sourceModule: string
): boolean {
	const normalizedFilePath = filePath.replaceAll('\\', '/');
	const normalizedSourceModule = sourceModule.replaceAll('\\', '/');
	const baseName = path.posix.basename(normalizedSourceModule);

	if (
		baseName === 'index' ||
		baseName === 'spec' ||
		baseName === 'feature' ||
		baseName === 'extension'
	) {
		return true;
	}

	if (OWNER_SUFFIX_PATTERNS.some((suffix) => baseName.endsWith(suffix))) {
		return true;
	}

	if (
		/\/(commands|queries|events|forms|views|presentations|capabilities|services)\//.test(
			normalizedFilePath
		)
	) {
		return true;
	}

	return !/\/docs\//.test(normalizedFilePath);
}

export function formatDocBlockDiagnostics(
	diagnostics: readonly DocBlockDiagnostic[]
): string {
	return diagnostics
		.map((diagnostic) => {
			const location =
				diagnostic.line && diagnostic.column
					? `${diagnostic.file}:${diagnostic.line}:${diagnostic.column}`
					: diagnostic.file;
			return `${diagnostic.ruleId}: ${diagnostic.message} (${location})`;
		})
		.join('\n');
}
