import { buildRepairPromptWithOutput } from './validators';

export interface TicketPipelineModelRunner {
  generateJson: (prompt: string) => Promise<string>;
}

export type TicketPipelineStage =
  | 'extractEvidence'
  | 'groupProblems'
  | 'generateTickets'
  | 'suggestPatch';

export interface TicketPipelineLogEntry {
  stage: TicketPipelineStage;
  phase: 'request' | 'response' | 'validation_error' | 'model_error' | 'repair';
  attempt: number;
  prompt: string;
  response?: string;
  error?: string;
  timestamp: string;
}

export interface TicketPipelineLogger {
  log: (entry: TicketPipelineLogEntry) => void | Promise<void>;
}

export interface TicketPipelineRunOptions<T> {
  stage: TicketPipelineStage;
  prompt: string;
  modelRunner: TicketPipelineModelRunner;
  validate: (raw: string) => T;
  logger?: TicketPipelineLogger;
  maxAttempts?: number;
  repair?: (raw: string, error: string) => string | null;
}

const DEFAULT_MAX_ATTEMPTS = 2;

function timestamp(): string {
  return new Date().toISOString();
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function safeLog(
  logger: TicketPipelineLogger | undefined,
  entry: TicketPipelineLogEntry
): Promise<void> {
  if (!logger) return;
  try {
    await logger.log(entry);
  } catch {
    // Ignore logging failures.
  }
}

export async function runWithValidation<T>(
  options: TicketPipelineRunOptions<T>
): Promise<T> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  let attempt = 0;
  let lastError: string | undefined;
  let lastRaw = '';
  let currentPrompt = options.prompt;

  while (attempt < maxAttempts) {
    attempt += 1;
    await safeLog(options.logger, {
      stage: options.stage,
      phase: 'request',
      attempt,
      prompt: currentPrompt,
      timestamp: timestamp(),
    });

    let raw: string;
    try {
      raw = await options.modelRunner.generateJson(currentPrompt);
    } catch (error) {
      lastError = toErrorMessage(error);
      await safeLog(options.logger, {
        stage: options.stage,
        phase: 'model_error',
        attempt,
        prompt: currentPrompt,
        error: lastError,
        timestamp: timestamp(),
      });
      throw new Error(`[${options.stage}] Model error: ${lastError}`);
    }

    await safeLog(options.logger, {
      stage: options.stage,
      phase: 'response',
      attempt,
      prompt: currentPrompt,
      response: raw,
      timestamp: timestamp(),
    });

    try {
      return options.validate(raw);
    } catch (error) {
      lastError = toErrorMessage(error);
      lastRaw = raw;

      if (options.repair) {
        const repaired = options.repair(raw, lastError);
        if (repaired && repaired !== raw) {
          await safeLog(options.logger, {
            stage: options.stage,
            phase: 'repair',
            attempt,
            prompt: currentPrompt,
            response: repaired,
            error: lastError,
            timestamp: timestamp(),
          });
          try {
            return options.validate(repaired);
          } catch (repairError) {
            lastError = toErrorMessage(repairError);
            lastRaw = repaired;
          }
        }
      }

      await safeLog(options.logger, {
        stage: options.stage,
        phase: 'validation_error',
        attempt,
        prompt: currentPrompt,
        response: lastRaw,
        error: lastError,
        timestamp: timestamp(),
      });

      currentPrompt = [
        options.prompt,
        buildRepairPromptWithOutput(lastError, lastRaw),
      ].join('\n\n');
    }
  }

  throw new Error(
    `[${options.stage}] Validation failed after ${maxAttempts} attempt(s): ${
      lastError ?? 'unknown error'
    }`
  );
}
