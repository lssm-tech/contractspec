'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import dynamic from 'next/dynamic';
import type { TemplateId } from '@lssm/bundle.contractspec-studio/templates/registry';
import { staticShouldNotHappen } from '@lssm/lib.utils-typescript';

// Dynamically import template components with ssr: false to avoid SSR issues with sql.js
const TemplateShell = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.TemplateShell
    ),
  { ssr: false }
);

const TodosTaskList = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.TaskList
    ),
  { ssr: false }
);

const MessagingWorkspace = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.MessagingWorkspace
    ),
  { ssr: false }
);

const RecipesExperience = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.RecipeList
    ),
  { ssr: false }
);

const SaasDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.SaasDashboard
    ),
  { ssr: false }
);

const CrmDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.CrmDashboard
    ),
  { ssr: false }
);

const AgentDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.AgentDashboard
    ),
  { ssr: false }
);

const WorkflowDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.WorkflowDashboard
    ),
  { ssr: false }
);

const MarketplaceDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.MarketplaceDashboard
    ),
  { ssr: false }
);

const IntegrationDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.IntegrationDashboard
    ),
  { ssr: false }
);

const AnalyticsDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.AnalyticsDashboard
    ),
  { ssr: false }
);

const SpecEditor = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/SpecEditor').then(
      (mod) => mod.SpecEditor
    ),
  { ssr: false }
);

const StudioCanvas = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/StudioCanvas').then(
      (mod) => mod.StudioCanvas
    ),
  { ssr: false }
);

const MarkdownView = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.MarkdownView
    ),
  { ssr: false }
);

const BuilderPanel = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.BuilderPanel
    ),
  { ssr: false }
);

const SpecEditorPanel = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.SpecEditorPanel
    ),
  { ssr: false }
);

const EvolutionDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.EvolutionDashboard
    ),
  { ssr: false }
);

const EvolutionSidebar = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.EvolutionSidebar
    ),
  { ssr: false }
);

const OverlayContextProvider = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.OverlayContextProvider
    ),
  { ssr: false }
);

const PersonalizationInsights = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.PersonalizationInsights
    ),
  { ssr: false }
);

const LearningTrackList = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (mod) => mod.LearningTrackList
    ),
  { ssr: false }
);

type SandboxTemplateId = TemplateId;
type Mode = 'playground' | 'specs' | 'builder' | 'markdown' | 'evolution';

const TEMPLATE_LIBRARY: Record<
  SandboxTemplateId,
  { title: string; description: string; component: JSX.Element }
> = {
  'todos-app': {
    title: 'To-dos workflow',
    description:
      'Policies baked into every assignment, approvals, and deposits.',
    component: <TodosTaskList />,
  },
  'messaging-app': {
    title: 'Messaging surface',
    description: 'Realtime-ready messaging with optimistic delivery.',
    component: <MessagingWorkspace />,
  },
  'recipe-app-i18n': {
    title: 'Ceremony recipes',
    description: 'Flip between English and French without reloading.',
    component: <RecipesExperience />,
  },
  'saas-boilerplate': {
    title: 'SaaS Boilerplate',
    description: 'Multi-tenant orgs, projects, settings, and billing.',
    component: <SaasDashboard />,
  },
  'crm-pipeline': {
    title: 'CRM Pipeline',
    description: 'Contacts, deals, pipelines, and task management.',
    component: <CrmDashboard />,
  },
  'agent-console': {
    title: 'AI Agent Console',
    description: 'Tools, agents, runs, and execution metrics.',
    component: <AgentDashboard />,
  },
  'workflow-system': {
    title: 'Workflow System',
    description: 'Multi-step workflows with approvals and state machine.',
    component: <WorkflowDashboard />,
  },
  marketplace: {
    title: 'Marketplace',
    description: 'Stores, products, orders, payouts, and reviews.',
    component: <MarketplaceDashboard />,
  },
  'integration-hub': {
    title: 'Integration Hub',
    description: 'Third-party integrations with sync and mapping.',
    component: <IntegrationDashboard />,
  },
  'analytics-dashboard': {
    title: 'Analytics Dashboard',
    description: 'Dashboards, widgets, and saved queries.',
    component: <AnalyticsDashboard />,
  },
  'learning-journey-studio-onboarding': {
    title: 'Learning Journey — Studio',
    description: 'First 30 minutes in ContractSpec Studio (track steps).',
    component: (
      <LearningTrackList templateId="learning-journey-studio-onboarding" />
    ),
  },
  'learning-journey-platform-tour': {
    title: 'Learning Journey — Platform Tour',
    description: 'Cross-module tour using platform primitives.',
    component: (
      <LearningTrackList templateId="learning-journey-platform-tour" />
    ),
  },
  'learning-journey-crm-onboarding': {
    title: 'Learning Journey — CRM First Win',
    description: 'CRM onboarding journey to first closed-won.',
    component: (
      <LearningTrackList templateId="learning-journey-crm-onboarding" />
    ),
  },
  'learning-journey-duo-drills': {
    title: 'Learning Journey — Duo Drills',
    description: 'Drill/SRS learning journey with accuracy and mastery steps.',
    component: <LearningTrackList templateId="learning-journey-duo-drills" />,
  },
  'learning-journey-ambient-coach': {
    title: 'Learning Journey — Ambient Coach',
    description: 'Contextual tips with acknowledge/action completions.',
    component: (
      <LearningTrackList templateId="learning-journey-ambient-coach" />
    ),
  },
  'learning-journey-quest-challenges': {
    title: 'Learning Journey — Quest Challenges',
    description: 'Time-bound challenges with day unlocks and XP bonuses.',
    component: (
      <LearningTrackList templateId="learning-journey-quest-challenges" />
    ),
  },
};

/** Hook to track behavior events in the sandbox */
function useSandboxBehaviorTracking(
  templateId: TemplateId,
  mode: Mode,
  pushLog: (message: string) => void
) {
  const [eventCount, setEventCount] = useState(0);

  // Track template changes
  useEffect(() => {
    setEventCount((prev) => prev + 1);
  }, [templateId]);

  // Track mode changes
  useEffect(() => {
    setEventCount((prev) => prev + 1);
  }, [mode]);

  // Return event count for display
  return { eventCount };
}

export default function SandboxExperienceClient() {
  const [templateId, setTemplateId] = useState<TemplateId>('todos-app');
  const [mode, setMode] = useState<Mode>('playground');
  const [showEvolutionSidebar, setShowEvolutionSidebar] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'Sandbox ready – instant local runtime hydrated.',
  ]);

  const template = TEMPLATE_LIBRARY[templateId];

  const pushLog = useCallback((message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 6));
  }, []);

  // Behavior tracking
  const { eventCount } = useSandboxBehaviorTracking(templateId, mode, pushLog);

  // Handle expanding to evolution dashboard from sidebar
  const handleExpandToEvolution = useCallback(() => {
    setMode('evolution');
    pushLog('Expanded to Evolution dashboard');
  }, [pushLog]);

  // Check if sidebar should be shown for current mode
  const showSidebarForMode =
    mode === 'playground' || mode === 'specs' || mode === 'builder';

  const mainPanel = useMemo(() => {
    switch (mode) {
      case 'playground':
        return (
          <OverlayContextProvider
            templateId={templateId}
            role="user"
            device="desktop"
          >
            <TemplateShell
              templateId={templateId}
              title={template.title}
              description={template.description}
              projectId="sandbox"
              showSaveAction={false}
            >
              {template.component}
            </TemplateShell>
          </OverlayContextProvider>
        );
      case 'specs':
        return (
          <OverlayContextProvider
            templateId={templateId}
            role="user"
            device="desktop"
          >
            <SpecEditorPanel
              templateId={templateId}
              SpecEditor={
                SpecEditor as React.ComponentType<{
                  projectId: string;
                  type: 'CAPABILITY' | 'WORKFLOW' | 'COMPONENT' | 'INTEGRATION';
                  content: string;
                  onChange: (content: string) => void;
                  metadata?: Record<string, unknown>;
                  onValidate?: () => void;
                }>
              }
              onLog={pushLog}
            />
          </OverlayContextProvider>
        );
      case 'builder':
        return (
          <OverlayContextProvider
            templateId={templateId}
            role="user"
            device="desktop"
          >
            <BuilderPanel
              templateId={templateId}
              StudioCanvas={StudioCanvas}
              onLog={pushLog}
            />
          </OverlayContextProvider>
        );
      case 'markdown':
        return (
          <div className="border-border bg-card rounded-2xl border p-4">
            <MarkdownView templateId={templateId} />
          </div>
        );
      case 'evolution':
        return (
          <div className="border-border bg-card rounded-2xl border p-4">
            <EvolutionDashboard templateId={templateId} onLog={pushLog} />
          </div>
        );
      default:
        staticShouldNotHappen(mode);
        return null;
    }
  }, [mode, template, templateId, pushLog]);

  return (
    <main className="section-padding space-y-8 py-16 pt-24">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Live sandbox
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">
          Preview templates, specs, and builder flows in your browser.
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-base">
          Toggle between fully local templates, spec editing, and the visual
          builder without provisioning any infrastructure. Data stays in-memory
          so you can rehearse safely.
        </p>
      </header>

      <div
      //className="grid gap-6 lg:grid-cols-[240px,1fr]"
      >
        <aside className="border-border bg-card rounded-2xl border p-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Templates
          </p>
          <div className="mt-3 grid grid-cols-1 justify-center gap-2 md:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(TEMPLATE_LIBRARY) as TemplateId[]).map((id) => (
              <button
                key={id}
                type="button"
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                  templateId === id
                    ? 'text-foreground border-violet-500 bg-violet-500/10'
                    : 'border-border hover:border-violet-500/40'
                }`}
                onClick={() => {
                  setTemplateId(id);
                  pushLog(`Switched to template ${id}`);
                }}
              >
                {TEMPLATE_LIBRARY[id].title}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mt-6 text-xs font-semibold tracking-wide uppercase">
            Modes
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
            {(
              [
                'playground',
                'specs',
                'builder',
                'markdown',
                'evolution',
              ] as Mode[]
            ).map((modeId) => (
              <button
                key={modeId}
                type="button"
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                  mode === modeId
                    ? 'text-foreground border-violet-500 bg-violet-500/10'
                    : 'border-border hover:border-violet-500/40'
                }`}
                onClick={() => {
                  setMode(modeId);
                  pushLog(`Mode changed to ${modeId}`);
                }}
              >
                {modeId === 'playground'
                  ? 'Template playground'
                  : modeId === 'specs'
                    ? 'Spec editor'
                    : modeId === 'builder'
                      ? 'Visual builder'
                      : modeId === 'markdown'
                        ? 'Markdown preview'
                        : '🤖 AI Evolution'}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content with optional sidebar */}
        <div
          className={`grid gap-6 ${showSidebarForMode && showEvolutionSidebar ? 'lg:grid-cols-[1fr,320px]' : ''}`}
        >
          <section className="space-y-4">{mainPanel}</section>

          {/* Evolution Sidebar - shown in playground, specs, and builder modes */}
          {showSidebarForMode && showEvolutionSidebar && (
            <aside className="space-y-4">
              <EvolutionSidebar
                templateId={templateId}
                onLog={pushLog}
                onOpenEvolution={handleExpandToEvolution}
              />

              {/* Personalization toggle button */}
              {!showInsights && (
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm transition hover:bg-blue-500/20"
                  onClick={() => setShowInsights(true)}
                >
                  <span>📊</span>
                  <span>Show Insights ({eventCount} events)</span>
                </button>
              )}

              {showInsights && (
                <PersonalizationInsights
                  templateId={templateId}
                  onToggle={() => setShowInsights(false)}
                />
              )}
            </aside>
          )}
        </div>

        {/* Toggle sidebar button when hidden */}
        {showSidebarForMode && !showEvolutionSidebar && (
          <button
            type="button"
            className="fixed right-4 bottom-24 z-50 flex items-center gap-2 rounded-full border border-violet-500/50 bg-violet-500/20 px-4 py-2 text-sm shadow-lg backdrop-blur transition hover:bg-violet-500/30"
            onClick={() => setShowEvolutionSidebar(true)}
          >
            <span>🤖</span>
            <span>AI Insights</span>
          </button>
        )}

        {/* Hide sidebar toggle in sidebar modes */}
        {showSidebarForMode && showEvolutionSidebar && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground text-xs underline"
              onClick={() => setShowEvolutionSidebar(false)}
            >
              Hide AI sidebar
            </button>
          </div>
        )}
      </div>

      <section className="border-border bg-card rounded-2xl border p-4">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Runtime console
        </p>
        <div className="text-muted-foreground mt-3 space-y-1 font-mono text-xs">
          {logs.map((entry, index) => (
            <p key={`${entry}-${index}`}>→ {entry}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
