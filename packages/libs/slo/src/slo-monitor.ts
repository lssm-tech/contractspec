import { BurnRateCalculator } from './burn-rate-calculator';
import { SLOTracker } from './slo-tracker';
import type {
  IncidentManager,
  IncidentPayload,
  SLODefinition,
  SLOWindowSample,
} from './types';

export interface SLOMonitorOptions {
  definition: SLODefinition;
  incidentManager: IncidentManager;
  tracker?: SLOTracker;
}

export class SLOMonitor {
  private readonly tracker: SLOTracker;
  private readonly burnRate: BurnRateCalculator;
  private lastIncidentAt?: Date;

  constructor(private readonly options: SLOMonitorOptions) {
    this.tracker =
      options.tracker ?? new SLOTracker({ definition: options.definition });
    this.burnRate = new BurnRateCalculator(options.definition);
  }

  recordWindow(sample: SLOWindowSample) {
    const snapshot = this.tracker.recordWindow(sample);
    const burn = this.burnRate.calculate(sample);
    const alerts = this.options.definition.alerts ?? {};

    const incidents: IncidentPayload[] = [];
    const now = new Date();

    if (
      typeof snapshot.definition.latencyP99TargetMs === 'number' &&
      typeof sample.latencyP99 === 'number' &&
      sample.latencyP99 > snapshot.definition.latencyP99TargetMs
    ) {
      incidents.push({
        definition: snapshot.definition,
        reason: `P99 latency ${sample.latencyP99}ms exceeds target ${snapshot.definition.latencyP99TargetMs}ms`,
        snapshot,
        severity: 'warning',
      });
    }

    if (
      typeof snapshot.definition.latencyP95TargetMs === 'number' &&
      typeof sample.latencyP95 === 'number' &&
      sample.latencyP95 > snapshot.definition.latencyP95TargetMs
    ) {
      incidents.push({
        definition: snapshot.definition,
        reason: `P95 latency ${sample.latencyP95}ms exceeds target ${snapshot.definition.latencyP95TargetMs}ms`,
        snapshot,
        severity: 'warning',
      });
    }

    const fastThreshold = alerts.fastBurnThreshold ?? 14;
    const slowThreshold = alerts.slowBurnThreshold ?? 6;

    if (burn.burnRate >= fastThreshold) {
      incidents.push({
        definition: snapshot.definition,
        reason: `Fast burn detected (rate=${burn.burnRate.toFixed(2)})`,
        snapshot,
        severity: 'critical',
      });
    } else if (burn.burnRate >= slowThreshold) {
      incidents.push({
        definition: snapshot.definition,
        reason: `Slow burn detected (rate=${burn.burnRate.toFixed(2)})`,
        snapshot,
        severity: 'warning',
      });
    }

    if (incidents.length > 0) {
      for (const incident of incidents) {
        void this.options.incidentManager.createIncident(incident);
      }
      this.lastIncidentAt = now;
    }

    return {
      snapshot,
      burnRate: burn.burnRate,
      incidents,
      lastIncidentAt: this.lastIncidentAt,
    };
  }

  getHistory() {
    return this.tracker.getHistory();
  }
}
