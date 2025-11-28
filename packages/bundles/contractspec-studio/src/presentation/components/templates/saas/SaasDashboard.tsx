'use client';

/**
 * SaaS Dashboard
 *
 * Properly integrated with ContractSpec example handlers
 * and design-system components.
 */
import { useState, useMemo } from 'react';
import { StatCard, StatCardGroup, StatusChip, EntityCard, EmptyState, LoaderBlock, ErrorState, Button } from '@lssm/lib.design-system';
import { useProjectList } from './hooks/useProjectList';

type Tab = 'projects' | 'billing' | 'settings';

const statusVariantMap: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  DRAFT: 'neutral',
  ARCHIVED: 'danger',
};

export function SaasDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const { data, subscription, loading, error, stats, refetch } = useProjectList();

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
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
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      {stats && subscription && (
        <StatCardGroup>
          <StatCard
            label="Projects"
            value={`${stats.total} / ${stats.projectLimit}`}
            description={`${stats.usagePercent.toFixed(0)}% used`}
          />
          <StatCard label="Active" value={stats.activeCount} variant="success" />
          <StatCard
            label="Plan"
            value={subscription.planName}
            description={subscription.status}
          />
          <StatCard
            label="API Calls"
            value={`${(subscription.usage.apiCalls / 1000).toFixed(0)}K`}
            description={`of ${(subscription.limits.apiCalls / 1000).toFixed(0)}K`}
          />
        </StatCardGroup>
      )}

      {/* Navigation Tabs */}
      <nav className="flex gap-1 rounded-lg bg-muted p-1" role="tablist">
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
        {activeTab === 'projects' && <ProjectsTab data={data} />}
        {activeTab === 'billing' && <BillingTab subscription={subscription} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function ProjectsTab({ data }: { data: ReturnType<typeof useProjectList>['data'] }) {
  if (!data?.projects.length) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action={{ label: 'Create Project', onClick: () => {} }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Projects</h3>
        <Button variant="primary" size="sm">
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((project) => (
          <EntityCard
            key={project.id}
            title={project.name}
            subtitle={project.slug}
            description={project.description}
            footer={
              <div className="flex items-center justify-between">
                <StatusChip
                  status={project.status.toLowerCase() as 'active' | 'warning' | 'neutral'}
                  variant={statusVariantMap[project.status] ?? 'neutral'}
                >
                  {project.status}
                </StatusChip>
                <span className="text-xs text-muted-foreground">
                  {project.updatedAt.toLocaleDateString()}
                </span>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

function BillingTab({ subscription }: { subscription: ReturnType<typeof useProjectList>['subscription'] }) {
  if (!subscription) return null;

  const usageItems = [
    {
      label: 'Projects',
      used: subscription.usage.projects,
      limit: subscription.limits.projects,
    },
    {
      label: 'Team Members',
      used: subscription.usage.users,
      limit: subscription.limits.users,
    },
    {
      label: 'Storage (GB)',
      used: subscription.usage.storage,
      limit: subscription.limits.storage,
    },
    {
      label: 'API Calls',
      used: subscription.usage.apiCalls,
      limit: subscription.limits.apiCalls,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{subscription.planName} Plan</h3>
            <p className="text-sm text-muted-foreground">
              Current period: {subscription.currentPeriodStart.toLocaleDateString()} -{' '}
              {subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
          </div>
          <StatusChip variant="success">{subscription.status}</StatusChip>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h4 className="mb-4 font-medium">Usage</h4>
        <div className="space-y-4">
          {usageItems.map((item) => {
            const pct = (item.used / item.limit) * 100;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">
                    {item.used.toLocaleString()} / {item.limit.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Organization Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Organization Name</label>
            <input
              type="text"
              defaultValue="Demo Organization"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Default Timezone</label>
            <select className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
