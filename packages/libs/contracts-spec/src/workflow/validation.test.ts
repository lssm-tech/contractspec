import { describe, expect, it } from 'bun:test';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { FormRegistry, type FormSpec } from '../forms';
import type { OperationSpec } from '../operations';
import { OperationSpecRegistry } from '../operations/registry';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import { WorkflowRegistry, type WorkflowSpec } from './spec';
import {
	assertWorkflowSpecValid,
	validateWorkflowSpec,
	type WorkflowValidationIssue,
} from './validation';

const DummyModel = new SchemaModel({
	name: 'DummyModel',
	fields: {
		ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
	},
});

function createOperation(
	key: string,
	version: string
): OperationSpec<typeof DummyModel, typeof DummyModel> {
	return {
		meta: {
			key,
			version,
			kind: 'command',
			stability: StabilityEnum.Experimental,
			owners: [OwnersEnum.PlatformSigil],
			tags: [TagsEnum.Auth],
			description: 'Dummy operation for tests',
			title: 'Some title',
			goal: 'Test',
			context: 'Testing',
		},
		io: {
			input: DummyModel,
			output: DummyModel,
		},
		policy: {
			auth: 'user',
		},
		sideEffects: {},
	};
}

function createForm(key: string, version: string): FormSpec<typeof DummyModel> {
	return {
		meta: {
			key,
			version,
			title: 'Test Form',
			description: 'Testing form',
			domain: 'testing',
			owners: [OwnersEnum.PlatformSigil],
			tags: [TagsEnum.Auth],
			stability: StabilityEnum.Experimental,
		},
		model: DummyModel,
		fields: [],
	};
}

function sampleWorkflowSpec(): WorkflowSpec {
	return {
		meta: {
			key: 'sigil.workflow.sample',
			version: '1.0.0',
			title: 'Sample Workflow',
			description: 'Workflow used in tests',
			domain: 'testing',
			owners: [OwnersEnum.PlatformSigil],
			tags: [TagsEnum.Auth],
			stability: StabilityEnum.Experimental,
		},
		definition: {
			entryStepId: 'start',
			steps: [
				{
					id: 'start',
					type: 'automation',
					label: 'Start',
					action: { operation: { key: 'sigil.start', version: '1.0.0' } },
				},
				{
					id: 'review',
					type: 'human',
					label: 'Review',
					action: { form: { key: 'reviewForm', version: '1.0.0' } },
				},
				{
					id: 'finish',
					type: 'automation',
					label: 'Finish',
					action: { operation: { key: 'sigil.finish', version: '1.0.0' } },
				},
			],
			transitions: [
				{ from: 'start', to: 'review' },
				{ from: 'review', to: 'finish' },
			],
		},
	};
}

function errors(issues: WorkflowValidationIssue[]) {
	return issues.filter((issue) => issue.level === 'error');
}

describe('WorkflowRegistry', () => {
	it('registers workflows and retrieves the latest version by key', () => {
		const registry = new WorkflowRegistry();
		const specV1 = sampleWorkflowSpec();
		registry.register(specV1);

		const specV2: WorkflowSpec = {
			...specV1,
			meta: { ...specV1.meta, version: '2.0.0' },
		};
		registry.register(specV2);

		expect(registry.get(specV1.meta.key)).toEqual(specV2);
		expect(registry.get(specV1.meta.key, '1.0.0')).toEqual(specV1);
	});

	it('rejects duplicate workflow versions', () => {
		const registry = new WorkflowRegistry();
		const spec = sampleWorkflowSpec();
		registry.register(spec);
		expect(() => registry.register(spec)).toThrowError(/Duplicate contract/);
	});
});

describe('validateWorkflowSpec', () => {
	it('returns no errors for a valid workflow', () => {
		const spec = sampleWorkflowSpec();
		const operations = new OperationSpecRegistry();
		operations.register(createOperation('sigil.start', '1.0.0'));
		operations.register(createOperation('sigil.finish', '1.0.0'));
		const forms = new FormRegistry();
		forms.register(createForm('reviewForm', '1.0.0'));

		const issues = validateWorkflowSpec(spec, { operations, forms });
		expect(errors(issues)).toHaveLength(0);
		expect(() =>
			assertWorkflowSpecValid(spec, { operations, forms })
		).not.toThrow();
	});

	it('flags transitions pointing to unknown steps', () => {
		const spec = sampleWorkflowSpec();
		spec.definition.transitions.push({ from: 'finish', to: 'missing' });
		const issues = validateWorkflowSpec(spec);
		expect(errors(issues)).toHaveLength(1);
		expect(errors(issues)[0]?.message).toMatch(/unknown "to" step "missing"/);
	});

	it('flags unreachable steps', () => {
		const spec = sampleWorkflowSpec();
		spec.definition.steps.push({
			id: 'ghost',
			type: 'automation',
			label: 'Ghost',
		});
		const issues = validateWorkflowSpec(spec);
		expect(errors(issues)).toHaveLength(1);
		expect(errors(issues)[0]?.message).toMatch(/unreachable/);
	});

	it('detects cycles in transitions', () => {
		const spec = sampleWorkflowSpec();
		spec.definition.transitions.push({ from: 'finish', to: 'start' });
		const issues = validateWorkflowSpec(spec);
		expect(errors(issues).some((issue) => /cycle/.test(issue.message))).toBe(
			true
		);
	});

	it('flags missing operation references when registry provided', () => {
		const spec = sampleWorkflowSpec();
		const operations = new OperationSpecRegistry();
		operations.register(createOperation('sigil.start', '1.0.0'));
		const issues = validateWorkflowSpec(spec, { operations });
		expect(
			errors(issues).some((issue) => /unknown operation/.test(issue.message))
		).toBe(true);
	});

	it('flags missing form references when registry provided', () => {
		const spec = sampleWorkflowSpec();
		const forms = new FormRegistry();
		const issues = validateWorkflowSpec(spec, { forms });
		expect(
			errors(issues).some((issue) => /unknown form/.test(issue.message))
		).toBe(true);
	});

	it('flags empty runtime port references', () => {
		const spec = sampleWorkflowSpec();
		spec.runtime = {
			ports: {
				checkpointStore: ' ',
			},
		};

		const issues = validateWorkflowSpec(spec);
		expect(
			errors(issues).some((issue) =>
				/runtime port "checkpointStore" must not be empty/.test(issue.message)
			)
		).toBe(true);
	});

	it('warns when runtime capabilities do not define corresponding ports', () => {
		const spec = sampleWorkflowSpec();
		spec.runtime = {
			capabilities: {
				checkpointing: true,
			},
			ports: {},
		};

		const issues = validateWorkflowSpec(spec);
		expect(
			issues.some(
				(issue) =>
					issue.level === 'warning' &&
					/checkpointing without defining runtime\.ports\.checkpointStore/.test(
						issue.message
					)
			)
		).toBe(true);
	});

	it('requires idempotency keys for retrying workflow-devkit automation steps', () => {
		const spec = sampleWorkflowSpec();
		spec.runtime = {
			capabilities: {
				adapters: {
					'workflow-devkit': true,
				},
			},
			workflowDevkit: {},
		};
		spec.definition.steps[0] = {
			...spec.definition.steps[0]!,
			retry: {
				maxAttempts: 3,
				backoff: 'exponential',
				delayMs: 1000,
			},
			runtime: {
				workflowDevkit: {
					behavior: 'sleep',
					sleep: {
						duration: '5m',
					},
				},
			},
		};

		const issues = validateWorkflowSpec(spec);
		expect(
			errors(issues).some((issue) => /idempotencyKey/.test(issue.message))
		).toBe(true);
	});

	it('requires resumeSource for workflow-devkit wait steps', () => {
		const spec = sampleWorkflowSpec();
		spec.runtime = {
			capabilities: {
				adapters: {
					'workflow-devkit': true,
				},
			},
			workflowDevkit: {},
		};
		spec.definition.steps[1] = {
			...spec.definition.steps[1]!,
			runtime: {
				workflowDevkit: {
					behavior: 'hookWait',
					hookWait: {
						// @ts-expect-error test invalid runtime config
						resumeSource: 'webhook',
					},
				},
			},
		};

		const issues = validateWorkflowSpec(spec);
		expect(
			errors(issues).some((issue) => /resumeSource "hook"/.test(issue.message))
		).toBe(true);
	});

	it('requires strict JSON-serializable metadata when workflow-devkit is enabled', () => {
		const spec = sampleWorkflowSpec() as WorkflowSpec & {
			metadata: Record<string, unknown>;
		};
		spec.runtime = {
			capabilities: {
				adapters: {
					'workflow-devkit': true,
				},
			},
			workflowDevkit: {
				serialization: {
					mode: 'strict',
				},
			},
		};
		spec.metadata = {
			createdAt: new Date(),
		};

		const issues = validateWorkflowSpec(spec);
		expect(
			errors(issues).some((issue) =>
				/metadata must be JSON-serializable/.test(issue.message)
			)
		).toBe(true);
	});

	it('accepts workflow-devkit wait steps with explicit resume metadata', () => {
		const spec = sampleWorkflowSpec();
		spec.runtime = {
			capabilities: {
				adapters: {
					'workflow-devkit': true,
				},
			},
			workflowDevkit: {
				hostTarget: 'next',
				integrationMode: 'generated',
			},
		};
		spec.definition.steps[1] = {
			...spec.definition.steps[1]!,
			runtime: {
				workflowDevkit: {
					behavior: 'approvalWait',
					approvalWait: {
						resumeSource: 'approval',
						token: 'review:approval',
						payloadExample: {
							approved: true,
						},
					},
				},
			},
		};

		const issues = validateWorkflowSpec(spec);
		expect(errors(issues)).toHaveLength(0);
	});
});
