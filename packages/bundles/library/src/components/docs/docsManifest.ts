export type DocsSectionKey =
	| 'start'
	| 'core-model'
	| 'build'
	| 'operate'
	| 'integrations'
	| 'reference'
	| 'studio';

export type DocsAudience =
	| 'oss'
	| 'operator'
	| 'reference'
	| 'studio-bridge'
	| 'secondary';

export type DocsCtaMode = 'oss-next' | 'studio-bridge' | 'reference';

export interface DocsPageEntry {
	href: string;
	title: string;
	description: string;
	section?: DocsSectionKey;
	order?: number;
	navTitle?: string;
	primaryNav?: boolean;
	audience?: DocsAudience;
	ctaMode?: DocsCtaMode;
	aliases?: string[];
}

export interface DocsSection {
	key: DocsSectionKey;
	title: string;
	description: string;
}

export const DOCS_PRIMARY_SECTIONS: readonly DocsSection[] = [
	{
		key: 'start',
		title: 'Start',
		description:
			'Install ContractSpec, wire a first contract, and adopt it into an existing codebase.',
	},
	{
		key: 'core-model',
		title: 'Core Model',
		description:
			'Learn how contracts, generated surfaces, policies, overlays, and safe regeneration fit together.',
	},
	{
		key: 'build',
		title: 'Build',
		description:
			'Use practical guides, libraries, architecture patterns, and examples to ship real surfaces.',
	},
	{
		key: 'operate',
		title: 'Operate',
		description:
			'Run the system safely with governance, auditability, tracing, and operator-grade controls.',
	},
	{
		key: 'integrations',
		title: 'Integrations',
		description:
			'Connect models, messaging, storage, payments, search, and external systems through typed bindings.',
	},
	{
		key: 'reference',
		title: 'Reference',
		description:
			'Search generated contract docs, inspect example packages, and navigate the system as source of truth.',
	},
	{
		key: 'studio',
		title: 'Studio',
		description:
			'Understand what Studio adds on top of the open system and when to adopt it.',
	},
] as const;

export const DOCS_PAGES: readonly DocsPageEntry[] = [
	{
		href: '/docs',
		title: 'Documentation',
		description:
			'OSS-first documentation for ContractSpec, the open spec system for AI-native software.',
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/getting-started/start-here',
		title: 'Start here',
		description:
			'The fastest path from install to your first contract and generated surface.',
		section: 'start',
		order: 10,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/getting-started/installation',
		title: 'Installation',
		description:
			'Install the CLI and core packages, then prepare a workspace for incremental adoption.',
		section: 'start',
		order: 20,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/getting-started/hello-world',
		title: 'Hello world',
		description:
			'Define a first operation, generate the surface, and verify the end-to-end loop.',
		section: 'start',
		order: 30,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/getting-started/compatibility',
		title: 'Compatibility',
		description:
			'Check the supported runtimes, package managers, and adoption assumptions before rollout.',
		section: 'start',
		order: 40,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/getting-started/tools',
		title: 'Developer tools',
		description:
			'Use the CLI, editors, and helper tooling that make the OSS workflow practical day to day.',
		section: 'start',
		order: 50,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/getting-started/troubleshooting',
		title: 'Troubleshooting',
		description:
			'Resolve the common installation, validation, and runtime mistakes you hit during first adoption.',
		section: 'start',
		order: 60,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs',
		title: 'Contracts and specs',
		description:
			'Understand the spec model that drives generated surfaces, validation, policy, and safe regeneration.',
		section: 'core-model',
		order: 10,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/capabilities',
		title: 'Capabilities',
		description:
			'Model commands, queries, presentations, and events as explicit contract surfaces.',
		section: 'core-model',
		order: 20,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/dataviews',
		title: 'Data views',
		description:
			'Define queryable, presentable views that stay aligned with the rest of the system.',
		section: 'core-model',
		order: 30,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/workflows',
		title: 'Workflows',
		description:
			'Compose multi-step behavior from typed contracts, policies, and runtime orchestration.',
		section: 'core-model',
		order: 40,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/policy',
		title: 'Policy',
		description:
			'Apply consistent governance, access rules, and risk controls across every surface.',
		section: 'core-model',
		order: 50,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/overlays',
		title: 'Overlays',
		description:
			'Customize generated surfaces safely without forking the system or breaking regeneration.',
		section: 'core-model',
		order: 60,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/module-bundles',
		title: 'Module bundles',
		description:
			'Define AI-native surfaces as typed bundle specs that resolve into personalized, auditable runtime plans.',
		section: 'core-model',
		order: 70,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/connect',
		title: 'ContractSpec Connect',
		description:
			'Guard coding-agent edits and shell actions with task-scoped context, plan packets, patch verdicts, and review packets.',
		section: 'core-model',
		order: 80,
		navTitle: 'Connect',
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/specs/builder-control-plane',
		title: 'Builder control plane',
		description:
			'Route multimodal authoring work through governed builder contracts, provider policies, readiness gates, and mobile review flows.',
		section: 'core-model',
		order: 90,
		primaryNav: true,
		audience: 'studio-bridge',
		ctaMode: 'studio-bridge',
	},
	{
		href: '/docs/guides/contract-types',
		title: 'Contract types',
		description:
			'Choose the right contract surface for the behavior you want to make explicit.',
		section: 'core-model',
		order: 100,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides',
		title: 'Guides',
		description:
			'Follow concrete adoption paths for existing apps, generated docs, CI gating, and typed surfaces.',
		section: 'build',
		order: 10,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/nextjs-one-endpoint',
		title: 'Adopt one endpoint in Next.js',
		description:
			'Start with one endpoint, one contract, and one generated surface in an existing Next.js app.',
		section: 'build',
		order: 20,
		navTitle: 'Next.js endpoint',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/import-existing-codebases',
		title: 'Import an existing codebase',
		description:
			'Stabilize a live codebase incrementally instead of rewriting it from scratch.',
		section: 'build',
		order: 30,
		navTitle: 'Import existing code',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/spec-validation-and-typing',
		title: 'Validation and typing',
		description:
			'Keep runtime validation and TypeScript types aligned from the same source definitions.',
		section: 'build',
		order: 40,
		navTitle: 'Validation and typing',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/contract-driven-forms',
		title: 'Build a contract-driven form',
		description:
			'Define schema-backed form data, fields, layout, policy, and submit actions as one reusable ContractSpec surface.',
		section: 'build',
		order: 45,
		navTitle: 'Contract-driven forms',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/generate-docs-clients-schemas',
		title: 'Generate docs, clients, and schemas',
		description:
			'Export stable docs and client-facing artifacts from the same contract layer.',
		section: 'build',
		order: 50,
		navTitle: 'Generate docs and clients',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'reference',
	},
	{
		href: '/docs/guides/docs-generation-pipeline',
		title: 'Docs generation pipeline',
		description:
			'Feed generated docs into the public docs site without breaking source-of-truth ownership.',
		section: 'build',
		order: 60,
		navTitle: 'Docs pipeline',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'reference',
	},
	{
		href: '/docs/guides/first-module-bundle',
		title: 'Build a first module bundle',
		description:
			'Define one bundle spec, resolve a personalized surface plan, and render it through the React host layer.',
		section: 'build',
		order: 65,
		navTitle: 'First module bundle',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/host-builder-workbench',
		title: 'Host the Builder workbench',
		description:
			'Load a Builder workspace snapshot, wire common commands, and keep runtime mode plus mobile review flows explicit.',
		section: 'build',
		order: 66,
		navTitle: 'Host Builder workbench',
		primaryNav: true,
		audience: 'studio-bridge',
		ctaMode: 'studio-bridge',
	},
	{
		href: '/docs/guides/connect-in-a-repo',
		title: 'Use Connect in a repo',
		description:
			'Enable Connect in workspace config, verify agent actions, and inspect local review and replay artifacts.',
		section: 'build',
		order: 67,
		navTitle: 'Connect in a repo',
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/libraries',
		title: 'Libraries overview',
		description:
			'Navigate the core libraries, runtimes, and system packages that make up the open foundation.',
		section: 'build',
		order: 70,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/libraries/translation-runtime',
		title: 'Translation runtime',
		description:
			'Use ContractSpec TranslationSpec catalogs as the canonical i18n layer, then resolve, format, snapshot, and optionally project messages to i18next.',
		section: 'build',
		order: 71,
		navTitle: 'Translation runtime',
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
		aliases: ['i18n runtime', 'i18next adapter', 'translations'],
	},
	{
		href: '/docs/libraries/cross-platform-ui',
		title: 'Cross-platform UI',
		description:
			'Understand how the presentation runtimes, ui-kit-web, ui-kit, and design-system stay aligned across React and React Native.',
		section: 'build',
		order: 72,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/libraries/application-shell',
		title: 'Application shell',
		description:
			'Implement reusable app navigation with desktop sidebars, topbar breadcrumbs, command search, in-app notifications, mobile adapters, and PageOutline section navigation.',
		section: 'build',
		order: 73,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/libraries/design-system',
		title: 'Design system',
		description:
			'Adopt high-level product UI primitives, actionable object references, responsive AdaptivePanel overlays, forms, data tables, and theme helpers.',
		section: 'build',
		order: 74,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
		aliases: [
			'object references',
			'ObjectReferenceHandler',
			'AdaptivePanel',
			'adaptive panels',
			'sheet drawer',
		],
	},
	{
		href: '/docs/architecture',
		title: 'Architecture',
		description:
			'See how the spec layer, runtimes, integrations, and multi-surface outputs fit together.',
		section: 'build',
		order: 80,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/safety',
		title: 'Operate safely',
		description:
			'Add auditability, migrations, policy controls, and trustworthy release behavior from the start.',
		section: 'operate',
		order: 10,
		navTitle: 'Safety overview',
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/ci-contract-diff-gating',
		title: 'CI diff gating',
		description:
			'Use deterministic checks to block drift and risky changes before they reach production.',
		section: 'operate',
		order: 20,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/guides/release-capsules',
		title: 'Author release capsules',
		description:
			'Pair changesets with structured release capsules, generate release artifacts, and keep changelog plus docs surfaces aligned.',
		section: 'operate',
		order: 25,
		navTitle: 'Release capsules',
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'reference',
	},
	{
		href: '/docs/safety/security-trust',
		title: 'Security and trust',
		description:
			'Understand the trust model, artifact validation expectations, and operational boundaries.',
		section: 'operate',
		order: 30,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/safety/auditing',
		title: 'Audit trails',
		description:
			'Track changes, policy decisions, and operational actions with a clear evidence trail.',
		section: 'operate',
		order: 40,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/safety/migrations',
		title: 'Migrations',
		description:
			'Evolve schemas and data safely without abandoning the contract layer.',
		section: 'operate',
		order: 50,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/safety/tenant-isolation',
		title: 'Tenant isolation',
		description:
			'Keep tenant data, config, policies, and integrations separated at runtime.',
		section: 'operate',
		order: 60,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/knowledge',
		title: 'Knowledge and context',
		description:
			'Bind trusted knowledge sources to the system without losing governance or isolation.',
		section: 'operate',
		order: 70,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/advanced/telemetry',
		title: 'Telemetry',
		description:
			'Instrument surfaces, collect evidence, and keep observability aligned with the contract model.',
		section: 'operate',
		order: 80,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/advanced/workflow-monitoring',
		title: 'Workflow monitoring',
		description:
			'Observe multi-step execution with enough context to understand failures and regressions.',
		section: 'operate',
		order: 90,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/ops/distributed-tracing',
		title: 'Distributed tracing',
		description:
			'Trace contract execution across integrations, workflows, and generated surfaces.',
		section: 'operate',
		order: 100,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations',
		title: 'Integrations overview',
		description:
			'Understand the binding model for external services, providers, and tenant-owned connections.',
		section: 'integrations',
		order: 10,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/spec-model',
		title: 'Integration spec model',
		description:
			'Define what an integration provides before wiring it into an app or runtime.',
		section: 'integrations',
		order: 20,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/openai',
		title: 'OpenAI integration',
		description:
			'Connect OpenAI through typed capabilities, explicit provider config, and governed runtime usage.',
		section: 'integrations',
		order: 30,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/mistral',
		title: 'Mistral integration',
		description:
			'Use Mistral through the same provider contract model and runtime guardrails.',
		section: 'integrations',
		order: 40,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/qdrant',
		title: 'Qdrant integration',
		description:
			'Store and retrieve knowledge embeddings with explicit provider configuration and ownership.',
		section: 'integrations',
		order: 50,
		primaryNav: true,
		audience: 'operator',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/stripe',
		title: 'Stripe integration',
		description:
			'Bind payments and billing behavior without smearing provider logic across the codebase.',
		section: 'integrations',
		order: 60,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/twilio',
		title: 'Twilio integration',
		description:
			'Handle messaging and telephony through typed transport boundaries and explicit configuration.',
		section: 'integrations',
		order: 70,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/integrations/github',
		title: 'GitHub integration',
		description:
			'Push execution context into GitHub workflows and automation surfaces without hidden glue.',
		section: 'integrations',
		order: 80,
		primaryNav: true,
		audience: 'oss',
		ctaMode: 'oss-next',
	},
	{
		href: '/docs/reference',
		title: 'Contract reference',
		description:
			'Browse the generated reference index for public contract surfaces, versions, and examples.',
		section: 'reference',
		order: 10,
		primaryNav: true,
		audience: 'reference',
		ctaMode: 'reference',
	},
	{
		href: '/docs/examples',
		title: 'Examples',
		description:
			'Explore runnable examples and use them as reference implementations for new systems.',
		section: 'reference',
		order: 20,
		primaryNav: true,
		audience: 'reference',
		ctaMode: 'reference',
	},
	{
		href: '/docs/studio',
		title: 'Studio overview',
		description:
			'See what Studio adds on top of OSS ContractSpec and when a team should adopt the operating layer.',
		section: 'studio',
		order: 10,
		primaryNav: true,
		audience: 'studio-bridge',
		ctaMode: 'studio-bridge',
	},
	{
		href: '/docs/manifesto',
		title: 'Manifesto',
		description:
			'Why ContractSpec is built as an open system, how incremental adoption works, and why Studio stays additive.',
		audience: 'secondary',
	},
	{
		href: '/docs/intent/contract-first-api',
		title: 'Contract-first API',
		description:
			'Use contracts as the durable source of truth for API behavior and generated surfaces.',
		audience: 'secondary',
	},
	{
		href: '/docs/intent/spec-driven-development',
		title: 'Spec-driven development',
		description:
			'See how explicit specs stabilize change across APIs, UI, data, and agent-facing surfaces.',
		audience: 'secondary',
	},
	{
		href: '/docs/intent/deterministic-codegen',
		title: 'Deterministic regeneration',
		description:
			'Understand safe regeneration, conflict boundaries, and why teams keep control of the output.',
		audience: 'secondary',
	},
	{
		href: '/docs/intent/schema-validation-typescript',
		title: 'Schema validation and TypeScript',
		description:
			'Keep schema, runtime validation, and TypeScript behavior aligned without duplicate work.',
		audience: 'secondary',
	},
	{
		href: '/docs/intent/openapi-alternative',
		title: 'OpenAPI alternative',
		description:
			'Compare a multi-surface contract system with API-only description tooling.',
		audience: 'secondary',
	},
	{
		href: '/docs/intent/generate-client-from-schema',
		title: 'Generate client from schema',
		description:
			'Generate client-facing artifacts from the same source that drives runtime behavior.',
		audience: 'secondary',
	},
	{
		href: '/docs/comparison',
		title: 'Comparison overview',
		description:
			'Compare ContractSpec with workflow engines, internal-tool builders, and enterprise orchestration products.',
		audience: 'secondary',
	},
	{
		href: '/docs/comparison/workflow-engines',
		title: 'Workflow engines',
		description:
			'Contrast a contract system with workflow-only orchestration approaches.',
		audience: 'secondary',
	},
	{
		href: '/docs/comparison/internal-tool-builders',
		title: 'Internal-tool builders',
		description:
			'Compare ContractSpec with builders that optimize for screens instead of durable system contracts.',
		audience: 'secondary',
	},
	{
		href: '/docs/comparison/automation-platforms',
		title: 'Automation platforms',
		description:
			'Compare automation-first tools with a system that owns explicit contracts and generated surfaces.',
		audience: 'secondary',
	},
	{
		href: '/docs/comparison/windmill',
		title: 'Windmill comparison',
		description:
			'Understand where Windmill fits and where ContractSpec solves a different class of system problem.',
		audience: 'secondary',
	},
	{
		href: '/docs/comparison/enterprise-platforms',
		title: 'Enterprise orchestrators',
		description:
			'Compare ContractSpec with enterprise platforms that centralize execution in a closed operating surface.',
		audience: 'secondary',
	},
	{
		href: '/docs/ecosystem/templates',
		title: 'Templates',
		description:
			'Use templates and starter systems as proof points and accelerators for OSS adoption.',
		audience: 'secondary',
	},
	{
		href: '/docs/ecosystem/plugins',
		title: 'Plugins',
		description:
			'Explore marketplace and editor integrations that support the OSS workflow.',
		audience: 'secondary',
	},
	{
		href: '/docs/ecosystem/registry',
		title: 'Registry',
		description:
			'Inspect registry and manifest concepts that help package reusable capability surfaces.',
		audience: 'secondary',
	},
] as const;

export function getDocsPageByHref(href: string) {
	return DOCS_PAGES.find((page) => page.href === href);
}

export function getPrimaryDocsSections() {
	return DOCS_PRIMARY_SECTIONS.map((section) => ({
		...section,
		items: DOCS_PAGES.filter(
			(page) => page.section === section.key && page.primaryNav
		).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
	}));
}

export function getPrimaryDocsTraversal() {
	return DOCS_PAGES.filter((page) => page.primaryNav).sort(
		(a, b) =>
			DOCS_PRIMARY_SECTIONS.findIndex((section) => section.key === a.section) -
				DOCS_PRIMARY_SECTIONS.findIndex(
					(section) => section.key === b.section
				) || (a.order ?? 0) - (b.order ?? 0)
	);
}

export function getDocsNextPrevious(href: string) {
	const traversal = getPrimaryDocsTraversal();
	const index = traversal.findIndex((page) => page.href === href);

	if (index < 0) {
		return { previous: null, next: null };
	}

	return {
		previous: traversal[index - 1] ?? null,
		next: traversal[index + 1] ?? null,
	};
}

export function getSecondaryDocsPages() {
	return DOCS_PAGES.filter((page) => page.audience === 'secondary');
}

export function getDocsHomeSections() {
	return getPrimaryDocsSections().map((section) => ({
		...section,
		featured: section.items.slice(0, 3),
	}));
}
