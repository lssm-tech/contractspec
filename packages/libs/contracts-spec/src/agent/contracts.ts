import type { CapabilityRegistry } from '../capabilities';
import type { DataViewRegistry } from '../data-views';
import type { EventRegistry } from '../events';
import type { FormRegistry } from '../forms';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import { AgentExecutionCapability } from './capabilities';
import {
	AgentApprovalsCommand,
	AgentCancelCommand,
	AgentRunCommand,
} from './commands';
import {
	AgentApprovalRequestedEvent,
	AgentRunCompletedEvent,
	AgentRunFailedEvent,
	AgentRunStartedEvent,
} from './events';
import { AgentRunForm } from './forms';
import { AgentRunAuditPresentation } from './presentations';
import { AgentArtifactsQuery, AgentStatusQuery } from './queries';
import { AgentRunsDataView } from './views';

export const agentOperationContracts = {
	AgentRunCommand,
	AgentCancelCommand,
	AgentApprovalsCommand,
	AgentStatusQuery,
	AgentArtifactsQuery,
};

export const agentEventContracts = {
	AgentRunStartedEvent,
	AgentRunCompletedEvent,
	AgentRunFailedEvent,
	AgentApprovalRequestedEvent,
};

export const agentCapabilityContracts = {
	AgentExecutionCapability,
};

export const agentDataViewContracts = {
	AgentRunsDataView,
};

export const agentFormContracts = {
	AgentRunForm,
};

export const agentPresentationContracts = {
	AgentRunAuditPresentation,
};

export function registerAgentOperations(registry: OperationSpecRegistry) {
	return registry
		.register(AgentRunCommand)
		.register(AgentCancelCommand)
		.register(AgentApprovalsCommand)
		.register(AgentStatusQuery)
		.register(AgentArtifactsQuery);
}

export function registerAgentEvents(registry: EventRegistry) {
	return registry
		.register(AgentRunStartedEvent)
		.register(AgentRunCompletedEvent)
		.register(AgentRunFailedEvent)
		.register(AgentApprovalRequestedEvent);
}

export function registerAgentCapabilities(registry: CapabilityRegistry) {
	return registry.register(AgentExecutionCapability);
}

export function registerAgentDataViews(registry: DataViewRegistry) {
	return registry.register(AgentRunsDataView);
}

export function registerAgentForms(registry: FormRegistry) {
	return registry.register(AgentRunForm);
}

export function registerAgentPresentations(registry: PresentationRegistry) {
	return registry.register(AgentRunAuditPresentation);
}
