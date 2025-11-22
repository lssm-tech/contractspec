import type { TelemetryDispatch } from './tracker';
import type { TelemetryAnomalyDetectionConfig } from './spec';

export interface TelemetryAnomalyEvent {
  dispatch: TelemetryDispatch;
  threshold: TelemetryAnomalyDetectionConfig;
  metric: string;
  value: number | undefined;
  type: 'min' | 'max';
}

export interface TelemetryAnomalyMonitorOptions {
  onAnomaly?: (event: TelemetryAnomalyEvent) => void;
  now?: () => Date;
}

export class TelemetryAnomalyMonitor {
  private readonly onAnomaly?: (event: TelemetryAnomalyEvent) => void;
  private readonly now: () => Date;
  private readonly samples = new Map<string, number>();

  constructor(options: TelemetryAnomalyMonitorOptions = {}) {
    this.onAnomaly = options.onAnomaly;
    this.now = options.now ?? (() => new Date());
  }

  observe(dispatch: TelemetryDispatch) {
    const anomalyConfig = dispatch.definition.anomalyDetection;
    if (!anomalyConfig?.enabled) return;
    if (!anomalyConfig.thresholds?.length) return;

    const eventKey = `${dispatch.name}.v${dispatch.version}`;
    const count = this.samples.get(eventKey) ?? 0;
    const newCount = count + 1;
    this.samples.set(eventKey, newCount);

    if (
      typeof anomalyConfig.minimumSample === 'number' &&
      newCount < anomalyConfig.minimumSample
    ) {
      return;
    }

    for (const threshold of anomalyConfig.thresholds) {
      const value = this.extractMetric(dispatch, threshold.metric);
      if (typeof value !== 'number') continue;
      if (typeof threshold.min === 'number' && value < threshold.min) {
        this.emit(dispatch, anomalyConfig, threshold.metric, value, 'min');
      }
      if (typeof threshold.max === 'number' && value > threshold.max) {
        this.emit(dispatch, anomalyConfig, threshold.metric, value, 'max');
      }
    }
  }

  private extractMetric(dispatch: TelemetryDispatch, metric: string) {
    const value = dispatch.properties[metric];
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && value !== null && 'value' in value) {
      const maybeNumber = (value as Record<string, unknown>).value;
      return typeof maybeNumber === 'number' ? maybeNumber : undefined;
    }
    return undefined;
  }

  private emit(
    dispatch: TelemetryDispatch,
    threshold: TelemetryAnomalyDetectionConfig,
    metric: string,
    value: number,
    type: 'min' | 'max'
  ) {
    this.onAnomaly?.({
      dispatch,
      threshold,
      metric,
      value,
      type,
    });
  }

  reset() {
    this.samples.clear();
  }
}
