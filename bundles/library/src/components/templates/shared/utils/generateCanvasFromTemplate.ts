import type {
  CanvasState,
  ComponentNode,
} from '../../../../modules/visual-builder';
import { getTemplate, type TemplateId } from '../../../../lib/registry';

/**
 * Generate a unique ID for canvas nodes
 */
function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate initial canvas state from a template's presentations.
 * Maps template presentations and components to canvas nodes.
 */
export function generateCanvasFromTemplate(
  templateId: TemplateId
): CanvasState {
  const template = getTemplate(templateId);

  if (!template) {
    return createEmptyCanvas(templateId);
  }

  // Generate nodes based on template type
  const nodes = generateNodesForTemplate(templateId, template.components);

  return {
    id: `canvas-${templateId}`,
    projectId: 'sandbox',
    nodes,
    updatedAt: new Date().toISOString(),
    versions: [],
  };
}

/**
 * Generate canvas nodes for a specific template type
 */
function generateNodesForTemplate(
  templateId: TemplateId,
  components: {
    list: string;
    detail: string;
    form?: string;
    dashboard?: string;
  }
): ComponentNode[] {
  switch (templateId) {
    case 'crm-pipeline':
      return generateCrmPipelineCanvas(components);
    case 'saas-boilerplate':
      return generateSaasBoilerplateCanvas(components);
    case 'agent-console':
      return generateAgentConsoleCanvas(components);
    case 'todos-app':
      return generateTodosCanvas(components);
    case 'messaging-app':
      return generateMessagingCanvas(components);
    case 'recipe-app-i18n':
      return generateRecipeCanvas(components);
    default:
      return generateDefaultCanvas(components);
  }
}

/**
 * CRM Pipeline canvas structure
 */
function generateCrmPipelineCanvas(_components: {
  list: string;
  detail: string;
  dashboard?: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'PageLayout',
      props: { title: 'CRM Pipeline' },
      children: [
        {
          id: generateId(),
          type: 'KanbanBoard',
          props: { columns: 5 },
          children: [
            {
              id: generateId(),
              type: 'Card',
              props: { heading: 'Lead', body: 'New opportunities' },
            },
            {
              id: generateId(),
              type: 'Card',
              props: { heading: 'Qualified', body: 'Validated prospects' },
            },
            {
              id: generateId(),
              type: 'Card',
              props: { heading: 'Proposal', body: 'Sent proposals' },
            },
            {
              id: generateId(),
              type: 'Card',
              props: { heading: 'Negotiation', body: 'In discussion' },
            },
            {
              id: generateId(),
              type: 'Card',
              props: { heading: 'Closed', body: 'Won or lost' },
            },
          ],
        },
        {
          id: generateId(),
          type: 'StatsBar',
          props: {},
          children: [
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Total Value', value: '$180,000' },
            },
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Open Deals', value: '12' },
            },
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Win Rate', value: '65%' },
            },
          ],
        },
      ],
    },
  ];
}

/**
 * SaaS Boilerplate canvas structure
 */
function generateSaasBoilerplateCanvas(_components: {
  list: string;
  detail: string;
  dashboard?: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'PageLayout',
      props: { title: 'SaaS Dashboard' },
      children: [
        {
          id: generateId(),
          type: 'Grid',
          props: { columns: 3 },
          children: [
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Active Projects', value: '8' },
            },
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Team Members', value: '15' },
            },
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Usage', value: '72%' },
            },
          ],
        },
        {
          id: generateId(),
          type: 'DataTable',
          props: { columns: ['Name', 'Status', 'Created', 'Actions'] },
        },
        {
          id: generateId(),
          type: 'Sidebar',
          props: { position: 'right' },
          children: [
            {
              id: generateId(),
              type: 'Card',
              props: { heading: 'Subscription', body: 'Pro Plan - $99/mo' },
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Agent Console canvas structure
 */
function generateAgentConsoleCanvas(_components: {
  list: string;
  detail: string;
  dashboard?: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'PageLayout',
      props: { title: 'AI Agent Console' },
      children: [
        {
          id: generateId(),
          type: 'Tabs',
          props: { tabs: ['Agents', 'Runs', 'Tools'] },
          children: [
            {
              id: generateId(),
              type: 'TabPanel',
              props: { tab: 'Agents' },
              children: [
                {
                  id: generateId(),
                  type: 'CardGrid',
                  props: { columns: 3 },
                },
              ],
            },
            {
              id: generateId(),
              type: 'TabPanel',
              props: { tab: 'Runs' },
              children: [
                {
                  id: generateId(),
                  type: 'DataTable',
                  props: {
                    columns: ['Agent', 'Status', 'Duration', 'Tokens', 'Cost'],
                  },
                },
              ],
            },
            {
              id: generateId(),
              type: 'TabPanel',
              props: { tab: 'Tools' },
              children: [
                {
                  id: generateId(),
                  type: 'CardGrid',
                  props: { columns: 4, grouped: true },
                },
              ],
            },
          ],
        },
        {
          id: generateId(),
          type: 'StatsBar',
          props: {},
          children: [
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Total Runs', value: '1,234' },
            },
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Success Rate', value: '94%' },
            },
            {
              id: generateId(),
              type: 'StatCard',
              props: { label: 'Total Cost', value: '$45.67' },
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Todos App canvas structure
 */
function generateTodosCanvas(_components: {
  list: string;
  detail: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'PageLayout',
      props: { title: 'Task Board' },
      children: [
        {
          id: generateId(),
          type: 'FilterBar',
          props: { filters: ['status', 'priority', 'assignee'] },
        },
        {
          id: generateId(),
          type: 'TaskList',
          props: {},
        },
        {
          id: generateId(),
          type: 'FloatingActionButton',
          props: { icon: 'plus', label: 'Add Task' },
        },
      ],
    },
  ];
}

/**
 * Messaging App canvas structure
 */
function generateMessagingCanvas(_components: {
  list: string;
  detail: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'SplitLayout',
      props: { ratio: '1:3' },
      children: [
        {
          id: generateId(),
          type: 'ConversationList',
          props: {},
        },
        {
          id: generateId(),
          type: 'MessageThread',
          props: {},
          children: [
            {
              id: generateId(),
              type: 'MessageComposer',
              props: { placeholder: 'Type a message...' },
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Recipe App canvas structure
 */
function generateRecipeCanvas(_components: {
  list: string;
  detail: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'PageLayout',
      props: { title: 'Recipes' },
      children: [
        {
          id: generateId(),
          type: 'LanguageSwitcher',
          props: { languages: ['EN', 'FR'] },
        },
        {
          id: generateId(),
          type: 'CategoryNav',
          props: { categories: ['All', 'Appetizers', 'Main', 'Desserts'] },
        },
        {
          id: generateId(),
          type: 'RecipeGrid',
          props: { columns: 3 },
        },
      ],
    },
  ];
}

/**
 * Default canvas structure for unknown templates
 */
function generateDefaultCanvas(_components: {
  list: string;
  detail: string;
}): ComponentNode[] {
  return [
    {
      id: generateId(),
      type: 'PageLayout',
      props: { title: 'Dashboard' },
      children: [
        {
          id: generateId(),
          type: 'Card',
          props: {
            heading: 'Welcome',
            body: 'Start building your application',
          },
        },
      ],
    },
  ];
}

/**
 * Create an empty canvas state
 */
function createEmptyCanvas(templateId: TemplateId): CanvasState {
  return {
    id: `canvas-${templateId}`,
    projectId: 'sandbox',
    nodes: [],
    updatedAt: new Date().toISOString(),
    versions: [],
  };
}
