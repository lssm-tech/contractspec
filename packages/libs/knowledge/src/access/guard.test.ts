import { describe, expect, it } from 'bun:test';
import type {
	ResolvedAppConfig,
	ResolvedKnowledge,
} from '@contractspec/lib.contracts-spec/app-config/runtime';
import { KnowledgeAccessGuard } from './guard';

function makeResolvedKnowledge(
	overrides: Partial<ResolvedKnowledge> = {}
): ResolvedKnowledge {
	return {
		binding: {
			spaceKey: 'support-faq',
			required: true,
			scope: {},
		},
		space: {
			meta: {
				key: 'support-faq',
				version: '1.0.0',
				category: 'canonical',
				description: 'Support FAQ knowledge space.',
				stability: 'experimental',
				owners: [],
				tags: [],
			},
			retention: {},
			access: {
				trustLevel: 'high',
				automationWritable: false,
			},
		},
		sources: [],
		...overrides,
	};
}

function makeResolvedAppConfig(
	knowledge: ResolvedKnowledge[]
): ResolvedAppConfig {
	return {
		appId: 'app.support',
		tenantId: 'tenant-acme',
		blueprintName: 'support-app',
		blueprintVersion: '1.0.0',
		configVersion: '1.0.0',
		capabilities: { enabled: [], disabled: [] },
		features: { include: [], exclude: [] },
		dataViews: {},
		workflows: {},
		jobs: {},
		policies: [],
		experiments: { catalog: [], active: [], paused: [] },
		featureFlags: [],
		routes: [],
		integrations: [],
		knowledge,
		translation: {
			defaultLocale: 'en',
			supportedLocales: ['en'],
			tenantOverrides: [],
		},
		branding: {
			appName: 'Support App',
			assets: {},
			colors: {
				primary: '#111111',
				secondary: '#222222',
			},
			domain: 'support.example.com',
		},
	};
}

describe('KnowledgeAccessGuard', () => {
	it('allows unbound spaces when binding.required is false', () => {
		const guard = new KnowledgeAccessGuard();
		const resolvedKnowledge = makeResolvedKnowledge({
			binding: {
				spaceKey: 'support-faq',
				required: false,
				scope: {},
			},
		});
		const appConfig = makeResolvedAppConfig([]);

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({ allowed: true });
	});

	it('rejects access when the required space is not bound', () => {
		const guard = new KnowledgeAccessGuard();
		const resolvedKnowledge = makeResolvedKnowledge();
		const appConfig = makeResolvedAppConfig([]);

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason:
				'Knowledge space "support-faq" is not bound in the resolved app config.',
		});
	});

	it('blocks writes when automationWritable is false', () => {
		const guard = new KnowledgeAccessGuard();
		const resolvedKnowledge = makeResolvedKnowledge();
		const appConfig = makeResolvedAppConfig([resolvedKnowledge]);

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					operation: 'write',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason: 'Knowledge space "support-faq" does not allow automated writes.',
		});
	});

	it('blocks writes to disallowed categories', () => {
		const guard = new KnowledgeAccessGuard();
		const resolvedKnowledge = makeResolvedKnowledge({
			space: {
				...makeResolvedKnowledge().space,
				access: {
					trustLevel: 'high',
					automationWritable: true,
				},
				meta: {
					...makeResolvedKnowledge().space.meta,
					category: 'external',
				},
			},
		});
		const appConfig = makeResolvedAppConfig([resolvedKnowledge]);

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					operation: 'write',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason:
				'Knowledge space "support-faq" is category "external" and is read-only.',
		});
	});

	it('enforces workflow bindings and warns on ephemeral reads', () => {
		const guard = new KnowledgeAccessGuard();
		const resolvedKnowledge = makeResolvedKnowledge({
			binding: {
				spaceKey: 'scratchpad',
				required: true,
				scope: {
					workflows: ['allowed-workflow'],
				},
			},
			space: {
				...makeResolvedKnowledge().space,
				meta: {
					...makeResolvedKnowledge().space.meta,
					key: 'scratchpad',
					category: 'ephemeral',
				},
			},
		});
		const appConfig = makeResolvedAppConfig([resolvedKnowledge]);

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					workflowName: 'blocked-workflow',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason:
				'Workflow "blocked-workflow" is not authorized to access knowledge space "scratchpad".',
		});

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					workflowName: 'allowed-workflow',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({
			allowed: true,
			severity: 'warning',
			reason:
				'Knowledge space "scratchpad" is ephemeral; results may be transient.',
		});
	});

	it('requires workflow and agent names when scoped bindings exist', () => {
		const resolvedKnowledge = makeResolvedKnowledge({
			binding: {
				spaceKey: 'support-faq',
				required: true,
				scope: {
					workflows: ['answer-faq'],
					agents: ['support-agent'],
				},
			},
			space: {
				...makeResolvedKnowledge().space,
				access: {
					trustLevel: 'high',
					automationWritable: true,
				},
			},
		});
		const appConfig = makeResolvedAppConfig([resolvedKnowledge]);
		const workflowGuard = new KnowledgeAccessGuard();
		const agentGuard = new KnowledgeAccessGuard({
			requireAgentBinding: true,
		});

		expect(
			workflowGuard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason:
				'Workflow binding is required to access knowledge space "support-faq".',
		});
		expect(
			agentGuard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					workflowName: 'answer-faq',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason:
				'Agent binding is required to access knowledge space "support-faq".',
		});
		expect(
			agentGuard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					workflowName: 'answer-faq',
					agentName: 'support-agent',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({ allowed: true });
	});

	it('returns localized denial messages', () => {
		const guard = new KnowledgeAccessGuard({
			locale: 'fr',
			requireAgentBinding: true,
		});
		const resolvedKnowledge = makeResolvedKnowledge({
			binding: {
				spaceKey: 'support-faq',
				required: true,
				scope: {
					agents: ['support-agent'],
				},
			},
			space: {
				...makeResolvedKnowledge().space,
				access: {
					trustLevel: 'high',
					automationWritable: true,
				},
			},
		});
		const appConfig = makeResolvedAppConfig([resolvedKnowledge]);

		expect(
			guard.checkAccess(
				resolvedKnowledge,
				{
					tenantId: 'tenant-acme',
					appId: 'app.support',
					operation: 'read',
				},
				appConfig
			)
		).toEqual({
			allowed: false,
			reason:
				'Un agent lié est requis pour accéder à l\'espace de connaissances "support-faq".',
		});
	});
});
