import { Client } from '@notionhq/client';
import type {
  ProjectManagementProvider,
  ProjectManagementWorkItem,
  ProjectManagementWorkItemInput,
} from '../project-management';

export interface NotionProjectManagementProviderOptions {
  apiKey: string;
  databaseId?: string;
  summaryParentPageId?: string;
  titleProperty?: string;
  statusProperty?: string;
  priorityProperty?: string;
  tagsProperty?: string;
  dueDateProperty?: string;
  descriptionProperty?: string;
  client?: Client;
}

type NotionPageCreateParams = Parameters<Client['pages']['create']>[0];
type NotionPropertyRecord = Extract<
  NotionPageCreateParams['properties'],
  Record<string, { type?: string }>
>;
type NotionPropertyValue = NotionPropertyRecord[string];
type NotionTitleProperty = Extract<NotionPropertyValue, { title: unknown[] }>;
type NotionRichTextProperty = Extract<
  NotionPropertyValue,
  { rich_text: unknown[] }
>;
type NotionSelectProperty = Extract<NotionPropertyValue, { select: unknown }>;
type NotionMultiSelectProperty = Extract<
  NotionPropertyValue,
  { multi_select: unknown }
>;
type NotionDateProperty = Extract<NotionPropertyValue, { date: unknown }>;
type NotionAppendChildrenParams = Parameters<
  Client['blocks']['children']['append']
>[0];
type NotionBlockChildren = NotionAppendChildrenParams['children'];

export class NotionProjectManagementProvider implements ProjectManagementProvider {
  private readonly client: Client;
  private readonly defaults: Omit<
    NotionProjectManagementProviderOptions,
    'apiKey' | 'client'
  >;

  constructor(options: NotionProjectManagementProviderOptions) {
    this.client = options.client ?? new Client({ auth: options.apiKey });
    this.defaults = {
      databaseId: options.databaseId,
      summaryParentPageId: options.summaryParentPageId,
      titleProperty: options.titleProperty,
      statusProperty: options.statusProperty,
      priorityProperty: options.priorityProperty,
      tagsProperty: options.tagsProperty,
      dueDateProperty: options.dueDateProperty,
      descriptionProperty: options.descriptionProperty,
    };
  }

  async createWorkItem(
    input: ProjectManagementWorkItemInput
  ): Promise<ProjectManagementWorkItem> {
    if (input.type === 'summary' && this.defaults.summaryParentPageId) {
      return this.createSummaryPage(input);
    }

    const databaseId = this.defaults.databaseId;
    if (!databaseId) {
      throw new Error('Notion databaseId is required to create work items.');
    }

    const titleProperty = this.defaults.titleProperty ?? 'Name';
    const properties: NotionPropertyRecord = {
      [titleProperty]: buildTitleProperty(input.title),
    };

    applySelect(properties, this.defaults.statusProperty, input.status);
    applySelect(properties, this.defaults.priorityProperty, input.priority);
    applyMultiSelect(properties, this.defaults.tagsProperty, input.tags);
    applyDate(properties, this.defaults.dueDateProperty, input.dueDate);
    applyRichText(
      properties,
      this.defaults.descriptionProperty,
      input.description
    );

    const page = await this.client.pages.create({
      parent: { type: 'database_id', database_id: databaseId },
      properties,
    });

    return {
      id: page.id,
      title: input.title,
      url: 'url' in page ? (page.url as string | undefined) : undefined,
      status: input.status,
      priority: input.priority,
      tags: input.tags,
      projectId: databaseId,
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

  private async createSummaryPage(
    input: ProjectManagementWorkItemInput
  ): Promise<ProjectManagementWorkItem> {
    const parentId = this.defaults.summaryParentPageId;
    if (!parentId) {
      throw new Error('Notion summaryParentPageId is required for summaries.');
    }

    const summaryProperties: NotionPropertyRecord = {
      title: buildTitleProperty(input.title),
    };
    const page = await this.client.pages.create({
      parent: { type: 'page_id', page_id: parentId },
      properties: summaryProperties,
    });

    if (input.description) {
      const children = buildParagraphBlocks(input.description);
      if (children.length > 0) {
        await this.client.blocks.children.append({
          block_id: page.id,
          children,
        });
      }
    }

    return {
      id: page.id,
      title: input.title,
      url: 'url' in page ? (page.url as string | undefined) : undefined,
      status: input.status,
      priority: input.priority,
      tags: input.tags,
      projectId: parentId,
      externalId: input.externalId,
      metadata: input.metadata,
    };
  }
}

function buildTitleProperty(title: string): NotionTitleProperty {
  return {
    title: [
      {
        type: 'text' as const,
        text: { content: title },
      },
    ],
  };
}

function buildRichText(text: string): NotionRichTextProperty {
  return {
    rich_text: [
      {
        type: 'text' as const,
        text: { content: text },
      },
    ],
  };
}

function applySelect(
  properties: NotionPropertyRecord,
  property: string | undefined,
  value: string | undefined
) {
  if (!property || !value) return;
  const next: NotionSelectProperty = {
    select: { name: value },
  };
  properties[property] = next;
}

function applyMultiSelect(
  properties: NotionPropertyRecord,
  property: string | undefined,
  values?: string[]
) {
  if (!property || !values || values.length === 0) return;
  const next: NotionMultiSelectProperty = {
    multi_select: values.map((value) => ({ name: value })),
  };
  properties[property] = next;
}

function applyDate(
  properties: NotionPropertyRecord,
  property: string | undefined,
  value?: Date
) {
  if (!property || !value) return;
  const next: NotionDateProperty = {
    date: { start: value.toISOString() },
  };
  properties[property] = next;
}

function applyRichText(
  properties: NotionPropertyRecord,
  property: string | undefined,
  value?: string
) {
  if (!property || !value) return;
  properties[property] = buildRichText(value);
}

function buildParagraphBlocks(text: string): NotionBlockChildren {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  return lines.map((line) => ({
    object: 'block' as const,
    type: 'paragraph' as const,
    paragraph: {
      rich_text: [
        {
          type: 'text' as const,
          text: { content: line },
        },
      ],
    },
  }));
}
