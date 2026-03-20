/**
 * Contracts MCP server.
 *
 * Exposes contract management operations (list, get, create, update,
 * delete, validate, build) as MCP tools, resources, and prompts.
 *
 * Services are injected at creation time so this bundle stays
 * decoupled from bundle.workspace — the app layer provides real impls.
 */

import { appLogger } from '../../infrastructure/elysia/logger';
import { createMcpElysiaHandler } from './common';
import {
	buildContractsPrompts,
	buildContractsResources,
} from './contractsMcpResources';
import { buildContractsOps } from './contractsMcpTools';
import type { ContractsMcpServices } from './contractsMcpTypes';

export type { ContractInfo, ContractsMcpServices } from './contractsMcpTypes';

export function createContractsMcpHandler(
	path = '/api/mcp/contracts',
	services: ContractsMcpServices
) {
	return createMcpElysiaHandler({
		logger: appLogger,
		path,
		serverName: 'contractspec-contracts-mcp',
		ops: buildContractsOps(services),
		resources: buildContractsResources(services),
		prompts: buildContractsPrompts(),
	});
}
