import type { ProposalSink, RegenerationContext, SpecChangeProposal } from './types';
import { ProposalExecutor } from './executor';
import type { ProposalExecutionResult } from './executor';

export interface ExecutorResultPayload {
  context: RegenerationContext;
  proposal: SpecChangeProposal;
  result: ProposalExecutionResult;
}

export interface ExecutorSinkLogger {
  info?: (message: string, meta?: Record<string, unknown>) => void;
  error?: (message: string, error: Error, meta?: Record<string, unknown>) => void;
}

export interface ExecutorSinkOptions {
  dryRun?: boolean;
  onResult?: (payload: ExecutorResultPayload) => void | Promise<void>;
  logger?: ExecutorSinkLogger;
}

export class ExecutorProposalSink implements ProposalSink {
  constructor(
    private readonly executor: ProposalExecutor,
    private readonly options: ExecutorSinkOptions = {}
  ) {}

  async submit(
    context: RegenerationContext,
    proposal: SpecChangeProposal
  ): Promise<void> {
    const dryRun = this.options.dryRun ?? false;
    try {
      const result = await this.executor.execute(context, proposal, { dryRun });
      if (this.options.logger?.info) {
        this.options.logger.info('[regenerator] proposal executed', {
          proposalId: proposal.id,
          contextId: context.id,
          status: result.status,
        });
      }
      if (this.options.onResult) {
        await this.options.onResult({ context, proposal, result });
      }
    } catch (error) {
      if (this.options.logger?.error) {
        this.options.logger.error(
          '[regenerator] proposal execution failed',
          error instanceof Error ? error : new Error(String(error)),
          { proposalId: proposal.id, contextId: context.id }
        );
      }
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}







