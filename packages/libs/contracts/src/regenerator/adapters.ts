import type {
  BehaviorSignal,
  ErrorSignal,
  RegenerationContext,
  TelemetrySignal,
} from './types';

export interface TelemetrySignalProvider {
  pollTelemetry(
    context: RegenerationContext,
    since: Date,
    until: Date
  ): Promise<TelemetrySignal[]>;
}

export interface ErrorSignalProvider {
  pollErrors(
    context: RegenerationContext,
    since: Date,
    until: Date
  ): Promise<ErrorSignal[]>;
}

export interface BehaviorSignalProvider {
  pollBehavior(
    context: RegenerationContext,
    since: Date,
    until: Date
  ): Promise<BehaviorSignal[]>;
}

export interface SignalAdapters {
  telemetry?: TelemetrySignalProvider;
  errors?: ErrorSignalProvider;
  behavior?: BehaviorSignalProvider;
}





