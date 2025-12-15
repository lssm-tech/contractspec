import type { LocalDatabase } from '../../database/sqlite-wasm';

export async function seedWorkflowSystem(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM workflow_definition WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const organizationId = 'wf_org_1';

  const workflows = [
    {
      id: 'wf_def_1',
      name: 'Purchase Request Approval',
      description: 'Multi-level approval for purchase requests above $1000',
      type: 'APPROVAL',
      status: 'ACTIVE',
    },
    {
      id: 'wf_def_2',
      name: 'Employee Onboarding',
      description: 'Sequential tasks for new hire onboarding',
      type: 'SEQUENTIAL',
      status: 'ACTIVE',
    },
    {
      id: 'wf_def_3',
      name: 'Content Publishing',
      description: 'Review and approval workflow for content',
      type: 'APPROVAL',
      status: 'DRAFT',
    },
  ] as const;

  for (const wf of workflows) {
    await db.run(
      `INSERT INTO workflow_definition (id, projectId, organizationId, name, description, type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        wf.id,
        projectId,
        organizationId,
        wf.name,
        wf.description,
        wf.type,
        wf.status,
      ]
    );
  }

  const steps = [
    {
      id: 'wf_step_1',
      definitionId: 'wf_def_1',
      name: 'Manager Approval',
      type: 'APPROVAL',
      requiredRoles: ['manager'],
      stepOrder: 1,
    },
    {
      id: 'wf_step_2',
      definitionId: 'wf_def_1',
      name: 'Finance Review',
      type: 'APPROVAL',
      requiredRoles: ['finance'],
      stepOrder: 2,
    },
    {
      id: 'wf_step_3',
      definitionId: 'wf_def_1',
      name: 'Executive Sign-off',
      type: 'APPROVAL',
      requiredRoles: ['executive'],
      stepOrder: 3,
    },
  ] as const;

  for (const step of steps) {
    await db.run(
      `INSERT INTO workflow_step (id, definitionId, name, type, requiredRoles, stepOrder)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        step.id,
        step.definitionId,
        step.name,
        step.type,
        JSON.stringify(step.requiredRoles),
        step.stepOrder,
      ]
    );
  }

  const instances = [
    { id: 'wf_inst_1', definitionId: 'wf_def_1', status: 'IN_PROGRESS', requestedBy: 'user-1' },
    { id: 'wf_inst_2', definitionId: 'wf_def_1', status: 'COMPLETED', requestedBy: 'user-2' },
    { id: 'wf_inst_3', definitionId: 'wf_def_1', status: 'REJECTED', requestedBy: 'user-3' },
  ] as const;

  for (const inst of instances) {
    await db.run(
      `INSERT INTO workflow_instance (id, projectId, definitionId, status, requestedBy)
       VALUES (?, ?, ?, ?, ?)`,
      [inst.id, projectId, inst.definitionId, inst.status, inst.requestedBy]
    );
  }
}



