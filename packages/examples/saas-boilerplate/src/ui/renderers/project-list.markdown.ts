/**
 * Markdown renderer for SaaS Project List presentation
 *
 * Uses dynamic import to ensure correct build order.
 */
import type { PresentationRenderer } from '@contractspec/lib.contracts';
import {
  mockListProjectsHandler,
  mockGetSubscriptionHandler,
} from '../../handlers';

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  description?: string;
}

/**
 * Markdown renderer for saas-boilerplate.project.list presentation
 * Only handles ProjectListView component
 */
export const projectListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, _ctx) => {
    // Only handle ProjectListView
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'ProjectListView'
    ) {
      throw new Error('projectListMarkdownRenderer: not ProjectListView');
    }

    const data = await mockListProjectsHandler({
      limit: 20,
      offset: 0,
    });

    // The example handler returns 'projects', not 'items'
    const items =
      (data as { projects?: ProjectItem[]; items?: ProjectItem[] }).projects ??
      (data as { items?: ProjectItem[] }).items ??
      [];

    const lines: string[] = [
      '# Projects',
      '',
      `**Total**: ${data.total} projects`,
      '',
    ];

    if (items.length === 0) {
      lines.push('_No projects found._');
    } else {
      lines.push('| Status | Project | Description |');
      lines.push('|--------|---------|-------------|');
      for (const project of items) {
        const status =
          project.status === 'ACTIVE'
            ? '✅'
            : project.status === 'ARCHIVED'
              ? '📦'
              : '⏸️';
        lines.push(
          `| ${status} | **${project.name}** | ${project.description ?? '-'} |`
        );
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for saas-boilerplate.dashboard presentation
 * Only handles SaasDashboard component
 */
export const saasDashboardMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, _ctx) => {
    // Only handle SaasDashboard
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'SaasDashboard'
    ) {
      throw new Error('saasDashboardMarkdownRenderer: not SaasDashboard');
    }

    const [projectsData, subscription] = await Promise.all([
      mockListProjectsHandler({ limit: 50 }),
      mockGetSubscriptionHandler(),
    ]);

    const projects =
      (projectsData as { projects?: ProjectItem[] }).projects ?? [];
    const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
    const archivedProjects = projects.filter(
      (p) => p.status === 'ARCHIVED'
    ).length;

    const lines: string[] = [
      '# SaaS Dashboard',
      '',
      '> Organization overview and usage summary',
      '',
      '## Summary',
      '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Total Projects | ${projectsData.total} |`,
      `| Active Projects | ${activeProjects} |`,
      `| Archived Projects | ${archivedProjects} |`,
      `| Subscription Plan | ${subscription.planName} |`,
      `| Subscription Status | ${subscription.status} |`,
      '',
      '## Projects',
      '',
    ];

    if (projects.length === 0) {
      lines.push('_No projects yet._');
    } else {
      lines.push('| Status | Project | Description |');
      lines.push('|--------|---------|-------------|');
      for (const project of projects.slice(0, 10)) {
        const status =
          project.status === 'ACTIVE'
            ? '✅'
            : project.status === 'ARCHIVED'
              ? '📦'
              : '⏸️';
        lines.push(
          `| ${status} | **${project.name}** | ${project.description ?? '-'} |`
        );
      }
      if (projects.length > 10) {
        lines.push(
          `| ... | ... | _${projectsData.total - 10} more projects_ |`
        );
      }
    }

    lines.push('');
    lines.push('## Subscription');
    lines.push('');
    lines.push(`- **Plan**: ${subscription.planName}`);
    lines.push(`- **Status**: ${subscription.status}`);
    if (subscription.currentPeriodEnd) {
      lines.push(
        `- **Period End**: ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
      );
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for saas-boilerplate.billing.settings presentation
 * Only handles SubscriptionView component
 */
export const saasBillingMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, _ctx) => {
    // Only handle SubscriptionView
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'SubscriptionView'
    ) {
      throw new Error('saasBillingMarkdownRenderer: not SubscriptionView');
    }

    const subscription = await mockGetSubscriptionHandler();

    const lines: string[] = [
      '# Billing & Subscription',
      '',
      '> Current subscription details and billing information',
      '',
      '## Subscription Details',
      '',
      '| Property | Value |',
      '|----------|-------|',
      `| Plan | ${subscription.planName} |`,
      `| Status | ${subscription.status} |`,
      `| ID | ${subscription.id} |`,
      `| Period Start | ${new Date(subscription.currentPeriodStart).toLocaleDateString()} |`,
      `| Period End | ${new Date(subscription.currentPeriodEnd).toLocaleDateString()} |`,
    ];

    lines.push('');
    lines.push('## Plan Limits');
    lines.push('');
    lines.push(`- **Projects**: ${subscription.limits.projects}`);
    lines.push(`- **Users**: ${subscription.limits.users}`);

    lines.push('');
    lines.push('## Plan Features');
    lines.push('');

    if (subscription.planName.toLowerCase().includes('free')) {
      lines.push('- ✅ Up to 3 projects');
      lines.push('- ✅ Basic support');
      lines.push('- ❌ Priority support');
      lines.push('- ❌ Advanced analytics');
    } else if (subscription.planName.toLowerCase().includes('pro')) {
      lines.push('- ✅ Unlimited projects');
      lines.push('- ✅ Priority support');
      lines.push('- ✅ Advanced analytics');
      lines.push('- ❌ Custom integrations');
    } else {
      lines.push('- ✅ Unlimited projects');
      lines.push('- ✅ Priority support');
      lines.push('- ✅ Advanced analytics');
      lines.push('- ✅ Custom integrations');
      lines.push('- ✅ Dedicated support');
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
