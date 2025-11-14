import type { ResolvedAppConfig, ResolvedKnowledge } from '../app-config/runtime';
import type { KnowledgeCategory } from './spec';

export interface KnowledgeAccessContext {
  tenantId: string;
  appId: string;
  environment?: string;
  workflowName?: string;
  agentName?: string;
  operation: 'read' | 'write' | 'search';
}

export interface KnowledgeAccessResult {
  allowed: boolean;
  reason?: string;
  severity?: 'error' | 'warning';
}

export interface KnowledgeAccessGuardOptions {
  disallowWriteCategories?: KnowledgeCategory[];
  requireWorkflowBinding?: boolean;
  requireAgentBinding?: boolean;
}

const DEFAULT_DISALLOWED_WRITE: KnowledgeCategory[] = ['external', 'ephemeral'];

export class KnowledgeAccessGuard {
  private readonly disallowedWrite: Set<KnowledgeCategory>;
  private readonly requireWorkflowBinding: boolean;
  private readonly requireAgentBinding: boolean;

  constructor(options: KnowledgeAccessGuardOptions = {}) {
    this.disallowedWrite = new Set(
      options.disallowWriteCategories ?? DEFAULT_DISALLOWED_WRITE
    );
    this.requireWorkflowBinding = options.requireWorkflowBinding ?? true;
    this.requireAgentBinding = options.requireAgentBinding ?? false;
  }

  checkAccess(
    spaceBinding: ResolvedKnowledge,
    context: KnowledgeAccessContext,
    appConfig: ResolvedAppConfig
  ): KnowledgeAccessResult {
    const { binding, space } = spaceBinding;

    if (binding.required !== false && !this.isSpaceBound(spaceBinding, appConfig)) {
      return {
        allowed: false,
        reason: `Knowledge space "${space.meta.key}" is not bound in the resolved app config.`,
      };
    }

    if (
      context.operation === 'write' &&
      this.disallowedWrite.has(space.meta.category)
    ) {
      return {
        allowed: false,
        reason: `Knowledge space "${space.meta.key}" is category "${space.meta.category}" and is read-only.`,
      };
    }

    if (this.requireWorkflowBinding && context.workflowName) {
      const allowedWorkflows = binding.scope?.workflows;
      if (allowedWorkflows && !allowedWorkflows.includes(context.workflowName)) {
        return {
          allowed: false,
          reason: `Workflow "${context.workflowName}" is not authorized to access knowledge space "${space.meta.key}".`,
        };
      }
    }

    if (this.requireAgentBinding && context.agentName) {
      const allowedAgents = binding.scope?.agents;
      if (allowedAgents && !allowedAgents.includes(context.agentName)) {
        return {
          allowed: false,
          reason: `Agent "${context.agentName}" is not authorized to access knowledge space "${space.meta.key}".`,
        };
      }
    }

    if (space.meta.category === 'ephemeral') {
      return {
        allowed: true,
        severity: 'warning',
        reason: `Knowledge space "${space.meta.key}" is ephemeral; results may be transient.`,
      };
    }

    return { allowed: true };
  }

  private isSpaceBound(
    resolved: ResolvedKnowledge,
    appConfig: ResolvedAppConfig
  ): boolean {
    return appConfig.knowledge.some(
      (entry) =>
        entry.space.meta.key === resolved.space.meta.key &&
        (resolved.space.meta.version == null ||
          entry.space.meta.version === resolved.space.meta.version)
    );
  }
}




