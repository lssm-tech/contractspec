import type {
  BehaviorSignal,
  BehaviorSignalEnvelope,
  ErrorSignal,
  ErrorSignalEnvelope,
  TelemetrySignal,
  TelemetrySignalEnvelope,
} from './types';

type Clock = () => Date;

export function telemetryToEnvelope(
  contextId: string,
  signal: TelemetrySignal,
  clock: Clock
): TelemetrySignalEnvelope {
  return {
    type: 'telemetry',
    contextId,
    signal: normalizeTelemetryDates(signal, clock),
  };
}

export function errorToEnvelope(
  contextId: string,
  signal: ErrorSignal,
  clock: Clock
): ErrorSignalEnvelope {
  return {
    type: 'error',
    contextId,
    signal: normalizeErrorDates(signal, clock),
  };
}

export function behaviorToEnvelope(
  contextId: string,
  signal: BehaviorSignal,
  clock: Clock
): BehaviorSignalEnvelope {
  return {
    type: 'behavior',
    contextId,
    signal: normalizeBehaviorDates(signal, clock),
  };
}

function normalizeTelemetryDates(
  signal: TelemetrySignal,
  clock: Clock
): TelemetrySignal {
  return {
    ...signal,
    windowStart: toDate(signal.windowStart, clock),
    windowEnd: toDate(signal.windowEnd, clock),
  };
}

function normalizeErrorDates(
  signal: ErrorSignal,
  clock: Clock
): ErrorSignal {
  return {
    ...signal,
    occurredAt: toDate(signal.occurredAt, clock),
  };
}

function normalizeBehaviorDates(
  signal: BehaviorSignal,
  clock: Clock
): BehaviorSignal {
  return {
    ...signal,
    windowStart: toDate(signal.windowStart, clock),
    windowEnd: toDate(signal.windowEnd, clock),
  };
}

function toDate(value: Date | string, clock: Clock): Date {
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return clock();
  }
  return parsed;
}

