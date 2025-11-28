/**
 * Markdown renderers for Workflow System presentations
 */
import type { PresentationRenderer } from '@lssm/lib.contracts';

// Mock data for workflow rendering
const mockWorkflowDefinitions = [
  {
    id: 'wf-1',
    name: 'Purchase Approval',
    type: 'APPROVAL',
    steps: [
      { id: 's1', name: 'Manager Review', order: 1, requiredRoles: ['manager'] },
      { id: 's2', name: 'Finance Review', order: 2, requiredRoles: ['finance'] },
      { id: 's3', name: 'Final Approval', order: 3, requiredRoles: ['admin'] },
    ],
    status: 'ACTIVE',
  },
  {
    id: 'wf-2',
    name: 'Leave Request',
    type: 'APPROVAL',
    steps: [
      { id: 's1', name: 'Supervisor Approval', order: 1, requiredRoles: ['supervisor'] },
      { id: 's2', name: 'HR Review', order: 2, requiredRoles: ['hr'] },
    ],
    status: 'ACTIVE',
  },
  {
    id: 'wf-3',
    name: 'Document Review',
    type: 'SEQUENTIAL',
    steps: [
      { id: 's1', name: 'Author Review', order: 1, requiredRoles: ['author'] },
      { id: 's2', name: 'Peer Review', order: 2, requiredRoles: ['reviewer'] },
      { id: 's3', name: 'Publish', order: 3, requiredRoles: ['publisher'] },
    ],
    status: 'DRAFT',
  },
];

const mockWorkflowInstances = [
  {
    id: 'inst-1',
    definitionId: 'wf-1',
    definitionName: 'Purchase Approval',
    status: 'IN_PROGRESS',
    currentStepId: 's2',
    startedAt: '2024-01-15T10:00:00Z',
    requestedBy: 'John Doe',
  },
  {
    id: 'inst-2',
    definitionId: 'wf-1',
    definitionName: 'Purchase Approval',
    status: 'COMPLETED',
    currentStepId: null,
    startedAt: '2024-01-10T09:00:00Z',
    completedAt: '2024-01-12T14:00:00Z',
    requestedBy: 'Jane Smith',
  },
  {
    id: 'inst-3',
    definitionId: 'wf-2',
    definitionName: 'Leave Request',
    status: 'PENDING',
    currentStepId: 's1',
    startedAt: '2024-01-16T08:00:00Z',
    requestedBy: 'Bob Wilson',
  },
];

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
      throw new Error('workflowDashboardMarkdownRenderer: not WorkflowDashboard');
    }

    const definitions = mockWorkflowDefinitions;
    const instances = mockWorkflowInstances;

    // Calculate stats
    const activeDefinitions = definitions.filter((d) => d.status === 'ACTIVE');
    const pendingInstances = instances.filter((i) => i.status === 'PENDING');
    const inProgressInstances = instances.filter((i) => i.status === 'IN_PROGRESS');
    const completedInstances = instances.filter((i) => i.status === 'COMPLETED');

    const lines: string[] = [
      '# Workflow Dashboard',
      '',
      '> Workflow and approval management overview',
      '',
      '## Summary',
      '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Active Workflows | ${activeDefinitions.length} |`,
      `| Pending Approvals | ${pendingInstances.length} |`,
      `| In Progress | ${inProgressInstances.length} |`,
      `| Completed | ${completedInstances.length} |`,
      '',
      '## Active Workflow Definitions',
      '',
    ];

    if (activeDefinitions.length === 0) {
      lines.push('_No active workflow definitions._');
    } else {
      lines.push('| Name | Type | Steps | Status |');
      lines.push('|------|------|-------|--------|');
      for (const def of activeDefinitions) {
        lines.push(`| ${def.name} | ${def.type} | ${def.steps.length} | ${def.status} |`);
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
        const startedDate = new Date(inst.startedAt).toLocaleDateString();
        lines.push(`| ${inst.definitionName} | ${inst.requestedBy} | ${inst.status} | ${startedDate} |`);
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
      throw new Error('workflowDefinitionListMarkdownRenderer: not WorkflowDefinitionList');
    }

    const definitions = mockWorkflowDefinitions;

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
        lines.push(`${step.order}. **${step.name}** - Roles: ${step.requiredRoles.join(', ')}`);
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
      throw new Error('workflowInstanceDetailMarkdownRenderer: not WorkflowInstanceDetail');
    }

    const instance = mockWorkflowInstances[0];
    const definition = mockWorkflowDefinitions.find((d) => d.id === instance.definitionId);

    const lines: string[] = [
      `# Workflow: ${instance.definitionName}`,
      '',
      `**Instance ID:** ${instance.id}`,
      `**Status:** ${instance.status}`,
      `**Requested By:** ${instance.requestedBy}`,
      `**Started:** ${new Date(instance.startedAt).toLocaleString()}`,
      '',
      '## Steps Progress',
      '',
    ];

    if (definition) {
      for (const step of definition.steps) {
        const isCurrent = step.id === instance.currentStepId;
        const isCompleted = definition.steps.indexOf(step) < 
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
    lines.push('- **Reject** - Reject and return');
    lines.push('- **Delegate** - Assign to another approver');

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

