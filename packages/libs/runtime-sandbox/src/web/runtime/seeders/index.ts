/**
 * Seed template data into the sandbox database.
 *
 * Lazy-loads individual seeders to avoid bundle bloat.
 */
import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';
import type { TemplateId } from '../services';

export interface SeedTemplateParams {
	templateId: TemplateId;
	projectId: string;
	db: DatabasePort;
}

/**
 * Seed the database with template-specific data.
 *
 * Unknown templates are a no-op (safe default).
 */
export async function seedTemplate(params: SeedTemplateParams): Promise<void> {
	const { templateId, projectId, db } = params;

	switch (templateId) {
		case 'todos-app':
			return seedTodos({ projectId, db });
		case 'messaging-app':
			return seedMessaging({ projectId, db });
		case 'recipe-app-i18n':
			return seedRecipes({ projectId, db });
		case 'crm-pipeline':
			return seedCrmPipeline({ projectId, db });
		case 'saas-boilerplate':
			return seedSaasBoilerplate({ projectId, db });
		case 'agent-console':
			return seedAgentConsole({ projectId, db });
		case 'workflow-system':
			return seedWorkflowSystem({ projectId, db });
		case 'marketplace':
			return seedMarketplace({ projectId, db });
		case 'integration-hub':
			return seedIntegrationHub({ projectId, db });
		case 'analytics-dashboard':
			return seedAnalyticsDashboard({ projectId, db });
		case 'policy-safe-knowledge-assistant':
			return seedPolicyKnowledgeAssistant({ projectId, db });
		default:
			// Unknown template - no-op
			return;
	}
}

// --------------------------------------------------------------------------
// Individual seeder functions with PostgreSQL syntax
// --------------------------------------------------------------------------

async function seedTodos(params: { projectId: string; db: DatabasePort }) {
	const { projectId, db } = params;

	// Check if already seeded
	const existing = await db.query(
		`SELECT COUNT(*) as count FROM template_task WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	const workCategoryId = 'todo_category_ops';
	const homeCategoryId = 'todo_category_home';

	await db.execute(
		`INSERT INTO template_task_category (id, "projectId", name, color) VALUES ($1, $2, $3, $4)`,
		[workCategoryId, projectId, 'Operations', '#8b5cf6']
	);
	await db.execute(
		`INSERT INTO template_task_category (id, "projectId", name, color) VALUES ($1, $2, $3, $4)`,
		[homeCategoryId, projectId, 'Home', '#f472b6']
	);

	const tasks = [
		{
			id: 'todo_task_1',
			title: 'Review intent signals',
			description: "Scan yesterday's signals and flag the ones to promote.",
			categoryId: workCategoryId,
			priority: 'HIGH',
		},
		{
			id: 'todo_task_2',
			title: 'Schedule studio walkthrough',
			description: "Prep the sandbox before tomorrow's ceremony.",
			categoryId: workCategoryId,
			priority: 'MEDIUM',
		},
		{
			id: 'todo_task_3',
			title: 'Collect testimonials',
			description: "Ask last week's pilot crew for quotes.",
			categoryId: homeCategoryId,
			priority: 'LOW',
		},
	];

	for (const task of tasks) {
		await db.execute(
			`INSERT INTO template_task (id, "projectId", "categoryId", title, description, completed, priority, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			[
				task.id,
				projectId,
				task.categoryId,
				task.title,
				task.description,
				0,
				task.priority,
				JSON.stringify(['demo']),
			]
		);
	}
}

async function seedMessaging(params: { projectId: string; db: DatabasePort }) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM template_conversation WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	const conversationId = 'conv_demo_1';
	const now = new Date().toISOString();

	await db.execute(
		`INSERT INTO template_conversation (id, "projectId", name, "isGroup", "avatarUrl", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6)`,
		[conversationId, projectId, 'Team Chat', 1, null, now]
	);

	// Add participants
	await db.execute(
		`INSERT INTO template_conversation_participant (id, "conversationId", "projectId", "userId", "displayName", role, "joinedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		['part_1', conversationId, projectId, 'user_alice', 'Alice', 'member', now]
	);
	await db.execute(
		`INSERT INTO template_conversation_participant (id, "conversationId", "projectId", "userId", "displayName", role, "joinedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		['part_2', conversationId, projectId, 'user_bob', 'Bob', 'member', now]
	);

	// Add messages
	await db.execute(
		`INSERT INTO template_message (id, "conversationId", "projectId", "senderId", "senderName", content, attachments, status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		[
			'msg_1',
			conversationId,
			projectId,
			'user_alice',
			'Alice',
			'Hey team! Ready for the demo?',
			JSON.stringify([]),
			'DELIVERED',
			now,
			now,
		]
	);
}

async function seedRecipes(params: { projectId: string; db: DatabasePort }) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM template_recipe WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	// Add category
	await db.execute(
		`INSERT INTO template_recipe_category (id, "nameEn", "nameFr", icon) VALUES ($1, $2, $3, $4)`,
		['cat_main', 'Main Courses', 'Plats Principaux', '🍽️']
	);

	// Add recipe
	const recipeId = 'recipe_1';
	await db.execute(
		`INSERT INTO template_recipe (id, "projectId", "categoryId", "slugEn", "slugFr", "nameEn", "nameFr", "descriptionEn", "descriptionFr", "prepTimeMinutes", "cookTimeMinutes", servings, "isFavorite")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
		[
			recipeId,
			projectId,
			'cat_main',
			'grilled-salmon',
			'saumon-grille',
			'Grilled Salmon',
			'Saumon Grillé',
			'Delicious grilled salmon with lemon',
			'Délicieux saumon grillé au citron',
			10,
			15,
			4,
			0,
		]
	);

	// Add ingredients
	await db.execute(
		`INSERT INTO template_recipe_ingredient (id, "recipeId", "nameEn", "nameFr", quantity, ordering)
     VALUES ($1, $2, $3, $4, $5, $6)`,
		['ing_1', recipeId, 'Salmon fillet', 'Filet de saumon', '4 pieces', 1]
	);
	await db.execute(
		`INSERT INTO template_recipe_ingredient (id, "recipeId", "nameEn", "nameFr", quantity, ordering)
     VALUES ($1, $2, $3, $4, $5, $6)`,
		['ing_2', recipeId, 'Lemon', 'Citron', '1 whole', 2]
	);

	// Add instructions
	await db.execute(
		`INSERT INTO template_recipe_instruction (id, "recipeId", "contentEn", "contentFr", ordering)
     VALUES ($1, $2, $3, $4, $5)`,
		[
			'inst_1',
			recipeId,
			'Preheat grill to medium-high heat.',
			'Préchauffer le grill à feu moyen-vif.',
			1,
		]
	);
	await db.execute(
		`INSERT INTO template_recipe_instruction (id, "recipeId", "contentEn", "contentFr", ordering)
     VALUES ($1, $2, $3, $4, $5)`,
		[
			'inst_2',
			recipeId,
			'Season salmon and grill for 4-5 minutes per side.',
			'Assaisonner le saumon et griller 4-5 minutes de chaque côté.',
			2,
		]
	);
}

async function seedCrmPipeline(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM crm_pipeline WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	const pipelineId = 'pipeline_sales';
	await db.execute(
		`INSERT INTO crm_pipeline (id, "projectId", name) VALUES ($1, $2, $3)`,
		[pipelineId, projectId, 'Sales Pipeline']
	);

	const stages = [
		{ id: 'stage_lead', name: 'Lead', position: 1 },
		{ id: 'stage_contact', name: 'Contact Made', position: 2 },
		{ id: 'stage_proposal', name: 'Proposal', position: 3 },
		{ id: 'stage_negotiation', name: 'Negotiation', position: 4 },
		{ id: 'stage_closed', name: 'Closed', position: 5 },
	];

	for (const stage of stages) {
		await db.execute(
			`INSERT INTO crm_stage (id, "pipelineId", name, position) VALUES ($1, $2, $3, $4)`,
			[stage.id, pipelineId, stage.name, stage.position]
		);
	}
}

async function seedSaasBoilerplate(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM saas_project WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await db.execute(
		`INSERT INTO saas_project (id, "projectId", "organizationId", name, description, status, tier)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		[
			'saas_proj_1',
			projectId,
			'org_demo',
			'Demo Project',
			'A demo SaaS project',
			'ACTIVE',
			'PRO',
		]
	);
}

async function seedAgentConsole(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM agent_definition WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await db.execute(
		`INSERT INTO agent_definition (id, "projectId", "organizationId", name, description, "modelProvider", "modelName", status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		[
			'agent_1',
			projectId,
			'org_demo',
			'Demo Agent',
			'A demo AI agent',
			'openai',
			'gpt-4',
			'ACTIVE',
		]
	);
}

async function seedWorkflowSystem(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM workflow_definition WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	const definitions = [
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
			description: 'Sequence security, procurement, and legal before activation.',
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
	] as const;

	const instances = [
		{
			id: 'wfinst_expense_open',
			definitionId: 'wf_expense',
			status: 'IN_PROGRESS',
			currentStepId: 'wfstep_expense_finance',
			data: { amount: 4200, currency: 'EUR', vendor: 'Nimbus AI' },
			requestedBy: 'sarah@contractspec.io',
			startedAt: '2026-03-20T08:00:00.000Z',
			completedAt: null,
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
					actorId: null,
					comment: null,
					decidedAt: null,
					createdAt: '2026-03-20T08:15:00.000Z',
				},
			],
		},
		{
			id: 'wfinst_vendor_done',
			definitionId: 'wf_vendor',
			status: 'COMPLETED',
			currentStepId: null,
			data: { vendor: 'Acme Cloud', riskTier: 'medium' },
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
			data: { policy: 'Model rollout freeze', durationDays: 14 },
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
	] as const;

	for (const definition of definitions) {
		await db.execute(
			`INSERT INTO workflow_definition (id, "projectId", "organizationId", name, description, type, status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			[
				definition.id,
				projectId,
				'org_demo',
				definition.name,
				definition.description,
				definition.type,
				definition.status,
				definition.createdAt,
				definition.updatedAt,
			]
		);

		for (const step of definition.steps) {
			await db.execute(
				`INSERT INTO workflow_step (id, "definitionId", name, description, "stepOrder", type, "requiredRoles", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[
					step.id,
					definition.id,
					step.name,
					step.description,
					step.stepOrder,
					step.type,
					JSON.stringify(step.requiredRoles),
					step.createdAt,
				]
			);
		}
	}

	for (const instance of instances) {
		await db.execute(
			`INSERT INTO workflow_instance (id, "projectId", "definitionId", status, "currentStepId", data, "requestedBy", "startedAt", "completedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			[
				instance.id,
				projectId,
				instance.definitionId,
				instance.status,
				instance.currentStepId,
				JSON.stringify(instance.data),
				instance.requestedBy,
				instance.startedAt,
				instance.completedAt,
			]
		);

		for (const approval of instance.approvals) {
			await db.execute(
				`INSERT INTO workflow_approval (id, "instanceId", "stepId", status, "actorId", comment, "decidedAt", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[
					approval.id,
					instance.id,
					approval.stepId,
					approval.status,
					approval.actorId,
					approval.comment,
					approval.decidedAt,
					approval.createdAt,
				]
			);
		}
	}
}

async function seedMarketplace(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM marketplace_store WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await db.execute(
		`INSERT INTO marketplace_store (id, "projectId", "organizationId", name, description, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
		['store_1', projectId, 'org_demo', 'Demo Store', 'A demo store', 'ACTIVE']
	);
}

async function seedIntegrationHub(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM integration WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await db.execute(
		`INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		[
			'int_1',
			projectId,
			'org_demo',
			'Salesforce',
			'Salesforce CRM integration',
			'CRM',
			'ACTIVE',
		]
	);
}

async function seedAnalyticsDashboard(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM analytics_dashboard WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await db.execute(
		`INSERT INTO analytics_dashboard (id, "projectId", "organizationId", name, slug, description, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		[
			'dash_1',
			projectId,
			'org_demo',
			'Sales Overview',
			'sales-overview',
			'Sales performance dashboard',
			'PUBLISHED',
		]
	);
}

async function seedPolicyKnowledgeAssistant(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM psa_user_context WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await db.execute(
		`INSERT INTO psa_user_context ("projectId", locale, jurisdiction, "allowedScope")
     VALUES ($1, $2, $3, $4)`,
		[projectId, 'en-GB', 'EU', 'education_only']
	);
}
