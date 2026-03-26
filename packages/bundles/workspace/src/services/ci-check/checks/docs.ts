import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { analyzeWorkspaceDocBlocks } from '../../docs/docblock-audit';
import type { CICheckOptions, CIIssue } from '../types';

export async function runDocsChecks(
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	options: CICheckOptions
): Promise<CIIssue[]> {
	const workspaceRoot = options.workspaceRoot ?? process.cwd();
	const diagnostics = await analyzeWorkspaceDocBlocks(
		adapters.fs,
		workspaceRoot
	);

	return diagnostics.map((diagnostic) => ({
		ruleId: diagnostic.ruleId,
		severity: diagnostic.severity === 'warning' ? 'warning' : 'error',
		message: diagnostic.message,
		category: 'docs',
		file: diagnostic.file,
		line: diagnostic.line,
		column: diagnostic.column,
		context: {
			packageName: diagnostic.packageName,
			packageRoot: diagnostic.packageRoot,
			...diagnostic.context,
		},
	}));
}
