import type { CapabilityRegistry } from '../capabilities';
import type { EventRegistry } from '../events';
import type { OperationSpecRegistry } from '../operations/registry';
import {
  ControlPlaneExecutionApproveCommand,
  ControlPlaneExecutionCancelCommand,
  ControlPlaneExecutionRejectCommand,
  ControlPlaneExecutionStartCommand,
  ControlPlaneIntentSubmitCommand,
  ControlPlanePlanCompileCommand,
  ControlPlanePlanVerifyCommand,
  ControlPlaneSkillDisableCommand,
  ControlPlaneSkillInstallCommand,
} from './commands';
import {
  ControlPlaneApprovalCapability,
  ControlPlaneAuditCapability,
  ControlPlaneChannelRuntimeCapability,
  ControlPlaneCoreCapability,
  ControlPlaneSkillRegistryCapability,
} from './capabilities';
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
  ControlPlaneExecutionApproveCommand,
  ControlPlaneExecutionRejectCommand,
  ControlPlaneExecutionCancelCommand,
  ControlPlaneSkillInstallCommand,
  ControlPlaneSkillDisableCommand,
  ControlPlaneExecutionGetQuery,
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
    .register(ControlPlaneExecutionApproveCommand)
    .register(ControlPlaneExecutionRejectCommand)
    .register(ControlPlaneExecutionCancelCommand)
    .register(ControlPlaneSkillInstallCommand)
    .register(ControlPlaneSkillDisableCommand)
    .register(ControlPlaneExecutionGetQuery)
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
