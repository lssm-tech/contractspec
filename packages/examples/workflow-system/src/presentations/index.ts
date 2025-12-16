/**
 * Workflow System Presentation Descriptors
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { WorkflowDefinitionModel } from '../workflow/workflow.schema';
import { WorkflowInstanceModel } from '../instance/instance.schema';
import { ApprovalRequestModel } from '../approval/approval.schema';

// ============ Workflow Definition Presentations ============

/**
 * Workflow designer canvas for building workflows.
 */
export const WorkflowDesignerPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.designer',
    version: 1,
    description: 'Visual workflow designer with drag-and-drop steps',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'designer', 'admin'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowDesigner',
    props: WorkflowDefinitionModel,
  },
  targets: ['react'],
  policy: {
    flags: ['workflow.designer.enabled'],
  },
};

/**
 * List of workflow definitions.
 */
export const WorkflowListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.definition.list',
    version: 1,
    description: 'List of workflow definitions with status and actions',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'list', 'admin'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowDefinitionList',
    props: WorkflowDefinitionModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.enabled'],
  },
};

/**
 * Workflow definition detail view.
 */
export const WorkflowDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.definition.detail',
    version: 1,
    description: 'Detailed view of a workflow definition with steps',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowDefinitionDetail',
    props: WorkflowDefinitionModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.enabled'],
  },
};

// ============ Workflow Instance Presentations ============

/**
 * List of running workflow instances.
 */
export const InstanceListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.instance.list',
    version: 1,
    description: 'List of workflow instances with status and progress',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'instance', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowInstanceList',
    props: WorkflowInstanceModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.enabled'],
  },
};

/**
 * Workflow instance detail view with timeline.
 */
export const InstanceDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.instance.detail',
    version: 1,
    description: 'Detailed view of a workflow instance with step timeline',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'instance', 'detail', 'timeline'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowInstanceDetail',
    props: WorkflowInstanceModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.enabled'],
  },
};

/**
 * Workflow progress tracker widget.
 */
export const ProgressTrackerPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.instance.progress',
    version: 1,
    description: 'Visual progress tracker showing current step in workflow',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'progress', 'widget'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowProgressTracker',
    props: WorkflowInstanceModel,
  },
  targets: ['react'],
  policy: {
    flags: ['workflow.enabled'],
  },
};

// ============ Approval Presentations ============

/**
 * Approval inbox - list of pending approvals.
 */
export const ApprovalInboxPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.approval.inbox',
    version: 1,
    description: 'Inbox showing pending approval requests for current user',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'approval', 'inbox'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ApprovalInbox',
    props: ApprovalRequestModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.approvals.enabled'],
  },
};

/**
 * Approval request detail view.
 */
export const ApprovalDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.approval.detail',
    version: 1,
    description: 'Detailed approval request view with context and actions',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'approval', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ApprovalRequestDetail',
    props: ApprovalRequestModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.approvals.enabled'],
  },
};

/**
 * Approval decision form.
 */
export const ApprovalFormPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.approval.form',
    version: 1,
    description: 'Form for submitting approval decisions',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'approval', 'form'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ApprovalDecisionForm',
  },
  targets: ['react'],
  policy: {
    flags: ['workflow.approvals.enabled'],
  },
};

// ============ Dashboard Widgets ============

/**
 * Pending approvals count badge.
 */
export const PendingApprovalsBadgePresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.approval.badge',
    version: 1,
    description: 'Badge showing count of pending approvals',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'approval', 'badge', 'widget'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'PendingApprovalsBadge',
  },
  targets: ['react'],
  policy: {
    flags: ['workflow.approvals.enabled'],
  },
};

/**
 * Workflow metrics dashboard widget.
 */
export const WorkflowMetricsPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'workflow.metrics',
    version: 1,
    description: 'Dashboard widget showing workflow metrics and statistics',
    domain: 'workflow-system',
    owners: ['workflow-team'],
    tags: ['workflow', 'metrics', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WorkflowMetricsDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['workflow.metrics.enabled'],
  },
};

// ============ All Presentations ============

export const WorkflowSystemPresentations = {
  // Definition
  WorkflowDesignerPresentation,
  WorkflowListPresentation,
  WorkflowDetailPresentation,

  // Instance
  InstanceListPresentation,
  InstanceDetailPresentation,
  ProgressTrackerPresentation,

  // Approval
  ApprovalInboxPresentation,
  ApprovalDetailPresentation,
  ApprovalFormPresentation,
  PendingApprovalsBadgePresentation,

  // Dashboard
  WorkflowMetricsPresentation,
};
