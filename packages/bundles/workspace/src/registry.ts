import { OperationSpecRegistry, installOp } from '@contractspec/lib.contracts';
import { registerReportContracts } from '@contractspec/lib.contracts';
import { GetContractVerificationStatusQuery } from '@contractspec/lib.contracts';
import { getContractVerificationStatusHandler } from './handlers/report/getContractVerificationStatus';

/**
 * Create workspace operation registry with all required specs and handlers bound.
 */
export function createWorkspaceRegistry(): OperationSpecRegistry {
  const registry = new OperationSpecRegistry();

  // Register report-related contracts
  registerReportContracts(registry);

  // Bind workspace-specific handlers
  installOp(
    registry,
    GetContractVerificationStatusQuery,
    getContractVerificationStatusHandler
  );

  return registry;
}

/**
 * Export a ready-to-use registry for CLI compatibility.
 */
export const operationRegistry = createWorkspaceRegistry();
