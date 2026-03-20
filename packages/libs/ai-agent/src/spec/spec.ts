import type {
	DataViewRef,
	FormRef,
	PresentationRef,
} from '@contractspec/lib.contracts-spec/features';
import type { KnowledgeCategory } from '@contractspec/lib.contracts-spec/knowledge/spec';
import type { OwnerShipMeta } from '@contractspec/lib.contracts-spec/ownership';
import type { PolicyRef } from '@contractspec/lib.contracts-spec/policy/spec';
import { createAgentI18n } from '../i18n';

/**
 * Metadata for an agent specification.
 */
export type AgentMeta = OwnerShipMeta;

export type AgentRuntimeAdapterKey =
	| 'langgraph'
	| 'langchain'
	| 'workflow-devkit';

export interface AgentRuntimeCapabilities {
	/** Optional external adapter availability map for runtime interoperability. */
	adapters?: Partial<Record<AgentRuntimeAdapterKey, boolean>>;
	/** Whether the agent should persist checkpoints for replay/resume. */
	checkpointing?: boolean;
	/** Whether the agent supports external suspend/resume semantics. */
	suspendResume?: boolean;
	/** Whether the agent can delegate approvals to external gateways. */
	approvalGateway?: boolean;
}

export interface AgentRuntimePorts {
	/** Symbolic checkpoint store adapter identifier. */
	checkpointStore?: string;
	/** Symbolic suspend/resume adapter identifier. */
	suspension?: string;
	/** Symbolic retry classifier identifier. */
	retryClassifier?: string;
	/** Symbolic approval gateway identifier. */
	approvalGateway?: string;
}

export interface AgentRuntimeConfig {
	capabilities?: AgentRuntimeCapabilities;
	ports?: AgentRuntimePorts;
}

/**
 * Reference to a ContractSpec operation that backs an agent tool.
 * When set, the tool is a projection of the operation (one contract → REST, GraphQL, MCP, agent).
 */
export interface OperationRef {
	/** Operation key (e.g., "knowledge.search") */
	key: string;
	/** Optional specific version; defaults to latest when omitted */
	version?: string;
}

/**
 * Reference to a subagent that backs an agent tool.
 * When set, the tool delegates to the subagent; mutually exclusive with operationRef and manual handler.
 */
export interface SubagentRef {
	/** Subagent identifier (resolved from subagent registry) */
	agentId: string;
	/** Whether to extract summary for toModelOutput (default: true) */
	toModelSummary?: boolean;
	/**
	 * Pass full conversation history to subagent (opt-in).
	 * Defeats context isolation; use sparingly. Requires subagent to support generate({ messages }).
	 * Streaming is disabled when history is passed.
	 */
	passConversationHistory?: boolean;
}

/**
 * Configuration for a tool that an agent can use.
 */
export interface AgentToolConfig {
	/** Tool name (unique within the agent) */
	name: string;
	/**
	 * Reference to a ContractSpec operation. When set, the tool is backed by the operation:
	 * schema and handler are derived from the operation; no manual handler needed.
	 */
	operationRef?: OperationRef;
	/**
	 * Reference to a subagent. When set, the tool delegates to the subagent.
	 * Mutually exclusive with operationRef; requires subagentRegistry in agent config.
	 */
	subagentRef?: SubagentRef;
	/** Human-readable description for the LLM */
	description?: string;
	/** JSON Schema fragment for tool parameters (fallback when no operationRef) */
	schema?: Record<string, unknown>;
	/** Optional cooldown in milliseconds between invocations */
	cooldownMs?: number;
	/** Maximum execution time before timeout */
	timeoutMs?: number;
	/** Whether the tool can be executed without human approval (AI SDK needsApproval = !automationSafe) */
	automationSafe?: boolean;
	/** Explicit approval requirement (overrides automationSafe) */
	requiresApproval?: boolean;
	/** Optional policy guard that must evaluate to allow the tool call */
	policy?: PolicyRef;
	/**
	 * When set, wrap raw output as { presentationKey, data } for ToolResultRenderer.
	 * At most one of outputPresentation, outputForm, outputDataView per tool.
	 */
	outputPresentation?: PresentationRef;
	/**
	 * When set, wrap raw output as { formKey, defaultValues } for ToolResultRenderer.
	 * At most one of outputPresentation, outputForm, outputDataView per tool.
	 */
	outputForm?: FormRef;
	/**
	 * When set, wrap raw output as { dataViewKey, items } for ToolResultRenderer.
	 * At most one of outputPresentation, outputForm, outputDataView per tool.
	 */
	outputDataView?: DataViewRef;
}

/**
 * Reference to a knowledge space that the agent can access.
 */
export interface AgentKnowledgeRef {
	/** Knowledge space key */
	key: string;
	/** Optional specific version */
	version?: number;
	/** Filter by knowledge category */
	category?: KnowledgeCategory;
	/** Whether the knowledge is required (static injection) or optional (dynamic RAG) */
	required?: boolean;
	/** Additional instructions appended when the space is available */
	instructions?: string;
}

/**
 * Memory configuration for agent session persistence.
 */
export interface AgentMemoryConfig {
	/** Maximum entries to keep in memory */
	maxEntries?: number;
	/** Time-to-live in minutes */
	ttlMinutes?: number;
	/** Number of messages before triggering summarization */
	summaryTrigger?: number;
	/** Whether to persist to long-term storage */
	persistLongTerm?: boolean;
}

/**
 * Memory tools config — model-accessible CRUD (Anthropic memory, custom).
 * Distinct from AgentMemoryConfig (session summarization).
 *
 * @see https://ai-sdk.dev/docs/agents/memory
 */
export interface AgentMemoryToolsConfig {
	/** Provider: anthropic uses memory_20250818; custom uses operationRef. */
	provider: 'anthropic' | 'custom';
	/** Storage adapter key when using knowledge-backed storage (e.g. ephemeral space) */
	storageAdapter?: string;
	/** Ephemeral KnowledgeSpaceSpec key when using knowledge-backed storage */
	spaceKey?: string;
}

/**
 * Confidence policy for agent responses.
 */
export interface AgentConfidencePolicy {
	/** Minimum acceptable confidence before escalation. Defaults to 0.7 */
	min?: number;
	/** Default value used when provider does not report confidence */
	default?: number;
}

/**
 * Escalation policy for handling uncertain or failed agent responses.
 */
export interface AgentEscalationPolicy {
	/** Auto escalate when confidence < threshold */
	confidenceThreshold?: number;
	/** Escalate when a tool throws irrecoverable errors */
	onToolFailure?: boolean;
	/** Escalate when iteration budget exceeded */
	onTimeout?: boolean;
	/** Optional human approval workflow ID */
	approvalWorkflow?: string;
}

/**
 * Combined policy configuration for an agent.
 */
export interface AgentPolicy {
	confidence?: AgentConfidencePolicy;
	escalation?: AgentEscalationPolicy;
	/** Feature flags to apply to this agent */
	flags?: string[];
}

/**
 * Complete specification for a ContractSpec agent.
 */
export interface AgentSpec {
	meta: AgentMeta;
	/** System instructions for the agent */
	instructions: string;
	/** Human-readable description */
	description?: string;
	/** Tags for categorization */
	tags?: string[];
	/** Default locale for the agent (e.g., 'en', 'fr'). Falls back to 'en' if unset. */
	locale?: string;
	/** Tools the agent can use */
	tools: AgentToolConfig[];
	/** Memory/session configuration */
	memory?: AgentMemoryConfig;
	/** Memory tools (model-accessible CRUD) — Anthropic or custom operation-backed */
	memoryTools?: AgentMemoryToolsConfig;
	/** Knowledge spaces the agent can access */
	knowledge?: AgentKnowledgeRef[];
	/** Policy configuration */
	policy?: AgentPolicy;
	/** Runtime adapter and portability config. */
	runtime?: AgentRuntimeConfig;
	/** Maximum steps per generation (defaults to 10) */
	maxSteps?: number;
}

/**
 * Define and validate an agent specification.
 *
 * @param spec - The agent specification
 * @returns The frozen, validated specification
 * @throws Error if the specification is invalid
 */
export function defineAgent(spec: AgentSpec): AgentSpec {
	const i18n = createAgentI18n(spec.locale);
	if (!spec.meta?.key) {
		throw new Error(i18n.t('error.agentKeyRequired'));
	}
	if (typeof spec.meta.version !== 'string') {
		throw new Error(
			i18n.t('error.agentMissingVersion', { key: spec.meta.key })
		);
	}
	if (!spec.instructions?.trim()) {
		throw new Error(
			i18n.t('error.agentRequiresInstructions', { key: spec.meta.key })
		);
	}
	if (!spec.tools?.length) {
		throw new Error(i18n.t('error.agentRequiresTool', { key: spec.meta.key }));
	}

	for (const [portName, portRef] of Object.entries(spec.runtime?.ports ?? {})) {
		if (portRef !== undefined && portRef.trim().length === 0) {
			throw new Error(
				`Agent ${spec.meta.key} has invalid runtime config: port "${portName}" must not be empty`
			);
		}
	}

	// Validate tool names are unique
	const toolNames = new Set<string>();
	for (const tool of spec.tools) {
		if (toolNames.has(tool.name)) {
			throw new Error(
				i18n.t('error.agentDuplicateTool', {
					key: spec.meta.key,
					name: tool.name,
				})
			);
		}
		toolNames.add(tool.name);

		// subagentRef and operationRef are mutually exclusive
		if (tool.subagentRef && tool.operationRef) {
			throw new Error(
				`Agent ${spec.meta.key} tool "${tool.name}" cannot have both subagentRef and operationRef. Use one.`
			);
		}

		// At most one output rendering ref per tool
		const outputRefCount = [
			tool.outputPresentation,
			tool.outputForm,
			tool.outputDataView,
		].filter(Boolean).length;
		if (outputRefCount > 1) {
			throw new Error(
				`Agent ${spec.meta.key} tool "${tool.name}" has multiple output refs (outputPresentation, outputForm, outputDataView). Use at most one.`
			);
		}
	}

	return Object.freeze(spec);
}

/**
 * Generate a unique key for an agent spec.
 */
export function agentKey(meta: AgentMeta): string {
	return `${meta.key}.v${meta.version}`;
}
