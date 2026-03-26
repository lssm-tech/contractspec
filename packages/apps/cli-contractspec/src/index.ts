import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	type DocBlock,
	registerDocBlocks,
} from '@contractspec/lib.contracts-spec/docs';
import chalk from 'chalk';
import { Command, Help } from 'commander';
import { actionDriftCommand } from './commands/action-drift/index';
import { actionPrCommand } from './commands/action-pr/index';
import { agentCommand } from './commands/agent/index';
import { applyCommand } from './commands/apply/index';
import { buildCommand } from './commands/build-cmd/index';
import { createChangelogCommand } from './commands/changelog/index';
import { chatCommand } from './commands/chat/index';
import { ciCommand } from './commands/ci/index';
import { cicdCommand } from './commands/cicd/index';
import { cleanCommand } from './commands/clean/index';
import { controlPlaneCommand } from './commands/control-plane/index';
import { createCommand } from './commands/create/index';
import { deleteCommand } from './commands/delete/index';
import { depsCommand } from './commands/deps/index';
import { diffCommand } from './commands/diff/index';
import { createDocsCommand } from './commands/docs/index';
import { doctorCommand } from './commands/doctor/index';
import { examplesCommand } from './commands/examples/index';
import { extractCommand } from './commands/extract/index';
import { fixCommand } from './commands/fix/index';
import { gapCommand } from './commands/gap/index';
import { generateCommand } from './commands/generate/index';
import { registerHookCommand } from './commands/hook/index';
import { createImpactCommand } from './commands/impact/index';
import { createImplCommand } from './commands/impl/index';
import { importCommand } from './commands/import/index';
import { initCommand } from './commands/init/index';
import { integrityCommand } from './commands/integrity/index';
import { listCommand } from './commands/list/index';
import { llmCommand } from './commands/llm/index';
import { openapiCommand } from './commands/openapi/index';
import { pluginsCommand } from './commands/plugins/index';
import { quickstartCommand } from './commands/quickstart/index';
import { regeneratorCommand } from './commands/regenerator/index';
import { registryCommand } from './commands/registry/index';
import { syncCommand } from './commands/sync/index';
import { generateGoldenTestsCommand } from './commands/test/generate';
import { testCommand } from './commands/test/index';
import { updateCommand } from './commands/update/index';
import { upgradeCommand } from './commands/upgrade/index';
import { validateCommand } from './commands/validate/index';
import { createVersionCommand } from './commands/version/index';
import { vibeCommand } from './commands/vibe/index';
import { viewCommand } from './commands/view/index';
import { watchCommand } from './commands/watch/index';
import { workspaceCommand } from './commands/workspace/index';
import { loadConfig, mergeConfig } from './utils/config';

// Define categories
const CATEGORY_ESSENTIALS = 'Essentials';
const CATEGORY_DEVELOPMENT = 'Development';
const CATEGORY_TESTING = 'Testing & Quality';
const CATEGORY_AI = 'AI & Assistants';
const CATEGORY_OPERATIONS = 'Operations';
const CATEGORY_INTEGRATION = 'Integration';
const CATEGORY_ECOSYSTEM = 'Ecosystem';
const CATEGORY_OTHER = 'Other';

const CATEGORY_ORDER = [
	CATEGORY_ESSENTIALS,
	CATEGORY_DEVELOPMENT,
	CATEGORY_TESTING,
	CATEGORY_AI,
	CATEGORY_OPERATIONS,
	CATEGORY_INTEGRATION,
	CATEGORY_ECOSYSTEM,
	CATEGORY_OTHER,
];

// Custom Help class to group commands
class GroupedHelp extends Help {
	formatHelp(cmd: Command, helper: Help): string {
		// Get standard help output using base Help class
		// We create a new instance to avoid recursive calls if we called super.formatHelp (which might be bound)
		const raw = new Help().formatHelp(cmd, helper);

		// Split at "Commands:" to replace the list
		// The standard output puts Commands at the end or before options?
		// Usually usage -> options -> commands or usage -> commands -> options.
		// Commander 14 usually does usage -> options -> commands.

		const splitTag = '\nCommands:\n';
		if (!raw.includes(splitTag)) {
			// Maybe it has no commands or different format, just return raw
			return raw;
		}

		const [preCommands] = raw.split(splitTag);

		// There might be content AFTER commands (like arguments description?),
		// but usually Commands is the last section or followed by nothing.
		// However, if we split by "Commands:", postCommands contains the list.
		// If there is another section after, it would be in postCommands.
		// For specific grouping, we want to REPLACE the command list.
		// Since we don't know easily where the list ends if there are other sections,
		// we assume Commands is the last big section or we just regenerate strictly the command list
		// and ignore potentially lost footer info (which is rare).
		// Actually, let's just use the `preCommands` and append our groups.

		const formattedGroups = this.formatCommandGroups(cmd, helper);
		return `${preCommands}${splitTag}${formattedGroups}`;
	}

	formatCommandGroups(cmd: Command, helper: Help): string {
		const commands = helper.visibleCommands(cmd);
		if (!commands.length) return '';

		// Calculate global width to align all groups
		const termWidth = helper.padWidth(cmd, helper);

		// Create a scoped helper that enforces the global width
		const scopedHelper = Object.create(helper);
		scopedHelper.padWidth = () => termWidth;

		const groups: Record<string, Command[]> = {};
		commands.forEach((c) => {
			const cat =
				(c as Command & { category?: string }).category || CATEGORY_OTHER;
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(c);
		});

		return CATEGORY_ORDER.filter((cat) => groups[cat] && groups[cat].length > 0)
			.map((cat) => {
				const groupCmds = groups[cat] || [];
				// Create a dummy command to use standard formatter for this group
				const dummyCmd = new Command();
				groupCmds.forEach((c) => dummyCmd.addCommand(c));

				// Use the base Help formatHelp to get the full help info for this dummy command
				// Then extract just the commands list
				const dummyHelp = new Help().formatHelp(dummyCmd, scopedHelper);
				const split = dummyHelp.split('\nCommands:\n');

				// If we found the commands section, take it. Otherwise fallback to raw (shouldn't happen if commands exist)
				const subsetOutput = split[1] || dummyHelp;

				// Strip trailing newlines/misc
				const cleanOutput = subsetOutput.replace(/\n+$/, '');

				return `${chalk.yellow.bold(cat)}\n${cleanOutput}`;
			})
			.join('\n\n');
	}
}

const program = new Command();

function resolveCliVersion() {
	const envVersion = process.env.CONTRACTSPEC_CLI_VERSION;
	if (typeof envVersion === 'string' && envVersion.length > 0) {
		return envVersion;
	}

	const currentDir = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		resolve(currentDir, '../package.json'),
		resolve(currentDir, '../../package.json'),
		resolve(currentDir, '../../../package.json'),
	];

	for (const candidate of candidates) {
		if (!existsSync(candidate)) continue;
		try {
			const packageJson = JSON.parse(readFileSync(candidate, 'utf8'));
			if (typeof packageJson.version === 'string') {
				return packageJson.version;
			}
		} catch {
			// Fall through to the next candidate.
		}
	}

	return '0.0.1';
}

program
	.name('contractspec')
	.description(
		'CLI tool for creating, building, and validating contract specifications'
	)
	.version(resolveCliVersion())
	.configureHelp(new GroupedHelp());

// Helper to set category
function withCategory(cmd: Command, category: string): Command {
	(cmd as Command & { category: string }).category = category;
	return cmd;
}

// Essentials
program.addCommand(withCategory(initCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(createDocsCommand(), CATEGORY_OTHER));
program.addCommand(withCategory(listCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(quickstartCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(workspaceCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(viewCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(generateCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(extractCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(gapCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(applyCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(importCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(updateCommand, CATEGORY_ESSENTIALS));
program.addCommand(withCategory(deleteCommand, CATEGORY_ESSENTIALS));

// Development
program.addCommand(withCategory(watchCommand, CATEGORY_DEVELOPMENT));
program.addCommand(withCategory(syncCommand, CATEGORY_DEVELOPMENT));
program.addCommand(withCategory(cleanCommand, CATEGORY_DEVELOPMENT));
program.addCommand(withCategory(depsCommand, CATEGORY_DEVELOPMENT));
program.addCommand(withCategory(diffCommand, CATEGORY_DEVELOPMENT));
program.addCommand(withCategory(createImplCommand(), CATEGORY_DEVELOPMENT));
program.addCommand(withCategory(fixCommand, CATEGORY_DEVELOPMENT));

// Testing & Quality
program.addCommand(withCategory(integrityCommand, CATEGORY_TESTING));
program.addCommand(withCategory(doctorCommand, CATEGORY_TESTING));
program.addCommand(withCategory(ciCommand, CATEGORY_TESTING));

// AI
program.addCommand(withCategory(llmCommand, CATEGORY_AI));
program.addCommand(withCategory(chatCommand, CATEGORY_AI));
program.addCommand(withCategory(agentCommand, CATEGORY_AI));

// Operations
program.addCommand(withCategory(createImpactCommand(), CATEGORY_OPERATIONS));
program.addCommand(withCategory(controlPlaneCommand, CATEGORY_OPERATIONS));
program.addCommand(withCategory(cicdCommand, CATEGORY_OPERATIONS));
program.addCommand(withCategory(createVersionCommand(), CATEGORY_OPERATIONS));
program.addCommand(withCategory(createChangelogCommand(), CATEGORY_OPERATIONS));
program.addCommand(withCategory(actionPrCommand, CATEGORY_OPERATIONS));
program.addCommand(withCategory(actionDriftCommand, CATEGORY_OPERATIONS));

// Register Hook command (special case as it's a function)
registerHookCommand(program);
const hookCmd = program.commands.find((c) => c.name() === 'hook');
if (hookCmd) withCategory(hookCmd, CATEGORY_OPERATIONS);

program.addCommand(withCategory(upgradeCommand, CATEGORY_OPERATIONS));

// Integration
program.addCommand(withCategory(registryCommand, CATEGORY_INTEGRATION));
program.addCommand(withCategory(openapiCommand, CATEGORY_INTEGRATION));
program.addCommand(withCategory(examplesCommand, CATEGORY_INTEGRATION));

// Ecosystem
program.addCommand(withCategory(pluginsCommand, CATEGORY_ECOSYSTEM));

// Inline Commands

// Create command
const createCmd = program
	.command('create')
	.description('Create a new contract specification')
	.option(
		'-t, --type <type>',
		'Spec type: operation, event, presentation, form, feature, workflow, data-view, migration, telemetry, experiment, app-config, integration, knowledge'
	)
	.option('--ai', 'Use AI to generate spec from description')
	.option(
		'--provider <provider>',
		'AI provider: claude, openai, ollama, custom'
	)
	.option('--model <model>', 'AI model to use')
	.option('--endpoint <endpoint>', 'Custom endpoint for AI provider')
	.option('-o, --output-dir <dir>', 'Output directory')
	.action(async (options) => {
		try {
			const config = await loadConfig();
			const mergedConfig = mergeConfig(config, options);
			await createCommand(options, mergedConfig);
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
withCategory(createCmd, CATEGORY_ESSENTIALS);

// Build command
const buildCmd = program
	.command('build')
	.description('Generate implementation code from a spec')
	.argument('<spec-file>', 'Path to spec file')
	.option('-o, --output-dir <dir>', 'Output directory (default: ./generated)')
	.option(
		'--provider <provider>',
		'AI provider: claude, openai, ollama, custom'
	)
	.option('--model <model>', 'AI model to use')
	.option(
		'--agent-mode <mode>',
		'Agent mode: simple, cursor, claude-code, openai-codex, opencode'
	)
	.option('--no-tests', 'Skip test generation')
	.option('--no-agent', 'Disable AI agent (use basic templates)')
	.action(async (specFile, options) => {
		try {
			const config = await loadConfig();
			const mergedConfig = mergeConfig(config, options);
			await buildCommand(specFile, options, mergedConfig);
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
withCategory(buildCmd, CATEGORY_DEVELOPMENT);

// Validate command
const validateCmd = program
	.command('validate')
	.description(
		'Validate a contract specification and optionally its implementation'
	)
	.argument(
		'[spec-files]',
		'Path to spec files (defaults to workspace scan)',
		undefined
	)
	.option(
		'--blueprint <path>',
		'Path to AppBlueprintSpec module for validation'
	)
	.option(
		'--tenant-config <path>',
		'Path to TenantAppConfig file for validation (requires --blueprint)'
	)
	.option(
		'--connections <paths...>',
		'Paths to modules or JSON files exporting IntegrationConnection entries'
	)
	.option(
		'--integration-registrars <paths...>',
		'Modules that register integration specs (supporting optional #exportName)'
	)
	.option(
		'--translation-catalog <path>',
		'Path to a blueprint translation catalog JSON/module'
	)
	.option(
		'--check-implementation',
		'Validate implementation against spec using AI'
	)
	.option(
		'--implementation-path <path>',
		'Path to implementation file (auto-detected if not specified)'
	)
	.option(
		'--agent-mode <mode>',
		'Agent mode for validation: simple, claude-code, openai-codex, opencode'
	)
	.option('--check-handlers', 'Verify handler implementations exist')
	.option('--check-tests', 'Verify test coverage')
	.option('-i, --interactive', 'Interactive mode - prompt for what to validate')
	.action(async (specFile: string, options) => {
		try {
			const config = await loadConfig();
			const mergedConfig = mergeConfig(config, options);
			// specFiles is string[] from variadic arg
			await validateCommand(specFile, options, mergedConfig);
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
withCategory(validateCmd, CATEGORY_DEVELOPMENT);

// Test command
const testProgram = program
	.command('test <specFile>')
	.description('Run test specs')
	.option('-r, --registry <path>', 'Path to registry module')
	.option('-j, --json', 'Output results as JSON')
	.option('-g, --generate', 'Generate tests using AI')
	.option('-l, --list', 'List available tests')
	.action(async (specFile, options) => {
		const config = await loadConfig();
		try {
			await testCommand(specFile, options, config);
		} catch (error) {
			console.error(
				chalk.red('Error running tests:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
withCategory(testProgram, CATEGORY_TESTING);

testProgram
	.command('generate')
	.description('Generate golden tests from captured traffic')
	.requiredOption(
		'-o, --operation <name>',
		'Operation name, e.g. billing.createInvoice'
	)
	.requiredOption('-O, --output <path>', 'Destination test file')
	.requiredOption(
		'--runner-import <path>',
		'Module path that exports the runner function used in generated tests'
	)
	.option('--runner-fn <name>', 'Exported runner function name', 'runContract')
	.option('--suite-name <name>', 'Override suite name')
	.option('--framework <name>', 'vitest (default) or jest', 'vitest')
	.option('--from-production', 'Pull snapshots from production database', false)
	.option(
		'--days <number>',
		'Lookback window in days',
		(value) => Number(value),
		7
	)
	.option(
		'--sample-rate <number>',
		'Sample subset of traffic (0-1)',
		(value) => Number(value),
		1
	)
	.action(async (cmdOptions) => {
		try {
			await generateGoldenTestsCommand({
				operation: cmdOptions.operation,
				output: cmdOptions.output,
				runnerImport: cmdOptions.runnerImport,
				runnerFn: cmdOptions.runnerFn,
				suiteName: cmdOptions.suiteName,
				framework: cmdOptions.framework,
				fromProduction: cmdOptions.fromProduction,
				days: cmdOptions.days,
				sampleRate: cmdOptions.sampleRate,
			});
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});

// Regenerator command
const regeneratorCmd = program
	.command('regenerator')
	.description('Operate the Regenerator daemon')
	.argument('<blueprint-file>', 'Path to AppBlueprintSpec file')
	.argument('<tenant-file>', 'Path to TenantAppConfig file')
	.argument('<rules-file>', 'Path to module exporting regenerator rules')
	.argument(
		'<sink-file>',
		'Path to module exporting a proposal sink (use "auto" with --executor)'
	)
	.option(
		'-p, --poll-interval <ms>',
		'Polling interval in ms (default 60000)',
		(value) => Number.parseInt(value, 10)
	)
	.option(
		'-b, --batch-duration <ms>',
		'Lookback duration in ms (default 300000)',
		(value) => Number.parseInt(value, 10)
	)
	.option('--once', 'Run a single evaluation cycle then exit')
	.option(
		'--contexts <path>',
		'Optional file exporting an array of RegenerationContext overrides'
	)
	.option(
		'--executor <path>',
		'Module exporting a ProposalExecutor instance, factory, or deps (required when sink is "auto")'
	)
	.option(
		'--dry-run',
		'Execute proposals in dry-run mode when using executor sink'
	)
	.action(async (blueprintPath, tenantPath, rulesPath, sinkPath, options) => {
		try {
			const config = await loadConfig();
			const mergedConfig = mergeConfig(config, options);
			await regeneratorCommand(
				blueprintPath,
				tenantPath,
				rulesPath,
				sinkPath,
				options,
				mergedConfig
			);
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
withCategory(regeneratorCmd, CATEGORY_OPERATIONS);

// Vibe
program.addCommand(withCategory(vibeCommand, CATEGORY_ESSENTIALS));

// Parse CLI arguments
export function run() {
	program.parse();
}

export const ContractSpecCliDocBlock = {
	id: 'docs.tech.cli.contractspec',
	title: 'ContractSpec CLI',
	summary:
		'The command-line interface for creating, building, and validating contract specifications.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/cli/contractspec',
	tags: ['cli', 'tooling', 'reference'],
	owners: ['@contractspec/app.cli-contractspec'],
	body: `# ContractSpec CLI

The \`@contractspec/app.cli-contractspec\` package provides the command-line interface for the ContractSpec ecosystem.

## Installation

\`\`\`bash
bun add -D @contractspec/app.cli-contractspec
\`\`\`

## Quick Start

\`\`\`bash
contractspec create
contractspec build src/contracts/mySpec.ts
contractspec validate src/contracts/mySpec.ts
\`\`\`

## Operator Flows

### \`control-plane\`

Use the CLI to inspect approvals, traces, and deterministic replay state.

\`\`\`bash
contractspec control-plane approval list --workspace-id workspace-1
contractspec control-plane approval approve <decisionId> --actor-id operator-1 --capability-grants control-plane.execution.approve
contractspec control-plane trace list --workspace-id workspace-1 --provider-key messaging.slack
contractspec control-plane trace replay <decisionId>
\`\`\`

Environment:

- \`CHANNEL_RUNTIME_STORAGE\` defaults to \`postgres\`
- Supported storage modes are \`memory\` and \`postgres\`; invalid values fail fast
- \`CHANNEL_RUNTIME_DATABASE_URL\` or \`DATABASE_URL\` is required for postgres-backed flows

## Core Commands

- \`create\` — interactive contract authoring
- \`build\` — implementation generation from specs
- \`validate\` — contract and implementation validation
- \`impact\` — breaking-change detection against a baseline
- \`doctor\` and \`ci\` — repository health and CI-oriented checks

## Configuration

The CLI is configured via \`.contractsrc.json\` in your project root.

\`\`\`json
{
  "aiProvider": "claude",
  "aiModel": "claude-3-7-sonnet-20250219",
  "agentMode": "claude-code",
		"outputDir": "./src"
}
\`\`\`
`,
} satisfies DocBlock;

registerDocBlocks([ContractSpecCliDocBlock]);
