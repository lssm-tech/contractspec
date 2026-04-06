import { connect } from '@contractspec/bundle.workspace';
import { printConnectResult } from './artifacts';
import { requireExactlyOne } from './io';
import { createConnectEvaluationRuntime } from './registry';
import { syncConnectReviewDecisions } from './review-sync';
import {
	createConnectCommandContext,
	tryCreateConnectControlPlaneRuntime,
} from './runtime';

export async function runConnectReviewListCommand(options: { json?: boolean }) {
	const ctx = await createConnectCommandContext(options);
	const items = await connect.listConnectReviewPackets(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
	});
	printConnectResult(
		options.json,
		items,
		items.length === 0
			? 'No pending review packets.'
			: items
					.map((item) => `${item.packet.id}: ${item.packet.reason}`)
					.join('\n')
	);
	return 0;
}

export async function runConnectReviewSyncCommand(options: {
	all?: boolean;
	decision?: string;
	json?: boolean;
	queue?: string;
}) {
	if (options.all && options.decision) {
		throw new Error('Provide either --all or --decision, not both.');
	}
	const ctx = await createConnectCommandContext(options);
	const results = await syncConnectReviewDecisions(ctx, {
		all: options.all || !options.decision,
		decisionId: options.decision,
		queue: options.queue,
		strict: true,
	});
	printConnectResult(
		options.json,
		results,
		results.length === 0
			? 'No pending review packets.'
			: results
					.map((result) => `${result.decisionId}: ${result.status}`)
					.join('\n')
	);
	return results.some((result) => result.status === 'failed') ? 1 : 0;
}

export async function runConnectReplayCommand(
	decisionId: string,
	options: { json?: boolean }
) {
	const ctx = await createConnectCommandContext(options);
	const controlPlane = await tryCreateConnectControlPlaneRuntime();
	try {
		const result = await connect.replayConnectDecision(
			ctx.adapters,
			{
				cwd: ctx.cwd,
				config: ctx.config,
				workspaceRoot: ctx.config.workspaceRoot,
				packageRoot: ctx.config.packageRoot,
				decisionId,
			},
			controlPlane.controlPlane
		);
		if (!result.patchVerdict && !result.contextPack && !result.planPacket) {
			throw new Error(`No stored Connect decision ${decisionId}.`);
		}
		printConnectResult(options.json, result, `Replay: ${result.source}`);
		return 0;
	} finally {
		await controlPlane.dispose();
	}
}

export async function runConnectEvalCommand(
	decisionId: string,
	options: {
		json?: boolean;
		registry: string;
		scenario?: string;
		suite?: string;
		version?: string;
	}
) {
	const ctx = await createConnectCommandContext(options);
	requireExactlyOne(
		{ label: '--scenario', value: options.scenario },
		{ label: '--suite', value: options.suite }
	);
	const runtime = await createConnectEvaluationRuntime({
		registryPath: options.registry,
		config: ctx.config,
		packageRoot: ctx.config.packageRoot,
		decisionId,
	});
	const result = await connect.evaluateConnectDecision(
		ctx.adapters,
		{
			cwd: ctx.cwd,
			config: ctx.config,
			workspaceRoot: ctx.config.workspaceRoot,
			packageRoot: ctx.config.packageRoot,
			decisionId,
			scenarioKey: options.scenario,
			suiteKey: options.suite,
			version: options.version,
		},
		runtime
	);
	printConnectResult(
		options.json,
		result.evaluation,
		`Evaluation stored in ${result.historyDir}`
	);
	return 0;
}
