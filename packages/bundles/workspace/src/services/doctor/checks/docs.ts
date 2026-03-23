import type { FsAdapter } from '../../../ports/fs';
import { analyzeWorkspaceDocBlocks } from '../../docs/docblock-audit';
import type { CheckContext, CheckResult } from '../types';

export async function runDocChecks(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult[]> {
	const diagnostics = await analyzeWorkspaceDocBlocks(fs, ctx.workspaceRoot);

	if (diagnostics.length === 0) {
		return [
			{
				category: 'docs',
				name: 'Same-File DocBlocks',
				status: 'pass',
				message: 'All analyzed packages follow the same-file DocBlock rules.',
			},
		];
	}

	return diagnostics.map((diagnostic) => ({
		category: 'docs',
		name: `Same-File DocBlocks (${diagnostic.packageName})`,
		status: diagnostic.severity === 'warning' ? 'warn' : 'fail',
		message: diagnostic.message,
		details: fs.relative(ctx.workspaceRoot, diagnostic.file),
		context: {
			ruleId: diagnostic.ruleId,
			file: diagnostic.file,
			line: diagnostic.line,
			column: diagnostic.column,
			packageName: diagnostic.packageName,
		},
	}));
}
