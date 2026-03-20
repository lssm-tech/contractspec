'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import type {
	RegistryTemplate,
	TemplateId,
} from '@contractspec/lib.example-shared-ui';
import { useRegistryTemplates } from '@contractspec/lib.example-shared-ui';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tooltip';
import { getTemplate } from '@contractspec/module.examples';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { StudioSignupSection } from '../marketing';
import { TemplatePreviewModal } from './TemplatesPreviewModal';

const templates = [
	{
		id: 'minimal-example',
		templateId: 'todos-app' as TemplateId,
		title: 'Minimal Example',
		description:
			'A minimal template to get you running in minutes. Perfect for exploring the engine.',
		tags: ['Getting Started'],
		capabilities: 'Basic Forms, Auth',
		isStarter: true,
		previewUrl: '/sandbox?template=minimal-example',
		docsUrl: '/docs/getting-started/hello-world',
	},
	// ============================================
	// Phase 1 Examples (using cross-cutting modules)
	// ============================================
	{
		id: 'saas-boilerplate',
		templateId: 'saas-boilerplate' as TemplateId,
		title: 'SaaS Boilerplate',
		description:
			'Complete SaaS foundation with multi-tenant orgs, projects, settings, and billing usage.',
		tags: ['Getting Started', 'SaaS', 'Business'],
		capabilities: 'Multi-tenancy, RBAC, Projects, Billing',
		isNew: true,
		previewUrl: '/sandbox?template=saas-boilerplate',
		docsUrl: '/docs/templates/saas-boilerplate',
	},
	{
		id: 'crm-pipeline',
		templateId: 'crm-pipeline' as TemplateId,
		title: 'CRM Pipeline',
		description:
			'Sales CRM with contacts, companies, deals, pipeline stages, and task management.',
		tags: ['CRM', 'Business'],
		capabilities: 'Contacts, Deals, Pipelines, Tasks',
		isNew: true,
		previewUrl: '/sandbox?template=crm-pipeline',
		docsUrl: '/docs/templates/crm-pipeline',
	},
	{
		id: 'agent-console',
		templateId: 'agent-console' as TemplateId,
		title: 'AI Agent Console',
		description:
			'AI agent orchestration platform with tools, agents, runs, and execution logs.',
		tags: ['AI', 'Ops'],
		capabilities: 'Tools, Agents, Runs, Metrics',
		isNew: true,
		previewUrl: '/sandbox?template=agent-console',
		docsUrl: '/docs/templates/agent-console',
	},
	// ============================================
	// Phase 2-4 Examples
	// ============================================
	{
		id: 'workflow-system',
		templateId: 'workflow-system' as TemplateId,
		title: 'Workflow / Approval System',
		description:
			'Multi-step workflows with role-based approvals and state transitions.',
		tags: ['Business', 'Ops'],
		capabilities: 'Workflows, Approvals, State Machine',
		isNew: true,
		previewUrl: '/sandbox?template=workflow-system',
		docsUrl: '/docs/templates/workflow-system',
	},
	{
		id: 'marketplace',
		templateId: 'marketplace' as TemplateId,
		title: 'Marketplace',
		description:
			'Two-sided marketplace with stores, products, orders, and payouts.',
		tags: ['Business', 'Payments'],
		capabilities: 'Stores, Products, Orders, Payouts',
		isNew: true,
		previewUrl: '/sandbox?template=marketplace',
		docsUrl: '/docs/templates/marketplace',
	},
	{
		id: 'integration-hub',
		templateId: 'integration-hub' as TemplateId,
		title: 'Integration Hub',
		description:
			'Third-party integrations with connections, sync configs, and field mapping.',
		tags: ['Ops', 'AI'],
		capabilities: 'Integrations, Connections, Sync',
		isNew: true,
		previewUrl: '/sandbox?template=integration-hub',
		docsUrl: '/docs/templates/integration-hub',
	},
	// ============================================
	// Learning Journeys
	// ============================================
	{
		id: 'learning-journey-studio-onboarding',
		templateId: 'learning-journey-studio-onboarding' as TemplateId,
		title: 'Learning Journey — Studio Getting Started',
		description:
			'First 30 minutes in Studio: choose template, edit spec, regenerate, playground, evolution.',
		tags: ['Learning', 'Onboarding'],
		capabilities: 'Spec-first onboarding, XP/streak, progress widget',
		isNew: true,
		previewUrl: '/sandbox?template=learning-journey-studio-onboarding',
		docsUrl: '/docs/templates/learning-journey-studio-onboarding',
	},
	{
		id: 'learning-journey-platform-tour',
		templateId: 'learning-journey-platform-tour' as TemplateId,
		title: 'Learning Journey — Platform Primitives Tour',
		description:
			'Touch identity, audit, notifications, jobs, flags, files, metering once with guided steps.',
		tags: ['Learning', 'Platform'],
		capabilities: 'Cross-module tour with event-driven completion',
		isNew: true,
		previewUrl: '/sandbox?template=learning-journey-platform-tour',
		docsUrl: '/docs/templates/learning-journey-platform-tour',
	},
	{
		id: 'learning-journey-crm-onboarding',
		templateId: 'learning-journey-crm-onboarding' as TemplateId,
		title: 'Learning Journey — CRM First Win',
		description:
			'Get to first closed-won deal: pipeline, contact/company, deal, stages, follow-up.',
		tags: ['Learning', 'CRM'],
		capabilities: 'CRM onboarding with XP/streak/badge',
		isNew: true,
		previewUrl: '/sandbox?template=learning-journey-crm-onboarding',
		docsUrl: '/docs/templates/learning-journey-crm-onboarding',
	},
	{
		id: 'analytics-dashboard',
		templateId: 'analytics-dashboard' as TemplateId,
		title: 'Analytics Dashboard',
		description:
			'Custom dashboards with widgets, saved queries, and real-time visualization.',
		tags: ['Business', 'Ops'],
		capabilities: 'Dashboards, Widgets, Queries',
		isNew: true,
		previewUrl: '/sandbox?template=analytics-dashboard',
		docsUrl: '/docs/templates/analytics-dashboard',
	},
	// ============================================
	// Classic Templates
	// ============================================
	{
		id: 'plumber-ops',
		templateId: 'messaging-app' as TemplateId,
		title: 'Plumber Ops',
		description:
			'Complete workflow: Quotes → Deposit → Job → Invoice → Payment. Policy-enforced approvals.',
		tags: ['Trades', 'Payments'],
		capabilities: 'Quotes, Jobs, Invoicing, Payments',
		previewUrl: '/sandbox?template=plumber-ops',
		docsUrl: '/docs/specs/workflows',
	},
	{
		id: 'coliving-management',
		templateId: 'recipe-app-i18n' as TemplateId,
		title: 'Coliving Management',
		description:
			'Coliving management: Onboarding, chores, shared wallet. Multi-party approvals built-in.',
		tags: ['Coliving', 'Finance'],
		capabilities: 'Tasks, Approvals, Payments',
		previewUrl: '/sandbox?template=coliving-management',
		docsUrl: '/docs/specs/workflows',
	},
	{
		id: 'chores-allowance',
		templateId: 'todos-app' as TemplateId,
		title: 'Chores & Allowance',
		description:
			'Family task management with approval workflows. Teach financial accountability safely.',
		tags: ['Family', 'Ops'],
		capabilities: 'Tasks, Approvals, Notifications',
		previewUrl: '/sandbox?template=chores-allowance',
		docsUrl: '/docs/specs/workflows',
	},
	{
		id: 'service-dispatch',
		templateId: 'messaging-app' as TemplateId,
		title: 'Service Dispatch',
		description:
			'Field service scheduling, routing, and invoicing. Real-time coordination with policy gates.',
		tags: ['Ops', 'Trades'],
		capabilities: 'Scheduling, Maps, Invoicing',
		previewUrl: '/sandbox?template=service-dispatch',
		docsUrl: '/docs/specs/workflows',
	},
	{
		id: 'content-review',
		templateId: 'todos-app' as TemplateId,
		title: 'Content Review',
		description:
			'Multi-stage approval workflow for content. Audit trail for every decision.',
		tags: ['Ops'],
		capabilities: 'Workflows, Approvals, Comments',
		previewUrl: '/sandbox?template=content-review',
		docsUrl: '/docs/specs/workflows',
	},
];
type LocalTemplate = (typeof templates)[number];

const allTags = [
	'Getting Started',
	'SaaS',
	'Business',
	'CRM',
	'AI',
	'Trades',
	'Coliving',
	'Family',
	'Ops',
	'Payments',
	'Learning',
	'Platform',
];

export const TemplatesPage = () => {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [preview, setPreview] = useState<TemplateId | null>(null);
	const [studioSignupModalOpen, setStudioSignupModalOpen] = useState(false);
	const [source, setSource] = useState<'local' | 'registry'>('local');
	const [selectedTemplateForCommand, setSelectedTemplateForCommand] = useState<
		RegistryTemplate | LocalTemplate | null
	>(null);

	const { data: registryTemplates = [], isLoading: registryLoading } =
		useRegistryTemplates();

	const filtered = templates.filter((t) => {
		const matchTag = !selectedTag || t.tags.includes(selectedTag);
		const matchSearch =
			!search ||
			t.title.toLowerCase().includes(search.toLowerCase()) ||
			t.description.toLowerCase().includes(search.toLowerCase());
		return matchTag && matchSearch;
	});

	const commandId = selectedTemplateForCommand
		? 'templateId' in selectedTemplateForCommand
			? selectedTemplateForCommand.templateId
			: selectedTemplateForCommand.id
		: '';

	return (
		<TooltipProvider>
			<main>
				<section className="section-padding hero-gradient border-border/70 border-b">
					<div className="editorial-shell space-y-8">
						<div className="max-w-4xl space-y-5">
							<p className="editorial-kicker">Proof through real scenarios</p>
							<h1 className="editorial-title">
								Templates that show the open system in practice.
							</h1>
							<p className="editorial-subtitle">
								These scenarios are the fastest way to understand ContractSpec:
								explicit contracts, aligned surfaces, and an adoption path from
								OSS exploration into Studio deployment.
							</p>
						</div>
						<div className="editorial-proof-strip">
							<div className="editorial-stat">
								<span className="editorial-stat-value">{templates.length}</span>
								<span className="editorial-label">curated scenarios</span>
							</div>
							<div className="editorial-stat">
								<span className="editorial-stat-value">2</span>
								<span className="editorial-label">entry paths</span>
							</div>
							<div className="editorial-stat">
								<span className="editorial-stat-value">OSS</span>
								<span className="editorial-label">first, Studio second</span>
							</div>
						</div>
					</div>
				</section>

				<section className="editorial-section">
					<div className="editorial-shell space-y-6">
						<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
							<div className="max-w-3xl space-y-3">
								<p className="editorial-kicker">Browse by source</p>
								<h2 className="font-serif text-4xl tracking-[-0.04em]">
									Use local scenarios for core proof, then scan the community.
								</h2>
								<p className="text-muted-foreground text-sm leading-7">
									Local templates show the official adoption path. Community
									templates show where the ecosystem is pushing the system next.
								</p>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => setSource('local')}
									className={cn(
										'rounded-full px-4 py-2 font-medium text-sm transition-colors',
										{
											'bg-primary text-primary-foreground': source === 'local',
											'border border-border bg-card hover:bg-card/80':
												source !== 'local',
										}
									)}
									aria-pressed={source === 'local'}
								>
									Local
								</button>
								<button
									onClick={() => setSource('registry')}
									className={cn(
										'rounded-full px-4 py-2 font-medium text-sm transition-colors',
										{
											'bg-primary text-primary-foreground':
												source === 'registry',
											'border border-border bg-card hover:bg-card/80':
												source !== 'registry',
										}
									)}
									aria-pressed={source === 'registry'}
								>
									Community
								</button>
							</div>
						</div>
						<div className="editorial-panel space-y-5">
							<div className="relative">
								<Search
									className="absolute top-3.5 left-4 text-muted-foreground"
									size={18}
								/>
								<input
									type="text"
									placeholder="Search scenarios, industries, or capabilities"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="w-full rounded-full border border-border bg-background px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
									aria-label="Search templates"
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<button
									onClick={() => setSelectedTag(null)}
									className={cn(
										'rounded-full px-4 py-2 font-medium text-sm transition-colors',
										{
											'bg-primary text-primary-foreground':
												selectedTag === null,
											'border border-border bg-card hover:bg-card/80':
												selectedTag !== null,
										}
									)}
									aria-pressed={selectedTag === null}
								>
									All
								</button>
								{allTags.map((tag) => (
									<button
										key={tag}
										onClick={() => setSelectedTag(tag)}
										className={cn(
											'rounded-full px-4 py-2 font-medium text-sm transition-colors',
											{
												'bg-primary text-primary-foreground':
													selectedTag === tag,
												'border border-border bg-card hover:bg-card/80':
													selectedTag !== tag,
											}
										)}
										aria-pressed={selectedTag === tag}
									>
										{tag}
									</button>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="section-padding">
					<div className="editorial-shell">
						{source === 'registry' ? (
							registryLoading ? (
								<div className="py-12 text-center">
									<p className="text-muted-foreground">
										Loading community templates…
									</p>
								</div>
							) : registryTemplates.length === 0 ? (
								<div className="py-12 text-center">
									<p className="text-muted-foreground">
										No community templates found (configure
										`NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL`).
									</p>
								</div>
							) : (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{registryTemplates.map((t) => (
										<div
											key={t.id}
											className="editorial-panel relative flex flex-col space-y-4 transition-colors hover:border-[color:rgb(162_79_42_/_0.55)]"
										>
											<div>
												<h3 className="font-serif text-2xl tracking-[-0.03em]">
													{t.name}
												</h3>
												<p className="mt-1 text-muted-foreground text-sm">
													{t.description}
												</p>
											</div>
											<div className="flex-1 space-y-2">
												<div className="flex flex-wrap gap-1">
													{t.tags.map((tag) => (
														<span
															key={tag}
															className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] text-muted-foreground"
														>
															{tag}
														</span>
													))}
												</div>
											</div>
											<div className="flex gap-2 pt-4">
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															className="btn-ghost flex-1 text-center text-xs"
															onClick={() => {
																const local = getTemplate(t.id as TemplateId);
																if (!local) {
																	setSelectedTemplateForCommand(t);
																	return;
																}
																setPreview(t.id as TemplateId);
															}}
														>
															Preview
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Preview this template (if available locally)</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															className="btn-primary flex-1 text-center text-xs"
															onClick={() => {
																captureAnalyticsEvent(
																	analyticsEventNames.EXAMPLE_REPO_OPEN,
																	{
																		surface: 'templates',
																		templateId: t.id,
																		source: 'registry',
																	}
																);
																setSelectedTemplateForCommand(t);
															}}
														>
															Use Template
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Get CLI command</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</div>
									))}
								</div>
							)
						) : filtered.length === 0 ? (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">
									No templates match your filters. Try a different search.
								</p>
							</div>
						) : (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{filtered.map((template, i) => (
									<div
										key={i}
										className="editorial-panel relative flex flex-col space-y-4 transition-colors hover:border-[color:rgb(162_79_42_/_0.55)]"
									>
										{'isNew' in template && template.isNew && (
											<span className="absolute top-4 right-4 rounded-full bg-[color:var(--success)] px-2.5 py-1 font-medium text-[11px] text-white uppercase">
												New
											</span>
										)}
										<div>
											<h3 className="font-serif text-2xl tracking-[-0.03em]">
												{template.title}
											</h3>
											<p className="mt-1 text-muted-foreground text-sm">
												{template.description}
											</p>
										</div>
										<div className="flex-1 space-y-2">
											<p className="text-muted-foreground text-xs">
												<span className="font-medium text-foreground">
													Capabilities:
												</span>{' '}
												{template.capabilities}
											</p>
											<div className="flex flex-wrap gap-1">
												{template.tags.map((tag) => (
													<span
														key={tag}
														className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] text-muted-foreground"
													>
														{tag}
													</span>
												))}
											</div>
										</div>
										<div className="flex gap-2 pt-4">
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														className="btn-ghost flex-1 text-center text-xs"
														onClick={() => setPreview(template.templateId)}
													>
														Preview
													</button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Preview this template in a modal</p>
												</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														className="btn-primary flex-1 text-center text-xs"
														onClick={() => {
															captureAnalyticsEvent(
																analyticsEventNames.EXAMPLE_REPO_OPEN,
																{
																	surface: 'templates',
																	templateId: template.templateId,
																	source: 'local',
																}
															);
															setSelectedTemplateForCommand(template);
														}}
													>
														Use Template
													</button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Get CLI command</p>
												</TooltipContent>
											</Tooltip>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>

				<section className="editorial-section bg-striped">
					<div className="editorial-shell space-y-8">
						<div className="max-w-3xl space-y-4">
							<p className="editorial-kicker">From template to real system</p>
							<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
								Templates become useful when the system can absorb more context.
							</h2>
							<p className="editorial-copy">
								Use templates to prove the base flow, then layer integrations,
								knowledge, and runtime behavior on top without losing the same
								contract source.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-3">
							<div className="editorial-panel space-y-4">
								<div className="text-3xl">💳</div>
								<h3 className="font-serif text-2xl tracking-[-0.03em]">
									Add payments
								</h3>
								<p className="text-muted-foreground text-sm">
									Connect Stripe to any template for payment processing,
									subscriptions, and invoicing. Type-safe and policy-enforced.
								</p>
								<Link
									href="/docs/integrations/stripe"
									className="font-medium text-[color:var(--blue)] text-sm hover:opacity-80"
								>
									Learn more →
								</Link>
							</div>
							<div className="editorial-panel space-y-4">
								<div className="text-3xl">📧</div>
								<h3 className="font-serif text-2xl tracking-[-0.03em]">
									Add notifications
								</h3>
								<p className="text-muted-foreground text-sm">
									Send transactional emails via Postmark or Resend. Process
									inbound emails with Gmail API. SMS via Twilio.
								</p>
								<Link
									href="/docs/integrations"
									className="font-medium text-[color:var(--blue)] text-sm hover:opacity-80"
								>
									View integrations →
								</Link>
							</div>
							<div className="editorial-panel space-y-4">
								<div className="text-3xl">🧠</div>
								<h3 className="font-serif text-2xl tracking-[-0.03em]">
									Add AI and knowledge
								</h3>
								<p className="text-muted-foreground text-sm">
									Power templates with OpenAI, vector search via Qdrant, and
									structured knowledge spaces for context-aware workflows.
								</p>
								<Link
									href="/docs/knowledge"
									className="font-medium text-[color:var(--blue)] text-sm hover:opacity-80"
								>
									Learn about knowledge →
								</Link>
							</div>
						</div>
						<div className="pt-4 text-center">
							<p className="mb-4 text-muted-foreground text-sm">
								All integrations are configured per-tenant with automatic health
								checks and credential rotation.
							</p>
							<Link href="/docs/architecture" className="btn-primary">
								View Architecture
							</Link>
						</div>
					</div>
				</section>
			</main>

			{/*{preview ? (*/}
			<TemplatePreviewModal
				templateId={preview}
				onClose={() => {
					setPreview(null);
				}}
			/>
			{/*) : null}*/}

			<Dialog
				open={studioSignupModalOpen}
				onOpenChange={setStudioSignupModalOpen}
			>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Deploy in Studio</DialogTitle>
						<DialogDescription>
							Deploy templates in ContractSpec Studio and run the full
							evidence-to-spec loop with your team.
						</DialogDescription>
					</DialogHeader>
					<StudioSignupSection variant="compact" />
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!selectedTemplateForCommand}
				onOpenChange={() => setSelectedTemplateForCommand(null)}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Use this template</DialogTitle>
						<DialogDescription>
							Initialize a new project with this template using the CLI.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 pt-4">
						<div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-50">
							npx contractspec init --template {commandId}
						</div>
						<div className="flex gap-2">
							<button
								className="btn-secondary w-full"
								onClick={() => {
									navigator.clipboard.writeText(
										`npx contractspec init --template ${commandId}`
									);
									captureAnalyticsEvent(
										analyticsEventNames.COPY_COMMAND_CLICK,
										{
											surface: 'templates',
											templateId: commandId,
											filename: 'templates-cli',
										}
									);
								}}
							>
								Copy Command
							</button>
						</div>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-border border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or
								</span>
							</div>
						</div>
						<button
							className="btn-ghost w-full text-sm"
							onClick={() => {
								captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
									surface: 'templates',
									templateId: commandId,
								});
								setSelectedTemplateForCommand(null);
								setStudioSignupModalOpen(true);
							}}
						>
							Deploy to Studio
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
};
