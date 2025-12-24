/**
 * Workflow System Presentation Descriptors
 */
import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { WorkflowDefinitionModel } from '../workflow/workflow.schema';
import { WorkflowInstanceModel } from '../instance/instance.schema';
import { ApprovalRequestModel } from '../approval/approval.schema';

// ============ Workflow Definition Presentations ============

/**
 * Workflow designer canvas for building workflows.
 */
export const WorkflowDesignerPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.designer',
    version: 1,
    title: 'Workflow Designer',
    description: 'Visual workflow designer with drag-and-drop steps',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'designer', 'admin'],
    stability: StabilityEnum.Experimental,
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
export const WorkflowListPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.definition.list',
    version: 1,
    title: 'Workflow List',
    description: 'List of workflow definitions with status and actions',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'list', 'admin'],
    stability: StabilityEnum.Experimental,
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
export const WorkflowDetailPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.definition.detail',
    version: 1,
    title: 'Workflow Details',
    description: 'Detailed view of a workflow definition with steps',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'detail'],
    stability: StabilityEnum.Experimental,
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
export const InstanceListPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.instance.list',
    version: 1,
    title: 'Instance List',
    description: 'List of workflow instances with status and progress',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'list'],
    stability: StabilityEnum.Experimental,
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
export const InstanceDetailPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.instance.detail',
    version: 1,
    title: 'Instance Details',
    description: 'Detailed view of a workflow instance with step timeline',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'detail', 'timeline'],
    stability: StabilityEnum.Experimental,
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
export const ProgressTrackerPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.instance.progress',
    version: 1,
    title: 'Progress Tracker',
    description: 'Visual progress tracker showing current step in workflow',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'progress', 'widget'],
    stability: StabilityEnum.Experimental,
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
export const ApprovalInboxPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.approval.inbox',
    version: 1,
    title: 'Approval Inbox',
    description: 'Inbox showing pending approval requests for current user',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'inbox'],
    stability: StabilityEnum.Experimental,
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
export const ApprovalDetailPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.approval.detail',
    version: 1,
    title: 'Approval Details',
    description: 'Detailed approval request view with context and actions',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'detail'],
    stability: StabilityEnum.Experimental,
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
export const ApprovalFormPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.approval.form',
    version: 1,
    title: 'Approval Form',
    description: 'Form for submitting approval decisions',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'form'],
    stability: StabilityEnum.Experimental,
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
export const PendingApprovalsBadgePresentation: PresentationSpec = {
  meta: {
    name: 'workflow.approval.badge',
    version: 1,
    title: 'Pending Approvals Badge',
    description: 'Badge showing count of pending approvals',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'badge', 'widget'],
    stability: StabilityEnum.Experimental,
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
export const WorkflowMetricsPresentation: PresentationSpec = {
  meta: {
    name: 'workflow.metrics',
    version: 1,
    title: 'Workflow Metrics',
    description: 'Dashboard widget showing workflow metrics and statistics',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'metrics', 'dashboard'],
    stability: StabilityEnum.Experimental,
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
