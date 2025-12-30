'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, EmptyState } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';
import { listExamples } from '@contractspec/module.examples';
import {
  listTemplates,
  type TemplateId,
} from '@contractspec/bundle.library/lib/registry';

const TemplateShell = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.TemplateShell),
  { ssr: false }
);

const MarkdownView = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.MarkdownView),
  { ssr: false }
);

const BuilderPanel = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.BuilderPanel),
  { ssr: false }
);

const SpecEditorPanel = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.SpecEditorPanel),
  { ssr: false }
);

const EvolutionDashboard = dynamic(
  () =>
    import('@contractspec/bundle.library').then((m) => m.EvolutionDashboard),
  { ssr: false }
);

const TodosTaskList = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.TaskList),
  { ssr: false }
);

const MessagingWorkspace = dynamic(
  () =>
    import('@contractspec/bundle.library').then((m) => m.MessagingWorkspace),
  { ssr: false }
);

const RecipesExperience = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.RecipeList),
  { ssr: false }
);

const SaasDashboard = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.SaasDashboard),
  { ssr: false }
);

const CrmDashboard = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.CrmDashboard),
  { ssr: false }
);

const AgentDashboard = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.AgentDashboard),
  { ssr: false }
);

const WorkflowDashboard = dynamic(
  () => import('@contractspec/bundle.library').then((m) => m.WorkflowDashboard),
  { ssr: false }
);

const MarketplaceDashboard = dynamic(
  () =>
    import('@contractspec/bundle.library').then((m) => m.MarketplaceDashboard),
  { ssr: false }
);

const IntegrationDashboard = dynamic(
  () =>
    import('@contractspec/bundle.library').then((m) => m.IntegrationDashboard),
  { ssr: false }
);

const AnalyticsDashboard = dynamic(
  () =>
    import('@contractspec/bundle.library').then((m) => m.AnalyticsDashboard),
  { ssr: false }
);

const PolicySafeKnowledgeAssistantDashboard = dynamic(
  () =>
    import('@contractspec/bundle.library').then(
      (m) => m.PolicySafeKnowledgeAssistantDashboard
    ),
  { ssr: false }
);

type Mode = (typeof CORE_TEMPLATE_MODES)[number];

const CORE_TEMPLATE_MODES = [
  'playground',
  'specs',
  'builder',
  'markdown',
  'evolution',
] as const;

export function SandboxExperienceClient() {
  const templates = useMemo(() => listTemplates(), []);
  const examples = useMemo(() => listExamples(), []);
  const exampleById = useMemo(
    () => new Map(examples.map((e) => [e.meta.key, e] as const)),
    [examples]
  );

  const [templateId, setTemplateId] = useState<TemplateId>('todos-app');
  const [mode, setMode] = useState<Mode>('playground');

  const allowedModes: readonly Mode[] = useMemo(() => {
    const example = exampleById.get(templateId);
    if (!example) return CORE_TEMPLATE_MODES;
    return example.surfaces.sandbox.modes;
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
        return <MarkdownFallback templateId={templateId} />;
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
            SpecEditor={dynamic(() =>
              import('@contractspec/bundle.studio/presentation/components/studio/organisms/SpecEditor').then(
                (m) => m.SpecEditor
              )
            )}
          />
        );
      case 'builder':
        return (
          <BuilderPanel
            templateId={templateId}
            onLog={() => void 0}
            StudioCanvas={dynamic(() =>
              import('@contractspec/bundle.studio/presentation/components/studio/organisms/StudioCanvas').then(
                (m) => m.StudioCanvas
              )
            )}
          />
        );
      case 'markdown':
        return <MarkdownView templateId={templateId} />;
      case 'evolution':
        return (
          <EvolutionDashboard templateId={templateId} onLog={() => void 0} />
        );
      default:
        return <MarkdownFallback templateId={templateId} />;
    }
  }, [mode, templateId, displayName, playground]);

  return (
    <VStack as="main" gap="lg" className="pt-24">
      <VStack gap="md">
        <TemplatePicker
          templateId={templateId}
          onChangeTemplateId={(id) => {
            setTemplateId(id);
            if (!allowedModes.includes(mode)) {
              setMode(allowedModes[0] ?? 'playground');
            }
          }}
          templates={templates.map((t) => ({ id: t.id, label: t.name }))}
        />
        <ModePicker
          mode={mode}
          allowedModes={allowedModes}
          onChangeMode={setMode}
        />
      </VStack>
      {main}
    </VStack>
  );
}

function TemplatePicker(props: {
  templateId: string;
  onChangeTemplateId: (id: string) => void;
  templates: { id: string; label: string }[];
}) {
  return (
    <HStack gap="md" align="center" wrap="wrap">
      <Select value={props.templateId} onValueChange={props.onChangeTemplateId}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Choose a template" />
        </SelectTrigger>
        <SelectContent>
          {props.templates.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </HStack>
  );
}

function ModePicker(props: {
  mode: Mode;
  allowedModes: readonly Mode[];
  onChangeMode: (m: Mode) => void;
}) {
  return (
    <HStack gap="sm" wrap="wrap">
      {props.allowedModes.map((m) => (
        <Button
          key={m}
          variant={props.mode === m ? 'default' : 'outline'}
          onPress={() => props.onChangeMode(m)}
        >
          {m}
        </Button>
      ))}
    </HStack>
  );
}

function MarkdownFallback({ templateId }: { templateId: TemplateId }) {
  return (
    <VStack gap="md">
      <EmptyState
        title="No custom UI yet"
        description="This example doesn't ship a dedicated playground UI. Use Markdown mode (if available) or the spec/builder modes."
      />
      <MarkdownView templateId={templateId} />
    </VStack>
  );
}
