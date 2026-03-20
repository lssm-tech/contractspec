export const WORKFLOW_SYSTEM_DEMO_PROJECT_ID = 'workflow-system-demo';
export const WORKFLOW_SYSTEM_DEMO_ORGANIZATION_ID = 'org_demo';

export interface WorkflowSystemDemoStep {
	id: string;
	name: string;
	description: string;
	stepOrder: number;
	type: 'APPROVAL' | 'TASK' | 'NOTIFICATION';
	requiredRoles: string[];
	createdAt: string;
}

export interface WorkflowSystemDemoDefinition {
	id: string;
	name: string;
	description: string;
	type: 'APPROVAL' | 'SEQUENTIAL' | 'PARALLEL';
	status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
	createdAt: string;
	updatedAt: string;
	steps: WorkflowSystemDemoStep[];
}

export interface WorkflowSystemDemoApproval {
	id: string;
	stepId: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
	actorId?: string;
	comment?: string;
	decidedAt?: string;
	createdAt: string;
}

export interface WorkflowSystemDemoInstance {
	id: string;
	definitionId: string;
	status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
	currentStepId?: string;
	data?: Record<string, unknown>;
	requestedBy: string;
	startedAt: string;
	completedAt?: string;
	approvals: WorkflowSystemDemoApproval[];
}

export const WORKFLOW_SYSTEM_DEMO_DEFINITIONS: WorkflowSystemDemoDefinition[] =
	[
		{
			id: 'wf_expense',
			name: 'Expense Approval',
			description: 'Approve non-trivial spend before finance releases budget.',
			type: 'APPROVAL',
			status: 'ACTIVE',
			createdAt: '2026-03-10T09:00:00.000Z',
			updatedAt: '2026-03-20T08:15:00.000Z',
			steps: [
				{
					id: 'wfstep_expense_manager',
					name: 'Manager Review',
					description: 'Validate business value and team budget.',
					stepOrder: 1,
					type: 'APPROVAL',
					requiredRoles: ['manager'],
					createdAt: '2026-03-10T09:00:00.000Z',
				},
				{
					id: 'wfstep_expense_finance',
					name: 'Finance Review',
					description: 'Confirm ledger coding and spending threshold.',
					stepOrder: 2,
					type: 'APPROVAL',
					requiredRoles: ['finance'],
					createdAt: '2026-03-10T09:10:00.000Z',
				},
			],
		},
		{
			id: 'wf_vendor',
			name: 'Vendor Onboarding',
			description:
				'Sequence security, procurement, and legal before activation.',
			type: 'SEQUENTIAL',
			status: 'ACTIVE',
			createdAt: '2026-03-08T11:00:00.000Z',
			updatedAt: '2026-03-19T13:10:00.000Z',
			steps: [
				{
					id: 'wfstep_vendor_security',
					name: 'Security Check',
					description: 'Review data access and integration scope.',
					stepOrder: 1,
					type: 'APPROVAL',
					requiredRoles: ['security'],
					createdAt: '2026-03-08T11:00:00.000Z',
				},
				{
					id: 'wfstep_vendor_procurement',
					name: 'Procurement Check',
					description: 'Validate pricing, procurement policy, and owner.',
					stepOrder: 2,
					type: 'APPROVAL',
					requiredRoles: ['procurement'],
					createdAt: '2026-03-08T11:05:00.000Z',
				},
				{
					id: 'wfstep_vendor_legal',
					name: 'Legal Sign-off',
					description: 'Approve terms before the vendor goes live.',
					stepOrder: 3,
					type: 'APPROVAL',
					requiredRoles: ['legal'],
					createdAt: '2026-03-08T11:10:00.000Z',
				},
			],
		},
		{
			id: 'wf_policy_exception',
			name: 'Policy Exception',
			description:
				'Escalate a temporary exception through team lead and compliance.',
			type: 'APPROVAL',
			status: 'DRAFT',
			createdAt: '2026-03-15T07:30:00.000Z',
			updatedAt: '2026-03-18T11:20:00.000Z',
			steps: [
				{
					id: 'wfstep_policy_lead',
					name: 'Team Lead Review',
					description: 'Check urgency and expected blast radius.',
					stepOrder: 1,
					type: 'APPROVAL',
					requiredRoles: ['team-lead'],
					createdAt: '2026-03-15T07:30:00.000Z',
				},
				{
					id: 'wfstep_policy_compliance',
					name: 'Compliance Review',
					description: 'Accept or reject the exception request.',
					stepOrder: 2,
					type: 'APPROVAL',
					requiredRoles: ['compliance'],
					createdAt: '2026-03-15T07:40:00.000Z',
				},
			],
		},
	];

export const WORKFLOW_SYSTEM_DEMO_INSTANCES: WorkflowSystemDemoInstance[] = [
	{
		id: 'wfinst_expense_open',
		definitionId: 'wf_expense',
		status: 'IN_PROGRESS',
		currentStepId: 'wfstep_expense_finance',
		data: {
			amount: 4200,
			currency: 'EUR',
			vendor: 'Nimbus AI',
		},
		requestedBy: 'sarah@contractspec.io',
		startedAt: '2026-03-20T08:00:00.000Z',
		approvals: [
			{
				id: 'wfappr_expense_manager',
				stepId: 'wfstep_expense_manager',
				status: 'APPROVED',
				actorId: 'manager.demo',
				comment: 'Approved for the Q2 automation budget.',
				decidedAt: '2026-03-20T08:15:00.000Z',
				createdAt: '2026-03-20T08:05:00.000Z',
			},
			{
				id: 'wfappr_expense_finance',
				stepId: 'wfstep_expense_finance',
				status: 'PENDING',
				createdAt: '2026-03-20T08:15:00.000Z',
			},
		],
	},
	{
		id: 'wfinst_vendor_done',
		definitionId: 'wf_vendor',
		status: 'COMPLETED',
		data: {
			vendor: 'Acme Cloud',
			riskTier: 'medium',
		},
		requestedBy: 'leo@contractspec.io',
		startedAt: '2026-03-19T09:30:00.000Z',
		completedAt: '2026-03-19T13:10:00.000Z',
		approvals: [
			{
				id: 'wfappr_vendor_security',
				stepId: 'wfstep_vendor_security',
				status: 'APPROVED',
				actorId: 'security.demo',
				comment: 'SOC2 scope is acceptable.',
				decidedAt: '2026-03-19T10:10:00.000Z',
				createdAt: '2026-03-19T09:35:00.000Z',
			},
			{
				id: 'wfappr_vendor_procurement',
				stepId: 'wfstep_vendor_procurement',
				status: 'APPROVED',
				actorId: 'procurement.demo',
				comment: 'Commercial terms match the preferred vendor tier.',
				decidedAt: '2026-03-19T11:25:00.000Z',
				createdAt: '2026-03-19T10:15:00.000Z',
			},
			{
				id: 'wfappr_vendor_legal',
				stepId: 'wfstep_vendor_legal',
				status: 'APPROVED',
				actorId: 'legal.demo',
				comment: 'MSA redlines are complete.',
				decidedAt: '2026-03-19T13:05:00.000Z',
				createdAt: '2026-03-19T11:30:00.000Z',
			},
		],
	},
	{
		id: 'wfinst_policy_rejected',
		definitionId: 'wf_policy_exception',
		status: 'REJECTED',
		currentStepId: 'wfstep_policy_compliance',
		data: {
			policy: 'Model rollout freeze',
			durationDays: 14,
		},
		requestedBy: 'maya@contractspec.io',
		startedAt: '2026-03-18T10:00:00.000Z',
		completedAt: '2026-03-18T11:20:00.000Z',
		approvals: [
			{
				id: 'wfappr_policy_lead',
				stepId: 'wfstep_policy_lead',
				status: 'APPROVED',
				actorId: 'lead.demo',
				comment: 'Escalation justified for the release train.',
				decidedAt: '2026-03-18T10:30:00.000Z',
				createdAt: '2026-03-18T10:05:00.000Z',
			},
			{
				id: 'wfappr_policy_compliance',
				stepId: 'wfstep_policy_compliance',
				status: 'REJECTED',
				actorId: 'compliance.demo',
				comment: 'Exception exceeds the allowed blast radius.',
				decidedAt: '2026-03-18T11:15:00.000Z',
				createdAt: '2026-03-18T10:35:00.000Z',
			},
		],
	},
];
