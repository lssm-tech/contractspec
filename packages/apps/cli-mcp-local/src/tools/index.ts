/**
 * MCP tools for ContractSpec local server.
 *
 * Tools are registered as ContractSpec commands in a `SpecRegistry` and exposed
 * to MCP via `createMcpServer` from `@lssm/lib.contracts`.
 */

import type { SpecRegistry } from '@lssm/lib.contracts';
import type { WorkspaceAdapters } from '../server';
import { registerIntegrityTools } from './integrity';
import { registerSpecsTools } from './specs';
import { registerSpecsCreateTool } from './specs-create';
import { registerSpecsBuildTool } from './specs-build';
import { registerDepsTools } from './deps';
import { registerLLMTools } from './llm';

export function registerMcpLocalTools(
  reg: SpecRegistry,
  adapters: WorkspaceAdapters
): void {
  registerIntegrityTools(reg, adapters);
  registerSpecsTools(reg, adapters);
  registerSpecsCreateTool(reg, adapters);
  registerSpecsBuildTool(reg, adapters);
  registerDepsTools(reg, adapters);
  registerLLMTools(reg, adapters);
}
