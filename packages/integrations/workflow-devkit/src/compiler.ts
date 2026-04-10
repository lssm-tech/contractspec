import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow/spec';
import {
	inferWorkflowDevkitBehavior,
	resolveWorkflowDevkitEntryStepId,
	resolveWorkflowDevkitWaitToken,
	sanitizeIdentifier,
} from './helpers';
import type {
	WorkflowDevkitCompilation,
	WorkflowDevkitGeneratedArtifacts,
} from './types';

export interface CompileWorkflowSpecToWorkflowDevkitOptions {
	exportName: string;
	specImportPath: string;
	workflowFunctionName?: string;
}

export function compileWorkflowSpecToWorkflowDevkit(
	spec: WorkflowSpec
): WorkflowDevkitCompilation {
	return {
		entryStepId: resolveWorkflowDevkitEntryStepId(spec),
		hostTarget: spec.runtime?.workflowDevkit?.hostTarget ?? 'generic',
		hookTokenStrategy:
			spec.runtime?.workflowDevkit?.hookTokens?.strategy ?? 'deterministic',
		integrationMode: spec.runtime?.workflowDevkit?.integrationMode ?? 'manual',
		runIdentityStrategy:
			spec.runtime?.workflowDevkit?.runIdentity?.strategy ?? 'meta-key-version',
		specKey: spec.meta.key,
		specVersion: spec.meta.version,
		steps: spec.definition.steps.map((step) => ({
			behavior: inferWorkflowDevkitBehavior(step),
			id: step.id,
			label: step.label,
			operationRef: step.action?.operation
				? `${step.action.operation.key}.v${step.action.operation.version}`
				: undefined,
			runtime: step.runtime?.workflowDevkit,
			transitions: spec.definition.transitions
				.filter((transition) => transition.from === step.id)
				.map((transition) => ({
					condition: transition.condition,
					to: transition.to,
				})),
			type: step.type,
			waitToken: resolveWorkflowDevkitWaitToken(spec, step),
		})),
	};
}

export function generateWorkflowDevkitArtifacts(
	spec: WorkflowSpec,
	options: CompileWorkflowSpecToWorkflowDevkitOptions
): WorkflowDevkitGeneratedArtifacts {
	const compilation = compileWorkflowSpecToWorkflowDevkit(spec);
	const workflowFunctionName =
		options.workflowFunctionName ??
		`${sanitizeIdentifier(options.exportName)}WorkflowDevkit`;
	return {
		genericBootstrap: createGenericBootstrapTemplate(
			options.exportName,
			workflowFunctionName
		),
		manifest: JSON.stringify(compilation, null, 2),
		nextFollowUpRoute: createFollowUpRouteTemplate(workflowFunctionName),
		nextStartRoute: createStartRouteTemplate(workflowFunctionName),
		nextStreamRoute: createStreamRouteTemplate(),
		workflowModule: createWorkflowModuleTemplate(
			options.exportName,
			options.specImportPath,
			workflowFunctionName
		),
	};
}

function createGenericBootstrapTemplate(
	exportName: string,
	workflowFunctionName: string
) {
	return `import { ${workflowFunctionName} } from "./${sanitizeIdentifier(exportName)}.workflow-devkit";

export const ${sanitizeIdentifier(exportName)}WorkflowDevkitBootstrap = {
  workflow: ${workflowFunctionName},
  createBridge() {
    return {
      executeAutomationStep: async () => {
        throw new Error("Provide executeAutomationStep in your generic host bridge.");
      },
    };
  },
};
`;
}

function createStartRouteTemplate(workflowFunctionName: string) {
	return `import { createWorkflowDevkitStartRoute } from "@contractspec/integration.workflow-devkit";
import { ${workflowFunctionName} } from "./workflow";

export const POST = createWorkflowDevkitStartRoute({
  workflow: ${workflowFunctionName},
  async buildArgs(body) {
    return [body];
  },
});
`;
}

function createFollowUpRouteTemplate(workflowFunctionName: string) {
	return `import { createWorkflowDevkitFollowUpRoute } from "@contractspec/integration.workflow-devkit";

export const POST = createWorkflowDevkitFollowUpRoute({
  resolveToken({ runId }) {
    return \`${workflowFunctionName}:\${runId}\`;
  },
});
`;
}

function createStreamRouteTemplate() {
	return `import { createWorkflowDevkitStreamRoute } from "@contractspec/integration.workflow-devkit";

export const GET = createWorkflowDevkitStreamRoute();
`;
}

function createWorkflowModuleTemplate(
	exportName: string,
	specImportPath: string,
	workflowFunctionName: string
) {
	return `import { createHook, createWebhook, sleep } from "workflow";
import { runWorkflowSpecWithWorkflowDevkit } from "@contractspec/integration.workflow-devkit";
import { ${exportName} } from "${specImportPath}";

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
