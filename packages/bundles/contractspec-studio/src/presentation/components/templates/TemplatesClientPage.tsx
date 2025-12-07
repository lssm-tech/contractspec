'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@lssm/lib.ui-kit-core/utils';
import Link from 'next/link';

import dynamic from 'next/dynamic';
import type { TemplateId } from '../../../templates/registry';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lssm/lib.ui-kit-web/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lssm/lib.ui-kit-web/ui/dialog';
import { WaitlistSection } from '../marketing';

// Dynamically import template components with ssr: false to avoid SSR issues with sql.js
const TemplateShell = dynamic(
  () => import('./shared/TemplateShell').then((mod) => mod.TemplateShell),
  { ssr: false }
);

const TodosTaskList = dynamic(
  () => import('./todos/TaskList').then((mod) => mod.TaskList),
  { ssr: false }
);

const MessagingWorkspace = dynamic(
  () =>
    import('./messaging/MessagingWorkspace').then(
      (mod) => mod.MessagingWorkspace
    ),
  { ssr: false }
);

const RecipesExperience = dynamic(
  () => import('./recipes/RecipeList').then((mod) => mod.RecipeList),
  { ssr: false }
);

const SaasDashboard = dynamic(
  () => import('./saas/SaasDashboard').then((mod) => mod.SaasDashboard),
  { ssr: false }
);

const CrmDashboard = dynamic(
  () => import('./crm/CrmDashboard').then((mod) => mod.CrmDashboard),
  { ssr: false }
);

const AgentDashboard = dynamic(
  () =>
    import('./agent-console/AgentDashboard').then((mod) => mod.AgentDashboard),
  { ssr: false }
);

const WorkflowDashboard = dynamic(
  () =>
    import('./workflow-system/WorkflowDashboard').then(
      (mod) => mod.WorkflowDashboard
    ),
  { ssr: false }
);

const MarketplaceDashboard = dynamic(
  () =>
    import('./marketplace/MarketplaceDashboard').then(
      (mod) => mod.MarketplaceDashboard
    ),
  { ssr: false }
);

const IntegrationDashboard = dynamic(
  () =>
    import('./integration-hub/IntegrationDashboard').then(
      (mod) => mod.IntegrationDashboard
    ),
  { ssr: false }
);

const AnalyticsDashboard = dynamic(
  () =>
    import('./analytics-dashboard/AnalyticsDashboard').then(
      (mod) => mod.AnalyticsDashboard
    ),
  { ssr: false }
);

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
];

export const TemplatesPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<TemplateId | null>(null);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  const filtered = templates.filter((t) => {
    const matchTag = !selectedTag || t.tags.includes(selectedTag);
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <TooltipProvider>
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding hero-gradient border-border relative border-b">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <h1 className="text-5xl leading-tight font-bold md:text-6xl">
              Recipe templates
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready-to-use, customizable recipes. Policies built in. One-click
              deploy.
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="section-padding border-border border-b">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="relative">
              <Search
                className="text-muted-foreground absolute top-3 left-3"
                size={20}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card border-border w-full rounded-lg border py-3 pr-4 pl-10 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                aria-label="Search templates"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-violet-500 text-white'
                    : 'bg-card border-border hover:bg-card/80 border'
                }`}
                aria-pressed={selectedTag === null}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors`,
                    {
                      'bg-violet-500 text-white': selectedTag === tag,
                      'bg-card border-border hover:bg-card/80 border':
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
        </section>

        {/* Templates Grid */}
        <section className="section-padding">
          <div className="mx-auto max-w-6xl">
            {filtered.length === 0 ? (
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
                    className="card-subtle relative flex flex-col space-y-4 p-6 transition-colors hover:border-violet-500/50"
                  >
                    {'isNew' in template && template.isNew && (
                      <span className="absolute top-3 right-3 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{template.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-muted-foreground text-xs">
                        <span className="text-foreground font-medium">
                          Capabilities:
                        </span>{' '}
                        {template.capabilities}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-300"
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
                            onClick={() => setWaitlistModalOpen(true)}
                          >
                            Try now
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Join waitlist for early access</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Extend with Integrations & Knowledge */}
        <section className="section-padding border-border bg-striped border-t">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Extend templates with integrations & knowledge
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Every template can be enhanced with built-in integrations and
                knowledge spaces. Add payments, email, AI, and structured
                knowledge without writing integration code.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card-subtle space-y-4 p-6">
                <div className="text-3xl">💳</div>
                <h3 className="font-bold">Add Payments</h3>
                <p className="text-muted-foreground text-sm">
                  Connect Stripe to any template for payment processing,
                  subscriptions, and invoicing. Type-safe and policy-enforced.
                </p>
                <Link
                  href="/docs/integrations/stripe"
                  className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                >
                  Learn more →
                </Link>
              </div>
              <div className="card-subtle space-y-4 p-6">
                <div className="text-3xl">📧</div>
                <h3 className="font-bold">Add Notifications</h3>
                <p className="text-muted-foreground text-sm">
                  Send transactional emails via Postmark or Resend. Process
                  inbound emails with Gmail API. SMS via Twilio.
                </p>
                <Link
                  href="/docs/integrations"
                  className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                >
                  View integrations →
                </Link>
              </div>
              <div className="card-subtle space-y-4 p-6">
                <div className="text-3xl">🧠</div>
                <h3 className="font-bold">Add AI & Knowledge</h3>
                <p className="text-muted-foreground text-sm">
                  Power templates with OpenAI, vector search via Qdrant, and
                  structured knowledge spaces for context-aware workflows.
                </p>
                <Link
                  href="/docs/knowledge"
                  className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                >
                  Learn about knowledge →
                </Link>
              </div>
            </div>
            <div className="pt-4 text-center">
              <p className="text-muted-foreground mb-4 text-sm">
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

      {preview ? (
        <TemplatePreviewModal
          templateId={preview}
          onClose={() => setPreview(null)}
        />
      ) : null}

      <Dialog open={waitlistModalOpen} onOpenChange={setWaitlistModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Early Access Required</DialogTitle>
            <DialogDescription>
              ContractSpec is in design-partner early access. Join the waitlist
              to get access to try templates and build with ContractSpec.
            </DialogDescription>
          </DialogHeader>
          <WaitlistSection variant="compact" />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

interface TemplatePreviewModalProps {
  templateId: TemplateId;
  onClose: () => void;
}

function TemplatePreviewModal({
  templateId,
  onClose,
}: TemplatePreviewModalProps) {
  const previewComponent = useMemo(() => {
    switch (templateId) {
      case 'todos-app':
        return (
          <TemplateShell
            templateId="todos-app"
            title="Starter tasks"
            description="Track work items with filters, priorities, and per-tenant data isolation."
            showSaveAction={false}
          >
            <TodosTaskList />
          </TemplateShell>
        );
      case 'messaging-app':
        return (
          <TemplateShell
            templateId="messaging-app"
            title="Messaging workspace"
            description="Realtime-ready messaging surface with optimistic delivery."
            showSaveAction={false}
          >
            <MessagingWorkspace />
          </TemplateShell>
        );
      case 'recipe-app-i18n':
        return (
          <TemplateShell
            templateId="recipe-app-i18n"
            title="Ceremony recipes"
            description="Switch locales and preview how rituals translate across teams."
            showSaveAction={false}
          >
            <RecipesExperience />
          </TemplateShell>
        );
      case 'saas-boilerplate':
        return (
          <TemplateShell
            templateId="saas-boilerplate"
            title="SaaS Boilerplate"
            description="Multi-tenant organizations, projects, settings, and billing usage tracking."
            showSaveAction={false}
          >
            <SaasDashboard />
          </TemplateShell>
        );
      case 'crm-pipeline':
        return (
          <TemplateShell
            templateId="crm-pipeline"
            title="CRM Pipeline"
            description="Sales CRM with contacts, companies, deals, and pipeline stages."
            showSaveAction={false}
          >
            <CrmDashboard />
          </TemplateShell>
        );
      case 'agent-console':
        return (
          <TemplateShell
            templateId="agent-console"
            title="AI Agent Console"
            description="AI agent orchestration with tools, agents, runs, and execution logs."
            showSaveAction={false}
          >
            <AgentDashboard />
          </TemplateShell>
        );
      case 'workflow-system':
        return (
          <TemplateShell
            templateId="workflow-system"
            title="Workflow System"
            description="Multi-step workflows with role-based approvals."
            showSaveAction={false}
          >
            <WorkflowDashboard />
          </TemplateShell>
        );
      case 'marketplace':
        return (
          <TemplateShell
            templateId="marketplace"
            title="Marketplace"
            description="Two-sided marketplace with stores, products, and orders."
            showSaveAction={false}
          >
            <MarketplaceDashboard />
          </TemplateShell>
        );
      case 'integration-hub':
        return (
          <TemplateShell
            templateId="integration-hub"
            title="Integration Hub"
            description="Third-party integrations with sync and field mapping."
            showSaveAction={false}
          >
            <IntegrationDashboard />
          </TemplateShell>
        );
      case 'analytics-dashboard':
        return (
          <TemplateShell
            templateId="analytics-dashboard"
            title="Analytics Dashboard"
            description="Custom dashboards with widgets and queries."
            showSaveAction={false}
          >
            <AnalyticsDashboard />
          </TemplateShell>
        );
      default:
        return null;
    }
  }, [templateId]);

  if (!previewComponent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
      <div className="bg-background relative h-full max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl p-6 shadow-2xl">
        <button
          type="button"
          className="btn-ghost absolute top-4 right-4 text-sm"
          onClick={onClose}
        >
          Close
        </button>
        {previewComponent}
      </div>
    </div>
  );
}
