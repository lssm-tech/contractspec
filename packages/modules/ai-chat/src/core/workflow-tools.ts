/**
 * AI SDK tools for workflow creation via chat.
 * Leverages @contractspec/lib.workflow-composer for validation and composition.
 */

import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import {
	type StepInjection,
	validateExtension,
	WorkflowComposer,
	type WorkflowExtension,
} from '@contractspec/lib.workflow-composer';
import { type ToolSet, tool } from 'ai';
import { z } from 'zod';

const StepTypeSchema = z.enum(['human', 'automation', 'decision']);
const StepActionSchema = z
	.object({
		operation: z
			.object({
				name: z.string(),
				version: z.number(),
			})
			.optional(),
		form: z
			.object({
				key: z.string(),
				version: z.number(),
			})
			.optional(),
	})
	.optional();

const StepSchema = z.object({
	id: z.string(),
	type: StepTypeSchema,
	label: z.string(),
	description: z.string().optional(),
	action: StepActionSchema,
});

const StepInjectionSchema = z.object({
	after: z.string().optional(),
	before: z.string().optional(),
	inject: StepSchema,
	transitionTo: z.string().optional(),
	transitionFrom: z.string().optional(),
	when: z.string().optional(),
});

const WorkflowExtensionInputSchema = z.object({
	workflow: z.string(),
	tenantId: z.string().optional(),
	role: z.string().optional(),
	priority: z.number().optional(),
	customSteps: z.array(StepInjectionSchema).optional(),
	hiddenSteps: z.array(z.string()).optional(),
});

export interface WorkflowToolsConfig {
	/** Base workflows keyed by meta.key for compose and validate */
	baseWorkflows: WorkflowSpec[];
	/** Optional pre-configured composer with extensions; if not provided, a fresh one is used per compose */
	composer?: WorkflowComposer;
}

/**
 * Create AI SDK tools for workflow creation.
 * Tools: create_workflow_extension, compose_workflow, generate_workflow_spec_code.
 */
export function createWorkflowTools(config: WorkflowToolsConfig): ToolSet {
	const { baseWorkflows, composer } = config;
	const baseByKey = new Map(baseWorkflows.map((b) => [b.meta.key, b]));

	const createWorkflowExtensionTool = tool({
		description:
			'Create or validate a workflow extension. Use when the user asks to add steps, modify a workflow, or create a tenant-specific extension. The extension targets an existing base workflow.',
		inputSchema: WorkflowExtensionInputSchema,
		execute: async (input: z.infer<typeof WorkflowExtensionInputSchema>) => {
			const extension: WorkflowExtension = {
				workflow: input.workflow,
				tenantId: input.tenantId,
				role: input.role,
				priority: input.priority,
				customSteps: input.customSteps as StepInjection[] | undefined,
				hiddenSteps: input.hiddenSteps,
			};

			const base = baseByKey.get(input.workflow);
			if (!base) {
				return {
					success: false,
					error: `Base workflow "${input.workflow}" not found. Available: ${Array.from(baseByKey.keys()).join(', ')}`,
					extension,
				};
			}

			try {
				validateExtension(extension, base);
				return {
					success: true,
					message: 'Extension validated successfully',
					extension,
				};
			} catch (err) {
				return {
					success: false,
					error: err instanceof Error ? err.message : String(err),
					extension,
				};
			}
		},
	});

	const composeWorkflowInputSchema = z.object({
		workflowKey: z.string().describe('Base workflow meta.key'),
		tenantId: z.string().optional(),
		role: z.string().optional(),
		extensions: z
			.array(WorkflowExtensionInputSchema)
			.optional()
			.describe('Extensions to register before composing'),
	});

	const composeWorkflowTool = tool({
		description:
			'Compose a workflow by applying registered extensions to a base workflow. Returns the composed WorkflowSpec.',
		inputSchema: composeWorkflowInputSchema,
		execute: async (input: z.infer<typeof composeWorkflowInputSchema>) => {
			const base = baseByKey.get(input.workflowKey);
			if (!base) {
				return {
					success: false,
					error: `Base workflow "${input.workflowKey}" not found. Available: ${Array.from(baseByKey.keys()).join(', ')}`,
				};
			}

			const comp = composer ?? new WorkflowComposer();
			if (input.extensions?.length) {
				for (const ext of input.extensions) {
					comp.register({
						workflow: ext.workflow,
						tenantId: ext.tenantId,
						role: ext.role,
						priority: ext.priority,
						customSteps: ext.customSteps as StepInjection[] | undefined,
						hiddenSteps: ext.hiddenSteps,
					});
				}
			}

			try {
				const composed = comp.compose({
					base,
					tenantId: input.tenantId,
					role: input.role,
				});
				return {
					success: true,
					workflow: composed,
					meta: composed.meta,
					stepIds: composed.definition.steps.map((s) => s.id),
				};
			} catch (err) {
				return {
					success: false,
					error: err instanceof Error ? err.message : String(err),
				};
			}
		},
	});

	const generateWorkflowSpecCodeInputSchema = z.object({
		workflowKey: z.string().describe('Workflow meta.key'),
		composedSteps: z
			.array(
				z.object({
					id: z.string(),
					type: z.enum(['human', 'automation', 'decision']),
					label: z.string(),
					description: z.string().optional(),
				})
			)
			.optional()
			.describe('Steps to include; if omitted, uses the base workflow'),
	});

	const generateWorkflowSpecCodeTool = tool({
		description:
			'Generate TypeScript code for a workflow spec. Use after composing a workflow to output the spec as code the user can save.',
		inputSchema: generateWorkflowSpecCodeInputSchema,
		execute: async (
			input: z.infer<typeof generateWorkflowSpecCodeInputSchema>
		) => {
			const base = baseByKey.get(input.workflowKey);
			if (!base) {
				return {
					success: false,
					error: `Base workflow "${input.workflowKey}" not found. Available: ${Array.from(baseByKey.keys()).join(', ')}`,
					code: null,
				};
			}

			const steps = input.composedSteps ?? base.definition.steps;
			const specVarName =
				toPascalCase((base.meta.key.split('.').pop() ?? 'Workflow') + '') +
				'Workflow';

			const stepsCode = steps
				.map(
					(s: {
						id: string;
						type: string;
						label: string;
						description?: string;
					}) =>
						`    {
      id: '${s.id}',
      type: '${s.type}',
      label: '${escapeString(s.label)}',${s.description ? `\n      description: '${escapeString(s.description)}',` : ''}
    }`
				)
				.join(',\n');

			const meta = base.meta as { title?: string; description?: string };
			const transitionsJson = JSON.stringify(
				base.definition.transitions,
				null,
				6
			);

			const code = `import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow/spec';

/**
 * Workflow: ${base.meta.key}
 * Generated via AI chat workflow tools.
 */
export const ${specVarName}: WorkflowSpec = {
  meta: {
    key: '${base.meta.key}',
    version: '${String(base.meta.version)}',
    title: '${escapeString(meta.title ?? base.meta.key)}',
    description: '${escapeString(meta.description ?? '')}',
  },
  definition: {
    entryStepId: '${base.definition.entryStepId ?? base.definition.steps[0]?.id ?? ''}',
    steps: [
${stepsCode}
    ],
    transitions: ${transitionsJson},
  },
};
`;

			return {
				success: true,
				code,
				workflowKey: input.workflowKey,
			};
		},
	});

	return {
		create_workflow_extension: createWorkflowExtensionTool,
		compose_workflow: composeWorkflowTool,
		generate_workflow_spec_code: generateWorkflowSpecCodeTool,
	} as ToolSet;
}

function toPascalCase(value: string): string {
	return value
		.split(/[-_.]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function escapeString(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
