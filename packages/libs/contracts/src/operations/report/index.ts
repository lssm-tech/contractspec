import type { OperationSpecRegistry } from '../registry';
import { GetContractVerificationStatusQuery } from './getContractVerificationStatus';
import { type HandlerForOperationSpec, installOp } from '../../install';
import type { HandlerCtx } from '../../types';

export {
  GetContractVerificationStatusQuery,
  ContractVerificationStatusModel,
  GetContractVerificationStatusInput,
  GetContractVerificationStatusOutput,
} from './getContractVerificationStatus';
export { ContractVerificationTableDataView } from '../../data-views/report/contractVerificationTable';

// Define the expected output interface
interface ContractVerificationStatus {
  name: string;
  lastVerifiedSha?: string;
  lastVerifiedDate?: string;
  surfaces: string[];
  driftMismatches: number;
}

// CLI output structure
interface CLIResult {
  results: {
    specKey: string;
    specHash?: string;
    implementations: {
      type: string;
      exists: boolean;
    }[];
  }[];
}

export const getContractVerificationStatusHandler: HandlerForOperationSpec<
  typeof GetContractVerificationStatusQuery
> = async (
  input: { projectPath: string; baseline?: string },
  _ctx: HandlerCtx
) => {
  try {
    // Call CLI command to get implementation status
    // contractspec impl status --format json --all
    const cmdProcess = Bun.spawn(
      ['contractspec', 'impl', 'status', '--format', 'json', '--all'],
      {
        cwd: input.projectPath,
      }
    );

    const cmdStdout = await cmdProcess.stdout;
    const output = await Bun.readableStreamToText(cmdStdout);

    if (!output) {
      return { contracts: [] };
    }

    const cliOutput = JSON.parse(output) as CLIResult;
    const contracts: ContractVerificationStatus[] = [];

    for (const spec of cliOutput.results || []) {
      const contract: ContractVerificationStatus = {
        name: spec.specKey,
        lastVerifiedSha: spec.specHash,
        lastVerifiedDate: spec.specHash ? new Date().toISOString() : undefined, // Could be enhanced with git history later
        surfaces: spec.implementations
          .filter((impl) => impl.exists)
          .map((impl) => impl.type),
        driftMismatches: spec.implementations.filter((impl) => !impl.exists)
          .length,
      };
      contracts.push(contract);
    }

    return { contracts: contracts };
  } catch (error) {
    // Log error but return empty array to avoid breaking reports
    console.error('Failed to get contract verification status:', error);
    return { contracts: [] };
  }
};

/**
 * Register report-related operation contracts in the given registry.
 */
export function registerReportContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  installOp(
    registry,
    GetContractVerificationStatusQuery,
    getContractVerificationStatusHandler
  );
  return registry;
}
