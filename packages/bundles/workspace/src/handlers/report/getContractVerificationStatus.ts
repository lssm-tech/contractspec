import { spawn } from 'child_process';
import { promisify } from 'util';
import type { HandlerCtx } from '@contractspec/lib.contracts';
import { GetContractVerificationStatusQuery } from '@contractspec/lib.contracts';

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
  results: Array<{
    specKey: string;
    specHash?: string;
    implementations: Array<{
      type: string;
      exists: boolean;
    }>;
  }>;
}

export async function getContractVerificationStatusHandler(
  input: { projectPath: string; baseline?: string },
  ctx: HandlerCtx,
): Promise<{ contracts: Array<ReturnType<typeof ContractVerificationStatusModel.getZod>['_type']>> }> {
  try {
    // Call CLI command to get implementation status
    const result = await execAsync(
      'bun',
      ['contractspec', 'impl', 'status', '--format', 'json', '--all'],
      {
        cwd: input.projectPath,
        stdio: 'pipe',
      }
    );

    if (!result.stdout) {
      return { contracts: [] };
    }

    const cliOutput = JSON.parse(result.stdout.toString()) as CLIResult;
    const contracts: ContractVerificationStatus[] = [];

    for (const spec of cliOutput.results || []) {
      const contract: ContractVerificationStatus = {
        name: spec.specKey,
        lastVerifiedSha: spec.specHash,
        lastVerifiedDate: spec.specHash ? new Date().toISOString() : undefined, // Could be enhanced with git history later
        surfaces: spec.implementations
          .filter((impl: any) => impl.exists)
          .map((impl: any) => impl.type),
        driftMismatches: spec.implementations.filter(
          (impl: any) => !impl.exists
        ).length,
      };
      contracts.push(contract);
    }

    return { contracts };
  } catch (error) {
    // Log error but return empty array to avoid breaking reports
    console.error('Failed to get contract verification status:', error);
    return { contracts: [] };
  }
}
