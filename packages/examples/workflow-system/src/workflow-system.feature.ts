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
  },

  // All contract operations included in this feature
  operations: [
    // Workflow definition operations
    { name: 'workflow.definition.create', version: 1 },
    { name: 'workflow.definition.update', version: 1 },
    { name: 'workflow.step.add', version: 1 },
    { name: 'workflow.definition.publish', version: 1 },
    { name: 'workflow.definition.list', version: 1 },
    { name: 'workflow.definition.get', version: 1 },

    // Workflow instance operations
    { name: 'workflow.instance.start', version: 1 },
    { name: 'workflow.instance.transition', version: 1 },
    { name: 'workflow.instance.pause', version: 1 },
    { name: 'workflow.instance.resume', version: 1 },
    { name: 'workflow.instance.cancel', version: 1 },
    { name: 'workflow.instance.list', version: 1 },
    { name: 'workflow.instance.get', version: 1 },

    // Approval operations
    { name: 'workflow.approval.decide', version: 1 },
    { name: 'workflow.approval.delegate', version: 1 },
    { name: 'workflow.approval.comment.add', version: 1 },
    { name: 'workflow.approval.list.mine', version: 1 },
    { name: 'workflow.approval.get', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Definition events
    { name: 'workflow.definition.created', version: 1 },
    { name: 'workflow.definition.updated', version: 1 },
    { name: 'workflow.definition.published', version: 1 },
    { name: 'workflow.step.added', version: 1 },

    // Instance events
    { name: 'workflow.instance.started', version: 1 },
    { name: 'workflow.step.entered', version: 1 },
    { name: 'workflow.step.exited', version: 1 },
    { name: 'workflow.instance.completed', version: 1 },
    { name: 'workflow.instance.cancelled', version: 1 },
    { name: 'workflow.instance.paused', version: 1 },
    { name: 'workflow.instance.resumed', version: 1 },
    { name: 'workflow.instance.failed', version: 1 },
    { name: 'workflow.instance.timeout', version: 1 },

    // Approval events
    { name: 'workflow.approval.requested', version: 1 },
    { name: 'workflow.approval.decided', version: 1 },
    { name: 'workflow.approval.delegated', version: 1 },
    { name: 'workflow.approval.escalated', version: 1 },
  ],

  // Presentations associated with this feature
  presentations: [
    // Definition
    { name: 'workflow.designer', version: 1 },
    { name: 'workflow.definition.list', version: 1 },
    { name: 'workflow.definition.detail', version: 1 },

    // Instance
    { name: 'workflow.instance.list', version: 1 },
    { name: 'workflow.instance.detail', version: 1 },
    { name: 'workflow.instance.progress', version: 1 },

    // Approval
    { name: 'workflow.approval.inbox', version: 1 },
    { name: 'workflow.approval.detail', version: 1 },
    { name: 'workflow.approval.form', version: 1 },
    { name: 'workflow.approval.badge', version: 1 },

    // Dashboard
    { name: 'workflow.metrics', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'workflow.definition.list', version: 1 },
      pres: { name: 'workflow.definition.list', version: 1 },
    },
    {
      op: { name: 'workflow.instance.list', version: 1 },
      pres: { name: 'workflow.instance.list', version: 1 },
    },
    {
      op: { name: 'workflow.approval.list.mine', version: 1 },
      pres: { name: 'workflow.approval.inbox', version: 1 },
    },
    {
      op: { name: 'workflow.approval.decide', version: 1 },
      pres: { name: 'workflow.approval.form', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    { name: 'workflow.designer', version: 1, targets: ['react'] },
    {
      name: 'workflow.definition.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'workflow.definition.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'workflow.instance.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'workflow.instance.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { name: 'workflow.instance.progress', version: 1, targets: ['react'] },
    {
      name: 'workflow.approval.inbox',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'workflow.approval.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { name: 'workflow.metrics', version: 1, targets: ['react', 'markdown'] },
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
