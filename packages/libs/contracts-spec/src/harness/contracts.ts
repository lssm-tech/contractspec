import type { CapabilityRegistry } from '../capabilities';
import type { DataViewRegistry } from '../data-views';
import type { EventRegistry } from '../events';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import {
	HarnessEvaluationCapability,
	HarnessEvidenceCapability,
	HarnessExecutionCapability,
	HarnessTargetingCapability,
} from './capabilities';
import {
	HarnessEvaluationRunCommand,
	HarnessRunCancelCommand,
	HarnessRunStartCommand,
} from './commands';
import {
	HarnessEvaluationCompletedEvent,
	HarnessEvidenceCapturedEvent,
	HarnessRunCompletedEvent,
	HarnessRunFailedEvent,
	HarnessRunStartedEvent,
	HarnessStepBlockedEvent,
	HarnessStepCompletedEvent,
	HarnessStepStartedEvent,
} from './events';
import { HarnessRunAuditPresentation } from './presentations';
import {
	HarnessEvaluationGetQuery,
	HarnessEvidenceGetQuery,
	HarnessEvidenceListQuery,
	HarnessRunGetQuery,
	HarnessTargetResolveQuery,
} from './queries';
import {
	HarnessEvaluationsDataView,
	HarnessEvidenceDataView,
	HarnessRunsDataView,
} from './views';

export const harnessOperationContracts = {
	HarnessTargetResolveQuery,
	HarnessRunStartCommand,
	HarnessRunCancelCommand,
	HarnessRunGetQuery,
	HarnessEvidenceListQuery,
	HarnessEvidenceGetQuery,
	HarnessEvaluationRunCommand,
	HarnessEvaluationGetQuery,
};

export const harnessEventContracts = {
	HarnessRunStartedEvent,
	HarnessRunCompletedEvent,
	HarnessRunFailedEvent,
	HarnessStepStartedEvent,
	HarnessStepCompletedEvent,
	HarnessStepBlockedEvent,
	HarnessEvidenceCapturedEvent,
	HarnessEvaluationCompletedEvent,
};

export const harnessCapabilityContracts = {
	HarnessExecutionCapability,
	HarnessEvidenceCapability,
	HarnessEvaluationCapability,
	HarnessTargetingCapability,
};

export const harnessDataViewContracts = {
	HarnessRunsDataView,
	HarnessEvidenceDataView,
	HarnessEvaluationsDataView,
};

export const harnessPresentationContracts = {
	HarnessRunAuditPresentation,
};

export function registerHarnessOperations(registry: OperationSpecRegistry) {
	return registry
		.register(HarnessTargetResolveQuery)
		.register(HarnessRunStartCommand)
		.register(HarnessRunCancelCommand)
		.register(HarnessRunGetQuery)
		.register(HarnessEvidenceListQuery)
		.register(HarnessEvidenceGetQuery)
		.register(HarnessEvaluationRunCommand)
		.register(HarnessEvaluationGetQuery);
}

export function registerHarnessEvents(registry: EventRegistry) {
	return registry
		.register(HarnessRunStartedEvent)
		.register(HarnessRunCompletedEvent)
		.register(HarnessRunFailedEvent)
		.register(HarnessStepStartedEvent)
		.register(HarnessStepCompletedEvent)
		.register(HarnessStepBlockedEvent)
		.register(HarnessEvidenceCapturedEvent)
		.register(HarnessEvaluationCompletedEvent);
}

export function registerHarnessCapabilities(registry: CapabilityRegistry) {
	return registry
		.register(HarnessExecutionCapability)
		.register(HarnessEvidenceCapability)
		.register(HarnessEvaluationCapability)
		.register(HarnessTargetingCapability);
}

export function registerHarnessDataViews(registry: DataViewRegistry) {
	return registry
		.register(HarnessRunsDataView)
		.register(HarnessEvidenceDataView)
		.register(HarnessEvaluationsDataView);
}

export function registerHarnessPresentations(registry: PresentationRegistry) {
	return registry.register(HarnessRunAuditPresentation);
}
