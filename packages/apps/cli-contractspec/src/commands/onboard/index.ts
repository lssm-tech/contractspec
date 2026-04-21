import { isAbsolute, resolve } from 'node:path';
import {
	adoption,
	CONTRACTSPEC_AGENTS_BLOCK_END,
	CONTRACTSPEC_AGENTS_BLOCK_START,
	CONTRACTSPEC_USAGE_BLOCK_END,
	CONTRACTSPEC_USAGE_BLOCK_START,
	connect,
	createNodeAdapters,
	type ManagedMarkdownSectionConfig,
	mergeManagedMarkdown,
	onboarding,
	renderManagedMarkdownBlock,
} from '@contractspec/bundle.workspace';
import { getExample } from '@contractspec/module.examples/catalog';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfigWithWorkspace } from '../../utils/config';

const MANAGED_BLOCK_NOTE =
	'<!-- This section is managed by `contractspec init` and `contractspec onboard`. Content outside these markers is user-owned and preserved. -->';

const AGENT_GUIDE_SECTION: ManagedMarkdownSectionConfig = {
	endMarker: CONTRACTSPEC_AGENTS_BLOCK_END,
	note: MANAGED_BLOCK_NOTE,
	startMarker: CONTRACTSPEC_AGENTS_BLOCK_START,
};

const HUMAN_GUIDE_SECTION: ManagedMarkdownSectionConfig = {
	endMarker: CONTRACTSPEC_USAGE_BLOCK_END,
	note: MANAGED_BLOCK_NOTE,
	startMarker: CONTRACTSPEC_USAGE_BLOCK_START,
};

export const onboardCommand = new Command('onboard')
	.description(
		'Generate repo-local onboarding guidance and recommended next steps'
	)
	.argument('[tracks...]', 'Optional onboarding tracks to focus on')
	.option('--dry-run', 'Plan the onboarding flow without writing files')
	.option('--json', 'Output structured JSON')
	.option('-y, --yes', 'Skip interactive confirmations')
	.option('--human-guide <path>', 'Human-facing usage guide path', 'USAGE.md')
	.option('--agent-guide <path>', 'Agent-facing guide path', 'AGENTS.md')
	.option(
		'--example <key>',
		'Force a starter example and initialize its stub under .contractspec/examples'
	)
	.action(async (tracks: string[], options) => {
		const cwd = process.cwd();
		const config = await loadConfigWithWorkspace(cwd);
		const adapters = createNodeAdapters({
			config,
			cwd,
			silent: Boolean(options.json),
		});
		const adoptionSync = options.dryRun
			? undefined
			: await adoption.syncAdoptionCatalog(adapters, {
					config,
					cwd,
					packageRoot: config.packageRoot,
					workspaceRoot: config.workspaceRoot,
				});
		const plan = await onboarding.buildOnboardingPlan(adapters, {
			agentGuidePath: options.agentGuide,
			config,
			cwd,
			forcedExampleKey: options.example,
			humanGuidePath: options.humanGuide,
			packageRoot: config.packageRoot,
			selectedTracks: tracks.length > 0 ? (tracks as never) : undefined,
			workspaceRoot: config.workspaceRoot,
		});

		const files = options.dryRun
			? [
					{
						action: 'planned',
						filePath: resolveGuidePath(plan.packageRoot, plan.agentGuidePath),
						kind: 'agent-guide',
					},
					{
						action: 'planned',
						filePath: resolveGuidePath(plan.packageRoot, plan.humanGuidePath),
						kind: 'human-guide',
					},
				]
			: [
					await writeManagedGuide(
						adapters.fs,
						resolveGuidePath(plan.packageRoot, plan.agentGuidePath),
						plan.guides.agentGuide,
						AGENT_GUIDE_SECTION,
						Boolean(!options.yes && !options.json && process.stdin.isTTY)
					),
					await writeManagedGuide(
						adapters.fs,
						resolveGuidePath(plan.packageRoot, plan.humanGuidePath),
						plan.guides.humanGuide,
						HUMAN_GUIDE_SECTION,
						Boolean(!options.yes && !options.json && process.stdin.isTTY)
					),
				];

		const exampleResult =
			options.example && !options.dryRun
				? await initializeExampleStub(
						adapters.fs,
						plan.packageRoot,
						options.example
					)
				: undefined;

		const connectArtifacts = await onboarding.createOnboardingConnectArtifacts(
			adapters,
			plan
		);
		if (!options.dryRun && connectArtifacts) {
			const workspace = connect.withBranch(
				connect.resolveWorkspace({
					config,
					cwd,
					packageRoot: config.packageRoot,
					workspaceRoot: config.workspaceRoot,
				}),
				await adapters.git.currentBranch()
			);
			const storage = connect.resolveStoragePaths(workspace);
			await connect.ensureStorage(adapters.fs, storage);
			await connect.persistLatestArtifacts(
				adapters.fs,
				storage,
				connectArtifacts
			);
		}

		const result = {
			adoptionCatalogPath: adoptionSync?.catalogPath,
			builderMode: plan.builderMode,
			builderNextSteps: plan.builderNextSteps,
			connectArtifacts,
			example:
				exampleResult ??
				(options.example ? { key: options.example } : undefined),
			files,
			nextCommands: plan.nextCommands,
			primaryTrack: plan.primaryTrack.id,
			recommendations: plan.recommendations.map((recommendation) => ({
				docs: recommendation.track.primaryDocsRoute,
				example: recommendation.track.starterExample.key,
				reason: recommendation.reason,
				score: recommendation.score,
				selected: recommendation.selected,
				title: recommendation.track.title,
				track: recommendation.track.id,
			})),
		};

		if (options.json) {
			console.log(JSON.stringify(result, null, 2));
			return;
		}

		console.log(chalk.bold('\n🧭 ContractSpec Onboarding\n'));
		console.log(`Primary track: ${chalk.cyan(plan.primaryTrack.title)}`);
		console.log(`Starter example: ${chalk.cyan(plan.selectedExample.key)}`);
		if (adoptionSync) {
			console.log(chalk.gray(`Adoption catalog: ${adoptionSync.catalogPath}`));
		}
		console.log('\nFiles:');
		for (const file of files) {
			console.log(`  - ${file.action}: ${chalk.gray(file.filePath)}`);
		}
		if (exampleResult) {
			console.log(`  - created: ${chalk.gray(exampleResult.outDir)}`);
		}
		if (connectArtifacts) {
			console.log(
				chalk.gray(
					`  - updated: ${config.connect?.storage?.contextPack ?? '.contractspec/connect/context-pack.json'}`
				)
			);
			console.log(
				chalk.gray(
					`  - updated: ${config.connect?.storage?.planPacket ?? '.contractspec/connect/plan-packet.json'}`
				)
			);
		}
		console.log('\nNext commands:');
		for (const command of plan.nextCommands) {
			console.log(`  - ${chalk.cyan(command)}`);
		}
		console.log('');
	});

async function writeManagedGuide(
	fs: ReturnType<typeof createNodeAdapters>['fs'],
	filePath: string,
	content: string,
	config: ManagedMarkdownSectionConfig,
	interactive: boolean
) {
	const exists = await fs.exists(filePath);
	if (exists && interactive) {
		const proceed = await confirm({
			default: true,
			message: `${filePath} exists. Update the ContractSpec-managed section?`,
		});
		if (!proceed) {
			return { action: 'skipped', filePath, kind: 'guide' };
		}
	}

	if (!exists) {
		await fs.writeFile(filePath, renderManagedMarkdownBlock(content, config));
		return { action: 'created', filePath, kind: 'guide' };
	}

	const existingContent = await fs.readFile(filePath);
	await fs.writeFile(
		filePath,
		mergeManagedMarkdown(existingContent, content, config)
	);
	return { action: 'merged', filePath, kind: 'guide' };
}

async function initializeExampleStub(
	fs: ReturnType<typeof createNodeAdapters>['fs'],
	packageRoot: string,
	exampleKey: string
) {
	const example = getExample(exampleKey);
	if (!example) {
		throw new Error(`Example not found: ${exampleKey}`);
	}

	const outDir = resolve(
		packageRoot,
		'.contractspec',
		'examples',
		example.meta.key
	);
	await fs.mkdir(outDir);
	await fs.writeFile(
		resolve(outDir, 'example.json'),
		`${JSON.stringify(example, null, 2)}\n`
	);
	await fs.writeFile(
		resolve(outDir, 'README.md'),
		[
			`# ${example.meta.title}`,
			'',
			example.meta.summary ?? example.meta.description ?? '',
			'',
			`- id: \`${example.meta.key}\``,
			`- package: \`${example.entrypoints.packageName}\``,
			'',
			'This folder is a lightweight workspace stub that references an example manifest.',
			'',
		].join('\n')
	);

	return { key: example.meta.key, outDir };
}

function resolveGuidePath(packageRoot: string, targetPath: string) {
	return isAbsolute(targetPath) ? targetPath : resolve(packageRoot, targetPath);
}
