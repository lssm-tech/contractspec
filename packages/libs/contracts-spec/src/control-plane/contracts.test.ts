import { describe, expect, it } from 'bun:test';
import { CapabilityRegistry } from '../capabilities';
import { EventRegistry } from '../events';
import { OperationSpecRegistry } from '../operations/registry';
import {
  ControlPlaneExecutionApproveCommand,
  ControlPlaneExecutionFailedEvent,
  ControlPlaneIntentSubmitCommand,
  ControlPlanePolicyExplainQuery,
  ControlPlaneSkillInstallCommand,
  ControlPlaneSkillRegistryCapability,
  registerControlPlaneCapabilities,
  registerControlPlaneEvents,
  registerControlPlaneOperations,
} from './index';

describe('control-plane contracts', () => {
  it('registers operations for intent, execution, policy, and skills', () => {
    const registry = registerControlPlaneOperations(
      new OperationSpecRegistry()
    );

    expect(registry.get('controlPlane.intent.submit', '1.0.0')).toBe(
      ControlPlaneIntentSubmitCommand
    );
    expect(registry.get('controlPlane.execution.approve', '1.0.0')).toBe(
      ControlPlaneExecutionApproveCommand
    );
    expect(registry.get('controlPlane.policy.explain', '1.0.0')).toBe(
      ControlPlanePolicyExplainQuery
    );
    expect(registry.get('controlPlane.skill.install', '1.0.0')).toBe(
      ControlPlaneSkillInstallCommand
    );
  });

  it('registers lifecycle and skill events', () => {
    const registry = registerControlPlaneEvents(new EventRegistry());

    expect(registry.get('controlPlane.intent.received', '1.0.0')).toBeDefined();
    expect(registry.get('controlPlane.execution.failed', '1.0.0')).toBe(
      ControlPlaneExecutionFailedEvent
    );
    expect(registry.get('controlPlane.skill.installed', '1.0.0')).toBeDefined();
  });

  it('registers capability surfaces for control plane domains', () => {
    const registry = registerControlPlaneCapabilities(new CapabilityRegistry());

    expect(registry.get('control-plane.skill-registry', '1.0.0')).toBe(
      ControlPlaneSkillRegistryCapability
    );

    const operationKeys = registry
      .getOperationsFor('control-plane.skill-registry', '1.0.0')
      .sort();

    expect(operationKeys).toContain('controlPlane.skill.install');
    expect(operationKeys).toContain('controlPlane.skill.verify');
  });
});
