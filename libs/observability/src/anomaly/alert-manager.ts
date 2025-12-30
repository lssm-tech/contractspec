import type { AnomalySignal } from './anomaly-detector';
import type { RootCauseAnalysis } from './root-cause-analyzer';

export interface AlertManagerOptions {
  cooldownMs?: number;
  transport: (payload: {
    signal: AnomalySignal;
    analysis: RootCauseAnalysis;
  }) => Promise<void> | void;
}

export class AlertManager {
  private readonly cooldownMs: number;
  private readonly lastAlert = new Map<string, number>();

  constructor(private readonly options: AlertManagerOptions) {
    this.cooldownMs = options.cooldownMs ?? 60_000;
  }

  async notify(signal: AnomalySignal, analysis: RootCauseAnalysis) {
    const key = `${signal.type}:${analysis.culprit?.id ?? 'none'}`;
    const now = Date.now();
    const last = this.lastAlert.get(key) ?? 0;
    if (now - last < this.cooldownMs) {
      return;
    }

    await this.options.transport({ signal, analysis });
    this.lastAlert.set(key, now);
  }
}
