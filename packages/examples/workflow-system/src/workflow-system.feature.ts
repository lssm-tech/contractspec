/**
 * Workflow System Feature Module Specification
 *
 * Defines the feature module for workflow and approval capabilities.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Workflow System feature module that bundles workflow definition,
 * instance management, and approval handling into an installable feature.
 */
export const WorkflowSystemFeature: FeatureModuleSpec = {
  meta: {
    key: 'workflow-system',
    title: 'Workflow & Approval System',
    description:
      'State machine-based workflow engine with role-based approvals, delegation, and escalation',
    domain: 'workflow',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'state-machine', 'automation'],
    stability: 'experimental',
    version: 1,
  },

  // All contract operations included in this feature
  operations: [
    // Workflow definition operations
    { key: 'workflow.definition.create', version: 1 },
    { key: 'workflow.definition.update', version: 1 },
    { key: 'workflow.step.add', version: 1 },
    { key: 'workflow.definition.publish', version: 1 },
    { key: 'workflow.definition.list', version: 1 },
    { key: 'workflow.definition.get', version: 1 },

    // Workflow instance operations
    { key: 'workflow.instance.start', version: 1 },
    { key: 'workflow.instance.transition', version: 1 },
    { key: 'workflow.instance.pause', version: 1 },
    { key: 'workflow.instance.resume', version: 1 },
    { key: 'workflow.instance.cancel', version: 1 },
    { key: 'workflow.instance.list', version: 1 },
    { key: 'workflow.instance.get', version: 1 },

    // Approval operations
    { key: 'workflow.approval.decide', version: 1 },
    { key: 'workflow.approval.delegate', version: 1 },
    { key: 'workflow.approval.comment.add', version: 1 },
    { key: 'workflow.approval.list.mine', version: 1 },
    { key: 'workflow.approval.get', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Definition events
    { key: 'workflow.definition.created', version: 1 },
    { key: 'workflow.definition.updated', version: 1 },
    { key: 'workflow.definition.published', version: 1 },
    { key: 'workflow.step.added', version: 1 },

    // Instance events
    { key: 'workflow.instance.started', version: 1 },
    { key: 'workflow.step.entered', version: 1 },
    { key: 'workflow.step.exited', version: 1 },
    { key: 'workflow.instance.completed', version: 1 },
    { key: 'workflow.instance.cancelled', version: 1 },
    { key: 'workflow.instance.paused', version: 1 },
    { key: 'workflow.instance.resumed', version: 1 },
    { key: 'workflow.instance.failed', version: 1 },
    { key: 'workflow.instance.timedOut', version: 1 },

    // Approval events
    { key: 'workflow.approval.requested', version: 1 },
    { key: 'workflow.approval.decided', version: 1 },
    { key: 'workflow.approval.delegated', version: 1 },
    { key: 'workflow.approval.escalated', version: 1 },
  ],

  // Presentations associated with this feature
  presentations: [
    // Definition
    { key: 'workflow.designer', version: 1 },
    { key: 'workflow.definition.list', version: 1 },
    { key: 'workflow.definition.detail', version: 1 },

    // Instance
    { key: 'workflow.instance.list', version: 1 },
    { key: 'workflow.instance.detail', version: 1 },
    { key: 'workflow.instance.progress', version: 1 },

    // Approval
    { key: 'workflow.approval.inbox', version: 1 },
    { key: 'workflow.approval.detail', version: 1 },
    { key: 'workflow.approval.form', version: 1 },
    { key: 'workflow.approval.badge', version: 1 },

    // Dashboard
    { key: 'workflow.metrics', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { key: 'workflow.definition.list', version: 1 },
      pres: { key: 'workflow.definition.list', version: 1 },
    },
    {
      op: { key: 'workflow.instance.list', version: 1 },
      pres: { key: 'workflow.instance.list', version: 1 },
    },
    {
      op: { key: 'workflow.approval.list.mine', version: 1 },
      pres: { key: 'workflow.approval.inbox', version: 1 },
    },
    {
      op: { key: 'workflow.approval.decide', version: 1 },
      pres: { key: 'workflow.approval.form', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    { key: 'workflow.designer', version: 1, targets: ['react'] },
    {
      key: 'workflow.definition.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'workflow.definition.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'workflow.instance.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'workflow.instance.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'workflow.instance.progress', version: 1, targets: ['react'] },
    {
      key: 'workflow.approval.inbox',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'workflow.approval.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'workflow.metrics', version: 1, targets: ['react', 'markdown'] },
  ],

  // Capability requirements
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'feature-flags', version: 1 },
    ],
    provides: [
      { key: 'workflow', version: 1 },
      { key: 'approval', version: 1 },
      { key: 'state-machine', version: 1 },
    ],
  },
};
