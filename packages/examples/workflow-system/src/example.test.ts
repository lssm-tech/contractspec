import { describe, expect, test } from 'bun:test';
import { web } from '@contractspec/lib.runtime-sandbox';
import example from './example';
import { createWorkflowHandlers } from './handlers/workflow.handlers';
import { seedWorkflowSystem } from './seeders';
import {
	WORKFLOW_SYSTEM_DEMO_DEFINITIONS,
	WORKFLOW_SYSTEM_DEMO_PROJECT_ID,
} from './shared/demo-scenario';
import { workflowDashboardMarkdownRenderer } from './ui/renderers/workflow.markdown';
import { WorkflowSystemFeature } from './workflow-system.feature';

describe('@contractspec/example.workflow-system', () => {
	test('publishes workflow-system example metadata', () => {
		expect(example.meta.key).toBe('workflow-system');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.workflow-system'
		);
		expect(example.surfaces.templates).toBe(true);
		expect(example.surfaces.sandbox?.enabled).toBe(true);
		expect(WorkflowSystemFeature.meta.key).toBe(example.meta.key);
	});

	test('seeds a credible approval story and completes a fresh happy path', async () => {
		const runtime = new web.LocalRuntimeServices();
		try {
			await runtime.init();
			await seedWorkflowSystem({
				projectId: WORKFLOW_SYSTEM_DEMO_PROJECT_ID,
				db: runtime.db,
			});

			const handlers = createWorkflowHandlers(runtime.db);
			const definitions = await handlers.listDefinitions({
				projectId: WORKFLOW_SYSTEM_DEMO_PROJECT_ID,
				limit: 10,
			});
			const instances = await handlers.listInstances({
				projectId: WORKFLOW_SYSTEM_DEMO_PROJECT_ID,
				limit: 10,
			});

			expect(definitions.total).toBe(WORKFLOW_SYSTEM_DEMO_DEFINITIONS.length);
			expect(
				definitions.definitions.map((definition) => definition.name)
			).toEqual(
				expect.arrayContaining(['Expense Approval', 'Vendor Onboarding'])
			);
			expect(
				instances.instances.some(
					(instance) => instance.status === 'IN_PROGRESS'
				)
			).toBe(true);
			expect(
				instances.instances.some((instance) => instance.status === 'COMPLETED')
			).toBe(true);

			const expenseDefinition = definitions.definitions.find(
				(definition) => definition.id === 'wf_expense'
			);
			expect(expenseDefinition).toBeDefined();

			const freshInstance = await handlers.startInstance(
				{
					definitionId: expenseDefinition!.id,
					data: { amount: 5120, currency: 'EUR', vendor: 'Meetup Robotics' },
				},
				{
					projectId: WORKFLOW_SYSTEM_DEMO_PROJECT_ID,
					requestedBy: 'meetup@contractspec.io',
				}
			);
			expect(freshInstance.status).toBe('IN_PROGRESS');

			const afterManagerApproval = await handlers.approveStep(
				{
					instanceId: freshInstance.id,
					comment: 'Manager approved the expense request.',
				},
				{ actorId: 'manager.demo' }
			);
			expect(afterManagerApproval.currentStepId).toBe('wfstep_expense_finance');

			const completedInstance = await handlers.approveStep(
				{
					instanceId: freshInstance.id,
					comment: 'Finance approved the final budget check.',
				},
				{ actorId: 'finance.demo' }
			);
			expect(completedInstance.status).toBe('COMPLETED');

			const approvals = await handlers.getApprovals(freshInstance.id);
			expect(approvals).toHaveLength(2);
			expect(
				approvals.every((approval) => approval.status === 'APPROVED')
			).toBe(true);
		} finally {
			await runtime.db.close();
		}
	});

	test('renders markdown from the seeded workflow scenario', async () => {
		const markdown = await workflowDashboardMarkdownRenderer.render({
			source: {
				type: 'component',
				componentKey: 'WorkflowDashboard',
			},
		} as Parameters<typeof workflowDashboardMarkdownRenderer.render>[0]);

		expect(markdown.body).toContain('Expense Approval');
		expect(markdown.body).toContain('Vendor Onboarding');
		expect(markdown.body).toContain('Awaiting Action');
	});
});
