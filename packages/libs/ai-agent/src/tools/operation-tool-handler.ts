/**
 * Operation-as-tool: creates a ToolHandler that executes a ContractSpec operation.
 *
 * One contract → REST, GraphQL, MCP, agent tool. When an agent tool has
 * operationRef, this module provides the handler that delegates to
 * OperationSpecRegistry.execute.
 */
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';
import type { OperationRef } from '@contractspec/lib.contracts-spec/agent';
import type { ToolExecutionContext, ToolHandler } from '../types';

/**
 * Maps ToolExecutionContext (agent runtime) to HandlerCtx (contracts-spec runtime).
 */
function toolCtxToHandlerCtx(ctx: ToolExecutionContext): HandlerCtx {
	return {
		traceId: ctx.metadata?.traceId,
		organizationId: ctx.tenantId ?? null,
		userId: ctx.actorId ?? null,
		actor: ctx.actorId ? 'user' : 'anonymous',
		channel: 'agent',
		roles: [],
	};
}

/**
 * Create a ToolHandler that executes a ContractSpec operation.
 *
 * @param registry - OperationSpecRegistry with the operation registered and handler bound
 * @param operationRef - Reference to the operation (key, optional version)
 * @returns ToolHandler that delegates to registry.execute
 *
 * @example
 * ```typescript
 * const handler = createOperationToolHandler(opsRegistry, { key: 'knowledge.search', version: '1.0.0' });
 * toolHandlers.set('search_knowledge', handler);
 * ```
 */
export function createOperationToolHandler(
	registry: OperationSpecRegistry,
	operationRef: OperationRef
): ToolHandler {
	return (async (
		input: unknown,
		context: ToolExecutionContext
	): Promise<unknown> => {
		const handlerCtx = toolCtxToHandlerCtx(context);
		const result = await registry.execute(
			operationRef.key,
			operationRef.version,
			input ?? {},
			handlerCtx
		);
		return result;
	}) as ToolHandler;
}
