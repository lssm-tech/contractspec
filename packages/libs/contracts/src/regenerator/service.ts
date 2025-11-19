import { setTimeout as delay } from 'node:timers/promises';
import type {
  ProposalSink,
  RegeneratorSignal,
  RegenerationRule,
  RegenerationContext,
  SpecChangeProposal,
} from './types';
import type { SignalAdapters } from './adapters';
import { telemetryToEnvelope, errorToEnvelope, behaviorToEnvelope } from './utils';

export interface RegeneratorOptions {
  contexts: RegenerationContext[];
  adapters: SignalAdapters;
  rules: RegenerationRule[];
  sink: ProposalSink;
  pollIntervalMs?: number;
  batchDurationMs?: number;
  clock?: () => Date;
}

const DEFAULT_POLL_INTERVAL = 60_000;
const DEFAULT_BATCH_DURATION = 5 * 60_000;

export class RegeneratorService {
  private readonly contexts: Map<string, RegenerationContext>;
  private readonly lastPoll = new Map<string, Date>();
  private timer?: NodeJS.Timeout;
  private running = false;
  private readonly pollInterval: number;
  private readonly batchDuration: number;
  private readonly clock: () => Date;

  constructor(private readonly options: RegeneratorOptions) {
    this.contexts = new Map(
      options.contexts.map((ctx) => [ctx.id, ctx])
    );
    this.pollInterval = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL;
    this.batchDuration = options.batchDurationMs ?? DEFAULT_BATCH_DURATION;
    this.clock = options.clock ?? (() => new Date());
    if (this.options.rules.length === 0) {
      throw new Error('RegeneratorService requires at least one rule');
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    void this.tick();
    this.timer = setInterval(() => {
      void this.tick();
    }, this.pollInterval);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  async runOnce(): Promise<void> {
    await this.tick();
  }

  private async tick(): Promise<void> {
    const now = this.clock();
    const sinceDefault = new Date(now.getTime() - this.batchDuration);
    for (const context of this.contexts.values()) {
      const last = this.lastPoll.get(context.id) ?? sinceDefault;
      await this.evaluateContext(context, last, now);
      this.lastPoll.set(context.id, now);
    }
  }

  private async evaluateContext(
    context: RegenerationContext,
    since: Date,
    until: Date
  ): Promise<void> {
    const signals = await this.collectSignals(context, since, until);
    if (signals.length === 0) return;

    for (const rule of this.options.rules) {
      let proposals: SpecChangeProposal[] = [];
      try {
        proposals = await rule.evaluate(context, signals);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `[regenerator] rule ${rule.id} failed`,
          error instanceof Error ? error : new Error(String(error))
        );
        continue;
      }
      await this.flushProposals(context, proposals);
    }
  }

  private async collectSignals(
    context: RegenerationContext,
    since: Date,
    until: Date
  ): Promise<RegeneratorSignal[]> {
    const envelopes: RegeneratorSignal[] = [];
    const { adapters } = this.options;
    if (adapters.telemetry) {
      const telemetrySignals = await adapters.telemetry.pollTelemetry(
        context,
        since,
        until
      );
      envelopes.push(
        ...telemetrySignals.map((signal) =>
          telemetryToEnvelope(context.id, signal, this.clock)
        )
      );
    }
    if (adapters.errors) {
      const errorSignals = await adapters.errors.pollErrors(
        context,
        since,
        until
      );
      envelopes.push(
        ...errorSignals.map((signal) =>
          errorToEnvelope(context.id, signal, this.clock)
        )
      );
    }
    if (adapters.behavior) {
      const behaviorSignals = await adapters.behavior.pollBehavior(
        context,
        since,
        until
      );
      envelopes.push(
        ...behaviorSignals.map((signal) =>
          behaviorToEnvelope(context.id, signal, this.clock)
        )
      );
    }
    return envelopes;
  }

  private async flushProposals(
    context: RegenerationContext,
    proposals: SpecChangeProposal[]
  ): Promise<void> {
    for (const proposal of proposals) {
      if (proposal.signalIds.length === 0) continue;
      await this.options.sink.submit(context, proposal);
      // allow event loop to breathe when large volumes
      if (proposals.length > 10) {
        await delay(0);
      }
    }
  }
}






