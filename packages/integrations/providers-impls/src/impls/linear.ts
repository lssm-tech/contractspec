import { LinearClient } from '@linear/sdk';
import type {
  ProjectManagementProvider,
  ProjectManagementWorkItem,
  ProjectManagementWorkItemInput,
  ProjectManagementWorkItemPriority,
} from '../project-management';

export interface LinearProjectManagementProviderOptions {
  apiKey: string;
  teamId?: string;
  projectId?: string;
  assigneeId?: string;
  stateId?: string;
  labelIds?: string[];
  tagLabelMap?: Record<string, string>;
  client?: LinearClient;
}

const PRIORITY_MAP: Record<ProjectManagementWorkItemPriority, number> = {
  urgent: 1,
  high: 2,
  medium: 3,
  low: 4,
  none: 0,
};

export class LinearProjectManagementProvider implements ProjectManagementProvider {
  private readonly client: LinearClient;
  private readonly defaults: Omit<
    LinearProjectManagementProviderOptions,
    'apiKey' | 'client'
  >;

  constructor(options: LinearProjectManagementProviderOptions) {
    this.client =
      options.client ?? new LinearClient({ apiKey: options.apiKey });
    this.defaults = {
      teamId: options.teamId,
      projectId: options.projectId,
      assigneeId: options.assigneeId,
      stateId: options.stateId,
      labelIds: options.labelIds,
      tagLabelMap: options.tagLabelMap,
    };
  }

  async createWorkItem(
    input: ProjectManagementWorkItemInput
  ): Promise<ProjectManagementWorkItem> {
    const teamId = this.defaults.teamId;
    if (!teamId) {
      throw new Error('Linear teamId is required to create work items.');
    }

    const payload = await this.client.createIssue({
      teamId,
      title: input.title,
      description: input.description,
      priority: mapPriority(input.priority),
      estimate: input.estimate,
      assigneeId: input.assigneeId ?? this.defaults.assigneeId,
      projectId: input.projectId ?? this.defaults.projectId,
      stateId: this.defaults.stateId,
      labelIds: resolveLabelIds(this.defaults, input.tags),
    });

    const issue = await payload.issue;
    const state = issue ? await issue.state : undefined;
    return {
      id: issue?.id ?? '',
      title: issue?.title ?? input.title,
      url: issue?.url ?? undefined,
      status: state?.name ?? undefined,
      priority: input.priority,
      tags: input.tags,
      projectId: input.projectId ?? this.defaults.projectId,
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

function mapPriority(
  priority?: ProjectManagementWorkItemPriority
): number | undefined {
  if (!priority) return undefined;
  return PRIORITY_MAP[priority] ?? undefined;
}

function resolveLabelIds(
  defaults: Pick<
    LinearProjectManagementProviderOptions,
    'labelIds' | 'tagLabelMap'
  >,
  tags?: string[]
): string[] | undefined {
  const labelIds = new Set<string>();
  (defaults.labelIds ?? []).forEach((id) => labelIds.add(id));
  if (tags && defaults.tagLabelMap) {
    tags.forEach((tag) => {
      const mapped = defaults.tagLabelMap?.[tag];
      if (mapped) labelIds.add(mapped);
    });
  }
  const merged = [...labelIds];
  return merged.length > 0 ? merged : undefined;
}
