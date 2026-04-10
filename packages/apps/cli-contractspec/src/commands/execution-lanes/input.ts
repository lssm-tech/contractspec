import {
	type AuthorityContextRefs,
	assertValid,
	type CompletionLoopSpec,
	type ExecutionPlanPack,
	type TeamRunSpec,
	validateExecutionPlanPack,
} from '@contractspec/lib.execution-lanes';
import {
	parseJsonOrText,
	readRequiredStdin,
	requireExactlyOne,
	requireNonEmptyString,
} from '../connect/io';
import {
	normalizeMode,
	normalizeNextLane,
	type PlanningMode,
	resolveAuthorityContext,
} from './shared';

interface PlanCommandPayload {
	request: string;
	objective: string;
	constraints: string[];
	assumptions: string[];
	authorityContext: AuthorityContextRefs;
	mode: PlanningMode;
	nextLane: 'complete.persistent' | 'team.coordinated';
}

export interface CompletionLoopSpecInput
	extends Partial<Omit<CompletionLoopSpec, 'verificationPolicy' | 'signoff'>> {
	verificationPolicy?: Partial<
		Extract<CompletionLoopSpec['verificationPolicy'], object>
	>;
	signoff?: Partial<CompletionLoopSpec['signoff']>;
}

export interface TeamRunSpecInput
	extends Partial<
		Omit<TeamRunSpec, 'coordination' | 'verificationLane' | 'shutdownPolicy'>
	> {
	coordination?: Partial<TeamRunSpec['coordination']>;
	verificationLane?: Partial<TeamRunSpec['verificationLane']>;
	shutdownPolicy?: Partial<TeamRunSpec['shutdownPolicy']>;
}

export interface CompletionLaunchPayload {
	task?: string;
	planPack?: ExecutionPlanPack;
	completionSpec?: CompletionLoopSpecInput;
	contextSnapshot?: Record<string, unknown>;
}

export interface TeamLaunchPayload {
	task?: string;
	planPack?: ExecutionPlanPack;
	teamSpec?: TeamRunSpecInput;
}

export async function resolvePlanCommandPayload(
	task: string | undefined,
	options: Record<string, unknown>
): Promise<PlanCommandPayload> {
	const source = await resolveExecutionLaneSource(task, options.stdin);
	if (typeof source === 'string') {
		return {
			request: source,
			objective: source,
			constraints: [],
			assumptions: [],
			authorityContext: resolveAuthorityContext(options),
			mode: normalizeMode(options.mode as string | undefined),
			nextLane: normalizeNextLane(options.nextLane as string | undefined),
		};
	}

	const request = readString(source.request) ?? readString(source.objective);
	if (!request) {
		throw new Error('Plan stdin JSON requires "request" or "objective".');
	}

	return {
		request,
		objective: readString(source.objective) ?? request,
		constraints: readStringArray(source.constraints),
		assumptions: readStringArray(source.assumptions),
		authorityContext: resolveAuthorityContext(
			options,
			readAuthorityContext(source.authorityContext)
		),
		mode: normalizeMode(
			readString(source.mode) ||
				(typeof options.mode === 'string' ? options.mode : undefined)
		),
		nextLane: normalizeNextLane(
			readString(source.nextLane) ||
				(typeof options.nextLane === 'string' ? options.nextLane : undefined)
		),
	};
}

export async function resolveCompletionLaunchPayload(
	task: string | undefined,
	options: Record<string, unknown>
): Promise<CompletionLaunchPayload> {
	const source = await resolveExecutionLaneSource(task, options.stdin);
	if (typeof source === 'string') {
		if (options.stdin) {
			throw new Error(
				'Complete stdin input must be a JSON ExecutionPlanPack or { planPack, completionSpec?, contextSnapshot? }.'
			);
		}
		return { task: source };
	}
	if (looksLikePlanPack(source)) {
		return {
			planPack: assertExecutionPlanPack(source, 'Invalid completion plan pack'),
		};
	}
	if (!isRecord(source.planPack)) {
		throw new Error(
			'Complete stdin JSON requires an ExecutionPlanPack or { planPack, completionSpec?, contextSnapshot? }.'
		);
	}

	return {
		planPack: assertExecutionPlanPack(
			source.planPack,
			'Invalid completion plan pack'
		),
		completionSpec: readCompletionLoopSpecInput(source.completionSpec),
		contextSnapshot: readOptionalRecord(source.contextSnapshot),
	};
}

export async function resolveTeamLaunchPayload(
	task: string | undefined,
	options: Record<string, unknown>
): Promise<TeamLaunchPayload> {
	const source = await resolveExecutionLaneSource(task, options.stdin);
	if (typeof source === 'string') {
		if (options.stdin) {
			throw new Error(
				'Team stdin input must be a JSON ExecutionPlanPack or { planPack, teamSpec? }.'
			);
		}
		return { task: source };
	}
	if (looksLikePlanPack(source)) {
		return {
			planPack: assertExecutionPlanPack(source, 'Invalid team plan pack'),
		};
	}
	if (!isRecord(source.planPack)) {
		throw new Error(
			'Team stdin JSON requires an ExecutionPlanPack or { planPack, teamSpec? }.'
		);
	}

	return {
		planPack: assertExecutionPlanPack(
			source.planPack,
			'Invalid team plan pack'
		),
		teamSpec: readTeamRunSpecInput(source.teamSpec),
	};
}

async function resolveExecutionLaneSource(
	task: string | undefined,
	stdinEnabled: unknown
): Promise<string | Record<string, unknown>> {
	requireExactlyOne(
		{ label: '[task]', value: task?.trim() || undefined },
		{ label: '--stdin', value: stdinEnabled ? 'stdin' : undefined }
	);
	if (stdinEnabled) {
		return coerceRecordOrThrow(parseJsonOrText(await readRequiredStdin()));
	}
	return requireNonEmptyString(task ?? '', 'task');
}

function readCompletionLoopSpecInput(
	value: unknown
): CompletionLoopSpecInput | undefined {
	if (value === undefined) {
		return undefined;
	}
	if (!isRecord(value)) {
		throw new Error('completionSpec must be a JSON object.');
	}
	return value as CompletionLoopSpecInput;
}

function readTeamRunSpecInput(value: unknown): TeamRunSpecInput | undefined {
	if (value === undefined) {
		return undefined;
	}
	if (!isRecord(value)) {
		throw new Error('teamSpec must be a JSON object.');
	}
	return value as TeamRunSpecInput;
}

function assertExecutionPlanPack(
	value: Record<string, unknown>,
	message: string
): ExecutionPlanPack {
	const planPack = value as unknown as ExecutionPlanPack;
	assertValid(validateExecutionPlanPack(planPack), message);
	return planPack;
}

function readAuthorityContext(
	value: unknown
): Partial<AuthorityContextRefs> | undefined {
	if (!isRecord(value)) {
		return undefined;
	}
	return {
		policyRefs: readStringArray(value.policyRefs),
		ruleContextRefs: readStringArray(value.ruleContextRefs),
		approvalRefs: readStringArray(value.approvalRefs),
	};
}

function readOptionalRecord(
	value: unknown
): Record<string, unknown> | undefined {
	return isRecord(value) ? value : undefined;
}

function coerceRecordOrThrow(
	value: string | Record<string, unknown>
): string | Record<string, unknown> {
	if (typeof value === 'string') {
		return value;
	}
	if (!isRecord(value)) {
		throw new Error(
			'Execution lane stdin requires a JSON object or plain text.'
		);
	}
	return value;
}

function looksLikePlanPack(value: Record<string, unknown>): boolean {
	return 'meta' in value && 'planSteps' in value && 'staffing' in value;
}

function readString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}
	return value
		.filter((entry): entry is string => typeof entry === 'string')
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
