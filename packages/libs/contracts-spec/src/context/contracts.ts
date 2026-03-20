import type { CapabilityRegistry } from '../capabilities';
import type { DataViewRegistry } from '../data-views';
import type { EventRegistry } from '../events';
import type { FormRegistry } from '../forms';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import { ContextSystemCapability } from './capabilities';
import { ContextPackSnapshotCommand } from './commands';
import { ContextSnapshotCreatedEvent } from './events';
import { ContextPackSearchForm } from './forms';
import { ContextSnapshotSummaryPresentation } from './presentations';
import { ContextPackDescribeQuery, ContextPackSearchQuery } from './queries';
import { ContextSnapshotsDataView } from './views';

export const contextOperationContracts = {
	ContextPackDescribeQuery,
	ContextPackSearchQuery,
	ContextPackSnapshotCommand,
};

export const contextEventContracts = {
	ContextSnapshotCreatedEvent,
};

export const contextCapabilityContracts = {
	ContextSystemCapability,
};

export const contextDataViewContracts = {
	ContextSnapshotsDataView,
};

export const contextFormContracts = {
	ContextPackSearchForm,
};

export const contextPresentationContracts = {
	ContextSnapshotSummaryPresentation,
};

export function registerContextOperations(registry: OperationSpecRegistry) {
	return registry
		.register(ContextPackDescribeQuery)
		.register(ContextPackSearchQuery)
		.register(ContextPackSnapshotCommand);
}

export function registerContextEvents(registry: EventRegistry) {
	return registry.register(ContextSnapshotCreatedEvent);
}

export function registerContextCapabilities(registry: CapabilityRegistry) {
	return registry.register(ContextSystemCapability);
}

export function registerContextDataViews(registry: DataViewRegistry) {
	return registry.register(ContextSnapshotsDataView);
}

export function registerContextForms(registry: FormRegistry) {
	return registry.register(ContextPackSearchForm);
}

export function registerContextPresentations(registry: PresentationRegistry) {
	return registry.register(ContextSnapshotSummaryPresentation);
}
