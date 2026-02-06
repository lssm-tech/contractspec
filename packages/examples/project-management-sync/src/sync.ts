import {
  JiraProjectManagementProvider,
  LinearProjectManagementProvider,
  NotionProjectManagementProvider,
} from '@contractspec/integration.providers-impls/impls';
import type {
  ProjectManagementProvider,
  ProjectManagementWorkItem,
  ProjectManagementWorkItemInput,
} from '@contractspec/integration.providers-impls/project-management';

export type ProjectManagementProviderName = 'linear' | 'jira' | 'notion';

export interface ProjectManagementSyncInput {
  provider: ProjectManagementProviderName;
  providerClient?: ProjectManagementProvider;
  items?: ProjectManagementWorkItemInput[];
  summary?: ProjectManagementWorkItemInput;
  dryRun?: boolean;
}

export interface ProjectManagementSyncOutput {
  summary?: ProjectManagementWorkItem | ProjectManagementWorkItemInput;
  items: ProjectManagementWorkItem[] | ProjectManagementWorkItemInput[];
}

export async function syncProjectManagementWorkItems(
  input: ProjectManagementSyncInput
): Promise<ProjectManagementSyncOutput> {
  const items = input.items ?? buildSampleWorkItems();
  const summary = input.summary;
  const dryRun = input.dryRun ?? false;

  if (dryRun) {
    return { summary, items };
  }

  const provider =
    input.providerClient ?? createProviderFromEnv(input.provider);
  const createdSummary = summary
    ? await provider.createWorkItem(summary)
    : undefined;
  const createdItems = await provider.createWorkItems(items);
  return { summary: createdSummary, items: createdItems };
}

export async function runProjectManagementSyncFromEnv(): Promise<ProjectManagementSyncOutput> {
  const provider = resolveProviderName();
  const dryRun = process.env.CONTRACTSPEC_PM_DRY_RUN === 'true';
  const summary = provider === 'notion' ? buildSampleSummary() : undefined;
  return syncProjectManagementWorkItems({
    provider,
    summary,
    dryRun,
  });
}

export function buildSampleWorkItems(): ProjectManagementWorkItemInput[] {
  return [
    {
      title: 'Review onboarding drop-off',
      description:
        'Analyze activation funnel to identify the highest drop-off step and propose fixes.',
      type: 'task',
      priority: 'high',
      tags: ['onboarding', 'insights'],
    },
    {
      title: 'Ship first-run checklist',
      description:
        'Create a guided checklist with 3-5 steps to help new users reach first value.',
      type: 'task',
      priority: 'medium',
      tags: ['activation', 'ux'],
      dueDate: new Date('2026-02-15'),
    },
    {
      title: 'Define success metrics',
      description:
        'Agree on activation success metrics and instrument key events.',
      type: 'task',
      priority: 'low',
      tags: ['analytics', 'tracking'],
    },
  ];
}

export function buildSampleSummary(): ProjectManagementWorkItemInput {
  return {
    title: 'Product Intent Summary',
    description:
      'This summary aggregates the onboarding tasks and highlights the activation improvements to prioritize.',
    type: 'summary',
    tags: ['product-intent', 'summary'],
  };
}

export function createProviderFromEnv(
  provider: ProjectManagementProviderName
): ProjectManagementProvider {
  if (provider === 'linear') {
    return new LinearProjectManagementProvider({
      apiKey: requireEnv('LINEAR_API_KEY'),
      teamId: requireEnv('LINEAR_TEAM_ID'),
      projectId: process.env.LINEAR_PROJECT_ID,
      stateId: process.env.LINEAR_STATE_ID,
      assigneeId: process.env.LINEAR_ASSIGNEE_ID,
      labelIds: splitList(process.env.LINEAR_LABEL_IDS),
    });
  }

  if (provider === 'jira') {
    return new JiraProjectManagementProvider({
      siteUrl: requireEnv('JIRA_SITE_URL'),
      email: requireEnv('JIRA_EMAIL'),
      apiToken: requireEnv('JIRA_API_TOKEN'),
      projectKey: process.env.JIRA_PROJECT_KEY,
      issueType: process.env.JIRA_ISSUE_TYPE,
      defaultLabels: splitList(process.env.JIRA_DEFAULT_LABELS),
    });
  }

  return new NotionProjectManagementProvider({
    apiKey: requireEnv('NOTION_API_KEY'),
    databaseId: process.env.NOTION_DATABASE_ID,
    summaryParentPageId: process.env.NOTION_SUMMARY_PARENT_PAGE_ID,
    titleProperty: process.env.NOTION_TITLE_PROPERTY,
    statusProperty: process.env.NOTION_STATUS_PROPERTY,
    priorityProperty: process.env.NOTION_PRIORITY_PROPERTY,
    tagsProperty: process.env.NOTION_TAGS_PROPERTY,
    dueDateProperty: process.env.NOTION_DUE_DATE_PROPERTY,
    descriptionProperty: process.env.NOTION_DESCRIPTION_PROPERTY,
  });
}

export function resolveProviderName(): ProjectManagementProviderName {
  const raw = (process.env.CONTRACTSPEC_PM_PROVIDER ?? 'linear').toLowerCase();
  if (raw === 'linear' || raw === 'jira' || raw === 'notion') return raw;
  throw new Error(
    `Unsupported provider: ${raw}. Use one of: linear, jira, notion`
  );
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function splitList(value?: string): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}
