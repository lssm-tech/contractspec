import { Buffer } from 'node:buffer';
import type {
  ProjectManagementProvider,
  ProjectManagementWorkItem,
  ProjectManagementWorkItemInput,
  ProjectManagementWorkItemPriority,
  ProjectManagementWorkItemType,
} from '../project-management';

export interface JiraProjectManagementProviderOptions {
  siteUrl: string;
  email: string;
  apiToken: string;
  projectKey?: string;
  issueType?: string;
  defaultLabels?: string[];
  issueTypeMap?: Partial<Record<ProjectManagementWorkItemType, string>>;
  fetch?: typeof fetch;
}

export class JiraProjectManagementProvider implements ProjectManagementProvider {
  private readonly siteUrl: string;
  private readonly authHeader: string;
  private readonly defaults: Omit<
    JiraProjectManagementProviderOptions,
    'siteUrl' | 'email' | 'apiToken' | 'fetch'
  >;
  private readonly fetchFn: typeof fetch;

  constructor(options: JiraProjectManagementProviderOptions) {
    this.siteUrl = normalizeSiteUrl(options.siteUrl);
    this.authHeader = buildAuthHeader(options.email, options.apiToken);
    this.defaults = {
      projectKey: options.projectKey,
      issueType: options.issueType,
      defaultLabels: options.defaultLabels,
      issueTypeMap: options.issueTypeMap,
    };
    this.fetchFn = options.fetch ?? fetch;
  }

  async createWorkItem(
    input: ProjectManagementWorkItemInput
  ): Promise<ProjectManagementWorkItem> {
    const projectKey = input.projectId ?? this.defaults.projectKey;
    if (!projectKey) {
      throw new Error('Jira projectKey is required to create work items.');
    }

    const issueType = resolveIssueType(input.type, this.defaults);
    const description = buildJiraDescription(input.description);
    const labels = mergeLabels(this.defaults.defaultLabels, input.tags);
    const priority = mapPriority(input.priority);

    const payload = {
      fields: {
        project: { key: projectKey },
        summary: input.title,
        description,
        issuetype: { name: issueType },
        labels,
        priority: priority ? { name: priority } : undefined,
        assignee: input.assigneeId
          ? { accountId: input.assigneeId }
          : undefined,
        duedate: input.dueDate
          ? input.dueDate.toISOString().slice(0, 10)
          : undefined,
      },
    };

    const response = await this.fetchFn(`${this.siteUrl}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Jira API error (${response.status}): ${body || response.statusText}`
      );
    }

    const data = (await response.json()) as {
      id?: string;
      key?: string;
      self?: string;
    };

    return {
      id: data.id ?? data.key ?? '',
      title: input.title,
      url: data.key ? `${this.siteUrl}/browse/${data.key}` : undefined,
      status: input.status,
      priority: input.priority,
      tags: input.tags,
      projectId: projectKey,
      externalId: input.externalId,
      metadata: input.metadata,
    };
  }

  async createWorkItems(
    items: ProjectManagementWorkItemInput[]
  ): Promise<ProjectManagementWorkItem[]> {
    const created: ProjectManagementWorkItem[] = [];
    for (const item of items) {
      created.push(await this.createWorkItem(item));
    }
    return created;
  }
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/$/, '');
}

function buildAuthHeader(email: string, apiToken: string): string {
  const token = Buffer.from(`${email}:${apiToken}`).toString('base64');
  return `Basic ${token}`;
}

function resolveIssueType(
  type: ProjectManagementWorkItemType | undefined,
  defaults: Pick<
    JiraProjectManagementProviderOptions,
    'issueType' | 'issueTypeMap'
  >
): string {
  if (type && defaults.issueTypeMap?.[type]) {
    return defaults.issueTypeMap[type] ?? defaults.issueType ?? 'Task';
  }
  return defaults.issueType ?? 'Task';
}

function mapPriority(
  priority?: ProjectManagementWorkItemPriority
): string | undefined {
  switch (priority) {
    case 'urgent':
      return 'Highest';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    case 'none':
    default:
      return undefined;
  }
}

function mergeLabels(
  defaults?: string[],
  tags?: string[]
): string[] | undefined {
  const merged = new Set<string>();
  (defaults ?? []).forEach((label) => merged.add(label));
  (tags ?? []).forEach((tag) => merged.add(tag));
  const result = [...merged];
  return result.length > 0 ? result : undefined;
}

interface JiraDoc {
  type: 'doc';
  version: 1;
  content: JiraDocNode[];
}

interface JiraDocNode {
  type: 'paragraph';
  content: JiraDocText[];
}

interface JiraDocText {
  type: 'text';
  text: string;
}

function buildJiraDescription(description?: string): JiraDoc | undefined {
  if (!description) return undefined;
  const lines = description.split(/\r?\n/).filter((line) => line.trim());
  const content = lines.map((line) => ({
    type: 'paragraph' as const,
    content: [{ type: 'text' as const, text: line }],
  }));
  if (content.length === 0) return undefined;
  return { type: 'doc', version: 1, content };
}
