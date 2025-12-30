/**
 * Regenerator service.
 *
 * Thin wrapper around `@contractspec/lib.contracts/regenerator` for reuse across CLI/VSCode/web.
 * This service does not perform module loading; callers provide resolved contexts/rules/sink.
 */

import { RegeneratorService } from '@contractspec/lib.contracts/regenerator';
import type {
  ProposalSink,
  RegenerationContext,
  RegenerationRule,
} from '@contractspec/lib.contracts/regenerator/types';
import type { SignalAdapters } from '@contractspec/lib.contracts/regenerator/adapters';

export interface CreateRegeneratorOptions {
  contexts: RegenerationContext[];
  rules: RegenerationRule[];
  sink: ProposalSink;
  adapters?: SignalAdapters;
  pollIntervalMs?: number;
  batchDurationMs?: number;
}

export function createRegeneratorService(
  options: CreateRegeneratorOptions
): RegeneratorService {
  return new RegeneratorService({
    contexts: options.contexts,
    adapters: options.adapters ?? {},
    rules: options.rules,
    sink: options.sink,
    pollIntervalMs: options.pollIntervalMs,
    batchDurationMs: options.batchDurationMs,
  });
}
