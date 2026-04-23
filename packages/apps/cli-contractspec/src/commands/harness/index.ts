import type { HarnessBrowserEngine } from '@contractspec/integration.harness-runtime';
import chalk from 'chalk';
import { Command } from 'commander';
import { type Config, loadConfigWithWorkspace } from '../../utils/config';
import { requireExactlyOne } from '../connect/io';
import { createHarnessEvaluationRuntime } from './runtime';

export const harnessCommand = new Command('harness')
	.description('Run ContractSpec harness scenarios and suites')
	.addCommand(createHarnessEvalCommand());

function createHarnessEvalCommand() {
	return new Command('eval')
		.description('Run a harness scenario or suite and write replay evidence')
		.requiredOption('--registry <path>', 'Path to the harness registry module')
		.option('--scenario <key>', 'Harness scenario key')
		.option('--suite <key>', 'Harness suite key')
		.option('--version <version>', 'Scenario or suite version')
		.option('--target-url <url>', 'Override preview target URL')
		.option(
			'--browser-engine <engine>',
			'Browser engine: playwright, agent-browser, or both'
		)
		.option('--auth-profile <key>', 'Named testing.harness auth profile')
		.option('--update-baselines', 'Allow visual baseline updates')
		.option('--json', 'Output JSON')
		.action((options) => runSafely(() => runHarnessEvalCommand(options)));
}

export async function runHarnessEvalCommand(options: {
	authProfile?: string;
	browserEngine?: string;
	json?: boolean;
	registry: string;
	scenario?: string;
	suite?: string;
	targetUrl?: string;
	updateBaselines?: boolean;
	version?: string;
}) {
	requireExactlyOne(
		{ label: '--scenario', value: options.scenario },
		{ label: '--suite', value: options.suite }
	);
	const config = await loadConfigWithWorkspace(process.cwd());
	const runtime = await createHarnessEvaluationRuntime({
		registryPath: options.registry,
		config: withBaselinePolicy(config, options.updateBaselines),
		packageRoot: config.packageRoot,
		browserEngine: parseBrowserEngine(options.browserEngine),
		targetUrl: options.targetUrl,
		authProfile: options.authProfile,
	});
	try {
		const evaluation = options.scenario
			? await runtime.runScenarioEvaluation({
					scenarioKey: options.scenario,
					version: options.version,
				})
			: await runtime.runSuiteEvaluation({
					suiteKey: options.suite ?? '',
					version: options.version,
				});
		printHarnessResult(options.json, evaluation);
		return 0;
	} finally {
		await runtime.dispose();
	}
}

function parseBrowserEngine(
	value: string | undefined
): HarnessBrowserEngine | undefined {
	if (!value) return undefined;
	if (value === 'playwright' || value === 'agent-browser' || value === 'both') {
		return value;
	}
	throw new Error('Browser engine must be playwright, agent-browser, or both.');
}

function withBaselinePolicy(
	config: Config,
	updateBaselines: boolean | undefined
) {
	if (!updateBaselines) return config;
	return {
		...config,
		testing: {
			...config.testing,
			harness: {
				...config.testing?.harness,
				visual: {
					...config.testing?.harness?.visual,
					updateBaselines: true,
				},
			},
		},
	};
}

function printHarnessResult(json: boolean | undefined, value: unknown) {
	if (json) {
		console.log(JSON.stringify(value, null, 2));
		return;
	}

	const result = value as {
		status?: string;
		evaluationId?: string;
		replayBundleUri?: string;
		summary?: { suiteKey?: string; passRate?: number };
	};
	if (result.summary) {
		console.log(
			chalk.green(
				`Harness suite ${result.summary.suiteKey}: ${Math.round((result.summary.passRate ?? 0) * 100)}% pass rate`
			)
		);
		return;
	}
	console.log(
		chalk.green(
			`Harness evaluation ${result.evaluationId ?? 'completed'}: ${result.status ?? 'unknown'}`
		)
	);
	if (result.replayBundleUri) {
		console.log(`Replay bundle: ${result.replayBundleUri}`);
	}
}

async function runSafely(run: () => Promise<number>) {
	try {
		const code = await run();
		if (code !== 0) process.exit(code);
	} catch (error) {
		console.error(
			chalk.red('\n❌ Error:'),
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}
}
