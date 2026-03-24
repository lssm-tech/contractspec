import type { ChannelRuntimeStore } from './store';
import type {
	ChannelTelemetryEmitter,
	ChannelTelemetryEvent,
} from './telemetry';

export async function recordChannelTelemetry(
	store: ChannelRuntimeStore,
	telemetry: ChannelTelemetryEmitter | undefined,
	event: ChannelTelemetryEvent,
	decisionId?: string
): Promise<void> {
	await store.appendTraceEvent({
		...event,
		decisionId,
	});
	try {
		await telemetry?.record(event);
	} catch {
		// External telemetry sinks must not fail runtime state transitions.
	}
}
