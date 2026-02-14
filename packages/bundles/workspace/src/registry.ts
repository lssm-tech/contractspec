import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations';
import { registerReportContracts } from '@contractspec/lib.contracts-spec/operations/report';

/**
 * Create workspace operation registry with all required specs and handlers bound.
 */
export function createWorkspaceRegistry(): OperationSpecRegistry {
  const registry = new OperationSpecRegistry();

  // Register report-related contracts
  registerReportContracts(registry);

  return registry;
}

/**
 * Export a ready-to-use registry for CLI compatibility.
 */
export const operationRegistry = createWorkspaceRegistry();
