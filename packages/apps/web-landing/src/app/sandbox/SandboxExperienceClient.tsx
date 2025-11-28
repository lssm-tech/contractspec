'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { CanvasState } from '@lssm/bundle.contractspec-studio/modules/visual-builder';

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

const SpecEditor = dynamic(
  () =>
    import(
      '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/SpecEditor'
    ).then((mod) => mod.SpecEditor),
  { ssr: false }
);

const StudioCanvas = dynamic(
  () =>
    import(
      '@lssm/bundle.contractspec-studio/presentation/components/studio/organisms/StudioCanvas'
    ).then((mod) => mod.StudioCanvas),
  { ssr: false }
);

import type { TemplateId } from '@lssm/bundle.contractspec-studio/templates/registry';

// Note: New templates (saas-boilerplate, crm-pipeline, agent-console) don't have sandbox components yet
type SandboxTemplateId = 'todos-app' | 'messaging-app' | 'recipe-app-i18n';
type Mode = 'playground' | 'specs' | 'builder';

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
};

const DEMO_CANVAS: CanvasState = {
  id: 'sandbox-canvas',
  projectId: 'sandbox',
  versions: [],
  nodes: [
    {
      id: 'kanban',
      type: 'KanbanBoard',
      props: { columns: 3 },
      children: [
        {
          id: 'card-1',
          type: 'Card',
          props: { heading: 'Signals', body: 'Usage, telemetry, tickets' },
        },
        {
          id: 'card-2',
          type: 'Card',
          props: { heading: 'Policies', body: 'Approval flows' },
        },
      ],
    },
  ],
  updatedAt: new Date().toISOString(),
};

const SPEC_SNIPPETS: Record<TemplateId, string> = {
  'todos-app': `contractSpec("tasks.board.v1", {
  goal: "Assign and approve craft work",
  transport: { gql: { field: "tasksBoard" } },
  io: {
    input: { tenantId: "string", assignee: "string" },
    output: { tasks: "array" }
  }
});`,
  'messaging-app': `contractSpec("messaging.send.v1", {
  goal: "Deliver intent-rich updates",
  io: {
    input: { conversationId: "string", body: "richtext" },
    output: { messageId: "string", deliveredAt: "ISO8601" }
  }
});`,
  'recipe-app-i18n': `contractSpec("recipes.lookup.v1", {
  goal: "Serve bilingual rituals",
  io: {
    input: { locale: "enum<'EN'|'FR'>", slug: "string" },
    output: { title: "string", content: "markdown" }
  }
});`,
};

export default function SandboxExperienceClient() {
  const [templateId, setTemplateId] = useState<TemplateId>('todos-app');
  const [mode, setMode] = useState<Mode>('playground');
  const [logs, setLogs] = useState<string[]>([
    'Sandbox ready – instant local runtime hydrated.',
  ]);
  const [spec, setSpec] = useState(SPEC_SNIPPETS['todos-app']);
  const [selectedNode, setSelectedNode] = useState<string | undefined>();

  const template = TEMPLATE_LIBRARY[templateId];

  const mainPanel = useMemo(() => {
    switch (mode) {
      case 'playground':
        return (
          <TemplateShell
            templateId={templateId}
            title={template.title}
            description={template.description}
            projectId="sandbox"
            showSaveAction={false}
          >
            {template.component}
          </TemplateShell>
        );
      case 'specs':
        return (
          <div className="border-border bg-card rounded-2xl border p-4">
            <SpecEditor
              projectId="sandbox"
              type="CAPABILITY"
              content={spec}
              onChange={setSpec}
              metadata={{ template: templateId }}
              onSave={() => pushLog('Spec saved locally')}
              onValidate={() => pushLog('Spec validated')}
            />
          </div>
        );
      case 'builder':
        return (
          <StudioCanvas
            state={DEMO_CANVAS}
            selectedNodeId={selectedNode}
            onSelectNode={(nodeId) => {
              setSelectedNode(nodeId);
              pushLog(`Selected node ${nodeId}`);
            }}
          />
        );
      default:
        return null;
    }
  }, [mode, template, templateId, spec, selectedNode]);

  const pushLog = (message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 6));
  };

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

      <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
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
                  setSpec(SPEC_SNIPPETS[id]);
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
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            {(['playground', 'specs', 'builder'] as Mode[]).map((modeId) => (
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
                    : 'Visual builder'}
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-4">{mainPanel}</section>
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
