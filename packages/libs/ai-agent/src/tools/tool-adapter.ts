/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AnyOperationSpec } from '@contractspec/lib.contracts-spec/operations/operation';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { type Tool, tool } from 'ai';
import * as z from 'zod';
import { createAgentI18n } from '../i18n';
import { jsonSchemaToZodSafe } from '../schema/json-schema-to-zod';
import type { AgentToolConfig } from '../spec/spec';
import type { ToolExecutionContext, ToolHandler } from '../types';
import { createOperationToolHandler } from './operation-tool-handler';
import { createSubagentTool, type SubagentLike } from './subagent-tool';

/**
 * Convert ContractSpec AgentToolConfig to AI SDK CoreTool.
 *
 * @param specTool - The tool configuration from AgentSpec
 * @param handler - The handler function for the tool
 * @param context - Partial context to inject into handler calls
 * @param effectiveInputSchema - Optional Zod schema override (e.g., from operation io.input)
 * @returns AI SDK CoreTool
 */
/** Check if value is an AsyncGenerator (for streaming preliminary results). */
function isAsyncGenerator<T>(
	value: unknown
): value is AsyncGenerator<T, void, unknown> {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as AsyncGenerator<T>).next === 'function' &&
		typeof (value as AsyncGenerator<T>)[Symbol.asyncIterator] === 'function'
	);
}

export function specToolToAISDKTool(
	specTool: AgentToolConfig,
	handler: ToolHandler,
	context: Partial<ToolExecutionContext> = {},
	effectiveInputSchema?: z.ZodType,
	/** Optional operation spec for output ref fallback when specTool has no output refs */
	operationSpec?: AnyOperationSpec
): Tool<any, any> {
	let lastInvocationAt: number | undefined;

	const inputSchema =
		effectiveInputSchema ?? jsonSchemaToZodSafe(specTool.schema);

	const buildContext = (signal?: AbortSignal) => ({
		agentId: context.agentId ?? 'unknown',
		sessionId: context.sessionId ?? 'unknown',
		tenantId: context.tenantId,
		actorId: context.actorId,
		locale: context.locale,
		metadata: context.metadata,
		signal,
	});

	return tool({
		description: specTool.description ?? specTool.name,
		// AI SDK v6 uses inputSchema instead of parameters
		inputSchema,
		// AI SDK v6 native approval support
		needsApproval: specTool.requiresApproval ?? !specTool.automationSafe,
		execute: async function* (
			input,
			options?: { abortSignal?: AbortSignal }
		): AsyncGenerator<unknown> {
			const now = Date.now();
			const cooldownMs = normalizeDuration(specTool.cooldownMs);
			if (cooldownMs && lastInvocationAt !== undefined) {
				const elapsed = now - lastInvocationAt;
				if (elapsed < cooldownMs) {
					const retryAfterMs = cooldownMs - elapsed;
					throw createToolExecutionError(
						`Tool "${specTool.name}" is cooling down. Retry in ${retryAfterMs}ms.`,
						'TOOL_COOLDOWN_ACTIVE',
						retryAfterMs
					);
				}
			}

			const timeoutMs = normalizeDuration(specTool.timeoutMs);
			const signal = options?.abortSignal ?? context.signal;
			const { signal: timeoutSignal, dispose } = createTimeoutSignal(
				signal,
				timeoutMs
			);

			try {
				const execution = handler(input, buildContext(timeoutSignal));

				if (isAsyncGenerator(execution)) {
					for await (const raw of execution) {
						const wrapped = wrapToolOutputForRendering(
							specTool,
							raw,
							operationSpec
						);
						yield typeof wrapped === 'string' ? wrapped : wrapped;
					}
				} else {
					const raw = timeoutMs
						? await withTimeout(
								Promise.resolve(execution) as Promise<unknown>,
								timeoutMs,
								specTool.name
							)
						: await Promise.resolve(execution);
					const wrapped = wrapToolOutputForRendering(
						specTool,
						raw,
						operationSpec
					);
					yield typeof wrapped === 'string' ? wrapped : wrapped;
				}
			} finally {
				dispose();
				lastInvocationAt = Date.now();
			}
		},
	});
}

/**
 * Registry for resolving subagents by agentId.
 */
export type SubagentRegistry = Map<string, SubagentLike>;

/**
 * Options for specToolsToAISDKTools.
 */
export interface SpecToolsToAISDKToolsOptions {
	/** Optional OperationSpecRegistry for operation-backed tools (operationRef) */
	operationRegistry?: OperationSpecRegistry;
	/** Optional registry for subagent-backed tools (subagentRef) */
	subagentRegistry?: SubagentRegistry;
}

/**
 * Convert multiple ContractSpec tool configs to AI SDK tools.
 *
 * When a tool has operationRef and operationRegistry is provided, the handler
 * and input schema are derived from the operation. Otherwise, handlers must
 * be supplied for each tool.
 *
 * @param specTools - Array of tool configurations
 * @param handlers - Map of tool name to handler function (for inline tools)
 * @param context - Partial context to inject into handler calls
 * @param options - Optional operationRegistry for operation-backed tools
 * @returns Record of AI SDK tools keyed by name
 */
export function specToolsToAISDKTools(
	specTools: AgentToolConfig[],
	handlers: Map<string, ToolHandler>,
	context: Partial<ToolExecutionContext> = {},
	options?: SpecToolsToAISDKToolsOptions
): Record<string, Tool<any, any>> {
	const tools: Record<string, Tool<any, any>> = {};

	for (const specTool of specTools) {
		if (specTool.subagentRef && options?.subagentRegistry) {
			const subagent = options.subagentRegistry.get(
				specTool.subagentRef.agentId
			);
			if (!subagent) {
				throw new Error(
					`Subagent not found: ${specTool.subagentRef.agentId}. Register it in subagentRegistry.`
				);
			}
			if (
				specTool.requiresApproval === true ||
				specTool.automationSafe === false
			) {
				console.warn(
					`[ContractSpec] Subagent tool "${specTool.name}" cannot use needsApproval. ` +
						`requiresApproval and automationSafe are ignored for subagent tools (AI SDK limitation). ` +
						`See https://ai-sdk.dev/docs/agents/subagents#no-tool-approvals-in-subagents`
				);
			}
			tools[specTool.name] = createSubagentTool({
				subagent,
				description: specTool.description ?? specTool.name,
				toModelSummary: specTool.subagentRef.toModelSummary ?? true,
				passConversationHistory: specTool.subagentRef.passConversationHistory,
			});
			continue;
		}

		let handler: ToolHandler;
		let effectiveInputSchema: z.ZodType | undefined;
		let op: AnyOperationSpec | undefined;

		if (specTool.operationRef && options?.operationRegistry) {
			op = options.operationRegistry.get(
				specTool.operationRef.key,
				specTool.operationRef.version
			);
			if (!op) {
				throw new Error(
					`Operation not found: ${specTool.operationRef.key}${specTool.operationRef.version ? `.v${specTool.operationRef.version}` : ''}`
				);
			}
			handler = createOperationToolHandler(
				options.operationRegistry,
				specTool.operationRef
			);
			effectiveInputSchema = op.io.input?.getZod?.() as z.ZodType | undefined;
		} else {
			const manualHandler = handlers.get(specTool.name);
			if (!manualHandler) {
				if (specTool.subagentRef) {
					throw new Error(
						`Subagent tool "${specTool.name}" requires subagentRegistry. Pass subagentRegistry in ContractSpecAgentConfig.`
					);
				}
				throw new Error(
					createAgentI18n(context.locale).t('error.missingToolHandler', {
						name: specTool.name,
					})
				);
			}
			handler = manualHandler;
		}

		tools[specTool.name] = specToolToAISDKTool(
			specTool,
			handler,
			context,
			effectiveInputSchema,
			op
		);
	}

	return tools;
}

/**
 * Type-safe tool handler builder.
 *
 * @example
 * ```typescript
 * const handler = createToolHandler<{ query: string }>((input, ctx) => {
 *   return `Searched for: ${input.query}`;
 * });
 * ```
 */
export function createToolHandler<TInput = unknown, TOutput = string>(
	handler: (
		input: TInput,
		context: ToolExecutionContext
	) => Promise<TOutput> | TOutput | AsyncGenerator<TOutput>
): ToolHandler<TInput, TOutput> {
	return (input, context) => {
		return handler(input as TInput, context) as
			| Promise<TOutput>
			| TOutput
			| AsyncGenerator<TOutput>;
	};
}

/**
 * Build a tool handlers map from an object.
 *
 * @example
 * ```typescript
 * const handlers = buildToolHandlers({
 *   search: async (input: { query: string }) => `Found: ${input.query}`,
 *   calculate: async (input: { a: number, b: number }) => `${input.a + input.b}`,
 * });
 * ```
 */
export function buildToolHandlers(
	handlersObj: Record<string, ToolHandler>
): Map<string, ToolHandler> {
	return new Map(Object.entries(handlersObj));
}

/**
 * Wrap raw tool output for ToolResultRenderer when output refs are set.
 * Falls back to operation spec output refs when AgentToolConfig has none.
 */
function wrapToolOutputForRendering(
	specTool: AgentToolConfig,
	result: unknown,
	operationSpec?: AnyOperationSpec
): unknown {
	const presentation =
		specTool.outputPresentation ?? operationSpec?.outputPresentation;
	const form = specTool.outputForm ?? operationSpec?.outputForm;
	const dataView = specTool.outputDataView ?? operationSpec?.outputDataView;

	if (presentation) {
		return {
			presentationKey: presentation.key,
			data: result,
		};
	}
	if (form) {
		return {
			formKey: form.key,
			defaultValues:
				typeof result === 'object' && result !== null
					? (result as Record<string, unknown>)
					: {},
		};
	}
	if (dataView) {
		return {
			dataViewKey: dataView.key,
			items: Array.isArray(result) ? result : result != null ? [result] : [],
		};
	}
	return result;
}

function normalizeDuration(value: number | undefined): number | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (!Number.isFinite(value)) {
		return undefined;
	}

	if (value <= 0) {
		return undefined;
	}

	return Math.round(value);
}

function withTimeout<T>(
	execution: Promise<T>,
	timeoutMs: number,
	toolName: string
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timeoutHandle = setTimeout(() => {
			reject(
				createToolExecutionError(
					`Tool "${toolName}" timed out after ${timeoutMs}ms.`,
					'TOOL_EXECUTION_TIMEOUT'
				)
			);
		}, timeoutMs);

		execution
			.then((result) => {
				clearTimeout(timeoutHandle);
				resolve(result);
			})
			.catch((error) => {
				clearTimeout(timeoutHandle);
				reject(error);
			});
	});
}

function createTimeoutSignal(
	signal: AbortSignal | undefined,
	timeoutMs?: number
) {
	const controller = new AbortController();
	const abortFromSource = () => controller.abort();

	if (signal) {
		if (signal.aborted) {
			controller.abort();
		} else {
			signal.addEventListener('abort', abortFromSource);
		}
	}

	const timeoutHandle =
		timeoutMs !== undefined
			? setTimeout(() => {
					controller.abort();
				}, timeoutMs)
			: undefined;

	return {
		signal: controller.signal,
		dispose: () => {
			if (timeoutHandle !== undefined) {
				clearTimeout(timeoutHandle);
			}
			if (signal) {
				signal.removeEventListener('abort', abortFromSource);
			}
		},
	};
}

function createToolExecutionError(
	message: string,
	code: string,
	retryAfterMs?: number
) {
	return Object.assign(new Error(message), {
		code,
		kind: 'retryable',
		retryAfterMs,
	});
}
