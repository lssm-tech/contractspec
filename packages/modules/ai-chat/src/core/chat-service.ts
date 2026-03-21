/**
 * Main chat orchestration service
 */
import { generateText, streamText, type ToolSet } from 'ai';

/** Message format compatible with AI SDK streamText/generateText */
type ModelMessage =
	| { role: 'user'; content: string }
	| { role: 'assistant'; content: string }
	| {
			role: 'assistant';
			content: string;
			toolCalls: {
				type: 'tool-call';
				toolCallId: string;
				toolName: string;
				args: Record<string, unknown>;
			}[];
	  }
	| {
			role: 'tool';
			content: {
				type: 'tool-result';
				toolCallId: string;
				toolName: string;
				output: unknown;
			}[];
	  };

import type {
	Provider as ChatProvider,
	ProviderName,
} from '@contractspec/lib.ai-providers';
import type { ModelSelector } from '@contractspec/lib.ai-providers/selector-types';
import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import { compilePlannerPrompt } from '@contractspec/lib.surface-runtime/runtime/planner-prompt';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type { WorkflowComposer } from '@contractspec/lib.workflow-composer';
import type { WorkspaceContext } from '../context/workspace-context';
import { agentToolConfigsToToolSet } from './agent-tools-adapter';
import {
	buildContractsContextPrompt,
	type ContractsContextConfig,
} from './contracts-context';
import type { ConversationStore } from './conversation-store';
import { InMemoryConversationStore } from './conversation-store';
import type {
	ChatConversation,
	ChatMessage,
	ChatSource,
	ChatStreamChunk,
	ChatToolCall,
	SendMessageOptions,
	SendMessageResult,
	StreamMessageResult,
} from './message-types';
import {
	buildPlannerPromptInput,
	createSurfacePlannerTools,
} from './surface-planner-tools';
import { getProviderOptions, type ThinkingLevel } from './thinking-levels';
import { createWorkflowTools } from './workflow-tools';

/**
 * Configuration for ChatService
 */
export interface ChatServiceConfig {
	/** LLM provider to use */
	provider: ChatProvider;
	/** Optional workspace context for code-aware chat */
	context?: WorkspaceContext;
	/** Optional conversation store (defaults to in-memory) */
	store?: ConversationStore;
	/** Default system prompt */
	systemPrompt?: string;
	/** Maximum conversation history to include */
	maxHistoryMessages?: number;
	/** Callback for usage tracking */
	onUsage?: (usage: { inputTokens: number; outputTokens: number }) => void;
	/** Transport protocol for provider communication (e.g. "rest", "mcp"). */
	transport?: string;
	/** Auth method the provider expects (e.g. "api-key", "oauth2"). */
	authMethod?: string;
	/** Extra headers forwarded to the provider for authentication. */
	authHeaders?: Record<string, string>;
	/** Tools for the model to call (AI SDK ToolSet) */
	tools?: ToolSet;
	/** Thinking level: instant, thinking, extra_thinking, max. Maps to provider reasoning options. */
	thinkingLevel?: ThinkingLevel;
	/** Enable reasoning parts in stream (Deepseek R1, Claude extended thinking) */
	sendReasoning?: boolean;
	/** Enable source citations in stream (e.g. Perplexity Sonar) */
	sendSources?: boolean;
	/** Workflow creation tools: base workflows and optional composer */
	workflowToolsConfig?: {
		baseWorkflows: WorkflowSpec[];
		composer?: WorkflowComposer;
	};
	/** Optional model selector for dynamic model selection by task dimension */
	modelSelector?: ModelSelector;
	/** Contracts-spec context: agent, data-views, operations, forms, presentations */
	contractsContext?: ContractsContextConfig;
	/** Surface plan config: enables propose-patch tool when used in surface-runtime */
	surfacePlanConfig?: {
		plan: ResolvedSurfacePlan;
		onPatchProposal?: (
			proposal: import('@contractspec/lib.surface-runtime/spec/types').SurfacePatchProposal
		) => void;
	};
	/** MCP tools (from createMcpToolsets); merged when provided */
	mcpTools?: ToolSet;
}

/**
 * Default system prompt for ContractSpec vibe coding
 */
const DEFAULT_SYSTEM_PROMPT = `You are ContractSpec AI, an expert coding assistant specialized in ContractSpec development.

Your capabilities:
- Help users create, modify, and understand ContractSpec specifications
- Generate code that follows ContractSpec patterns and best practices
- Explain concepts from the ContractSpec documentation
- Suggest improvements and identify issues in specs and implementations

Guidelines:
- Be concise but thorough
- Provide code examples when helpful
- Reference relevant ContractSpec concepts and patterns
- Ask clarifying questions when the user's intent is unclear
- When suggesting code changes, explain the rationale`;

const WORKFLOW_TOOLS_PROMPT = `

Workflow creation: You can create and modify workflows. Use create_workflow_extension when the user asks to add steps, change a workflow, or create a tenant-specific extension. Use compose_workflow to apply extensions to a base workflow. Use generate_workflow_spec_code to output TypeScript for the user to save.`;

/**
 * Main chat service for AI-powered conversations
 */
export class ChatService {
	private readonly provider: ChatProvider;
	private readonly context?: WorkspaceContext;
	private readonly store: ConversationStore;
	private readonly systemPrompt: string;
	private readonly maxHistoryMessages: number;
	private readonly onUsage?: (usage: {
		inputTokens: number;
		outputTokens: number;
	}) => void;
	private readonly tools?: ToolSet;
	private readonly thinkingLevel?: ThinkingLevel;
	private readonly sendReasoning: boolean;
	private readonly sendSources: boolean;
	private readonly modelSelector?: ModelSelector;

	constructor(config: ChatServiceConfig) {
		this.provider = config.provider;
		this.context = config.context;
		this.store = config.store ?? new InMemoryConversationStore();
		this.systemPrompt = this.buildSystemPrompt(config);
		this.maxHistoryMessages = config.maxHistoryMessages ?? 20;
		this.onUsage = config.onUsage;
		this.tools = this.mergeTools(config);
		this.thinkingLevel = config.thinkingLevel;
		this.modelSelector = config.modelSelector;
		this.sendReasoning =
			config.sendReasoning ??
			(config.thinkingLevel != null && config.thinkingLevel !== 'instant');
		this.sendSources = config.sendSources ?? false;
	}

	private buildSystemPrompt(config: ChatServiceConfig): string {
		let base = config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
		if (config.workflowToolsConfig?.baseWorkflows?.length) {
			base += WORKFLOW_TOOLS_PROMPT;
		}
		const contractsPrompt = buildContractsContextPrompt(
			config.contractsContext ?? {}
		);
		if (contractsPrompt) {
			base += contractsPrompt;
		}
		if (config.surfacePlanConfig?.plan) {
			const plannerInput = buildPlannerPromptInput(
				config.surfacePlanConfig.plan
			);
			base += '\n\n' + compilePlannerPrompt(plannerInput);
		}
		return base;
	}

	private mergeTools(config: ChatServiceConfig): ToolSet | undefined {
		let merged: ToolSet = config.tools ?? {};
		const wfConfig = config.workflowToolsConfig;
		if (wfConfig?.baseWorkflows?.length) {
			const workflowTools = createWorkflowTools({
				baseWorkflows: wfConfig.baseWorkflows,
				composer: wfConfig.composer,
			});
			merged = { ...merged, ...workflowTools } as ToolSet;
		}
		const contractsCtx = config.contractsContext;
		if (contractsCtx?.agentSpecs?.length) {
			const allTools: import('@contractspec/lib.contracts-spec/agent').AgentToolConfig[] =
				[];
			for (const agent of contractsCtx.agentSpecs) {
				if (agent.tools?.length) allTools.push(...agent.tools);
			}
			if (allTools.length > 0) {
				const agentTools = agentToolConfigsToToolSet(allTools);
				merged = { ...merged, ...agentTools } as ToolSet;
			}
		}
		const surfaceConfig = config.surfacePlanConfig;
		if (surfaceConfig?.plan) {
			const plannerTools = createSurfacePlannerTools({
				plan: surfaceConfig.plan,
				onPatchProposal: surfaceConfig.onPatchProposal,
			});
			merged = { ...merged, ...plannerTools } as ToolSet;
		}
		if (config.mcpTools && Object.keys(config.mcpTools).length > 0) {
			merged = { ...merged, ...config.mcpTools } as ToolSet;
		}
		return Object.keys(merged).length > 0 ? merged : undefined;
	}

	private async resolveModel(): Promise<{
		model: ReturnType<ChatProvider['getModel']>;
		providerName: string;
	}> {
		if (this.modelSelector) {
			const dimension = this.thinkingLevelToDimension(this.thinkingLevel);
			const { model, selection } = await this.modelSelector.selectAndCreate({
				taskDimension: dimension,
			});
			return { model, providerName: selection.providerKey };
		}
		return {
			model: this.provider.getModel(),
			providerName: this.provider.name,
		};
	}

	private thinkingLevelToDimension(
		level: ThinkingLevel | undefined
	): 'reasoning' | 'latency' {
		if (!level || level === 'instant') return 'latency';
		return 'reasoning';
	}

	/**
	 * Send a message and get a complete response
	 */
	async send(options: SendMessageOptions): Promise<SendMessageResult> {
		// Get or create conversation
		let conversation: ChatConversation;
		if (options.conversationId) {
			const existing = await this.store.get(options.conversationId);
			if (!existing) {
				throw new Error(`Conversation ${options.conversationId} not found`);
			}
			conversation = existing;
		} else {
			conversation = await this.store.create({
				status: 'active',
				provider: this.provider.name,
				model: this.provider.model,
				messages: [],
				workspacePath: this.context?.workspacePath,
			});
		}

		// Add user message (skip when regenerating from edit)
		if (!options.skipUserAppend) {
			await this.store.appendMessage(conversation.id, {
				role: 'user',
				content: options.content,
				status: 'completed',
				attachments: options.attachments,
			});
		}

		conversation = (await this.store.get(conversation.id)) ?? conversation;

		// Build messages for model
		const messages = this.buildMessages(conversation, options);

		// Get the language model (from provider or modelSelector)
		const { model, providerName } = await this.resolveModel();

		const providerOptions = getProviderOptions(
			this.thinkingLevel,
			providerName as ProviderName
		);

		try {
			// Generate response
			const result = await generateText({
				model,
				messages: messages as unknown as NonNullable<
					Parameters<typeof generateText>[0]['messages']
				>,
				system: this.systemPrompt,
				tools: this.tools,
				providerOptions:
					Object.keys(providerOptions).length > 0
						? (providerOptions as Parameters<
								typeof generateText
							>[0]['providerOptions'])
						: undefined,
			});

			// Save assistant message
			const assistantMessage = await this.store.appendMessage(conversation.id, {
				role: 'assistant',
				content: result.text,
				status: 'completed',
			});

			// Refresh conversation
			const updatedConversation = await this.store.get(conversation.id);
			if (!updatedConversation) {
				throw new Error('Conversation lost after update');
			}

			return {
				message: assistantMessage,
				conversation: updatedConversation,
			};
		} catch (error) {
			// Save error message
			await this.store.appendMessage(conversation.id, {
				role: 'assistant',
				content: '',
				status: 'error',
				error: {
					code: 'generation_failed',
					message: error instanceof Error ? error.message : String(error),
				},
			});

			throw error;
		}
	}

	/**
	 * Send a message and get a streaming response
	 */
	async stream(options: SendMessageOptions): Promise<StreamMessageResult> {
		// Get or create conversation
		let conversation: ChatConversation;
		if (options.conversationId) {
			const existing = await this.store.get(options.conversationId);
			if (!existing) {
				throw new Error(`Conversation ${options.conversationId} not found`);
			}
			conversation = existing;
		} else {
			conversation = await this.store.create({
				status: 'active',
				provider: this.provider.name,
				model: this.provider.model,
				messages: [],
				workspacePath: this.context?.workspacePath,
			});
		}

		// Add user message (skip when regenerating from edit)
		if (!options.skipUserAppend) {
			await this.store.appendMessage(conversation.id, {
				role: 'user',
				content: options.content,
				status: 'completed',
				attachments: options.attachments,
			});
		}

		// Refresh conversation after optional append
		conversation = (await this.store.get(conversation.id)) ?? conversation;

		// Create placeholder for assistant message
		const assistantMessage = await this.store.appendMessage(conversation.id, {
			role: 'assistant',
			content: '',
			status: 'streaming',
		});

		// Build messages for model
		const messages = this.buildMessages(conversation, options);

		// Get the language model (from provider or modelSelector) and capture for async generator closure
		const { model, providerName } = await this.resolveModel();
		const systemPrompt = this.systemPrompt;
		const tools = this.tools;
		const store = this.store;
		const onUsage = this.onUsage;
		const streamProviderOptions = getProviderOptions(
			this.thinkingLevel,
			providerName as ProviderName
		);

		async function* streamGenerator(): AsyncIterable<ChatStreamChunk> {
			let fullContent = '';
			let fullReasoning = '';
			const toolCallsMap = new Map<string, ChatToolCall>();
			const sources: ChatSource[] = [];

			try {
				const result = streamText({
					model,
					messages: messages as unknown as NonNullable<
						Parameters<typeof streamText>[0]['messages']
					>,
					system: systemPrompt,
					tools,
					providerOptions:
						Object.keys(streamProviderOptions).length > 0
							? (streamProviderOptions as Parameters<
									typeof streamText
								>[0]['providerOptions'])
							: undefined,
				});

				for await (const part of result.fullStream) {
					if (part.type === 'text-delta') {
						const text = (part as { text?: string }).text ?? '';
						if (text) {
							fullContent += text;
							yield { type: 'text', content: text };
						}
					} else if (part.type === 'reasoning-delta') {
						const text = (part as { text?: string }).text ?? '';
						if (text) {
							fullReasoning += text;
							yield { type: 'reasoning', content: text };
						}
					} else if (part.type === 'source') {
						const src = part as { id: string; url?: string; title?: string };
						const source: ChatSource = {
							id: src.id,
							title: src.title ?? '',
							url: src.url,
							type: 'web',
						};
						sources.push(source);
						yield { type: 'source', source };
					} else if (part.type === 'tool-call') {
						const toolCall: ChatToolCall = {
							id: part.toolCallId,
							name: part.toolName,
							args: ((part as { input?: Record<string, unknown> }).input ??
								{}) as Record<string, unknown>,
							status: 'running',
						};
						toolCallsMap.set(part.toolCallId, toolCall);
						yield { type: 'tool_call', toolCall };
					} else if (part.type === 'tool-result') {
						const tc = toolCallsMap.get(part.toolCallId);
						if (tc) {
							tc.result = (part as { output?: unknown }).output;
							tc.status = 'completed';
						}
						yield {
							type: 'tool_result',
							toolResult: {
								toolCallId: part.toolCallId,
								toolName: part.toolName,
								result: (part as { output?: unknown }).output,
							},
						};
					} else if (part.type === 'tool-error') {
						const tc = toolCallsMap.get(
							(part as { toolCallId: string }).toolCallId
						);
						if (tc) {
							tc.status = 'error';
							tc.error =
								(part as { error?: string }).error ?? 'Tool execution failed';
						}
					} else if (part.type === 'finish') {
						const usage = (
							part as {
								usage?: { inputTokens?: number; completionTokens?: number };
							}
						).usage;
						const inputTokens = usage?.inputTokens ?? 0;
						const outputTokens = usage?.completionTokens ?? 0;
						await store.updateMessage(conversation.id, assistantMessage.id, {
							content: fullContent,
							status: 'completed',
							reasoning: fullReasoning || undefined,
							sources: sources.length > 0 ? sources : undefined,
							toolCalls:
								toolCallsMap.size > 0
									? Array.from(toolCallsMap.values())
									: undefined,
							usage: usage ? { inputTokens, outputTokens } : undefined,
						});
						onUsage?.({ inputTokens, outputTokens });
						yield {
							type: 'done',
							usage: usage ? { inputTokens, outputTokens } : undefined,
						};
						return;
					}
				}

				// Fallback if finish not received
				await store.updateMessage(conversation.id, assistantMessage.id, {
					content: fullContent,
					status: 'completed',
					reasoning: fullReasoning || undefined,
					sources: sources.length > 0 ? sources : undefined,
					toolCalls:
						toolCallsMap.size > 0
							? Array.from(toolCallsMap.values())
							: undefined,
				});
				yield { type: 'done' };
			} catch (error) {
				await store.updateMessage(conversation.id, assistantMessage.id, {
					content: fullContent,
					status: 'error',
					error: {
						code: 'stream_failed',
						message: error instanceof Error ? error.message : String(error),
					},
				});

				yield {
					type: 'error',
					error: {
						code: 'stream_failed',
						message: error instanceof Error ? error.message : String(error),
					},
				};
			}
		}

		return {
			conversationId: conversation.id,
			messageId: assistantMessage.id,
			stream: streamGenerator(),
		};
	}

	/**
	 * Get a conversation by ID
	 */
	async getConversation(
		conversationId: string
	): Promise<ChatConversation | null> {
		return this.store.get(conversationId);
	}

	/**
	 * List conversations
	 */
	async listConversations(options?: {
		projectId?: string;
		tags?: string[];
		limit?: number;
		offset?: number;
	}): Promise<ChatConversation[]> {
		return this.store.list({
			status: 'active',
			...options,
		});
	}

	/**
	 * Update conversation properties (title, project, tags, etc.)
	 */
	async updateConversation(
		conversationId: string,
		updates: Parameters<ConversationStore['update']>[1]
	): Promise<ChatConversation | null> {
		return this.store.update(conversationId, updates);
	}

	/**
	 * Fork a conversation, optionally up to a specific message
	 */
	async forkConversation(
		conversationId: string,
		upToMessageId?: string
	): Promise<ChatConversation> {
		return this.store.fork(conversationId, upToMessageId);
	}

	/**
	 * Update a message in a conversation
	 */
	async updateMessage(
		conversationId: string,
		messageId: string,
		updates: Partial<ChatMessage>
	): Promise<ChatMessage | null> {
		return this.store.updateMessage(conversationId, messageId, updates);
	}

	/**
	 * Truncate messages after the given message (for edit/regenerate)
	 */
	async truncateAfter(
		conversationId: string,
		messageId: string
	): Promise<ChatConversation | null> {
		return this.store.truncateAfter(conversationId, messageId);
	}

	/**
	 * Delete a conversation
	 */
	async deleteConversation(conversationId: string): Promise<boolean> {
		return this.store.delete(conversationId);
	}

	/**
	 * Build ModelMessage array for LLM (AI SDK format)
	 */
	private buildMessages(
		conversation: ChatConversation,
		_options: SendMessageOptions
	): ModelMessage[] {
		const historyStart = Math.max(
			0,
			conversation.messages.length - this.maxHistoryMessages
		);
		const messages: ModelMessage[] = [];

		for (let i = historyStart; i < conversation.messages.length; i++) {
			const msg = conversation.messages[i];
			if (!msg) continue;

			if (msg.role === 'user') {
				let content = msg.content;
				if (msg.attachments?.length) {
					const attachmentInfo = msg.attachments
						.map((a) => {
							if (a.type === 'file' || a.type === 'code') {
								return `\n\n### ${a.name}\n\`\`\`\n${a.content ?? ''}\n\`\`\``;
							}
							return `\n\n[Attachment: ${a.name}]`;
						})
						.join('');
					content += attachmentInfo;
				}
				messages.push({ role: 'user', content });
			} else if (msg.role === 'assistant') {
				if (msg.toolCalls?.length) {
					messages.push({
						role: 'assistant',
						content: msg.content || '',
						toolCalls: msg.toolCalls.map((tc) => ({
							type: 'tool-call' as const,
							toolCallId: tc.id,
							toolName: tc.name,
							args: tc.args,
						})),
					});
					messages.push({
						role: 'tool',
						content: msg.toolCalls.map((tc) => ({
							type: 'tool-result' as const,
							toolCallId: tc.id,
							toolName: tc.name,
							output: tc.result,
						})),
					});
				} else {
					messages.push({ role: 'assistant', content: msg.content });
				}
			}
		}

		return messages;
	}
}

/**
 * Create a chat service with the given configuration
 */
export function createChatService(config: ChatServiceConfig): ChatService {
	return new ChatService(config);
}
