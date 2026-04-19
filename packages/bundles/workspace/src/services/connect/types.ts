import type {
	ConnectVerdict,
	ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import type {
	SetupFileResult,
	SetupGitignoreBehavior,
	SetupPromptCallbacks,
} from '../setup/types';

export type { ConnectVerdict };

export type ConnectActorType = 'human' | 'agent' | 'service' | 'tool';
export type ConnectApprovalStatus =
	| 'not_required'
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'expired';

export type ConnectSurface =
	| 'agent'
	| 'audit'
	| 'cli'
	| 'contract'
	| 'harness'
	| 'integration'
	| 'knowledge'
	| 'library'
	| 'mcp'
	| 'runtime'
	| 'solution'
	| 'ui';

export type ConnectContractKind =
	| 'command'
	| 'query'
	| 'event'
	| 'policy'
	| 'capability';

export interface ConnectActorRef {
	id: string;
	type: ConnectActorType;
	sessionId?: string;
	traceId?: string;
}

export interface ConnectContractRef {
	key: string;
	version: string;
	kind?: ConnectContractKind;
}

export interface ConnectRuntimeLink {
	decisionId: string;
	traceId?: string;
	planId?: string;
	approvalStatus?: ConnectApprovalStatus;
	workspaceId?: string;
	providerKey?: string;
	receiptId?: string;
	threadId?: string;
}

export interface ConnectWorkspaceInput {
	cwd?: string;
	workspaceRoot?: string;
	packageRoot?: string;
	config?: ResolvedContractsrcConfig;
}

export interface ConnectInitInput extends ConnectWorkspaceInput {
	scope?: 'workspace' | 'package';
	interactive?: boolean;
	gitignoreBehavior?: SetupGitignoreBehavior;
	prompts?: Pick<SetupPromptCallbacks, 'confirm'>;
}

export interface ConnectInitResult {
	configPath: string;
	targetRoot: string;
	action: 'created' | 'merged';
	gitignore: SetupFileResult;
}

export interface ConnectTaskInput extends ConnectWorkspaceInput {
	taskId: string;
	actor?: ConnectActorRef;
	baseline?: string;
	paths?: string[];
}

export interface ConnectContextPack {
	id: string;
	taskId: string;
	repoId: string;
	branch: string;
	actor: ConnectActorRef;
	knowledge: Array<{
		spaceKey: string;
		category: 'canonical' | 'operational' | 'external' | 'ephemeral';
		trustLevel: 'high' | 'medium' | 'low';
		source: string;
		digest?: string;
	}>;
	impactedContracts: ConnectContractRef[];
	affectedSurfaces: ConnectSurface[];
	policyBindings: Array<{
		key: string;
		version: string;
		source: 'contract' | 'canon-pack' | 'workspace-config';
		authority: 'canonical' | 'operational';
	}>;
	configRefs: Array<{
		kind: 'contractsrc' | 'artifact' | 'canon-pack';
		ref: string;
	}>;
	acceptanceChecks: string[];
}

export interface ConnectPlanStep {
	id: string;
	summary: string;
	paths?: string[];
	commands?: string[];
	contractRefs?: string[];
}

export interface ConnectPlanPacket {
	id: string;
	taskId: string;
	repoId: string;
	branch: string;
	actor: ConnectActorRef;
	objective: string;
	steps: ConnectPlanStep[];
	impactedContracts: ConnectContractRef[];
	affectedSurfaces: ConnectSurface[];
	requiredChecks: string[];
	requiredApprovals: Array<{ capability: string; reason: string }>;
	riskScore: number;
	verificationStatus: 'approved' | 'revise' | 'review' | 'denied';
	controlPlane: {
		intentSubmit: ConnectContractRef;
		planCompile: ConnectContractRef;
		planVerify: ConnectContractRef;
		decisionId?: string;
		traceId?: string;
	};
	acpActions?: Array<'acp.fs.access' | 'acp.terminal.exec' | 'acp.tool.calls'>;
}

export interface ConnectImpactedFile {
	file: string;
	contracts: ConnectContractRef[];
	surfaces: ConnectSurface[];
	policies: ConnectContractRef[];
}

export interface ConnectPatchVerdict {
	decisionId: string;
	summary?: string;
	action: {
		actionType: 'write_file' | 'edit_file' | 'run_command';
		tool: 'acp.fs.access' | 'acp.terminal.exec' | 'acp.tool.calls';
		target?: string;
		cwd?: string;
	};
	impacted: ConnectImpactedFile[];
	checks: Array<{
		id: string;
		status: 'pass' | 'fail' | 'warn';
		detail: string;
	}>;
	verdict: ConnectVerdict;
	controlPlane: {
		verdict: 'autonomous' | 'assist' | 'blocked';
		requiresApproval: boolean;
		policyRef?: ConnectContractRef;
		decisionId?: string;
		approvalStatus?: ConnectApprovalStatus;
		traceId?: string;
	};
	approvalOperationRefs?: string[];
	remediation?: string[];
	reviewPacketRef?: string;
	retryBudget?: number;
	replay: {
		traceQuery: ConnectContractRef;
		policyExplain?: ConnectContractRef;
	};
}

export interface ConnectReviewPacket {
	id: string;
	sourceDecisionId: string;
	objective: string;
	reason: string;
	summary: {
		paths: string[];
		impactedContracts: ConnectContractRef[];
		affectedSurfaces: ConnectSurface[];
		requiredChecks: string[];
	};
	evidence: Array<{
		type:
			| 'context-pack'
			| 'plan-packet'
			| 'patch-verdict'
			| 'control-plane-trace';
		ref: string;
	}>;
	requiredApprovals: Array<{ capability: string; reason: string }>;
	controlPlane: {
		traceQuery: ConnectContractRef;
		policyExplain: ConnectContractRef;
		decisionId?: string;
		approvalStatus?: ConnectApprovalStatus;
		traceId?: string;
	};
	studio?: {
		enabled?: boolean;
		mode?: 'off' | 'review-bridge';
		queue?: string;
	};
}

export interface ConnectPlanInput extends ConnectTaskInput {
	candidate: {
		objective: string;
		steps?: Array<string | Omit<ConnectPlanStep, 'id'>>;
		touchedPaths?: string[];
		commands?: string[];
	};
}

export interface ConnectVerifyFsAccessInput extends ConnectTaskInput {
	tool: 'acp.fs.access';
	operation: string;
	path: string;
	content?: string;
	options?: Record<string, unknown>;
}

export interface ConnectVerifyTerminalExecInput extends ConnectTaskInput {
	tool: 'acp.terminal.exec';
	command: string;
	cwd?: string;
	touchedPaths?: string[];
}

export type ConnectVerifyInput =
	| ConnectVerifyFsAccessInput
	| ConnectVerifyTerminalExecInput;

export interface ConnectCommandResult {
	command: string;
	cwd?: string;
	exitCode: number;
	stdout: string;
	stderr: string;
}

export interface ConnectVerifyRuntime {
	runCommand?: (
		command: string,
		options?: { cwd?: string }
	) => Promise<ConnectCommandResult>;
}

export interface ConnectReplayResult {
	decisionId: string;
	historyDir: string;
	contextPack?: ConnectContextPack;
	planPacket?: ConnectPlanPacket;
	patchVerdict?: ConnectPatchVerdict;
	reviewPacket?: ConnectReviewPacket;
	trace?: unknown;
	replay?: unknown;
	source: 'local' | 'local+control-plane';
}

export interface ConnectEvaluationRuntime {
	runScenarioEvaluation(input: {
		scenarioKey: string;
		version?: string;
		context?: Record<string, unknown>;
	}): Promise<unknown>;
	runSuiteEvaluation(input: {
		suiteKey: string;
		version?: string;
		context?: Record<string, unknown>;
	}): Promise<unknown>;
}

export interface ConnectEvalInput extends ConnectWorkspaceInput {
	decisionId: string;
	scenarioKey?: string;
	suiteKey?: string;
	version?: string;
}

export interface ConnectReviewListItem {
	filePath: string;
	packet: ConnectReviewPacket;
}
