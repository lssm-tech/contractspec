import type { CapabilityRegistry } from '../capabilities';
import type { EventRegistry } from '../events';
import type { OperationSpecRegistry } from '../operations/registry';
import { PwaUpdateManagementCapability } from './capabilities';
import {
	PwaUpdateAppliedEvent,
	PwaUpdateDeferredEvent,
	PwaUpdatePromptedEvent,
} from './events';
import { PwaUpdateCheckQuery } from './queries';

export const pwaOperationContracts = {
	PwaUpdateCheckQuery,
};

export const pwaEventContracts = {
	PwaUpdatePromptedEvent,
	PwaUpdateAppliedEvent,
	PwaUpdateDeferredEvent,
};

export const pwaCapabilityContracts = {
	PwaUpdateManagementCapability,
};

export function registerPwaOperations(registry: OperationSpecRegistry) {
	return registry.register(PwaUpdateCheckQuery);
}

export function registerPwaEvents(registry: EventRegistry) {
	return registry
		.register(PwaUpdatePromptedEvent)
		.register(PwaUpdateAppliedEvent)
		.register(PwaUpdateDeferredEvent);
}

export function registerPwaCapabilities(registry: CapabilityRegistry) {
	return registry.register(PwaUpdateManagementCapability);
}
