import type { CapabilityRegistry } from '../capabilities';
import type { OperationSpecRegistry } from '../operations/registry';
import {
  AcpSessionInitCommand,
  AcpSessionResumeCommand,
  AcpSessionStopCommand,
  AcpPromptTurnCommand,
  AcpToolCallsCommand,
  AcpTerminalExecCommand,
  AcpFsAccessCommand,
} from './commands';
import { AcpTransportCapability } from './capabilities';

export const acpOperationContracts = {
  AcpSessionInitCommand,
  AcpSessionResumeCommand,
  AcpSessionStopCommand,
  AcpPromptTurnCommand,
  AcpToolCallsCommand,
  AcpTerminalExecCommand,
  AcpFsAccessCommand,
};

export const acpCapabilityContracts = {
  AcpTransportCapability,
};

export function registerAcpOperations(registry: OperationSpecRegistry) {
  return registry
    .register(AcpSessionInitCommand)
    .register(AcpSessionResumeCommand)
    .register(AcpSessionStopCommand)
    .register(AcpPromptTurnCommand)
    .register(AcpToolCallsCommand)
    .register(AcpTerminalExecCommand)
    .register(AcpFsAccessCommand);
}

export function registerAcpCapabilities(registry: CapabilityRegistry) {
  return registry.register(AcpTransportCapability);
}
