'use client';

/**
 * SaaS Dashboard
 *
 * Fully integrated with ContractSpec example handlers
 * and design-system components.
 *
 * Commands wired:
 * - CreateProjectContract -> Create Project button + modal
 * - UpdateProjectContract -> Edit project via modal
 * - DeleteProjectContract -> Delete project via modal
 */
import { useState, useCallback } from 'react';
import {
  StatCard,
  StatCardGroup,
  StatusChip,
  EntityCard,
  EmptyState,
  LoaderBlock,
  ErrorState,
  Button,
} from '@lssm/lib.design-system';
import {
  useProjectList,
  type Project,
  type Subscription,
} from './hooks/useProjectList';
import { useProjectMutations } from './hooks/useProjectMutations';
import { CreateProjectModal } from './modals/CreateProjectModal';
import { ProjectActionsModal } from './modals/ProjectActionsModal';

type Tab = 'projects' | 'billing' | 'settings';

function getStatusTone(
  status: Project['status']
): 'success' | 'warning' | 'neutral' | 'danger' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DRAFT':
      return 'neutral';
    case 'ARCHIVED':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function SaasDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectActionsOpen, setIsProjectActionsOpen] = useState(false);

  const { data, subscription, loading, error, stats, refetch } =
    useProjectList();

  const mutations = useProjectMutations({
    onSuccess: () => {
      refetch();
    },
  });

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsProjectActionsOpen(true);
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  if (loading && !data) {
    return <LoaderBlock label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SaaS Dashboard</h2>
        {activeTab === 'projects' && (
          <Button onPress={() => setIsCreateModalOpen(true)}>
            <span className="mr-2">+</span> New Project
          </Button>
        )}
      </div>

      {/* Stats Row */}
      {stats && subscription && (
        <StatCardGroup>
          <StatCard label="Projects" value={stats.total.toString()} />
          <StatCard label="Active" value={stats.activeCount.toString()} />
          <StatCard label="Draft" value={stats.draftCount.toString()} />
          <StatCard
            label="Plan"
            value={subscription.plan}
            hint={subscription.status}
          />
        </StatCardGroup>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-muted flex gap-1 rounded-lg p-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[400px]" role="tabpanel">
        {activeTab === 'projects' && (
          <ProjectsTab data={data} onProjectClick={handleProjectClick} />
        )}
        {activeTab === 'billing' && <BillingTab subscription={subscription} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (input) => {
          await mutations.createProject(input);
        }}
        isLoading={mutations.createState.loading}
      />

      {/* Project Actions Modal */}
      <ProjectActionsModal
        isOpen={isProjectActionsOpen}
        project={selectedProject}
        onClose={() => {
          setIsProjectActionsOpen(false);
          setSelectedProject(null);
        }}
        onUpdate={async (input) => {
          await mutations.updateProject(input);
        }}
        onArchive={async (projectId) => {
          await mutations.archiveProject(projectId);
        }}
        onActivate={async (projectId) => {
          await mutations.activateProject(projectId);
        }}
        onDelete={async (projectId) => {
          await mutations.deleteProject(projectId);
        }}
        isLoading={mutations.isLoading}
      />
    </div>
  );
}

interface ProjectsTabProps {
  data: ReturnType<typeof useProjectList>['data'];
  onProjectClick?: (project: Project) => void;
}

function ProjectsTab({ data, onProjectClick }: ProjectsTabProps) {
  if (!data?.items.length) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((project: Project) => (
          <EntityCard
            key={project.id}
            cardTitle={project.name}
            cardSubtitle={project.tier}
            meta={
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
            }
            chips={
              <StatusChip
                tone={getStatusTone(project.status)}
                label={project.status}
              />
            }
            footer={
              <div className="flex w-full items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  {project.updatedAt.toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => onProjectClick?.(project)}
                >
                  Actions
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

function BillingTab({ subscription }: { subscription: Subscription | null }) {
  if (!subscription) return null;

  return (
    <div className="space-y-6">
      <div className="border-border bg-card rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{subscription.plan} Plan</h3>
            <p className="text-muted-foreground text-sm">
              Current period:{' '}
              {subscription.currentPeriodStart.toLocaleDateString()} -{' '}
              {subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
            <p className="text-muted-foreground text-sm">
              Billing cycle: {subscription.billingCycle}
            </p>
          </div>
          <StatusChip tone="success" label={subscription.status} />
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="outline" onPress={() => alert('Upgrade clicked!')}>
            Upgrade Plan
          </Button>
          <Button
            variant="ghost"
            onPress={() => alert('Manage Billing clicked!')}
          >
            Manage Billing
          </Button>
        </div>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <div className="border-border bg-destructive/10 text-destructive rounded-xl border p-4">
          <p className="text-sm font-medium">
            ⚠️ Your subscription will be cancelled at the end of the current
            period.
          </p>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="border-border bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Organization Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Organization Name</label>
            <input
              type="text"
              defaultValue="Demo Organization"
              className="border-input bg-background mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Default Timezone</label>
            <select className="border-input bg-background mt-1 block w-full rounded-md border px-3 py-2">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div className="pt-2">
            <Button onPress={() => alert('Settings saved!')}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
