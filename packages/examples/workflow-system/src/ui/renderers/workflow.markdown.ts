/**
 * Markdown renderers for Workflow System presentations
 */
import type { PresentationRenderer } from '@contractspec/lib.presentation-runtime-core/transform-engine';
import {
	WORKFLOW_SYSTEM_DEMO_DEFINITIONS,
	WORKFLOW_SYSTEM_DEMO_INSTANCES,
} from '../../shared/demo-scenario';
import { createWorkflowVisualizationSections } from '../../visualizations';

const workflowDefinitions = WORKFLOW_SYSTEM_DEMO_DEFINITIONS;
const workflowInstances = WORKFLOW_SYSTEM_DEMO_INSTANCES;
const workflowDefinitionById = new Map(
	workflowDefinitions.map((definition) => [definition.id, definition])
);

function formatDate(value: string) {
	return new Date(value).toISOString().slice(0, 10);
}

/**
 * Markdown renderer for Workflow Dashboard
 */
export const workflowDashboardMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc) => {
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'WorkflowDashboard'
		) {
			throw new Error(
				'workflowDashboardMarkdownRenderer: not WorkflowDashboard'
			);
		}

		const definitions = workflowDefinitions;
		const instances = workflowInstances;
		const visualizations = createWorkflowVisualizationSections(instances);

		// Calculate stats
		const activeDefinitions = definitions.filter((d) => d.status === 'ACTIVE');
		const awaitingActionInstances = instances.filter(
			(i) => i.status === 'PENDING' || i.status === 'IN_PROGRESS'
		);

		const lines: string[] = [
			'# Workflow Dashboard',
			'',
			'> Seeded workflow and approval overview for the sandbox demo.',
			'',
			'## Summary',
			'',
			'| Metric | Value |',
			'|--------|-------|',
			`| Active Workflows | ${activeDefinitions.length} |`,
			`| Awaiting Action | ${awaitingActionInstances.length} |`,
			`| Completed | ${instances.filter((i) => i.status === 'COMPLETED').length} |`,
			`| Rejected | ${instances.filter((i) => i.status === 'REJECTED').length} |`,
			'',
		];

		lines.push('## Visualization Overview');
		lines.push('');
		for (const item of [
			...visualizations.primaryItems,
			...visualizations.comparisonItems,
		]) {
			lines.push(`- **${item.title}** via \`${item.spec.meta.key}\``);
		}

		lines.push('');
		lines.push('## Active Workflow Definitions');
		lines.push('');

		if (activeDefinitions.length === 0) {
			lines.push('_No active workflow definitions._');
		} else {
			lines.push('| Name | Type | Steps | Status |');
			lines.push('|------|------|-------|--------|');
			for (const def of activeDefinitions) {
				lines.push(
					`| ${def.name} | ${def.type} | ${def.steps.length} | ${def.status} |`
				);
			}
		}

		lines.push('');
		lines.push('## Recent Instances');
		lines.push('');

		if (instances.length === 0) {
			lines.push('_No workflow instances._');
		} else {
			lines.push('| Workflow | Requested By | Status | Started |');
			lines.push('|----------|--------------|--------|---------|');
			for (const inst of instances.slice(0, 10)) {
				const startedDate = formatDate(inst.startedAt);
				const definitionName =
					workflowDefinitionById.get(inst.definitionId)?.name ??
					inst.definitionId;
				lines.push(
					`| ${definitionName} | ${inst.requestedBy} | ${inst.status} | ${startedDate} |`
				);
			}
		}

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};

/**
 * Markdown renderer for Workflow Definition List
 */
export const workflowDefinitionListMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc) => {
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'WorkflowDefinitionList'
		) {
			throw new Error(
				'workflowDefinitionListMarkdownRenderer: not WorkflowDefinitionList'
			);
		}

		const definitions = workflowDefinitions;

		const lines: string[] = [
			'# Workflow Definitions',
			'',
			'> Configure automated approval and process workflows',
			'',
		];

		for (const def of definitions) {
			lines.push(`## ${def.name}`);
			lines.push('');
			lines.push(`**Type:** ${def.type} | **Status:** ${def.status}`);
			lines.push('');
			lines.push('### Steps');
			lines.push('');

			for (const step of def.steps) {
				lines.push(
					`${step.stepOrder}. **${step.name}** - Roles: ${step.requiredRoles.join(', ')}`
				);
			}

			lines.push('');
		}

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};

/**
 * Markdown renderer for Workflow Instance Detail
 */
export const workflowInstanceDetailMarkdownRenderer: PresentationRenderer<{
	mimeType: string;
	body: string;
}> = {
	target: 'markdown',
	render: async (desc) => {
		if (
			desc.source.type !== 'component' ||
			desc.source.componentKey !== 'WorkflowInstanceDetail'
		) {
			throw new Error(
				'workflowInstanceDetailMarkdownRenderer: not WorkflowInstanceDetail'
			);
		}

		const instance =
			workflowInstances.find(
				(workflowInstance) => workflowInstance.status === 'IN_PROGRESS'
			) ?? workflowInstances[0];
		if (!instance) {
			return {
				mimeType: 'text/markdown',
				body: '# No Workflow Instances\n\nNo workflow instances available.',
			};
		}
		const definition = workflowDefinitions.find(
			(d) => d.id === instance.definitionId
		);

		const lines: string[] = [
			`# Workflow: ${definition?.name ?? instance.definitionId}`,
			'',
			`**Instance ID:** ${instance.id}`,
			`**Status:** ${instance.status}`,
			`**Requested By:** ${instance.requestedBy}`,
			`**Started:** ${formatDate(instance.startedAt)}`,
			'',
			'## Steps Progress',
			'',
		];

		if (definition) {
			for (const step of definition.steps) {
				const isCurrent = step.id === instance.currentStepId;
				const isCompleted =
					definition.steps.indexOf(step) <
					definition.steps.findIndex((s) => s.id === instance.currentStepId);

				let status = '⬜ Pending';
				if (isCompleted) status = '✅ Completed';
				if (isCurrent) status = '🔄 In Progress';

				lines.push(`- ${status} **${step.name}**`);
			}
		}

		lines.push('');
		lines.push('## Actions');
		lines.push('');
		lines.push('- **Approve** - Move to next step');
		lines.push('- **Reject** - End the workflow with a rejection outcome');
		lines.push('- **Delegate** - Assign to another approver');

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};
