'use client';

import { useMemo } from 'react';

import dynamic from 'next/dynamic';
import { Dialog, DialogContent } from '@contractspec/lib.ui-kit-web/ui/dialog';
import { ScrollArea } from '@contractspec/lib.ui-kit-web/ui/scroll-area';
import { LoadingSpinner } from '@contractspec/lib.ui-kit-web/ui/atoms/LoadingSpinner';
import type { TemplateId } from '@contractspec/lib.example-shared-ui';

// Dynamically import template components with ssr: false
const TemplateShell = dynamic(
  () =>
    import('@contractspec/lib.example-shared-ui').then(
      (mod) => mod.TemplateShell
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const TodosTaskList = dynamic(
  () =>
    import('@contractspec/bundle.library/components/templates/todos/TaskList').then(
      (mod) => mod.TaskList
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const MessagingWorkspace = dynamic(
  () =>
    import('@contractspec/bundle.library/components/templates/messaging/MessagingWorkspace').then(
      (mod) => mod.MessagingWorkspace
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const RecipesExperience = dynamic(
  () =>
    import('@contractspec/bundle.library/components/templates/recipes/RecipeList').then(
      (mod) => mod.RecipeList
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const SaasDashboard = dynamic(
  () =>
    import('@contractspec/example.saas-boilerplate').then(
      (mod) => mod.SaasDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const CrmDashboard = dynamic(
  () =>
    import('@contractspec/example.crm-pipeline').then(
      (mod) => mod.CrmDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const AgentDashboard = dynamic(
  () =>
    import('@contractspec/example.agent-console/ui').then(
      (mod) => mod.AgentDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const WorkflowDashboard = dynamic(
  () =>
    import('@contractspec/example.workflow-system/ui').then(
      (mod) => mod.WorkflowDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const MarketplaceDashboard = dynamic(
  () =>
    import('@contractspec/example.marketplace/ui').then(
      (mod) => mod.MarketplaceDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const IntegrationDashboard = dynamic(
  () =>
    import('@contractspec/example.integration-hub/ui').then(
      (mod) => mod.IntegrationDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const AnalyticsDashboard = dynamic(
  () =>
    import('@contractspec/example.analytics-dashboard').then(
      (mod) => mod.AnalyticsDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

interface TemplatePreviewModalProps {
  templateId: TemplateId | null;
  onClose: () => void;
}
//
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
//       <div className="bg-background relative h-full max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl p-6 shadow-2xl">
//         <button
//           type="button"
//           className="btn-ghost absolute top-4 right-4 text-sm"
//           onClick={onClose}
//         >
//           Close
//         </button>
//         {previewComponent}
//       </div>
//     </div>
//   );
// };

export const TemplatePreviewModal = ({
  templateId,
  onClose,
}: TemplatePreviewModalProps) => {
  const previewComponent = useMemo(() => {
    switch (templateId) {
      case 'todos-app':
        return (
          <TemplateShell
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
            title="Analytics Dashboard"
            description="Custom dashboards with widgets and queries."
            showSaveAction={false}
          >
            <AnalyticsDashboard />
          </TemplateShell>
        );
      case null:
        return null;
      default:
        return null;
    }
  }, [templateId]);

  return (
    <Dialog open={!!previewComponent} onOpenChange={onClose}>
      {/*<DialogTrigger asChild>*/}
      {/*  <Button variant="outline">Fullscreen Dialog</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="mb-8 flex h-[calc(100vh-2rem)] min-w-[calc(100vw-2rem)] flex-col justify-between gap-0 p-0">
        <ScrollArea className="flex flex-col justify-between overflow-hidden">
          {/*<DialogHeader className="contents space-y-0 text-left">*/}
          {/*  <DialogTitle className="px-6 pt-6">Product Information</DialogTitle>*/}
          {/*  <DialogDescription asChild>*/}
          {/*  </DialogDescription>*/}
          {/*</DialogHeader>*/}
          {previewComponent}
        </ScrollArea>
        {/*<DialogFooter className="px-6 pb-6 sm:justify-end">*/}
        {/*  <DialogClose asChild>*/}
        {/*    <Button variant="outline">*/}
        {/*      <ChevronLeftIcon />*/}
        {/*      Back*/}
        {/*    </Button>*/}
        {/*  </DialogClose>*/}
        {/*  <Button type="button">Read More</Button>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
};
