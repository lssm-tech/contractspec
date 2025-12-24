/**
 * Agent Console Feature Module Specification
 *
 * Defines the feature module for agent orchestration capabilities.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Agent Console feature module that bundles all agent, tool, and run
 * operations, events, and presentations into an installable feature.
 */
export const AgentConsoleFeature: FeatureModuleSpec = {
  meta: {
    key: 'agent-console',
    title: 'AI Agent Console',
    description: 'AI agent orchestration with tools, runs, and logs management',
    domain: 'ai-ops',
    owners: ['@agent-console-team'],
    tags: ['ai', 'agents', 'orchestration'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    // Agent operations
    { name: 'agent.agent.create', version: 1 },
    { name: 'agent.agent.update', version: 1 },
    { name: 'agent.agent.get', version: 1 },
    { name: 'agent.agent.list', version: 1 },
    { name: 'agent.agent.assignTool', version: 1 },
    { name: 'agent.agent.removeTool', version: 1 },

    // Tool operations
    { name: 'agent.tool.create', version: 1 },
    { name: 'agent.tool.update', version: 1 },
    { name: 'agent.tool.get', version: 1 },
    { name: 'agent.tool.list', version: 1 },
    { name: 'agent.tool.test', version: 1 },

    // Run operations
    { name: 'agent.run.execute', version: 1 },
    { name: 'agent.run.cancel', version: 1 },
    { name: 'agent.run.get', version: 1 },
    { name: 'agent.run.list', version: 1 },
    { name: 'agent.run.getSteps', version: 1 },
    { name: 'agent.run.getLogs', version: 1 },
    { name: 'agent.run.getMetrics', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Agent events
    { name: 'agent.agent.created', version: 1 },
    { name: 'agent.agent.updated', version: 1 },
    { name: 'agent.agent.toolAssigned', version: 1 },
    { name: 'agent.agent.toolRemoved', version: 1 },

    // Tool events
    { name: 'agent.tool.created', version: 1 },
    { name: 'agent.tool.updated', version: 1 },
    { name: 'agent.tool.statusChanged', version: 1 },

    // Run events
    { name: 'agent.run.started', version: 1 },
    { name: 'agent.run.completed', version: 1 },
    { name: 'agent.run.failed', version: 1 },
    { name: 'agent.run.cancelled', version: 1 },
    { name: 'agent.run.toolInvoked', version: 1 },
    { name: 'agent.run.toolCompleted', version: 1 },
    { name: 'agent.run.messageGenerated', version: 1 },
  ],

  // Presentations associated with this feature
  presentations: [
    { name: 'agent-console.dashboard', version: 1 },
    { name: 'agent-console.agent.list', version: 1 },
    { name: 'agent-console.agent.detail', version: 1 },
    { name: 'agent-console.run.list', version: 1 },
    { name: 'agent-console.run.detail', version: 1 },
    { name: 'agent-console.tool.list', version: 1 },
    { name: 'agent-console.tool.detail', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'agent.agent.list', version: 1 },
      pres: { name: 'agent-console.agent.list', version: 1 },
    },
    {
      op: { name: 'agent.agent.get', version: 1 },
      pres: { name: 'agent-console.agent.detail', version: 1 },
    },
    {
      op: { name: 'agent.run.list', version: 1 },
      pres: { name: 'agent-console.run.list', version: 1 },
    },
    {
      op: { name: 'agent.run.get', version: 1 },
      pres: { name: 'agent-console.run.detail', version: 1 },
    },
    {
      op: { name: 'agent.tool.list', version: 1 },
      pres: { name: 'agent-console.tool.list', version: 1 },
    },
    {
      op: { name: 'agent.tool.get', version: 1 },
      pres: { name: 'agent-console.tool.detail', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      name: 'agent-console.dashboard',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'agent-console.agent.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'agent-console.run.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'agent-console.tool.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'jobs', version: 1 },
    ],
    provides: [{ key: 'agent', version: 1 }],
  },
};
