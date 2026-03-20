import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';
import {
	WORKFLOW_SYSTEM_DEMO_DEFINITIONS,
	WORKFLOW_SYSTEM_DEMO_INSTANCES,
	WORKFLOW_SYSTEM_DEMO_ORGANIZATION_ID,
} from '../shared/demo-scenario';

async function seedDefinitions(projectId: string, db: DatabasePort) {
	for (const definition of WORKFLOW_SYSTEM_DEMO_DEFINITIONS) {
		await db.execute(
			`INSERT INTO workflow_definition (id, "projectId", "organizationId", name, description, type, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			[
				definition.id,
				projectId,
				WORKFLOW_SYSTEM_DEMO_ORGANIZATION_ID,
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
}

async function seedInstances(projectId: string, db: DatabasePort) {
	for (const instance of WORKFLOW_SYSTEM_DEMO_INSTANCES) {
		await db.execute(
			`INSERT INTO workflow_instance (id, "projectId", "definitionId", status, "currentStepId", data, "requestedBy", "startedAt", "completedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			[
				instance.id,
				projectId,
				instance.definitionId,
				instance.status,
				instance.currentStepId ?? null,
				instance.data ? JSON.stringify(instance.data) : null,
				instance.requestedBy,
				instance.startedAt,
				instance.completedAt ?? null,
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
					approval.actorId ?? null,
					approval.comment ?? null,
					approval.decidedAt ?? null,
					approval.createdAt,
				]
			);
		}
	}
}

export async function seedWorkflowSystem(params: {
	projectId: string;
	db: DatabasePort;
}) {
	const { projectId, db } = params;

	const existing = await db.query(
		`SELECT COUNT(*) as count FROM workflow_definition WHERE "projectId" = $1`,
		[projectId]
	);
	if ((existing.rows[0]?.count as number) > 0) return;

	await seedDefinitions(projectId, db);
	await seedInstances(projectId, db);
}
