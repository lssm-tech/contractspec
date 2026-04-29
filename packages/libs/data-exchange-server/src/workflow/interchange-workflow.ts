import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import type {
	DataExchangeTemplate,
	InterchangeSource,
	InterchangeTarget,
} from '@contractspec/lib.data-exchange-core';

export const interchangeWorkflowStepIds = {
	profile: 'profile-source',
	inferMapping: 'infer-mapping',
	preview: 'preview',
	approve: 'approve',
	execute: 'execute',
	reconcile: 'reconcile',
	audit: 'export-audit',
} as const;

export function createInterchangeWorkflowSpec(args: {
	key: string;
	version: string;
	title: string;
	description: string;
	source: InterchangeSource;
	target: InterchangeTarget;
	template?: DataExchangeTemplate;
}): WorkflowSpec {
	return {
		meta: {
			key: args.key,
			version: args.version,
			title: args.title,
			description: args.description,
			domain: 'data-exchange',
			owners: ['@contractspec-core'],
			tags: ['workflow', 'data-exchange'],
			stability: 'experimental',
		},
		definition: {
			entryStepId: interchangeWorkflowStepIds.profile,
			steps: [
				{
					id: interchangeWorkflowStepIds.profile,
					type: 'automation',
					label: 'Profile source',
				},
				{
					id: interchangeWorkflowStepIds.inferMapping,
					type: 'automation',
					label: 'Infer mapping',
				},
				{
					id: interchangeWorkflowStepIds.preview,
					type: 'automation',
					label: 'Preview changes',
				},
				{
					id: interchangeWorkflowStepIds.approve,
					type: 'human',
					label: 'Approve execution',
				},
				{
					id: interchangeWorkflowStepIds.execute,
					type: 'automation',
					label: 'Execute interchange',
				},
				{
					id: interchangeWorkflowStepIds.reconcile,
					type: 'decision',
					label: 'Reconcile results',
				},
				{
					id: interchangeWorkflowStepIds.audit,
					type: 'automation',
					label: 'Export audit',
				},
			],
			transitions: [
				{
					from: interchangeWorkflowStepIds.profile,
					to: interchangeWorkflowStepIds.inferMapping,
				},
				{
					from: interchangeWorkflowStepIds.inferMapping,
					to: interchangeWorkflowStepIds.preview,
				},
				{
					from: interchangeWorkflowStepIds.preview,
					to: interchangeWorkflowStepIds.approve,
				},
				{
					from: interchangeWorkflowStepIds.approve,
					to: interchangeWorkflowStepIds.execute,
				},
				{
					from: interchangeWorkflowStepIds.execute,
					to: interchangeWorkflowStepIds.reconcile,
				},
				{
					from: interchangeWorkflowStepIds.reconcile,
					to: interchangeWorkflowStepIds.audit,
				},
			],
		},
		runtime: {
			capabilities: {
				checkpointing: true,
				suspendResume: true,
				approvalGateway: true,
			},
		},
		metadata: {
			sourceKind: args.source.kind,
			targetKind: args.target.kind,
			templateKey: args.template?.key,
			templateVersion: args.template?.version,
		},
	};
}
