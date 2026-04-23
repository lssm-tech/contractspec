import type { KnowledgeCategory } from '@contractspec/lib.contracts-spec';
import type {
	ResolvedAppConfig,
	ResolvedKnowledge,
} from '@contractspec/lib.contracts-spec/app-config/runtime';
import type { KnowledgeI18n } from '../i18n/messages';
import { createKnowledgeI18n, getDefaultI18n } from '../i18n/messages';
import type { KnowledgeAccessContext, KnowledgeAccessResult } from '../types';

export interface KnowledgeAccessGuardOptions {
	disallowWriteCategories?: KnowledgeCategory[];
	requireWorkflowBinding?: boolean;
	requireAgentBinding?: boolean;
	/** Default locale for access denial/warning messages */
	locale?: string;
}

const DEFAULT_DISALLOWED_WRITE: KnowledgeCategory[] = ['external', 'ephemeral'];

export class KnowledgeAccessGuard {
	private readonly disallowedWrite: Set<KnowledgeCategory>;
	private readonly requireWorkflowBinding: boolean;
	private readonly requireAgentBinding: boolean;
	private readonly i18n: KnowledgeI18n;

	constructor(options: KnowledgeAccessGuardOptions = {}) {
		this.disallowedWrite = new Set(
			options.disallowWriteCategories ?? DEFAULT_DISALLOWED_WRITE
		);
		this.requireWorkflowBinding = options.requireWorkflowBinding ?? true;
		this.requireAgentBinding = options.requireAgentBinding ?? false;
		this.i18n = options.locale
			? createKnowledgeI18n(options.locale)
			: getDefaultI18n();
	}

	checkAccess(
		spaceBinding: ResolvedKnowledge,
		context: KnowledgeAccessContext,
		appConfig: ResolvedAppConfig
	): KnowledgeAccessResult {
		const { binding, space } = spaceBinding;

		if (
			binding.required !== false &&
			!this.isSpaceBound(spaceBinding, appConfig)
		) {
			return {
				allowed: false,
				reason: this.i18n.t('access.notBound', {
					spaceKey: space.meta.key,
				}),
			};
		}

		if (
			context.operation === 'write' &&
			space.access.automationWritable === false
		) {
			return {
				allowed: false,
				reason: this.i18n.t('access.automationWriteDisabled', {
					spaceKey: space.meta.key,
				}),
			};
		}

		if (
			context.operation === 'write' &&
			this.disallowedWrite.has(space.meta.category)
		) {
			return {
				allowed: false,
				reason: this.i18n.t('access.readOnly', {
					spaceKey: space.meta.key,
					category: space.meta.category,
				}),
			};
		}

		if (this.requireWorkflowBinding) {
			const workflowAccess = this.checkWorkflowAccess(
				binding.scope?.workflows,
				context,
				space
			);
			if (!workflowAccess.allowed) {
				return workflowAccess;
			}
		}

		if (this.requireAgentBinding) {
			const agentAccess = this.checkAgentAccess(
				binding.scope?.agents,
				context,
				space
			);
			if (!agentAccess.allowed) {
				return agentAccess;
			}
		}

		if (space.meta.category === 'ephemeral') {
			return {
				allowed: true,
				severity: 'warning',
				reason: this.i18n.t('access.ephemeralWarning', {
					spaceKey: space.meta.key,
				}),
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

	private checkWorkflowAccess(
		allowedWorkflows: string[] | undefined,
		context: KnowledgeAccessContext,
		space: ResolvedKnowledge['space']
	): KnowledgeAccessResult {
		if (!allowedWorkflows || allowedWorkflows.length === 0) {
			return { allowed: true };
		}
		if (!context.workflowName) {
			return {
				allowed: false,
				reason: this.i18n.t('access.workflowBindingRequired', {
					spaceKey: space.meta.key,
				}),
			};
		}
		if (!allowedWorkflows.includes(context.workflowName)) {
			return {
				allowed: false,
				reason: this.i18n.t('access.workflowUnauthorized', {
					workflowName: context.workflowName,
					spaceKey: space.meta.key,
				}),
			};
		}
		return { allowed: true };
	}

	private checkAgentAccess(
		allowedAgents: string[] | undefined,
		context: KnowledgeAccessContext,
		space: ResolvedKnowledge['space']
	): KnowledgeAccessResult {
		if (!allowedAgents || allowedAgents.length === 0) {
			return { allowed: true };
		}
		if (!context.agentName) {
			return {
				allowed: false,
				reason: this.i18n.t('access.agentBindingRequired', {
					spaceKey: space.meta.key,
				}),
			};
		}
		if (!allowedAgents.includes(context.agentName)) {
			return {
				allowed: false,
				reason: this.i18n.t('access.agentUnauthorized', {
					agentName: context.agentName,
					spaceKey: space.meta.key,
				}),
			};
		}
		return { allowed: true };
	}
}
