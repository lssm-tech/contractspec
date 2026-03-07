import type { CapabilityRegistry } from '../capabilities';
import type { EventRegistry } from '../events';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import type { DataViewRegistry } from '../data-views';
import type { FormRegistry } from '../forms';
import {
  AgentRunCommand,
  AgentCancelCommand,
  AgentApprovalsCommand,
} from './commands';
import { AgentStatusQuery, AgentArtifactsQuery } from './queries';
import {
  AgentApprovalRequestedEvent,
  AgentRunCompletedEvent,
  AgentRunFailedEvent,
  AgentRunStartedEvent,
} from './events';
import { AgentExecutionCapability } from './capabilities';
import { AgentRunsDataView } from './views';
import { AgentRunForm } from './forms';
import { AgentRunAuditPresentation } from './presentations';

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
