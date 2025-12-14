'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  FileText,
  GraduationCap,
  LayoutGrid,
  Play,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';
import {
  type ExampleSandboxMode,
  listExamples,
} from '@lssm/module.contractspec-examples';
import {
  listTemplates,
  type TemplateId,
} from '@lssm/bundle.contractspec-studio/templates/registry';
import type { CanvasState } from '@lssm/bundle.contractspec-studio/modules/visual-builder';
import {
  FloatingAssistant,
  LearningCoach,
  recordLearningEvent,
  WorkspaceProjectShellLayout,
} from '@lssm/bundle.contractspec-studio/presentation/components';

const TemplateShell = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.TemplateShell
    ),
  { ssr: false }
);

const MarkdownView = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.MarkdownView
    ),
  { ssr: false }
);

const BuilderPanel = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.BuilderPanel
    ),
  { ssr: false }
);

const SpecEditorPanel = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.SpecEditorPanel
    ),
  { ssr: false }
);

const EvolutionDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.EvolutionDashboard
    ),
  { ssr: false }
);

const TodosTaskList = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.TaskList
    ),
  { ssr: false }
);

const MessagingWorkspace = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.MessagingWorkspace
    ),
  { ssr: false }
);

const RecipesExperience = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.RecipeList
    ),
  { ssr: false }
);

const SaasDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.SaasDashboard
    ),
  { ssr: false }
);

const CrmDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.CrmDashboard
    ),
  { ssr: false }
);

const AgentDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.AgentDashboard
    ),
  { ssr: false }
);

const WorkflowDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.WorkflowDashboard
    ),
  { ssr: false }
);

const MarketplaceDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.MarketplaceDashboard
    ),
  { ssr: false }
);

const IntegrationDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.IntegrationDashboard
    ),
  { ssr: false }
);

const AnalyticsDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.AnalyticsDashboard
    ),
  { ssr: false }
);

const PolicySafeKnowledgeAssistantDashboard = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.PolicySafeKnowledgeAssistantDashboard
    ),
  { ssr: false }
);

type Mode = ExampleSandboxMode | 'learning';

const SpecEditor = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/SpecEditor').then(
      (m) => m.SpecEditor
    ),
  { ssr: false }
);

const StudioCanvas = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/StudioCanvas').then(
      (m) => m.StudioCanvas
    ),
  { ssr: false }
);

type SpecEditorPanelEditorProps = {
  projectId: string;
  type?: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  content: string;
  onChange: (content: string) => void;
  metadata?: Record<string, unknown>;
  onSave?: () => void;
  onValidate?: () => void;
};

function SpecEditorAdapter(props: SpecEditorPanelEditorProps) {
  return (
    <SpecEditor
      projectId={props.projectId}
      type={props.type}
      content={props.content}
      metadata={props.metadata}
      onChange={props.onChange}
      onSave={props.onSave}
      onValidate={props.onValidate}
    />
  );
}

type BuilderPanelCanvasProps = {
  state: {
    id: string;
    projectId: string;
    nodes: {
      id: string;
      type: string;
      props?: Record<string, unknown>;
      children?: {
        id: string;
        type: string;
        props?: Record<string, unknown>;
      }[];
    }[];
    updatedAt: string;
    versions: {
      id: string;
      label: string;
      status: 'draft' | 'deployed';
      nodes: {
        id: string;
        type: string;
        props?: Record<string, unknown>;
      }[];
      createdAt: string;
    }[];
  };
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
};

function StudioCanvasAdapter(props: BuilderPanelCanvasProps) {
  return (
    <StudioCanvas
      state={props.state as unknown as CanvasState}
      selectedNodeId={props.selectedNodeId}
      onSelectNode={props.onSelectNode}
    />
  );
}

const CORE_MODES: readonly Mode[] = [
  'playground',
  'specs',
  'builder',
  'markdown',
  'evolution',
  'learning',
] as const;

const MODULES: {
  id: Mode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'specs', label: 'Specs', icon: FileText },
  { id: 'builder', label: 'Builder', icon: LayoutGrid },
  { id: 'markdown', label: 'Markdown', icon: TerminalSquare },
  { id: 'evolution', label: 'Evolution', icon: Sparkles },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
];

export default function SandboxExperienceClient() {
  const templates = useMemo(() => listTemplates(), []);
  const examples = useMemo(() => listExamples(), []);
  const exampleById = useMemo(
    () => new Map(examples.map((e) => [e.id, e] as const)),
    [examples]
  );

  const [templateId, setTemplateId] = useState<TemplateId>('todos-app');
  const [mode, setMode] = useState<Mode>('playground');

  const allowedModes: readonly Mode[] = useMemo(() => {
    const example = exampleById.get(templateId);
    const exampleModes = example ? example.surfaces.sandbox.modes : CORE_MODES;
    return Array.from(new Set([...exampleModes, 'learning'] as const));
  }, [exampleById, templateId]);

  const displayName = useMemo(() => {
    const template = templates.find((t) => t.id === templateId);
    return template?.name ?? templateId;
  }, [templates, templateId]);

  const playground = useMemo(() => {
    switch (templateId) {
      case 'todos-app':
        return <TodosTaskList />;
      case 'messaging-app':
        return <MessagingWorkspace />;
      case 'recipe-app-i18n':
        return <RecipesExperience />;
      case 'saas-boilerplate':
        return <SaasDashboard />;
      case 'crm-pipeline':
        return <CrmDashboard />;
      case 'agent-console':
        return <AgentDashboard />;
      case 'workflow-system':
        return <WorkflowDashboard />;
      case 'marketplace':
        return <MarketplaceDashboard />;
      case 'integration-hub':
        return <IntegrationDashboard />;
      case 'analytics-dashboard':
        return <AnalyticsDashboard />;
      case 'policy-safe-knowledge-assistant':
        return <PolicySafeKnowledgeAssistantDashboard />;
      default:
        return <MarkdownView templateId={templateId} />;
    }
  }, [templateId]);

  const main = useMemo(() => {
    switch (mode) {
      case 'playground':
        return (
          <TemplateShell
            templateId={templateId}
            title={displayName}
            description="Local runtime (in-browser) preview."
            projectId="sandbox"
            showSaveAction={false}
          >
            {playground}
          </TemplateShell>
        );
      case 'specs':
        return (
          <SpecEditorPanel
            templateId={templateId}
            onLog={() => void 0}
            SpecEditor={SpecEditorAdapter}
          />
        );
      case 'builder':
        return (
          <BuilderPanel
            templateId={templateId}
            onLog={() => void 0}
            StudioCanvas={StudioCanvasAdapter}
          />
        );
      case 'markdown':
        return <MarkdownView templateId={templateId} />;
      case 'evolution':
        return (
          <EvolutionDashboard templateId={templateId} onLog={() => void 0} />
        );
      case 'learning':
        return (
          <div className="space-y-4">
            <LearningCoach
              mode="sandbox"
              onNavigateModule={(next: string) => setMode(next as Mode)}
            />
          </div>
        );
      default:
        return <MarkdownView templateId={templateId} />;
    }
  }, [mode, templateId, displayName, playground]);

  const moduleOptions = MODULES.filter((m) => allowedModes.includes(m.id));

  return (
    <WorkspaceProjectShellLayout
      title="ContractSpec Sandbox"
      subtitle="Unlogged local preview (no auth, no analytics)"
      workspaceSelect={{
        label: 'Workspace',
        value: 'sandbox',
        options: [{ value: 'sandbox', label: 'Sandbox' }],
        onChange: () => void 0,
      }}
      projectSelect={{
        label: 'Template',
        value: templateId,
        options: templates.map((t) => ({ value: t.id, label: t.name })),
        onChange: (value: string) => {
          setTemplateId(value as TemplateId);
          recordLearningEvent({
            name: 'sandbox.template.selected',
            ts: Date.now(),
            payload: { templateId: value },
          });
          if (!allowedModes.includes(mode)) {
            setMode(allowedModes[0] ?? 'playground');
          }
        },
      }}
      environmentSelect={{
        label: 'Environment',
        value: 'local',
        options: [{ value: 'local', label: 'Local (in-browser)' }],
        onChange: () => void 0,
      }}
      modules={moduleOptions.map((m) => ({
        id: m.id,
        label: m.label,
        icon: <m.icon className="h-4 w-4" />,
      }))}
      activeModuleId={mode}
      onModuleChange={(next: string) => {
        recordLearningEvent({
          name: `sandbox.module.opened:${next}`,
          ts: Date.now(),
        });
        setMode(next as Mode);
      }}
      assistant={
        <FloatingAssistant
          context={{
            mode: 'sandbox',
            lifecycleEnabled: false,
            templateId,
          }}
        />
      }
    >
      {main}
    </WorkspaceProjectShellLayout>
  );
}
