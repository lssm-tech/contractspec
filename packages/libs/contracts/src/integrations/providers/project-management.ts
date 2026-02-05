export type ProjectManagementWorkItemPriority =
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low'
  | 'none';

export type ProjectManagementWorkItemType =
  | 'task'
  | 'bug'
  | 'story'
  | 'epic'
  | 'summary';

export interface ProjectManagementWorkItemInput {
  title: string;
  description?: string;
  type?: ProjectManagementWorkItemType;
  status?: string;
  priority?: ProjectManagementWorkItemPriority;
  tags?: string[];
  assigneeId?: string;
  projectId?: string;
  parentId?: string;
  dueDate?: Date;
  estimate?: number;
  externalId?: string;
  metadata?: Record<string, string>;
}

export interface ProjectManagementWorkItem {
  id: string;
  title: string;
  url?: string;
  status?: string;
  priority?: ProjectManagementWorkItemPriority;
  tags?: string[];
  projectId?: string;
  externalId?: string;
  metadata?: Record<string, string>;
}

export interface ProjectManagementProvider {
  createWorkItem(
    input: ProjectManagementWorkItemInput
  ): Promise<ProjectManagementWorkItem>;
  createWorkItems(
    items: ProjectManagementWorkItemInput[]
  ): Promise<ProjectManagementWorkItem[]>;
}
