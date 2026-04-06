import type { CapabilityRegistry } from '../capabilities';
import type { EventRegistry } from '../events';
import type { OperationSpecRegistry } from '../operations/registry';
import {
	ControlPlaneApprovalCapability,
	ControlPlaneAuditCapability,
	ControlPlaneChannelRuntimeCapability,
	ControlPlaneCoreCapability,
	ControlPlaneSkillRegistryCapability,
} from './capabilities';
import {
	ControlPlaneExecutionAbortCommand,
	ControlPlaneExecutionApproveCommand,
	ControlPlaneExecutionCancelCommand,
	ControlPlaneExecutionEvidenceExportCommand,
	ControlPlaneExecutionPauseCommand,
	ControlPlaneExecutionRejectCommand,
	ControlPlaneExecutionResumeCommand,
	ControlPlaneExecutionRetryCommand,
	ControlPlaneExecutionShutdownCommand,
	ControlPlaneExecutionStartCommand,
	ControlPlaneIntentSubmitCommand,
	ControlPlanePlanCompileCommand,
	ControlPlanePlanVerifyCommand,
	ControlPlaneSkillDisableCommand,
	ControlPlaneSkillInstallCommand,
} from './commands';
import {
	ControlPlaneExecutionCompletedEvent,
	ControlPlaneExecutionFailedEvent,
	ControlPlaneExecutionStepBlockedEvent,
	ControlPlaneExecutionStepCompletedEvent,
	ControlPlaneExecutionStepStartedEvent,
	ControlPlaneIntentReceivedEvent,
	ControlPlanePlanCompiledEvent,
	ControlPlanePlanRejectedEvent,
	ControlPlaneSkillInstalledEvent,
	ControlPlaneSkillRejectedEvent,
} from './events';
import {
	ControlPlaneExecutionGetQuery,
	ControlPlaneExecutionLaneGetQuery,
	ControlPlaneExecutionLaneListQuery,
	ControlPlaneExecutionListQuery,
	ControlPlanePolicyExplainQuery,
	ControlPlaneSkillListQuery,
	ControlPlaneSkillVerifyQuery,
	ControlPlaneTraceGetQuery,
} from './queries';

export const controlPlaneOperationContracts = {
	ControlPlaneIntentSubmitCommand,
	ControlPlanePlanCompileCommand,
	ControlPlanePlanVerifyCommand,
	ControlPlaneExecutionStartCommand,
	ControlPlaneExecutionAbortCommand,
	ControlPlaneExecutionApproveCommand,
	ControlPlaneExecutionRejectCommand,
	ControlPlaneExecutionCancelCommand,
	ControlPlaneExecutionPauseCommand,
	ControlPlaneExecutionResumeCommand,
	ControlPlaneExecutionRetryCommand,
	ControlPlaneExecutionShutdownCommand,
	ControlPlaneExecutionEvidenceExportCommand,
	ControlPlaneSkillInstallCommand,
	ControlPlaneSkillDisableCommand,
	ControlPlaneExecutionGetQuery,
	ControlPlaneExecutionLaneGetQuery,
	ControlPlaneExecutionLaneListQuery,
	ControlPlaneExecutionListQuery,
	ControlPlaneTraceGetQuery,
	ControlPlanePolicyExplainQuery,
	ControlPlaneSkillListQuery,
	ControlPlaneSkillVerifyQuery,
};

export const controlPlaneEventContracts = {
	ControlPlaneIntentReceivedEvent,
	ControlPlanePlanCompiledEvent,
	ControlPlanePlanRejectedEvent,
	ControlPlaneExecutionStepStartedEvent,
	ControlPlaneExecutionStepBlockedEvent,
	ControlPlaneExecutionStepCompletedEvent,
	ControlPlaneExecutionCompletedEvent,
	ControlPlaneExecutionFailedEvent,
	ControlPlaneSkillInstalledEvent,
	ControlPlaneSkillRejectedEvent,
};

export const controlPlaneCapabilityContracts = {
	ControlPlaneCoreCapability,
	ControlPlaneApprovalCapability,
	ControlPlaneAuditCapability,
	ControlPlaneSkillRegistryCapability,
	ControlPlaneChannelRuntimeCapability,
};

export function registerControlPlaneOperations(
	registry: OperationSpecRegistry
) {
	return registry
		.register(ControlPlaneIntentSubmitCommand)
		.register(ControlPlanePlanCompileCommand)
		.register(ControlPlanePlanVerifyCommand)
		.register(ControlPlaneExecutionStartCommand)
		.register(ControlPlaneExecutionAbortCommand)
		.register(ControlPlaneExecutionApproveCommand)
		.register(ControlPlaneExecutionRejectCommand)
		.register(ControlPlaneExecutionCancelCommand)
		.register(ControlPlaneExecutionPauseCommand)
		.register(ControlPlaneExecutionResumeCommand)
		.register(ControlPlaneExecutionRetryCommand)
		.register(ControlPlaneExecutionShutdownCommand)
		.register(ControlPlaneExecutionEvidenceExportCommand)
		.register(ControlPlaneSkillInstallCommand)
		.register(ControlPlaneSkillDisableCommand)
		.register(ControlPlaneExecutionGetQuery)
		.register(ControlPlaneExecutionLaneGetQuery)
		.register(ControlPlaneExecutionLaneListQuery)
		.register(ControlPlaneExecutionListQuery)
		.register(ControlPlaneTraceGetQuery)
		.register(ControlPlanePolicyExplainQuery)
		.register(ControlPlaneSkillListQuery)
		.register(ControlPlaneSkillVerifyQuery);
}

export function registerControlPlaneEvents(registry: EventRegistry) {
	return registry
		.register(ControlPlaneIntentReceivedEvent)
		.register(ControlPlanePlanCompiledEvent)
		.register(ControlPlanePlanRejectedEvent)
		.register(ControlPlaneExecutionStepStartedEvent)
		.register(ControlPlaneExecutionStepBlockedEvent)
		.register(ControlPlaneExecutionStepCompletedEvent)
		.register(ControlPlaneExecutionCompletedEvent)
		.register(ControlPlaneExecutionFailedEvent)
		.register(ControlPlaneSkillInstalledEvent)
		.register(ControlPlaneSkillRejectedEvent);
}

export function registerControlPlaneCapabilities(registry: CapabilityRegistry) {
	return registry
		.register(ControlPlaneCoreCapability)
		.register(ControlPlaneApprovalCapability)
		.register(ControlPlaneAuditCapability)
		.register(ControlPlaneSkillRegistryCapability)
		.register(ControlPlaneChannelRuntimeCapability);
}
