import { describe, expect, test } from 'bun:test';
import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import { createWorkflowTools } from './workflow-tools';

const mockBaseWorkflow: WorkflowSpec = {
	meta: {
		key: 'billing.invoiceApproval',
		version: '1.0.0',
		title: 'Invoice Approval',
		description: 'Base invoice approval workflow',
		stability: StabilityEnum.Experimental,
		owners: [OwnersEnum.PlatformSigil],
		tags: [TagsEnum.Auth],
	},
	definition: {
		entryStepId: 'validate-invoice',
		steps: [
			{
				id: 'validate-invoice',
				type: 'automation',
				label: 'Validate Invoice',
				description: 'Validate invoice data',
			},
			{
				id: 'approve',
				type: 'human',
				label: 'Approve',
				description: 'Human approval step',
			},
			{
				id: 'end',
				type: 'automation',
				label: 'End',
				description: 'Workflow complete',
			},
		],
		transitions: [
			{ from: 'validate-invoice', to: 'approve' },
			{ from: 'approve', to: 'end' },
		],
	},
};

describe('workflow-tools', () => {
	describe('createWorkflowTools', () => {
		test('returns tools object with create_workflow_extension, compose_workflow, generate_workflow_spec_code', () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			expect(tools).toHaveProperty('create_workflow_extension');
			expect(tools).toHaveProperty('compose_workflow');
			expect(tools).toHaveProperty('generate_workflow_spec_code');
		});
	});

	describe('create_workflow_extension', () => {
		test('validates extension successfully when customSteps have valid after anchor', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.create_workflow_extension as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflow: 'billing.invoiceApproval',
				tenantId: 'tenant-1',
				customSteps: [
					{
						after: 'validate-invoice',
						inject: {
							id: 'legal-review',
							type: 'human',
							label: 'Legal Review',
							description: 'Legal team review',
						},
					},
				],
			});
			expect(result).toMatchObject({
				success: true,
				message: 'Extension validated successfully',
			});
		});

		test('returns error when base workflow not found', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.create_workflow_extension as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflow: 'unknown.workflow',
				customSteps: [],
			});
			expect(result).toMatchObject({
				success: false,
				error: expect.stringContaining('not found'),
			});
		});

		test('returns error when extension validation fails (missing anchor)', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.create_workflow_extension as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflow: 'billing.invoiceApproval',
				customSteps: [
					{
						inject: {
							id: 'new-step',
							type: 'human',
							label: 'New Step',
						},
					},
				],
			});
			expect(result).toMatchObject({
				success: false,
				error: expect.stringMatching(/anchor|after|before/),
			});
		});
	});

	describe('compose_workflow', () => {
		test('composes workflow successfully with extensions', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.compose_workflow as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflowKey: 'billing.invoiceApproval',
				tenantId: 'tenant-1',
				extensions: [
					{
						workflow: 'billing.invoiceApproval',
						tenantId: 'tenant-1',
						customSteps: [
							{
								after: 'validate-invoice',
								transitionFrom: 'validate-invoice',
								transitionTo: 'approve',
								inject: {
									id: 'legal-review',
									type: 'human',
									label: 'Legal Review',
								},
							},
						],
					},
				],
			});
			expect(result).toMatchObject({
				success: true,
				workflow: expect.objectContaining({
					meta: expect.objectContaining({ key: 'billing.invoiceApproval' }),
					definition: expect.objectContaining({
						steps: expect.any(Array),
					}),
				}),
			});
			const stepIds = (result as { stepIds: string[] }).stepIds;
			expect(stepIds).toContain('validate-invoice');
			expect(stepIds).toContain('legal-review');
			expect(stepIds).toContain('approve');
		});

		test('returns error when base workflow not found', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.compose_workflow as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflowKey: 'unknown.workflow',
			});
			expect(result).toMatchObject({
				success: false,
				error: expect.stringContaining('not found'),
			});
		});
	});

	describe('generate_workflow_spec_code', () => {
		test('generates TypeScript code for base workflow', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.generate_workflow_spec_code as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = (await tool.execute({
				workflowKey: 'billing.invoiceApproval',
			})) as { success: boolean; code: string | null; workflowKey: string };
			expect(result.success).toBe(true);
			expect(result.workflowKey).toBe('billing.invoiceApproval');
			expect(result.code).toBeTruthy();
			const code = result.code ?? '';
			expect(code).toContain('WorkflowSpec');
			expect(code).toContain("key: 'billing.invoiceApproval'");
			expect(code).toContain('validate-invoice');
			expect(code).toContain('approve');
		});

		test('generates code with composedSteps when provided', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.generate_workflow_spec_code as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflowKey: 'billing.invoiceApproval',
				composedSteps: [
					{ id: 'validate-invoice', type: 'automation', label: 'Validate' },
					{ id: 'legal-review', type: 'human', label: 'Legal Review' },
					{ id: 'approve', type: 'human', label: 'Approve' },
				],
			});
			expect(result).toMatchObject({
				success: true,
				code: expect.stringContaining('legal-review'),
			});
		});

		test('returns error when base workflow not found', async () => {
			const tools = createWorkflowTools({
				baseWorkflows: [mockBaseWorkflow],
			});
			const tool = tools.generate_workflow_spec_code as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				workflowKey: 'unknown.workflow',
			});
			expect(result).toMatchObject({
				success: false,
				error: expect.stringContaining('not found'),
			});
		});
	});
});
