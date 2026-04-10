interface WorkflowDevkitTemplateOptions {
	exportName: string;
	specImportPath: string;
	workflowFunctionName: string;
}

export function generateWorkflowDevkitWorkflowTemplate({
	exportName,
	specImportPath,
	workflowFunctionName,
}: WorkflowDevkitTemplateOptions): string {
	return `import { createHook, createWebhook, sleep } from 'workflow';
import { runWorkflowSpecWithWorkflowDevkit } from '@contractspec/integration.workflow-devkit';
import { ${exportName} } from '${specImportPath}';

export async function ${workflowFunctionName}(input = {}, bridge = {}) {
  "use workflow";

  // Keep the workflow function deterministic.
  // Any Node.js or side-effectful logic should live in "use step" helpers that
  // your bridge calls, not in this orchestrator itself.
  return runWorkflowSpecWithWorkflowDevkit({
    spec: ${exportName},
    initialData: input,
    bridge,
    primitives: {
      sleep,
      createHook,
      createWebhook,
    },
  });
}
`;
}

export function generateWorkflowDevkitStartRouteTemplate(
	workflowImportPath: string,
	workflowFunctionName: string
): string {
	return `import { createWorkflowDevkitStartRoute } from '@contractspec/integration.workflow-devkit';
import { ${workflowFunctionName} } from '${workflowImportPath}';

export const POST = createWorkflowDevkitStartRoute({
  workflow: ${workflowFunctionName},
  async buildArgs(body) {
    return [body];
  },
});
`;
}

export function generateWorkflowDevkitFollowUpRouteTemplate(): string {
	return `import { createWorkflowDevkitFollowUpRoute } from '@contractspec/integration.workflow-devkit';

export const POST = createWorkflowDevkitFollowUpRoute({
  resolveToken({ runId }) {
    return \`workflow-session:\${runId}\`;
  },
});
`;
}

export function generateWorkflowDevkitStreamRouteTemplate(): string {
	return `import { createWorkflowDevkitStreamRoute } from '@contractspec/integration.workflow-devkit';

export const GET = createWorkflowDevkitStreamRoute();
`;
}

export function generateWorkflowDevkitGenericTemplate(
	workflowImportPath: string,
	workflowFunctionName: string
): string {
	return `import { ${workflowFunctionName} } from '${workflowImportPath}';

export const workflowDevkitBootstrap = {
  workflow: ${workflowFunctionName},
  createBridge() {
    return {
      executeAutomationStep: async () => {
        throw new Error('Provide executeAutomationStep in your generic host bridge.');
      },
    };
  },
};
`;
}
