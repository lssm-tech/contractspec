import type { LaneKey } from '../types';

export type ExecutionLaneCommandUsage =
	| '/clarify'
	| '/plan'
	| '/plan --consensus'
	| '/complete'
	| '/team';

export interface ExecutionLaneCommandDescriptor {
	usage: ExecutionLaneCommandUsage;
	alias: '/clarify' | '/plan' | '/complete' | '/team';
	lane: LaneKey;
	mode: 'default' | 'consensus';
	acceptsTask: boolean;
	summary: string;
}

export interface ParsedExecutionLaneCommand
	extends ExecutionLaneCommandDescriptor {
	raw: string;
	task: string;
	flags: string[];
}

export const EXECUTION_LANE_COMMANDS: ExecutionLaneCommandDescriptor[] = [
	{
		usage: '/clarify',
		alias: '/clarify',
		lane: 'clarify',
		mode: 'default',
		acceptsTask: true,
		summary: 'Reduce ambiguity and capture a clarification artifact.',
	},
	{
		usage: '/plan',
		alias: '/plan',
		lane: 'plan.consensus',
		mode: 'default',
		acceptsTask: true,
		summary: 'Draft a consensus-ready execution plan pack.',
	},
	{
		usage: '/plan --consensus',
		alias: '/plan',
		lane: 'plan.consensus',
		mode: 'consensus',
		acceptsTask: true,
		summary: 'Run the deliberate consensus-planning variant.',
	},
	{
		usage: '/complete',
		alias: '/complete',
		lane: 'complete.persistent',
		mode: 'default',
		acceptsTask: true,
		summary: 'Start or resume the persistent completion loop.',
	},
	{
		usage: '/team',
		alias: '/team',
		lane: 'team.coordinated',
		mode: 'default',
		acceptsTask: true,
		summary: 'Start coordinated multi-worker execution.',
	},
];

const DEFAULT_COMMAND_BY_LANE: Record<LaneKey, ExecutionLaneCommandUsage> = {
	clarify: '/clarify',
	'plan.consensus': '/plan',
	'complete.persistent': '/complete',
	'team.coordinated': '/team',
};

export function resolveExecutionLaneCommand(
	input: ExecutionLaneCommandUsage | LaneKey
): ExecutionLaneCommandDescriptor {
	const usage = input.startsWith('/')
		? (input as ExecutionLaneCommandUsage)
		: DEFAULT_COMMAND_BY_LANE[input as LaneKey];
	const command = EXECUTION_LANE_COMMANDS.find(
		(entry) => entry.usage === usage
	);
	if (!command) {
		throw new Error(`Unsupported execution lane command: ${input}`);
	}
	return command;
}

export function parseExecutionLaneCommand(
	input: string
): ParsedExecutionLaneCommand | undefined {
	const trimmed = input.trim();
	if (!trimmed.startsWith('/')) {
		return undefined;
	}

	const [alias = '', second = '', ...rest] = trimmed.split(/\s+/);
	if (
		alias === '/plan' &&
		second.startsWith('--') &&
		second !== '--consensus'
	) {
		return undefined;
	}

	const usage =
		alias === '/plan' && second === '--consensus'
			? '/plan --consensus'
			: (alias as ExecutionLaneCommandUsage);
	const command = EXECUTION_LANE_COMMANDS.find(
		(entry) => entry.usage === usage
	);
	if (!command) {
		return undefined;
	}

	const flags = usage === '/plan --consensus' ? ['--consensus'] : [];
	const task =
		usage === '/plan --consensus'
			? rest.join(' ').trim()
			: [second, ...rest].join(' ').trim();

	return {
		...command,
		raw: input,
		task,
		flags,
	};
}
