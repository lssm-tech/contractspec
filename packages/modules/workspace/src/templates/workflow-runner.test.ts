import { describe, expect, it } from 'bun:test';
import { generateWorkflowRunnerTemplate } from './workflow-runner';

describe('generateWorkflowRunnerTemplate', () => {
	it('generates a workflow runner', () => {
		const code = generateWorkflowRunnerTemplate({
			exportName: 'MyWorkflow',
			specImportPath: './my-workflow.contracts',
			runnerName: 'myWorkflowRunner',
			workflowName: 'My Workflow',
		});

		expect(code).toContain(
			"import { MyWorkflow } from './my-workflow.contracts'"
		);
		expect(code).toContain(
			"import { InMemoryStateStore } from '@contractspec/lib.contracts-spec/workflow/adapters';"
		);
		expect(code).toContain(
			"import { WorkflowRunner } from '@contractspec/lib.contracts-spec/workflow/runner';"
		);
		expect(code).toContain(
			"import { WorkflowRegistry } from '@contractspec/lib.contracts-spec/workflow/spec';"
		);
		expect(code).toContain('registry.register(MyWorkflow)');
		expect(code).toContain(
			'export const myWorkflowRunner = new WorkflowRunner({'
		);
	});
});
