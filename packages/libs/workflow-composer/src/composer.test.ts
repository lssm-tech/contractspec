import { describe, expect, it } from 'bun:test';
import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import { WorkflowComposer } from './composer';

function baseWorkflow(): WorkflowSpec {
	return {
		meta: {
			key: 'tenant.workflow',
			version: '1.0.0',
			title: 'Tenant Workflow',
			description: 'Workflow for composer tests',
			domain: 'testing',
			owners: [OwnersEnum.PlatformSigil],
			tags: [TagsEnum.Auth],
			stability: StabilityEnum.Experimental,
		},
		metadata: {
			source: 'base',
		},
		definition: {
			entryStepId: 'start',
			steps: [
				{
					id: 'start',
					type: 'automation',
					label: 'Start',
					action: { operation: { key: 'op.start', version: '1.0.0' } },
				},
				{
					id: 'review',
					type: 'human',
					label: 'Review',
				},
				{
					id: 'finish',
					type: 'automation',
					label: 'Finish',
					action: { operation: { key: 'op.finish', version: '1.0.0' } },
				},
			],
			transitions: [
				{ from: 'start', to: 'review' },
				{ from: 'review', to: 'finish' },
			],
		},
	};
}

describe('WorkflowComposer', () => {
	it('merges metadata and annotations from extensions', () => {
		const composer = new WorkflowComposer();
		composer.register({
			workflow: 'tenant.workflow',
			tenantId: 'acme',
			metadata: { tenant: 'acme' },
			annotations: { source: 'extension' },
			customSteps: [
				{
					after: 'start',
					inject: {
						id: 'legal',
						type: 'human',
						label: 'Legal Approval',
					},
					transitionFrom: 'start',
					transitionTo: 'review',
				},
			],
		});

		const composed = composer.compose({
			base: baseWorkflow(),
			tenantId: 'acme',
		});

		expect(composed.metadata).toEqual({ source: 'base', tenant: 'acme' });
		expect(composed.annotations).toEqual({ source: 'extension' });
	});

	it('rejects duplicate injected step identifiers', () => {
		const composer = new WorkflowComposer();
		composer.register({
			workflow: 'tenant.workflow',
			customSteps: [
				{
					after: 'start',
					inject: {
						id: 'review',
						type: 'human',
						label: 'Duplicate Review',
					},
				},
			],
		});

		expect(() =>
			composer.compose({
				base: baseWorkflow(),
			})
		).toThrow(/duplicate step id/i);
	});

	it('rejects hidden entry step extensions', () => {
		const composer = new WorkflowComposer();
		composer.register({
			workflow: 'tenant.workflow',
			hiddenSteps: ['start'],
		});

		expect(() =>
			composer.compose({
				base: baseWorkflow(),
			})
		).toThrow(/entry step/i);
	});

	it('rejects invalid transition endpoints in custom injections', () => {
		const composer = new WorkflowComposer();
		composer.register({
			workflow: 'tenant.workflow',
			customSteps: [
				{
					after: 'start',
					inject: {
						id: 'legal',
						type: 'human',
						label: 'Legal Approval',
					},
					transitionTo: 'does-not-exist',
				},
			],
		});

		expect(() =>
			composer.compose({
				base: baseWorkflow(),
			})
		).toThrow(/transitionTo step/i);
	});

	it('rejects hidden-step compositions that orphan remaining paths', () => {
		const composer = new WorkflowComposer();
		composer.register({
			workflow: 'tenant.workflow',
			hiddenSteps: ['review'],
		});

		expect(() =>
			composer.compose({
				base: baseWorkflow(),
			})
		).toThrow(/unreachable from entry step/i);
	});

	it('keeps the graph connected when a hidden step is replaced by an injected step', () => {
		const composer = new WorkflowComposer();
		composer.register({
			workflow: 'tenant.workflow',
			hiddenSteps: ['review'],
			customSteps: [
				{
					after: 'start',
					inject: {
						id: 'replacement-review',
						type: 'human',
						label: 'Replacement Review',
					},
					transitionFrom: 'start',
					transitionTo: 'finish',
				},
			],
		});

		const composed = composer.compose({
			base: baseWorkflow(),
		});

		expect(composed.definition.steps.map((step) => step.id)).toEqual([
			'start',
			'replacement-review',
			'finish',
		]);
		expect(composed.definition.transitions).toEqual([
			{ from: 'start', to: 'replacement-review' },
			{ from: 'replacement-review', to: 'finish' },
		]);
	});

	it('applies extensions in deterministic priority order', () => {
		const composer = new WorkflowComposer();
		composer.registerMany([
			{
				workflow: 'tenant.workflow',
				priority: 20,
				metadata: { order: 'later' },
			},
			{
				workflow: 'tenant.workflow',
				priority: 10,
				metadata: { order: 'earlier' },
			},
		]);

		const composed = composer.compose({
			base: baseWorkflow(),
		});

		expect(composed.metadata).toEqual({
			source: 'base',
			order: 'later',
		});
	});
});
