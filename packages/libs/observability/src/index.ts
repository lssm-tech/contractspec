export { AlertManager } from './anomaly/alert-manager';
export {
	AnomalyDetector,
	type AnomalySignal,
	type AnomalyThresholds,
} from './anomaly/anomaly-detector';
export { BaselineCalculator } from './anomaly/baseline-calculator';
export {
	type RootCauseAnalysis,
	RootCauseAnalyzer,
} from './anomaly/root-cause-analyzer';
export {
	IntentAggregator,
	type IntentAggregatorSnapshot,
	type TelemetrySample,
} from './intent/aggregator';
export {
	IntentDetector,
	type IntentSignal,
	type IntentSignalType,
} from './intent/detector';
export type { LogEntry, LogLevel } from './logging';
export { Logger, logger } from './logging';
export {
	createCounter,
	createHistogram,
	createUpDownCounter,
	getMeter,
	standardMetrics,
} from './metrics';
export {
	EvolutionPipeline,
	type EvolutionPipelineEvent,
	type EvolutionPipelineOptions,
} from './pipeline/evolution-pipeline';
export {
	LifecycleKpiPipeline,
	type LifecycleKpiPipelineOptions,
	type LifecyclePipelineEvent,
} from './pipeline/lifecycle-pipeline';
export {
	type ModelSelectionEventProperties,
	ModelSelectionTelemetry,
} from './telemetry/model-selection-telemetry';
export { PosthogBaselineReader } from './telemetry/posthog-baseline-reader';
export {
	PosthogTelemetryProvider,
	type PosthogTelemetryProviderOptions,
} from './telemetry/posthog-telemetry';
export { getTracer, traceAsync, traceSync } from './tracing';
export {
	createTracingMiddleware,
	type TracingMiddlewareOptions,
} from './tracing/middleware';
export {
	type ModelSelectionSpanAttributes,
	type ModelSelectionSpanInput,
	traceModelSelection,
} from './tracing/model-selection.span';
