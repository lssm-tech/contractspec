/**
 * Impact detection CLI command.
 *
 * Detects breaking and non-breaking changes between contract versions.
 *
 * Usage:
 *   contractspec impact                     # Compare against default branch
 *   contractspec impact --baseline main     # Compare against specific ref
 *   contractspec impact --format json       # Output as JSON
 *   contractspec impact --format markdown   # Output as markdown
 *   contractspec impact --fail-on-breaking  # Exit with error if breaking
 *
 * @module commands/impact
 */

import {
	createConsoleLoggerAdapter,
	createNodeFsAdapter,
	createNodeGitAdapter,
	createNoopLoggerAdapter,
	impact,
} from '@contractspec/bundle.workspace';
import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { Command } from 'commander';

export type ImpactOutputFormat = 'text' | 'json' | 'markdown' | 'check-run';

export interface ImpactCommandOptions {
	baseline?: string;
	format?: ImpactOutputFormat;
	failOnBreaking?: boolean;
	pattern?: string;
	quiet?: boolean;
}

export const ContractSpecImpactCommandDocBlock = {
	id: 'cli.impact',
	title: 'contractspec impact Command',
	kind: 'usage',
	visibility: 'public',
	route: '/docs/cli/impact',
	body: `
# contractspec impact

Detect breaking and non-breaking contract changes.

## Usage

\`\`\`bash
contractspec impact [options]
\`\`\`

## Options

- \`-b, --baseline <ref>\` - Git ref to compare against (branch, tag, commit)
- \`-f, --format <format>\` - Output format: text, json, markdown, check-run (default: text)
- \`--fail-on-breaking\` - Exit with error code if breaking changes detected
- \`-p, --pattern <glob>\` - Glob pattern for spec discovery
- \`-q, --quiet\` - Minimal output

## Examples

\`\`\`bash
# Compare against main branch
contractspec impact --baseline origin/main

# Get JSON output for CI integration
contractspec impact --format json > impact.json

# Fail build on breaking changes
contractspec impact --fail-on-breaking

# Custom spec pattern
contractspec impact --pattern "src/**/*.operation.ts"
\`\`\`

## Output Formats

### Text (default)
Human-readable console output with icons and summary.

### JSON
Machine-readable JSON with full impact result including deltas, summaries, and metadata.

### Markdown
GitHub-flavored markdown suitable for PR comments.

### Check Run
GitHub Check Run payload format for API integration.

## Exit Codes

- \`0\` - Success (no breaking changes, or breaking changes allowed)
- \`1\` - Failure (breaking changes detected with --fail-on-breaking, or error)
  `,
	tags: ['cli', 'impact-detection'],
} satisfies DocBlock;

/**
 * Create the impact command.
 */
export function createImpactCommand(): Command {
	const command = new Command('impact')
		.description('Detect breaking and non-breaking contract changes')
		.option(
			'-b, --baseline <ref>',
			'Git ref to compare against (branch, tag, commit)'
		)
		.option(
			'-f, --format <format>',
			'Output format (text, json, markdown, check-run)',
			'text'
		)
		.option(
			'--fail-on-breaking',
			'Exit with error code if breaking changes detected'
		)
		.option('-p, --pattern <glob>', 'Glob pattern for spec discovery')
		.option('-q, --quiet', 'Minimal output')
		.action(runImpactCommand);

	return command;
}

/**
 * Run the impact command.
 */
/**
 * Run the impact command.
 */
export async function runImpactCommand(
	options: ImpactCommandOptions
): Promise<void> {
	const fs = createNodeFsAdapter();
	const git = createNodeGitAdapter();
	// Use noop logger for machine-readable formats to keep stdout clean
	const isTextOutput = options.format === 'text' || !options.format;
	const logger = isTextOutput
		? createConsoleLoggerAdapter()
		: createNoopLoggerAdapter();

	try {
		const result = await impact.detectImpact(
			{ fs, git, logger },
			{
				baseline: options.baseline,
				pattern: options.pattern,
			}
		);

		// Format and output result
		const format = options.format ?? 'text';
		let output: string;

		switch (format) {
			case 'json':
				output = impact.formatJson(result);
				break;
			case 'markdown':
				output = impact.formatPrComment(result, { template: 'detailed' });
				break;
			case 'check-run':
				output = JSON.stringify(
					impact.formatCheckRun(result, 'HEAD', {
						failOnBreaking: options.failOnBreaking,
					}),
					null,
					2
				);
				break;
			case 'text':
			default:
				output = formatTextOutput(result);
				break;
		}

		console.log(output);

		// Exit with error if breaking changes and flag is set
		if (options.failOnBreaking && result.hasBreaking) {
			process.exit(1);
		}
	} catch (error) {
		logger.error('Impact detection failed', { error });
		process.exit(1);
	}
}

/**
 * Format result as text output.
 */
function formatTextOutput(
	result: Awaited<ReturnType<typeof impact.detectImpact>>
): string {
	const lines: string[] = [];

	// Status
	if (result.hasBreaking) {
		lines.push('❌ Breaking changes detected');
	} else if (result.hasNonBreaking) {
		lines.push('⚠️  Contract changed (non-breaking)');
	} else {
		lines.push('✅ No contract impact');
	}
	lines.push('');

	// Summary
	if (result.summary.breaking > 0) {
		lines.push(`  Breaking:     ${result.summary.breaking}`);
	}
	if (result.summary.nonBreaking > 0) {
		lines.push(`  Non-breaking: ${result.summary.nonBreaking}`);
	}
	if (result.summary.added > 0) {
		lines.push(`  Added:        ${result.summary.added}`);
	}
	if (result.summary.removed > 0) {
		lines.push(`  Removed:      ${result.summary.removed}`);
	}

	// Details
	if (result.deltas.length > 0) {
		lines.push('');
		lines.push('Changes:');
		for (const delta of result.deltas.slice(0, 20)) {
			const icon =
				delta.severity === 'breaking'
					? '🔴'
					: delta.severity === 'non_breaking'
						? '🟡'
						: '🔵';
			lines.push(`  ${icon} ${delta.specKey}: ${delta.description}`);
		}
		if (result.deltas.length > 20) {
			lines.push(`  ... and ${result.deltas.length - 20} more`);
		}
	}

	return lines.join('\n');
}
