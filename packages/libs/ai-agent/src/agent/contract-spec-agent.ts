import { randomUUID } from 'node:crypto';
import type { ModelSelector } from '@contractspec/lib.ai-providers/selector-types';
import {
	type AgentSpec,
	agentKey,
} from '@contractspec/lib.contracts-spec/agent';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';
import {
	type LanguageModel,
	type StepResult,
	stepCountIs,
	type Tool,
	Experimental_Agent as ToolLoopAgent,
	type ToolSet,
} from 'ai';
import * as z from 'zod';
import {
	type ApprovalRequest,
	type ApprovalWorkflow,
	createApprovalWorkflow,
} from '../approval/workflow';
import type { AgentRuntimeAdapterBundle } from '../interop/runtime-adapters';
import { injectStaticKnowledge } from '../knowledge/injector';
import { type AgentSessionStore, generateSessionId } from '../session/store';
import { type TelemetryCollector, trackAgentStep } from '../telemetry/adapter';
import type {
	PostHogLLMConfig,
	PostHogTracingOptions,
} from '../telemetry/posthog-types';
import type { AgentMemoryStore } from '../tools/agent-memory-store';
import { createKnowledgeQueryTool } from '../tools/knowledge-tool';
import { createMcpToolsets, type McpClientConfig } from '../tools/mcp-client';
import { createAnthropicMemoryTool } from '../tools/memory-tools';
import {
	type SubagentRegistry,
	specToolsToAISDKTools,
} from '../tools/tool-adapter';
import type {
	AgentCallOptions,
	AgentEventEmitter,
	AgentExecutionError,
	AgentGenerateParams,
	AgentGenerateResult,
	AgentSessionState,
	AgentStreamParams,
	ToolHandler,
} from '../types';

/**
 * Call options schema for AI SDK v6.
 * Maps ContractSpec's tenant/actor system to AI SDK callOptionsSchema.
 */
const ContractSpecCallOptionsSchema = z.object({
	tenantId: z.string().optional(),
	actorId: z.string().optional(),
	sessionId: z.string().optional(),
	workflowId: z.string().optional(),
	threadId: z.string().optional(),
	// Zod v4: z.record() requires both key and value schemas
	metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Type for tool with execute function (compatible with AI SDK Tool)
 */
type ExecutableTool = Tool;

/**
 * Configuration for creating a ContractSpecAgent.
 */
export interface ContractSpecAgentConfig {
	/** The agent specification */
	spec: AgentSpec;
	/** AI SDK language model */
	model: LanguageModel;
	/** Map of tool name to handler function */
	toolHandlers: Map<string, ToolHandler>;
	/** Optional OperationSpecRegistry for operation-backed tools (operationRef) */
	operationRegistry?: OperationSpecRegistry;
	/** Optional knowledge retriever for RAG */
	knowledgeRetriever?: KnowledgeRetriever;
	/** Optional session store for persistence */
	sessionStore?: AgentSessionStore;
	/** Optional telemetry collector for evolution */
	telemetryCollector?: TelemetryCollector;
	/** PostHog LLM Analytics config for automatic $ai_generation event capture */
	posthogConfig?: PostHogLLMConfig & {
		/** Per-call tracing overrides (e.g., distinctId from the current user) */
		tracingOptions?: PostHogTracingOptions;
	};
	/** Additional AI SDK tools (e.g., from MCP servers) */
	additionalTools?: Record<string, ExecutableTool>;
	/** Registry for subagent-backed tools (subagentRef) */
	subagentRegistry?: SubagentRegistry;
	/** Storage for memory tools (when memoryTools.provider is anthropic) */
	agentMemoryStore?: AgentMemoryStore;
	/** MCP servers to connect and expose as tools */
	mcpServers?: McpClientConfig[];
	/** Ranking-driven model selector for dynamic per-call routing */
	modelSelector?: ModelSelector;
	/** Optional external adapter bundles keyed by runtime id. */
	runtimeAdapters?: Partial<
		Record<string, AgentRuntimeAdapterBundle<AgentSessionState>>
	>;
	/** Approval workflow used for escalations and tool approvals. */
	approvalWorkflow?: ApprovalWorkflow;
	/** Optional lifecycle/audit event emitter. */
	eventEmitter?: AgentEventEmitter;
}

interface ActiveStepContext {
	traceId: string;
	tenantId?: string;
	actorId?: string;
	workflowId?: string;
	threadId?: string;
	stepIndex: number;
	stepStartedAt: Date;
	pendingApproval?: ApprovalRequest;
}

/**
 * ContractSpec Agent implementation using AI SDK v6.
 *
 * Integrates ContractSpec's spec-first governance with AI SDK's
 * ToolLoopAgent, providing:
 * - Spec-defined tools with type-safe handlers
 * - Hybrid knowledge injection (static + dynamic RAG)
 * - Session persistence
 * - Telemetry for evolution
 * - MCP interoperability
 */
export class ContractSpecAgent {
	readonly version = 'agent-v1';
	readonly id: string;
	readonly spec: AgentSpec;
	readonly tools: Record<string, ExecutableTool>;

	private readonly config: ContractSpecAgentConfig;
	private instructions: string;
	private mcpCleanup?: () => Promise<void>;
	private readonly activeStepContexts = new Map<string, ActiveStepContext>();

	private constructor(
		config: ContractSpecAgentConfig,
		instructions: string,
		tools: Record<string, ExecutableTool>,
		mcpCleanup?: () => Promise<void>
	) {
		this.config = config;
		this.spec = config.spec;
		this.id = agentKey(config.spec.meta);
		this.tools = tools;
		this.instructions = instructions;
		this.mcpCleanup = mcpCleanup;
	}

	/**
	 * Create a ContractSpecAgent instance.
	 * This is async because knowledge injection may need to fetch static content.
	 */
	static async create(
		config: ContractSpecAgentConfig
	): Promise<ContractSpecAgent> {
		const effectiveConfig: ContractSpecAgentConfig = {
			...config,
			approvalWorkflow:
				config.approvalWorkflow ??
				(config.spec.policy?.escalation?.approvalWorkflow
					? createApprovalWorkflow()
					: undefined),
		};
		let mcpToolset: Awaited<ReturnType<typeof createMcpToolsets>> | null = null;

		if ((effectiveConfig.mcpServers?.length ?? 0) > 0) {
			mcpToolset = await createMcpToolsets(effectiveConfig.mcpServers ?? [], {
				onNameCollision: 'error',
			});
		}

		try {
			// 1. Inject static knowledge into instructions
			const instructions = await injectStaticKnowledge(
				effectiveConfig.spec.instructions,
				effectiveConfig.spec.knowledge ?? [],
				effectiveConfig.knowledgeRetriever
			);

			// 2. Build tools from spec
			const specTools = specToolsToAISDKTools(
				effectiveConfig.spec.tools,
				effectiveConfig.toolHandlers,
				{ agentId: agentKey(effectiveConfig.spec.meta) },
				{
					operationRegistry: effectiveConfig.operationRegistry,
					subagentRegistry: effectiveConfig.subagentRegistry,
				}
			);

			// 3. Add dynamic knowledge query tool
			const knowledgeTool = effectiveConfig.knowledgeRetriever
				? createKnowledgeQueryTool(
						effectiveConfig.knowledgeRetriever,
						effectiveConfig.spec.knowledge ?? []
					)
				: null;

			// 3b. Add memory tool when memoryTools.provider is anthropic
			const memoryTool =
				effectiveConfig.spec.memoryTools?.provider === 'anthropic' &&
				effectiveConfig.agentMemoryStore
					? createAnthropicMemoryTool(effectiveConfig.agentMemoryStore)
					: null;

			// 4. Ensure MCP tools do not silently override spec or built-in tools
			const reservedToolNames = new Set(Object.keys(specTools));
			if (knowledgeTool) {
				reservedToolNames.add('query_knowledge');
			}
			if (memoryTool) {
				reservedToolNames.add('memory');
			}

			const conflictingMcpTools = Object.keys(mcpToolset?.tools ?? {}).filter(
				(toolName) => reservedToolNames.has(toolName)
			);

			if (conflictingMcpTools.length > 0) {
				throw new Error(
					`MCP tools conflict with agent tools: ${conflictingMcpTools.join(', ')}. Configure MCP toolPrefix values to avoid collisions.`
				);
			}

			// 5. Combine all tools
			const tools: Record<string, ExecutableTool> = {
				...specTools,
				...(knowledgeTool ? { query_knowledge: knowledgeTool } : {}),
				...(memoryTool ? { memory: memoryTool } : {}),
				...(mcpToolset?.tools ?? {}),
				...(effectiveConfig.additionalTools ?? {}),
			};

			return new ContractSpecAgent(
				effectiveConfig,
				instructions,
				tools,
				mcpToolset?.cleanup
			);
		} catch (error) {
			if (mcpToolset) {
				await mcpToolset.cleanup().catch(() => undefined);
			}
			throw error;
		}
	}

	/**
	 * Cleanup resources held by this agent (e.g., MCP connections).
	 */
	async cleanup(): Promise<void> {
		if (!this.mcpCleanup) {
			return;
		}

		const cleanup = this.mcpCleanup;
		this.mcpCleanup = undefined;
		await cleanup();
	}

	/**
	 * Generate a response (non-streaming).
	 */
	async generate(params: AgentGenerateParams): Promise<AgentGenerateResult> {
		const sessionId = params.options?.sessionId ?? generateSessionId();
		const traceId =
			params.options?.metadata?.['traceId'] ??
			this.config.posthogConfig?.tracingOptions?.posthogTraceId ??
			randomUUID();
		const workflowId =
			params.options?.workflowId ?? params.options?.metadata?.['workflowId'];
		const threadId =
			params.options?.threadId ?? params.options?.metadata?.['threadId'];
		const runtimeAdapter = this.resolveRuntimeAdapter();

		this.activeStepContexts.set(sessionId, {
			traceId,
			tenantId: params.options?.tenantId,
			actorId: params.options?.actorId,
			workflowId,
			threadId,
			stepIndex: 0,
			stepStartedAt: new Date(),
		});

		if (!params.messages?.length) {
			await this.ensureSession({
				sessionId,
				prompt: params.prompt ?? '',
				options: params.options,
				traceId,
			});
			await this.runSessionMiddleware(
				sessionId,
				runtimeAdapter?.middleware?.beforeModel
			);
		}

		const model = await this.resolveModelForCall({
			sessionId,
			traceId,
			options: params.options,
		});
		const effectiveMaxSteps = resolveMaxSteps(
			params.maxSteps,
			this.spec.maxSteps
		);
		const inner = this.createInnerAgent(model, effectiveMaxSteps);

		const generateOptions = {
			abortSignal: params.signal,
			options: {
				tenantId: params.options?.tenantId,
				actorId: params.options?.actorId,
				sessionId,
				workflowId,
				threadId,
				metadata: params.options?.metadata,
			},
		};

		let result: Awaited<ReturnType<(typeof inner)['generate']>>;

		try {
			if (params.messages && params.messages.length > 0) {
				result = await inner.generate({
					messages: params.messages as import('ai').ModelMessage[],
					...generateOptions,
				});
			} else {
				const prompt =
					params.systemOverride && params.prompt
						? `${this.instructions}\n\n${params.systemOverride}\n\n${params.prompt}`
						: (params.prompt ?? '');
				result = await inner.generate({
					prompt,
					...generateOptions,
				});
			}
		} catch (error) {
			const executionError = toAgentExecutionError(error);
			if (this.config.sessionStore) {
				await this.config.sessionStore.update(sessionId, {
					status: 'failed',
					traceId,
					workflowId,
					threadId,
					lastError: executionError,
				});
				await this.syncSessionCheckpoint(sessionId);
			}
			await this.emitAgentEvent('agent.failed', {
				sessionId,
				tenantId: params.options?.tenantId,
				workflowId,
				traceId,
				metadata: {
					error: executionError.message,
					code: executionError.code ?? executionError.kind,
				},
			});
			this.activeStepContexts.delete(sessionId);
			throw error;
		}

		if (!params.messages?.length) {
			await this.runSessionMiddleware(
				sessionId,
				runtimeAdapter?.middleware?.afterModel
			);
		}

		let pendingApproval =
			this.activeStepContexts.get(sessionId)?.pendingApproval;
		const escalationError = pendingApproval
			? undefined
			: resolveEscalationError(this.spec, result.finishReason);
		if (this.config.sessionStore && result.text.trim().length > 0) {
			const currentSession = await this.config.sessionStore.get(sessionId);
			const lastMessage = currentSession?.messages.at(-1);
			const lastContent =
				lastMessage && 'content' in lastMessage
					? lastMessage.content
					: undefined;
			if (lastMessage?.role !== 'assistant' || lastContent !== result.text) {
				await this.config.sessionStore.appendMessage(sessionId, {
					role: 'assistant',
					content: result.text,
				});
			}
		}

		if (!pendingApproval && escalationError) {
			pendingApproval = await this.requestApproval(sessionId, {
				toolName:
					this.spec.policy?.escalation?.approvalWorkflow ?? 'approval_required',
				toolCallId: `approval_${sessionId}`,
				args: {
					finishReason: result.finishReason,
					threshold:
						this.spec.policy?.escalation?.confidenceThreshold ??
						this.spec.policy?.confidence?.min,
				},
				reason: escalationError.message,
				error: escalationError,
			});
		}

		const finalStatus = pendingApproval ? 'escalated' : 'completed';
		if (this.config.sessionStore) {
			await this.config.sessionStore.update(sessionId, {
				status: finalStatus,
				traceId,
				workflowId,
				threadId,
				pendingApprovalRequestId: pendingApproval?.id,
				lastError: pendingApproval ? escalationError : undefined,
			});
			await this.syncSessionCheckpoint(sessionId);
		}

		if (pendingApproval) {
			await this.emitAgentEvent('agent.escalated', {
				sessionId,
				tenantId: params.options?.tenantId,
				workflowId,
				traceId,
				metadata: {
					approvalRequestId: pendingApproval.id,
					reason: pendingApproval.reason,
				},
			});
		} else {
			await this.emitAgentEvent('agent.completed', {
				sessionId,
				tenantId: params.options?.tenantId,
				workflowId,
				traceId,
				metadata: {
					finishReason: result.finishReason,
				},
			});
		}

		const session = this.config.sessionStore
			? await this.config.sessionStore.get(sessionId)
			: null;
		this.activeStepContexts.delete(sessionId);

		return {
			text: result.text,
			steps: result.steps,
			toolCalls: result.toolCalls.map((tc) => ({
				type: 'tool-call' as const,
				toolCallId: tc.toolCallId,
				toolName: tc.toolName,
				args: 'args' in tc ? tc.args : 'input' in tc ? tc.input : undefined,
			})),
			toolResults: result.toolResults.map((tr) => ({
				type: 'tool-result' as const,
				toolCallId: tr.toolCallId,
				toolName: tr.toolName,
				output: tr.output,
			})),
			finishReason: result.finishReason,
			usage: result.usage,
			session: session ?? undefined,
			pendingApproval: pendingApproval
				? {
						toolName: pendingApproval.toolName,
						toolCallId: pendingApproval.toolCallId,
						args: pendingApproval.toolArgs,
					}
				: undefined,
		};
	}

	/**
	 * Stream a response with real-time updates.
	 */
	async stream(params: AgentStreamParams) {
		const sessionId = params.options?.sessionId ?? generateSessionId();
		const traceId =
			params.options?.metadata?.['traceId'] ??
			this.config.posthogConfig?.tracingOptions?.posthogTraceId ??
			randomUUID();
		const workflowId =
			params.options?.workflowId ?? params.options?.metadata?.['workflowId'];
		const threadId =
			params.options?.threadId ?? params.options?.metadata?.['threadId'];
		const runtimeAdapter = this.resolveRuntimeAdapter();

		this.activeStepContexts.set(sessionId, {
			traceId,
			tenantId: params.options?.tenantId,
			actorId: params.options?.actorId,
			workflowId,
			threadId,
			stepIndex: 0,
			stepStartedAt: new Date(),
		});

		const prompt =
			params.systemOverride && params.prompt
				? `${this.instructions}\n\n${params.systemOverride}\n\n${params.prompt}`
				: (params.prompt ?? '');

		await this.ensureSession({
			sessionId,
			prompt,
			options: params.options,
			traceId,
		});
		await this.runSessionMiddleware(
			sessionId,
			runtimeAdapter?.middleware?.beforeModel
		);

		const model = await this.resolveModelForCall({
			sessionId,
			traceId,
			options: params.options,
		});
		const effectiveMaxSteps = resolveMaxSteps(
			params.maxSteps,
			this.spec.maxSteps
		);
		const inner = this.createInnerAgent(model, effectiveMaxSteps);

		return inner.stream({
			prompt,
			abortSignal: params.signal,
			options: {
				tenantId: params.options?.tenantId,
				actorId: params.options?.actorId,
				sessionId,
				workflowId,
				threadId,
				metadata: params.options?.metadata,
			},
		});
	}

	/**
	 * Handle step completion for persistence and telemetry.
	 */
	private async handleStepFinish(step: StepResult<ToolSet>): Promise<void> {
		const sessionId = (step as { options?: AgentCallOptions }).options
			?.sessionId;
		const context = sessionId
			? this.activeStepContexts.get(sessionId)
			: undefined;

		if (sessionId && this.config.sessionStore) {
			await this.config.sessionStore.appendStep(sessionId, step);

			if (step.text.trim().length > 0) {
				await this.config.sessionStore.appendMessage(sessionId, {
					role: 'assistant',
					content: step.text,
				});
			}

			for (const toolCall of step.toolCalls ?? []) {
				await this.emitAgentEvent('agent.tool.called', {
					sessionId,
					tenantId: context?.tenantId,
					workflowId: context?.workflowId,
					traceId: context?.traceId,
					stepIndex: context?.stepIndex,
					toolName: toolCall.toolName,
					metadata: {
						toolCallId: toolCall.toolCallId,
					},
				});
			}

			for (const toolResult of step.toolResults ?? []) {
				const toolCall = step.toolCalls?.find(
					(candidate) => candidate.toolCallId === toolResult.toolCallId
				);
				const toolError = extractToolExecutionError(toolResult.output);
				await this.config.sessionStore.appendMessage(sessionId, {
					role: 'tool',
					content: stringifyToolResult(toolResult.toolName, toolResult.output),
				} as never);

				if (toolError) {
					await this.emitAgentEvent('agent.tool.failed', {
						sessionId,
						tenantId: context?.tenantId,
						workflowId: context?.workflowId,
						traceId: context?.traceId,
						stepIndex: context?.stepIndex,
						toolName: toolResult.toolName,
						metadata: {
							toolCallId: toolResult.toolCallId,
							error: toolError.message,
							code: toolError.code,
						},
					});

					const shouldEscalate =
						(toolError.kind === 'timeout' &&
							this.spec.policy?.escalation?.onTimeout) ||
						(toolError.kind !== 'timeout' &&
							this.spec.policy?.escalation?.onToolFailure);

					if (shouldEscalate && toolCall && !context?.pendingApproval) {
						await this.requestApproval(sessionId, {
							toolName: toolCall.toolName,
							toolCallId: toolCall.toolCallId,
							args: toolCall.input,
							reason: toolError.message,
							error: toolError,
						});
					}
				} else {
					await this.emitAgentEvent('agent.tool.completed', {
						sessionId,
						tenantId: context?.tenantId,
						workflowId: context?.workflowId,
						traceId: context?.traceId,
						stepIndex: context?.stepIndex,
						toolName: toolResult.toolName,
						metadata: {
							toolCallId: toolResult.toolCallId,
						},
					});
				}
			}

			await this.config.sessionStore.update(sessionId, {
				status: context?.pendingApproval
					? 'escalated'
					: step.finishReason === 'tool-calls'
						? 'waiting'
						: 'running',
				workflowId: context?.workflowId,
				threadId: context?.threadId,
				traceId: context?.traceId,
				pendingApprovalRequestId: context?.pendingApproval?.id,
			});
			await this.syncSessionCheckpoint(sessionId);
		}

		if (this.config.telemetryCollector) {
			const now = new Date();
			const stepStartedAt = context?.stepStartedAt ?? now;
			const durationMs = Math.max(now.getTime() - stepStartedAt.getTime(), 0);

			if (context) {
				context.stepIndex += 1;
				context.stepStartedAt = now;
			}

			await trackAgentStep(
				this.config.telemetryCollector,
				this.id,
				step,
				durationMs,
				{
					sessionId,
					tenantId: context?.tenantId,
					actorId: context?.actorId,
					workflowId: context?.workflowId,
					traceId: context?.traceId,
					stepIndex: context?.stepIndex,
					stepStartedAt,
				}
			);

			if (sessionId && step.finishReason !== 'tool-calls') {
				this.activeStepContexts.delete(sessionId);
			}
		}
	}

	private async ensureSession(params: {
		sessionId: string;
		prompt: string;
		options?: AgentCallOptions;
		traceId: string;
	}): Promise<void> {
		if (!this.config.sessionStore) {
			return;
		}

		const runtimeAdapter = this.resolveRuntimeAdapter();
		let session = await this.config.sessionStore.get(params.sessionId);
		const previousStatus = session?.status;

		if (!session && runtimeAdapter?.checkpoint) {
			const checkpoint = await runtimeAdapter.checkpoint.load(params.sessionId);
			if (checkpoint) {
				session = await this.config.sessionStore.create({
					...omitSessionTimestamps(checkpoint.state),
					workflowId: params.options?.workflowId ?? checkpoint.state.workflowId,
					threadId: params.options?.threadId ?? checkpoint.state.threadId,
					traceId: params.traceId,
					checkpointId: checkpoint.checkpointId,
					status: 'running',
					pendingApprovalRequestId: undefined,
					lastError: undefined,
					metadata: params.options?.metadata ?? checkpoint.state.metadata,
				});
			}
		}

		if (!session) {
			session = await this.config.sessionStore.create({
				sessionId: params.sessionId,
				agentId: this.id,
				tenantId: params.options?.tenantId,
				actorId: params.options?.actorId,
				workflowId: params.options?.workflowId,
				threadId: params.options?.threadId,
				traceId: params.traceId,
				status: 'running',
				messages: [],
				steps: [],
				metadata: params.options?.metadata,
			});
			await this.emitAgentEvent('agent.session.created', {
				sessionId: params.sessionId,
				tenantId: params.options?.tenantId,
				workflowId: params.options?.workflowId,
				traceId: params.traceId,
			});
		} else {
			await this.config.sessionStore.update(params.sessionId, {
				status: 'running',
				workflowId: params.options?.workflowId ?? session.workflowId,
				threadId: params.options?.threadId ?? session.threadId,
				traceId: params.traceId,
				metadata: params.options?.metadata ?? session.metadata,
				pendingApprovalRequestId: undefined,
				lastError: undefined,
			});
			await this.emitAgentEvent('agent.session.updated', {
				sessionId: params.sessionId,
				tenantId: params.options?.tenantId ?? session.tenantId,
				workflowId: params.options?.workflowId ?? session.workflowId,
				traceId: params.traceId,
				metadata: {
					previousStatus: previousStatus ?? 'idle',
					nextStatus: 'running',
				},
			});
		}

		await this.config.sessionStore.appendMessage(params.sessionId, {
			role: 'user',
			content: params.prompt,
		});

		if (
			runtimeAdapter?.suspendResume &&
			(previousStatus === 'waiting' || previousStatus === 'escalated')
		) {
			await runtimeAdapter.suspendResume.resume({
				sessionId: params.sessionId,
				input: params.prompt,
				metadata: compactStringRecord({
					traceId: params.traceId,
					workflowId: params.options?.workflowId,
					threadId: params.options?.threadId,
				}),
			});
		}

		await this.syncSessionCheckpoint(params.sessionId);
	}

	private resolveRuntimeAdapter():
		| AgentRuntimeAdapterBundle<AgentSessionState>
		| undefined {
		return resolveRuntimeAdapterBundle(this.spec, this.config.runtimeAdapters);
	}

	private async syncSessionCheckpoint(
		sessionId: string
	): Promise<AgentSessionState | null> {
		if (!this.config.sessionStore) {
			return null;
		}

		const runtimeAdapter = this.resolveRuntimeAdapter();
		const session = await this.config.sessionStore.get(sessionId);
		if (!runtimeAdapter?.checkpoint || !session) {
			return session;
		}

		const checkpointId = `${sessionId}:${Date.now()}`;
		await runtimeAdapter.checkpoint.save({
			sessionId,
			threadId: session.threadId,
			state: session,
			checkpointId,
			createdAt: new Date(),
		});
		await this.config.sessionStore.update(sessionId, {
			checkpointId,
		});
		return this.config.sessionStore.get(sessionId);
	}

	private async runSessionMiddleware(
		sessionId: string,
		hook?: (
			state: AgentSessionState
		) => Promise<AgentSessionState | undefined> | AgentSessionState | undefined
	): Promise<void> {
		if (!hook || !this.config.sessionStore) {
			return;
		}

		const session = await this.config.sessionStore.get(sessionId);
		if (!session) {
			return;
		}

		const next = await hook(session);
		if (!next) {
			return;
		}

		await this.config.sessionStore.update(sessionId, {
			status: next.status,
			metadata: next.metadata,
			workflowId: next.workflowId,
			threadId: next.threadId,
			traceId: next.traceId,
			checkpointId: next.checkpointId,
			pendingApprovalRequestId: next.pendingApprovalRequestId,
			lastError: next.lastError,
		});
		await this.syncSessionCheckpoint(sessionId);
	}

	private async requestApproval(
		sessionId: string,
		params: {
			toolName: string;
			toolCallId: string;
			args: unknown;
			reason: string;
			error?: AgentExecutionError;
		}
	): Promise<ApprovalRequest | undefined> {
		const approvalWorkflow = this.config.approvalWorkflow;
		const context = this.activeStepContexts.get(sessionId);
		if (!approvalWorkflow || !context || context.pendingApproval) {
			return context?.pendingApproval;
		}

		const request = await approvalWorkflow.requestApproval({
			sessionId,
			agentId: this.id,
			tenantId: context.tenantId,
			toolName: params.toolName,
			toolCallId: params.toolCallId,
			toolArgs: params.args,
			reason: params.reason,
			payload: {
				traceId: context.traceId,
				workflowId: context.workflowId,
				threadId: context.threadId,
				code: params.error?.code,
			},
		});

		context.pendingApproval = request;
		if (this.config.sessionStore) {
			await this.config.sessionStore.update(sessionId, {
				status: 'escalated',
				pendingApprovalRequestId: request.id,
				lastError: params.error,
			});
			await this.syncSessionCheckpoint(sessionId);
		}

		await this.emitAgentEvent('agent.tool.approval_requested', {
			sessionId,
			tenantId: context.tenantId,
			workflowId: context.workflowId,
			traceId: context.traceId,
			stepIndex: context.stepIndex,
			toolName: params.toolName,
			metadata: {
				approvalRequestId: request.id,
				toolCallId: params.toolCallId,
				reason: params.reason,
			},
		});
		await this.emitAgentEvent('agent.escalated', {
			sessionId,
			tenantId: context.tenantId,
			workflowId: context.workflowId,
			traceId: context.traceId,
			stepIndex: context.stepIndex,
			toolName: params.toolName,
			metadata: {
				approvalRequestId: request.id,
				reason: params.reason,
			},
		});

		const runtimeAdapter = this.resolveRuntimeAdapter();
		if (runtimeAdapter?.suspendResume) {
			await runtimeAdapter.suspendResume.suspend({
				sessionId,
				reason: params.reason,
				metadata: compactStringRecord({
					traceId: context.traceId,
					workflowId: context.workflowId,
					threadId: context.threadId,
					approvalRequestId: request.id,
				}),
			});
		}

		return request;
	}

	private async emitAgentEvent(
		event: Parameters<NonNullable<AgentEventEmitter>>[0],
		payload: Omit<Parameters<NonNullable<AgentEventEmitter>>[1], 'agentId'>
	): Promise<void> {
		if (!this.config.eventEmitter) {
			return;
		}

		await this.config.eventEmitter(event, {
			agentId: this.id,
			...payload,
		});
	}

	private createInnerAgent(
		model: LanguageModel,
		maxSteps: number
	): ToolLoopAgent<
		z.infer<typeof ContractSpecCallOptionsSchema>,
		ToolSet,
		never
	> {
		return new ToolLoopAgent({
			model,
			instructions: this.instructions,
			tools: this.tools as ToolSet,
			stopWhen: stepCountIs(maxSteps),
			callOptionsSchema: ContractSpecCallOptionsSchema,
			onStepFinish: async (step: StepResult<ToolSet>) => {
				await this.handleStepFinish(step);
			},
		});
	}

	private async resolveModelForCall(params: {
		sessionId: string;
		traceId: string;
		options?: AgentCallOptions;
	}): Promise<LanguageModel> {
		if (this.config.modelSelector && params.options?.selectionContext) {
			const { model } = await this.config.modelSelector.selectAndCreate(
				params.options.selectionContext
			);
			return model;
		}

		const posthogConfig = this.config.posthogConfig;
		if (!posthogConfig) {
			return this.config.model;
		}

		const mergedProperties: Record<string, unknown> = {
			...posthogConfig.defaults?.posthogProperties,
			...posthogConfig.tracingOptions?.posthogProperties,
			$ai_session_id: params.sessionId,
			contractspec_session_id: params.sessionId,
			contractspec_trace_id: params.traceId,
			contractspec_agent_id: this.id,
			contractspec_tenant_id: params.options?.tenantId,
			contractspec_actor_id: params.options?.actorId,
			contractspec_workflow_id: params.options?.workflowId,
			contractspec_thread_id: params.options?.threadId,
		};

		const tracingOptions: PostHogTracingOptions = {
			...posthogConfig.tracingOptions,
			posthogDistinctId:
				posthogConfig.tracingOptions?.posthogDistinctId ??
				params.options?.actorId,
			posthogTraceId: params.traceId,
			posthogProperties: mergedProperties,
		};

		const { createPostHogTracedModel } = await import('../telemetry/posthog');
		return createPostHogTracedModel(
			this.config.model,
			posthogConfig,
			tracingOptions
		);
	}
}

function omitSessionTimestamps(
	session: AgentSessionState
): Omit<AgentSessionState, 'createdAt' | 'updatedAt'> {
	const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = session;
	return rest;
}

function resolveRuntimeAdapterBundle(
	spec: AgentSpec,
	runtimeAdapters?: Partial<
		Record<string, AgentRuntimeAdapterBundle<AgentSessionState>>
	>
): AgentRuntimeAdapterBundle<AgentSessionState> | undefined {
	if (!runtimeAdapters) {
		return undefined;
	}

	const preferredKeys: Array<'langgraph' | 'langchain' | 'workflow-devkit'> = [
		'langgraph',
		'langchain',
		'workflow-devkit',
	];
	for (const key of preferredKeys) {
		if (spec.runtime?.capabilities?.adapters?.[key] && runtimeAdapters[key]) {
			return runtimeAdapters[key];
		}
	}

	for (const key of preferredKeys) {
		if (runtimeAdapters[key]) {
			return runtimeAdapters[key];
		}
	}

	return undefined;
}

function compactStringRecord(
	input: Record<string, string | undefined>
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(input).filter(
			(entry): entry is [string, string] =>
				typeof entry[1] === 'string' && entry[1].length > 0
		)
	);
}

function toAgentExecutionError(error: unknown): AgentExecutionError {
	if (
		error &&
		typeof error === 'object' &&
		'kind' in error &&
		typeof error.kind === 'string' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return {
			kind: error.kind as AgentExecutionError['kind'],
			message: error.message,
			code:
				'code' in error && typeof error.code === 'string'
					? error.code
					: undefined,
			retryAfterMs:
				'retryAfterMs' in error && typeof error.retryAfterMs === 'number'
					? error.retryAfterMs
					: undefined,
		};
	}

	if (error instanceof Error) {
		return {
			kind:
				error.message.toLowerCase().includes('timeout') ||
				(error as { code?: string }).code === 'TOOL_EXECUTION_TIMEOUT'
					? 'timeout'
					: 'fatal',
			message: error.message,
			code: (error as { code?: string }).code,
		};
	}

	return {
		kind: 'fatal',
		message: String(error),
	};
}

function extractToolExecutionError(
	output: unknown
): AgentExecutionError | undefined {
	if (!output) {
		return undefined;
	}

	if (typeof output === 'string') {
		if (output.toLowerCase().includes('error')) {
			return {
				kind: output.toLowerCase().includes('timeout')
					? 'timeout'
					: 'retryable',
				message: output,
			};
		}
		return undefined;
	}

	if (typeof output !== 'object') {
		return undefined;
	}

	const record = output as Record<string, unknown>;
	const nestedError = record['error'];
	if (nestedError instanceof Error) {
		return toAgentExecutionError(nestedError);
	}

	if (nestedError && typeof nestedError === 'object') {
		return toAgentExecutionError(nestedError);
	}

	if (
		typeof record['message'] === 'string' &&
		typeof record['kind'] === 'string'
	) {
		return {
			kind: record['kind'] as AgentExecutionError['kind'],
			message: record['message'],
			code: typeof record['code'] === 'string' ? record['code'] : undefined,
			retryAfterMs:
				typeof record['retryAfterMs'] === 'number'
					? record['retryAfterMs']
					: undefined,
		};
	}

	if (typeof record['errorMessage'] === 'string') {
		return {
			kind:
				typeof record['errorCode'] === 'string' &&
				record['errorCode'].includes('TIMEOUT')
					? 'timeout'
					: 'retryable',
			message: record['errorMessage'],
			code:
				typeof record['errorCode'] === 'string'
					? record['errorCode']
					: undefined,
		};
	}

	return undefined;
}

function stringifyToolResult(toolName: string, output: unknown): string {
	if (typeof output === 'string') {
		return `[${toolName}] ${output}`;
	}

	try {
		return `[${toolName}] ${JSON.stringify(output)}`;
	} catch {
		return `[${toolName}] [unserializable result]`;
	}
}

function resolveMaxSteps(
	overrideMaxSteps: number | undefined,
	specMaxSteps?: number
) {
	const candidate = overrideMaxSteps ?? specMaxSteps ?? 10;
	if (!Number.isFinite(candidate)) {
		return 10;
	}

	if (candidate < 1) {
		return 1;
	}

	return Math.round(candidate);
}

function resolveEscalationError(
	spec: AgentSpec,
	finishReason: string
): AgentExecutionError | undefined {
	const escalation = spec.policy?.escalation;
	if (!escalation) {
		return undefined;
	}

	if (escalation.onTimeout && finishReason === 'length') {
		return {
			kind: 'timeout',
			code: 'AGENT_TIMEOUT_ESCALATION',
			message: 'Agent reached max step budget and requires escalation.',
		};
	}

	if (escalation.onToolFailure && finishReason === 'error') {
		return {
			kind: 'retryable',
			code: 'AGENT_TOOL_FAILURE_ESCALATION',
			message: 'Agent encountered a tool failure and requires escalation.',
		};
	}

	const confidenceThreshold = escalation.confidenceThreshold;
	const defaultConfidence = spec.policy?.confidence?.default;
	if (
		confidenceThreshold !== undefined &&
		defaultConfidence !== undefined &&
		defaultConfidence < confidenceThreshold
	) {
		return {
			kind: 'policy_blocked',
			code: 'AGENT_CONFIDENCE_ESCALATION',
			message: `Agent default confidence (${defaultConfidence}) is below escalation threshold (${confidenceThreshold}).`,
		};
	}

	return undefined;
}
