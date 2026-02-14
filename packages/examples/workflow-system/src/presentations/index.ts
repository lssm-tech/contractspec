/**
 * Workflow System Presentation Descriptors
 */
import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts-spec';
import { WorkflowDefinitionModel } from '../workflow/workflow.schema';
import { WorkflowInstanceModel } from '../instance/instance.schema';
import { ApprovalRequestModel } from '../approval/approval.schema';

// ============ Workflow Definition Presentations ============

/**
 * Workflow designer canvas for building workflows.
 */
export const WorkflowDesignerPresentation = definePresentation({
  meta: {
    key: 'workflow.designer',
    version: '1.0.0',
    title: 'Workflow Designer',
    description: 'Visual workflow designer with drag-and-drop steps',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'designer', 'admin'],
    stability: StabilityEnum.Experimental,
    goal: 'Building and modifying workflow definitions',
    context: 'Workflow administration and setup',
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
});

/**
 * List of workflow definitions.
 */
export const WorkflowListPresentation = definePresentation({
  meta: {
    key: 'workflow.definition.viewList',
    version: '1.0.0',
    title: 'Workflow List',
    description: 'List of workflow definitions with status and actions',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'list', 'admin'],
    stability: StabilityEnum.Experimental,
    goal: 'Overview of all defined workflows',
    context: 'Workflow management dashboard',
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
});

/**
 * Workflow definition detail view.
 */
export const WorkflowDetailPresentation = definePresentation({
  meta: {
    key: 'workflow.definition.detail',
    version: '1.0.0',
    title: 'Workflow Details',
    description: 'Detailed view of a workflow definition with steps',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Viewing technical details of a workflow definition',
    context: 'Workflow inspection and debugging',
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
});

// ============ Workflow Instance Presentations ============

/**
 * List of running workflow instances.
 */
export const InstanceListPresentation = definePresentation({
  meta: {
    key: 'workflow.instance.viewList',
    version: '1.0.0',
    title: 'Instance List',
    description: 'List of workflow instances with status and progress',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Monitoring active and past workflow executions',
    context: 'Operations monitoring',
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
});

/**
 * Workflow instance detail view with timeline.
 */
export const InstanceDetailPresentation = definePresentation({
  meta: {
    key: 'workflow.instance.detail',
    version: '1.0.0',
    title: 'Instance Details',
    description: 'Detailed view of a workflow instance with step timeline',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'detail', 'timeline'],
    stability: StabilityEnum.Experimental,
    goal: 'Detailed inspection of a specific workflow instance',
    context: 'Case management and troubleshooting',
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
});

/**
 * Workflow progress tracker widget.
 */
export const ProgressTrackerPresentation = definePresentation({
  meta: {
    key: 'workflow.instance.progress',
    version: '1.0.0',
    title: 'Progress Tracker',
    description: 'Visual progress tracker showing current step in workflow',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'progress', 'widget'],
    stability: StabilityEnum.Experimental,
    goal: 'Quick view of current progress for a workflow',
    context: 'Embedded progress indicator in entity views',
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
});

// ============ Approval Presentations ============

/**
 * Approval inbox - list of pending approvals.
 */
export const ApprovalInboxPresentation = definePresentation({
  meta: {
    key: 'workflow.approval.inbox',
    version: '1.0.0',
    title: 'Approval Inbox',
    description: 'Inbox showing pending approval requests for current user',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'inbox'],
    stability: StabilityEnum.Experimental,
    goal: 'Managing personal workload of approval requests',
    context: 'Personal task management',
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
});

/**
 * Approval request detail view.
 */
export const ApprovalDetailPresentation = definePresentation({
  meta: {
    key: 'workflow.approval.detail',
    version: '1.0.0',
    title: 'Approval Details',
    description: 'Detailed approval request view with context and actions',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Decision support for an approval request',
    context: 'Specific approval action',
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
});

/**
 * Approval decision form.
 */
export const ApprovalFormPresentation = definePresentation({
  meta: {
    key: 'workflow.approval.form',
    version: '1.0.0',
    title: 'Approval Form',
    description: 'Form for submitting approval decisions',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'form'],
    stability: StabilityEnum.Experimental,
    goal: 'Submitting a decision on an approval request',
    context: 'Approval decision dialog',
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
});

// ============ Dashboard Widgets ============

/**
 * Pending approvals count badge.
 */
export const PendingApprovalsBadgePresentation = definePresentation({
  meta: {
    key: 'workflow.approval.badge',
    version: '1.0.0',
    title: 'Pending Approvals Badge',
    description: 'Badge showing count of pending approvals',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'badge', 'widget'],
    stability: StabilityEnum.Experimental,
    goal: 'Visual notification of pending approvals',
    context: 'Global navigation or sidebar',
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
});

/**
 * Workflow metrics dashboard widget.
 */
export const WorkflowMetricsPresentation = definePresentation({
  meta: {
    key: 'workflow.metrics',
    version: '1.0.0',
    title: 'Workflow Metrics',
    description: 'Dashboard widget showing workflow metrics and statistics',
    domain: 'workflow-system',
    owners: ['@workflow-team'],
    tags: ['workflow', 'metrics', 'dashboard'],
    stability: StabilityEnum.Experimental,
    goal: 'Monitoring throughput and bottlenecks',
    context: 'System performance dashboard',
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
});

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
