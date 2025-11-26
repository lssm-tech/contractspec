import { EventEmitter } from 'node:events';
import {
  IntentAggregator,
  type IntentAggregatorSnapshot,
  type TelemetrySample,
} from '../intent/aggregator';
import { IntentDetector, type IntentSignal } from '../intent/detector';

export type EvolutionPipelineEvent =
  | { type: 'intent.detected'; payload: IntentSignal }
  | { type: 'telemetry.window'; payload: { sampleCount: number } };

export interface EvolutionPipelineOptions {
  detector?: IntentDetector;
  aggregator?: IntentAggregator;
  emitter?: EventEmitter;
  onIntent?: (intent: IntentSignal) => Promise<void> | void;
  onSnapshot?: (snapshot: IntentAggregatorSnapshot) => Promise<void> | void;
}

export class EvolutionPipeline {
  private readonly detector: IntentDetector;
  private readonly aggregator: IntentAggregator;
  private readonly emitter: EventEmitter;
  private readonly onIntent?: (intent: IntentSignal) => Promise<void> | void;
  private readonly onSnapshot?: (
    snapshot: IntentAggregatorSnapshot
  ) => Promise<void> | void;
  private timer?: NodeJS.Timeout;
  private previousMetrics?: ReturnType<IntentAggregator['flush']>['metrics'];

  constructor(options: EvolutionPipelineOptions = {}) {
    this.detector = options.detector ?? new IntentDetector();
    this.aggregator = options.aggregator ?? new IntentAggregator();
    this.emitter = options.emitter ?? new EventEmitter();
    this.onIntent = options.onIntent;
    this.onSnapshot = options.onSnapshot;
  }

  ingest(sample: TelemetrySample) {
    this.aggregator.add(sample);
  }

  on(listener: (event: EvolutionPipelineEvent) => void) {
    this.emitter.on('event', listener);
  }

  start(intervalMs = 5 * 60 * 1000) {
    this.stop();
    this.timer = setInterval(() => {
      void this.run();
    }, intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  async run() {
    const snapshot = this.aggregator.flush();
    this.emit({
      type: 'telemetry.window',
      payload: { sampleCount: snapshot.sampleCount },
    });
    if (this.onSnapshot) await this.onSnapshot(snapshot);
    if (!snapshot.sampleCount) return;

    const metricSignals = this.detector.detectFromMetrics(
      snapshot.metrics,
      this.previousMetrics
    );
    const sequenceSignals = this.detector.detectSequentialIntents(
      snapshot.sequences
    );
    this.previousMetrics = snapshot.metrics;

    const signals = [...metricSignals, ...sequenceSignals];
    for (const signal of signals) {
      if (this.onIntent) await this.onIntent(signal);
      this.emit({ type: 'intent.detected', payload: signal });
    }
  }

  private emit(event: EvolutionPipelineEvent) {
    this.emitter.emit('event', event);
  }
}










