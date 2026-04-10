import { describe, expect, it } from 'bun:test';
import { CapabilityRegistry } from '../capabilities';
import { EventRegistry } from '../events';
import { OperationSpecRegistry } from '../operations/registry';
import {
	ControlPlaneExecutionAbortCommand,
	ControlPlaneExecutionApproveCommand,
	ControlPlaneExecutionFailedEvent,
	ControlPlaneExecutionLaneGetQuery,
	ControlPlaneExecutionLaneListQuery,
	ControlPlaneExecutionPauseCommand,
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
		expect(registry.get('controlPlane.execution.abort', '1.0.0')).toBe(
			ControlPlaneExecutionAbortCommand
		);
		expect(registry.get('controlPlane.execution.pause', '1.0.0')).toBe(
			ControlPlaneExecutionPauseCommand
		);
		expect(registry.get('controlPlane.execution.lane.get', '1.0.0')).toBe(
			ControlPlaneExecutionLaneGetQuery
		);
		expect(registry.get('controlPlane.execution.lane.list', '1.0.0')).toBe(
			ControlPlaneExecutionLaneListQuery
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

	it('exports the execution-lane operator subpaths', async () => {
		const abortCommand = await import(
			'@contractspec/lib.contracts-spec/control-plane/commands/controlPlaneExecutionAbort.command'
		);
		const evidenceExportCommand = await import(
			'@contractspec/lib.contracts-spec/control-plane/commands/controlPlaneExecutionEvidenceExport.command'
		);
		const pauseCommand = await import(
			'@contractspec/lib.contracts-spec/control-plane/commands/controlPlaneExecutionPause.command'
		);
		const resumeCommand = await import(
			'@contractspec/lib.contracts-spec/control-plane/commands/controlPlaneExecutionResume.command'
		);
		const retryCommand = await import(
			'@contractspec/lib.contracts-spec/control-plane/commands/controlPlaneExecutionRetry.command'
		);
		const shutdownCommand = await import(
			'@contractspec/lib.contracts-spec/control-plane/commands/controlPlaneExecutionShutdown.command'
		);
		const laneModels = await import(
			'@contractspec/lib.contracts-spec/control-plane/queries/controlPlaneExecutionLane.models'
		);
		const laneGetQuery = await import(
			'@contractspec/lib.contracts-spec/control-plane/queries/controlPlaneExecutionLaneGet.query'
		);
		const laneListQuery = await import(
			'@contractspec/lib.contracts-spec/control-plane/queries/controlPlaneExecutionLaneList.query'
		);

		expect(abortCommand.ControlPlaneExecutionAbortCommand).toBeDefined();
		expect(
			evidenceExportCommand.ControlPlaneExecutionEvidenceExportCommand
		).toBeDefined();
		expect(pauseCommand.ControlPlaneExecutionPauseCommand).toBeDefined();
		expect(resumeCommand.ControlPlaneExecutionResumeCommand).toBeDefined();
		expect(retryCommand.ControlPlaneExecutionRetryCommand).toBeDefined();
		expect(shutdownCommand.ControlPlaneExecutionShutdownCommand).toBeDefined();
		expect(laneModels.ControlPlaneExecutionLaneDetailModel).toBeDefined();
		expect(laneGetQuery.ControlPlaneExecutionLaneGetQuery).toBeDefined();
		expect(laneListQuery.ControlPlaneExecutionLaneListQuery).toBeDefined();
	});
});
