'use client';

import { useMemo } from 'react';

import dynamic from 'next/dynamic';
import { Dialog, DialogContent } from '@lssm/lib.ui-kit-web/ui/dialog';
import { ScrollArea } from '@lssm/lib.ui-kit-web/ui/scroll-area';
import { LoadingSpinner } from '@lssm/lib.ui-kit-web/ui/atoms/LoadingSpinner';

// Dynamically import template components with ssr: false to avoid SSR issues with sql.js
const TemplateShell = dynamic(
  () => import('./shared/TemplateShell').then((mod) => mod.TemplateShell),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const TodosTaskList = dynamic(
  () => import('./todos/TaskList').then((mod) => mod.TaskList),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const MessagingWorkspace = dynamic(
  () =>
    import('./messaging/MessagingWorkspace').then(
      (mod) => mod.MessagingWorkspace
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const RecipesExperience = dynamic(
  () => import('./recipes/RecipeList').then((mod) => mod.RecipeList),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const SaasDashboard = dynamic(
  () => import('./saas/SaasDashboard').then((mod) => mod.SaasDashboard),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const CrmDashboard = dynamic(
  () => import('./crm/CrmDashboard').then((mod) => mod.CrmDashboard),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const AgentDashboard = dynamic(
  () =>
    import('./agent-console/AgentDashboard').then((mod) => mod.AgentDashboard),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const WorkflowDashboard = dynamic(
  () =>
    import('./workflow-system/WorkflowDashboard').then(
      (mod) => mod.WorkflowDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const MarketplaceDashboard = dynamic(
  () =>
    import('./marketplace/MarketplaceDashboard').then(
      (mod) => mod.MarketplaceDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const IntegrationDashboard = dynamic(
  () =>
    import('./integration-hub/IntegrationDashboard').then(
      (mod) => mod.IntegrationDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const AnalyticsDashboard = dynamic(
  () =>
    import('./analytics-dashboard/AnalyticsDashboard').then(
      (mod) => mod.AnalyticsDashboard
    ),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

interface TemplatePreviewModalProps {
  templateId: TemplateId;
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

  console.log('state', !!previewComponent, templateId);

  return (
    <Dialog open={!!previewComponent} onOpenChange={onClose} className="h-full">
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
