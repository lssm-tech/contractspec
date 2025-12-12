import { LocalDatabase } from '../database/sqlite-wasm';
import { LocalStorageService } from '../storage/indexeddb';
import { LocalGraphQLClient } from '../graphql/local-client';
import { LocalEventBus } from '../events/local-pubsub';
import type { TemplateId } from '../../../templates/registry';
import { staticShouldNotHappen } from '@lssm/lib.utils-typescript';
import { generateId } from '../utils/id';

export interface LocalRuntimeInitOptions {
  modulesPath?: string;
}

export interface TemplateSeedOptions {
  templateId: TemplateId;
  projectId?: string;
}

const DEFAULT_PROJECT_ID = 'local-project' as const;

export class LocalRuntimeServices {
  readonly db = new LocalDatabase();
  readonly storage = new LocalStorageService();
  readonly pubsub = new LocalEventBus();
  readonly graphql: LocalGraphQLClient;

  #initialized = false;

  constructor() {
    this.graphql = new LocalGraphQLClient({
      db: this.db,
      storage: this.storage,
      pubsub: this.pubsub,
    });
  }

  async init(options: LocalRuntimeInitOptions = {}): Promise<void> {
    if (this.#initialized) return;
    await Promise.all([
      this.db.init({ modulesPath: options.modulesPath }),
      this.storage.init(),
    ]);
    this.#initialized = true;
  }

  /**
   * Seed the in-browser database with sensible defaults for the selected template.
   */
  async seedTemplate(options: TemplateSeedOptions): Promise<void> {
    const projectId = options.projectId ?? DEFAULT_PROJECT_ID;
    switch (options.templateId) {
      case 'todos-app':
        await this.seedTodos(projectId);
        break;
      case 'messaging-app':
        await this.seedMessaging(projectId);
        break;
      case 'recipe-app-i18n':
        await this.seedRecipes(projectId);
        break;
      case 'saas-boilerplate':
        await this.seedSaasBoilerplate(projectId);
        break;
      case 'crm-pipeline':
        await this.seedCrmPipeline(projectId);
        break;
      case 'agent-console':
        await this.seedAgentConsole(projectId);
        break;
      case 'workflow-system':
        await this.seedWorkflowSystem(projectId);
        break;
      case 'marketplace':
        await this.seedMarketplace(projectId);
        break;
      case 'integration-hub':
        await this.seedIntegrationHub(projectId);
        break;
      case 'analytics-dashboard':
        await this.seedAnalyticsDashboard(projectId);
        break;
      case 'learning-journey-studio-onboarding':
      case 'learning-journey-platform-tour':
      case 'learning-journey-crm-onboarding':
        // Existing learning journey examples rely on event-driven progress; no seed data required.
        break;
      case 'learning-journey-duo-drills':
      case 'learning-journey-ambient-coach':
      case 'learning-journey-quest-challenges':
        // Learning journey examples are event-driven; no data seeding required.
        break;
      case 'service-business-os':
      case 'team-hub':
      case 'wealth-snapshot':
        throw new Error(
          `Seeding not implemented for template ${options.templateId}`
        );
      default:
        staticShouldNotHappen(options.templateId as never);
    }
  }

  private async seedTodos(projectId: string): Promise<void> {
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM template_task WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const workCategoryId = generateId('category');
    const homeCategoryId = generateId('category');

    await this.db.run(
      `INSERT INTO template_task_category (id, projectId, name, color) VALUES (?, ?, ?, ?)`,
      [workCategoryId, projectId, 'Operations', '#8b5cf6']
    );
    await this.db.run(
      `INSERT INTO template_task_category (id, projectId, name, color) VALUES (?, ?, ?, ?)`,
      [homeCategoryId, projectId, 'Home', '#f472b6']
    );

    const tasks = [
      {
        title: 'Review intent signals',
        description: 'Scan yesterday’s signals and flag the ones to promote.',
        categoryId: workCategoryId,
        priority: 'HIGH',
      },
      {
        title: 'Schedule studio walkthrough',
        description: 'Prep the sandbox before tomorrow’s ceremony.',
        categoryId: workCategoryId,
        priority: 'MEDIUM',
      },
      {
        title: 'Collect testimonials',
        description: 'Ask last week’s pilot crew for quotes.',
        categoryId: homeCategoryId,
        priority: 'LOW',
      },
    ];

    for (const task of tasks) {
      await this.db.run(
        `INSERT INTO template_task (id, projectId, categoryId, title, description, completed, priority, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId('task'),
          projectId,
          task.categoryId,
          task.title,
          task.description,
          0,
          task.priority,
          JSON.stringify(['demo']),
        ]
      );
    }
  }

  private async seedMessaging(projectId: string): Promise<void> {
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM template_conversation WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const conversationId = generateId('conversation');
    const now = new Date().toISOString();
    await this.db.run(
      `INSERT INTO template_conversation (id, projectId, name, isGroup, updatedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [conversationId, projectId, 'Studio Core Team', 1, now]
    );

    const participants = [
      { userId: 'theo', displayName: 'Théo', role: 'Builder' },
      { userId: 'claire', displayName: 'Claire', role: 'Lifecycle' },
      { userId: 'amir', displayName: 'Amir', role: 'Ops' },
    ];

    for (const participant of participants) {
      await this.db.run(
        `INSERT INTO template_conversation_participant (id, conversationId, projectId, userId, displayName, role, joinedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId('participant'),
          conversationId,
          projectId,
          participant.userId,
          participant.displayName,
          participant.role,
          now,
        ]
      );
    }

    const messages = [
      {
        senderId: 'claire',
        senderName: 'Claire',
        content:
          'Morning! Just ran the lifecycle scan, team is still in MVP->PMF crossover.',
      },
      {
        senderId: 'amir',
        senderName: 'Amir',
        content: 'Copy that. I will prep the deployment ceremony in Sandbox.',
      },
      {
        senderId: 'theo',
        senderName: 'Théo',
        content:
          'Great — I will stitch the new template bundles before the demo.',
      },
    ];

    for (const message of messages) {
      const messageId = generateId('message');
      await this.db.run(
        `INSERT INTO template_message (id, conversationId, projectId, senderId, senderName, content, attachments, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          messageId,
          conversationId,
          projectId,
          message.senderId,
          message.senderName,
          message.content,
          JSON.stringify([]),
          'SENT',
        ]
      );
    }
  }

  private async seedRecipes(projectId: string): Promise<void> {
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM template_recipe WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const categoryId = generateId('category');
    await this.db.run(
      `INSERT INTO template_recipe_category (id, nameEn, nameFr, icon) VALUES (?, ?, ?, ?)`,
      [categoryId, 'Ceremony', 'Cérémonie', '🎉']
    );

    const recipeId = generateId('recipe');
    await this.db.run(
      `INSERT INTO template_recipe (id, projectId, categoryId, slugEn, slugFr, nameEn, nameFr, descriptionEn, descriptionFr, heroImageUrl, prepTimeMinutes, cookTimeMinutes, servings, isFavorite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipeId,
        projectId,
        categoryId,
        'studio-ritual',
        'rituel-studio',
        'Studio Ritual',
        'Rituel Studio',
        'Guide your teams through intent, review, deploy.',
        'Guidez vos équipes à travers intention, revue, déploiement.',
        null,
        15,
        30,
        6,
        1,
      ]
    );

    const ingredients = [
      {
        nameEn: 'Signals stack',
        nameFr: 'Pile de signaux',
        quantity: '1 tray',
        ordering: 1,
      },
      {
        nameEn: 'Policy gates',
        nameFr: 'Gates de politique',
        quantity: '3 steps',
        ordering: 2,
      },
      {
        nameEn: 'Celebration tokens',
        nameFr: 'Jetons de célébration',
        quantity: 'Handful',
        ordering: 3,
      },
    ];

    for (const ingredient of ingredients) {
      await this.db.run(
        `INSERT INTO template_recipe_ingredient (id, recipeId, nameEn, nameFr, quantity, ordering)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateId('ingredient'),
          recipeId,
          ingredient.nameEn,
          ingredient.nameFr,
          ingredient.quantity,
          ingredient.ordering,
        ]
      );
    }

    const instructions = [
      {
        contentEn: 'Assemble your intent signals and highlight hottest leads.',
        contentFr:
          'Assemblez vos signaux d’intention et mettez en avant les plus chauds.',
        ordering: 1,
      },
      {
        contentEn: 'Walk the team through policies and approvals.',
        contentFr:
          'Faites passer l’équipe à travers les politiques et validations.',
        ordering: 2,
      },
      {
        contentEn: 'Deploy and celebrate the milestone.',
        contentFr: 'Déployez et célébrez l’étape atteinte.',
        ordering: 3,
      },
    ];

    for (const instruction of instructions) {
      await this.db.run(
        `INSERT INTO template_recipe_instruction (id, recipeId, contentEn, contentFr, ordering)
         VALUES (?, ?, ?, ?, ?)`,
        [
          generateId('instruction'),
          recipeId,
          instruction.contentEn,
          instruction.contentFr,
          instruction.ordering,
        ]
      );
    }
  }

  private async seedSaasBoilerplate(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM saas_project WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const organizationId = generateId('org');

    // Seed subscription
    await this.db.run(
      `INSERT INTO saas_subscription (id, projectId, organizationId, plan, status, billingCycle, currentPeriodStart, currentPeriodEnd)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generateId('sub'),
        projectId,
        organizationId,
        'PRO',
        'ACTIVE',
        'MONTHLY',
        new Date().toISOString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ]
    );

    // Seed projects
    const projects = [
      {
        name: 'Marketing Website',
        description: 'Company marketing site',
        status: 'ACTIVE',
        tier: 'PRO',
      },
      {
        name: 'Internal Dashboard',
        description: 'Analytics and metrics',
        status: 'ACTIVE',
        tier: 'FREE',
      },
      {
        name: 'Mobile App MVP',
        description: 'iOS/Android prototype',
        status: 'DRAFT',
        tier: 'FREE',
      },
    ];

    for (const project of projects) {
      await this.db.run(
        `INSERT INTO saas_project (id, projectId, organizationId, name, description, status, tier)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId('proj'),
          projectId,
          organizationId,
          project.name,
          project.description,
          project.status,
          project.tier,
        ]
      );
    }

    console.log(
      `[runtime-local] SaaS Boilerplate seeded for project: ${projectId}`
    );
  }

  private async seedCrmPipeline(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM crm_pipeline WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    // Create pipeline
    const pipelineId = 'pipeline-1';
    await this.db.run(
      `INSERT INTO crm_pipeline (id, projectId, name) VALUES (?, ?, ?)`,
      [pipelineId, projectId, 'Sales Pipeline']
    );

    // Create stages
    const stages = [
      { id: 'stage-1', name: 'Lead', position: 1 },
      { id: 'stage-2', name: 'Qualified', position: 2 },
      { id: 'stage-3', name: 'Proposal', position: 3 },
      { id: 'stage-4', name: 'Negotiation', position: 4 },
      { id: 'stage-5', name: 'Closed', position: 5 },
    ];

    for (const stage of stages) {
      await this.db.run(
        `INSERT INTO crm_stage (id, pipelineId, name, position) VALUES (?, ?, ?, ?)`,
        [stage.id, pipelineId, stage.name, stage.position]
      );
    }

    // Seed deals
    const deals = [
      {
        name: 'Enterprise License - Acme Corp',
        value: 75000,
        stageId: 'stage-3',
        status: 'OPEN',
      },
      {
        name: 'Startup Plan - TechStart Inc',
        value: 12000,
        stageId: 'stage-2',
        status: 'OPEN',
      },
      {
        name: 'Professional Services - Global Ltd',
        value: 45000,
        stageId: 'stage-4',
        status: 'OPEN',
      },
      {
        name: 'Annual Contract - SmallBiz Co',
        value: 8500,
        stageId: 'stage-1',
        status: 'OPEN',
      },
      {
        name: 'Custom Integration - MegaCorp',
        value: 125000,
        stageId: 'stage-5',
        status: 'WON',
      },
      {
        name: 'Pilot Project - NewCo',
        value: 5000,
        stageId: 'stage-2',
        status: 'LOST',
      },
    ];

    for (const deal of deals) {
      await this.db.run(
        `INSERT INTO crm_deal (id, projectId, pipelineId, stageId, name, value, currency, status, ownerId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId('deal'),
          projectId,
          pipelineId,
          deal.stageId,
          deal.name,
          deal.value,
          'USD',
          deal.status,
          'user-1',
        ]
      );
    }

    console.log(
      `[runtime-local] CRM Pipeline seeded for project: ${projectId}`
    );
  }

  private async seedAgentConsole(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM agent_definition WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const organizationId = generateId('org');

    // Seed tools
    const tools = [
      {
        name: 'Web Search',
        description: 'Search the web for information',
        category: 'RETRIEVAL',
      },
      {
        name: 'Code Interpreter',
        description: 'Execute Python code',
        category: 'COMPUTATION',
      },
      {
        name: 'Email Sender',
        description: 'Send emails via API',
        category: 'COMMUNICATION',
      },
      {
        name: 'Database Query',
        description: 'Query SQL databases',
        category: 'RETRIEVAL',
      },
      {
        name: 'File Reader',
        description: 'Read and parse files',
        category: 'UTILITY',
      },
    ];

    const toolIds: string[] = [];
    for (const tool of tools) {
      const id = generateId('tool');
      toolIds.push(id);
      await this.db.run(
        `INSERT INTO agent_tool (id, projectId, organizationId, name, description, category, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          projectId,
          organizationId,
          tool.name,
          tool.description,
          tool.category,
          'ACTIVE',
        ]
      );
    }

    // Seed agents
    const agents = [
      {
        name: 'Research Assistant',
        description: 'Helps with research tasks',
        model: 'gpt-4',
        status: 'ACTIVE',
      },
      {
        name: 'Code Helper',
        description: 'Assists with coding',
        model: 'gpt-4',
        status: 'ACTIVE',
      },
      {
        name: 'Email Drafter',
        description: 'Drafts professional emails',
        model: 'gpt-3.5-turbo',
        status: 'PAUSED',
      },
    ];

    for (const agent of agents) {
      const agentId = generateId('agent');
      await this.db.run(
        `INSERT INTO agent_definition (id, projectId, organizationId, name, description, modelName, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          agentId,
          projectId,
          organizationId,
          agent.name,
          agent.description,
          agent.model,
          agent.status,
        ]
      );

      // Assign some tools
      const toolsToAssign = toolIds.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const toolId of toolsToAssign) {
        await this.db.run(
          `INSERT INTO agent_tool_assignment (id, agentId, toolId) VALUES (?, ?, ?)`,
          [generateId('assign'), agentId, toolId]
        );
      }
    }

    // Seed some sample runs
    const agentRows = await this.db.exec<{ id: string }>(
      `SELECT id FROM agent_definition WHERE projectId = ? LIMIT 1`,
      [projectId]
    );

    if (agentRows.length > 0) {
      const agentId = agentRows[0]!.id;
      const runs = [
        { status: 'COMPLETED', tokens: 1200, duration: 3500 },
        { status: 'COMPLETED', tokens: 800, duration: 2100 },
        { status: 'FAILED', tokens: 150, duration: 500 },
      ];

      for (const run of runs) {
        await this.db.run(
          `INSERT INTO agent_run (id, projectId, agentId, status, totalTokens, durationMs, queuedAt, completedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            generateId('run'),
            projectId,
            agentId,
            run.status,
            run.tokens,
            run.duration,
            new Date().toISOString(),
            run.status === 'COMPLETED' ? new Date().toISOString() : null,
          ]
        );
      }
    }

    console.log(
      `[runtime-local] Agent Console seeded for project: ${projectId}`
    );
  }

  private async seedWorkflowSystem(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM workflow_definition WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const organizationId = generateId('org');

    // Create workflow definitions
    const workflows = [
      {
        name: 'Purchase Request Approval',
        description: 'Multi-level approval for purchase requests above $1000',
        type: 'APPROVAL',
        status: 'ACTIVE',
      },
      {
        name: 'Employee Onboarding',
        description: 'Sequential tasks for new hire onboarding',
        type: 'SEQUENTIAL',
        status: 'ACTIVE',
      },
      {
        name: 'Content Publishing',
        description: 'Review and approval workflow for content',
        type: 'APPROVAL',
        status: 'DRAFT',
      },
    ];

    for (const workflow of workflows) {
      const definitionId = generateId('wfdef');
      await this.db.run(
        `INSERT INTO workflow_definition (id, projectId, organizationId, name, description, type, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          definitionId,
          projectId,
          organizationId,
          workflow.name,
          workflow.description,
          workflow.type,
          workflow.status,
        ]
      );

      // Add steps for the workflow
      if (workflow.name === 'Purchase Request Approval') {
        const steps = [
          {
            name: 'Manager Approval',
            type: 'APPROVAL',
            requiredRoles: ['manager'],
            order: 1,
          },
          {
            name: 'Finance Review',
            type: 'APPROVAL',
            requiredRoles: ['finance'],
            order: 2,
          },
          {
            name: 'Executive Sign-off',
            type: 'APPROVAL',
            requiredRoles: ['executive'],
            order: 3,
          },
        ];

        for (const step of steps) {
          await this.db.run(
            `INSERT INTO workflow_step (id, definitionId, name, type, requiredRoles, stepOrder)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              generateId('wfstep'),
              definitionId,
              step.name,
              step.type,
              JSON.stringify(step.requiredRoles),
              step.order,
            ]
          );
        }

        // Create sample instances
        const instances = [
          { status: 'IN_PROGRESS', requestedBy: 'user-1' },
          { status: 'COMPLETED', requestedBy: 'user-2' },
          { status: 'REJECTED', requestedBy: 'user-3' },
        ];

        for (const instance of instances) {
          await this.db.run(
            `INSERT INTO workflow_instance (id, projectId, definitionId, status, requestedBy)
             VALUES (?, ?, ?, ?, ?)`,
            [
              generateId('wfinst'),
              projectId,
              definitionId,
              instance.status,
              instance.requestedBy,
            ]
          );
        }
      }
    }

    console.log(
      `[runtime-local] Workflow System seeded for project: ${projectId}`
    );
  }

  private async seedMarketplace(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM marketplace_store WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const organizationId = generateId('org');

    // Create stores
    const stores = [
      {
        name: 'Tech Gadgets Pro',
        description: 'Premium electronics and accessories',
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 124,
      },
      {
        name: 'Artisan Crafts',
        description: 'Handmade crafts and unique gifts',
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 67,
      },
      {
        name: 'Fresh Foods Market',
        description: 'Farm-to-table produce and groceries',
        status: 'PENDING',
        rating: 0,
        reviewCount: 0,
      },
    ];

    for (const store of stores) {
      const storeId = generateId('store');
      await this.db.run(
        `INSERT INTO marketplace_store (id, projectId, organizationId, name, description, status, rating, reviewCount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storeId,
          projectId,
          organizationId,
          store.name,
          store.description,
          store.status,
          store.rating,
          store.reviewCount,
        ]
      );

      // Add products for active stores
      if (store.status === 'ACTIVE' && store.name === 'Tech Gadgets Pro') {
        const products = [
          {
            name: 'Wireless Earbuds Pro',
            price: 149.99,
            stock: 50,
            category: 'Audio',
            status: 'ACTIVE',
          },
          {
            name: 'USB-C Hub 7-in-1',
            price: 59.99,
            stock: 100,
            category: 'Accessories',
            status: 'ACTIVE',
          },
          {
            name: 'Mechanical Keyboard RGB',
            price: 129.99,
            stock: 25,
            category: 'Peripherals',
            status: 'ACTIVE',
          },
          {
            name: 'Portable SSD 1TB',
            price: 99.99,
            stock: 0,
            category: 'Storage',
            status: 'OUT_OF_STOCK',
          },
        ];

        for (const product of products) {
          await this.db.run(
            `INSERT INTO marketplace_product (id, storeId, name, price, currency, stock, category, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              generateId('prod'),
              storeId,
              product.name,
              product.price,
              'USD',
              product.stock,
              product.category,
              product.status,
            ]
          );
        }

        // Add sample orders
        const orders = [
          { customerId: 'customer-1', total: 209.98, status: 'DELIVERED' },
          { customerId: 'customer-2', total: 59.99, status: 'PROCESSING' },
          { customerId: 'customer-3', total: 379.97, status: 'PENDING' },
        ];

        for (const order of orders) {
          await this.db.run(
            `INSERT INTO marketplace_order (id, projectId, storeId, customerId, total, currency, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              generateId('order'),
              projectId,
              storeId,
              order.customerId,
              order.total,
              'USD',
              order.status,
            ]
          );
        }
      }
    }

    console.log(`[runtime-local] Marketplace seeded for project: ${projectId}`);
  }

  private async seedIntegrationHub(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM integration WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const organizationId = generateId('org');

    // Create integrations
    const integrations = [
      {
        name: 'Salesforce',
        type: 'CRM',
        status: 'ACTIVE',
        iconUrl: '/icons/salesforce.svg',
      },
      {
        name: 'HubSpot',
        type: 'MARKETING',
        status: 'ACTIVE',
        iconUrl: '/icons/hubspot.svg',
      },
      {
        name: 'Stripe',
        type: 'PAYMENT',
        status: 'ACTIVE',
        iconUrl: '/icons/stripe.svg',
      },
      {
        name: 'Slack',
        type: 'COMMUNICATION',
        status: 'INACTIVE',
        iconUrl: '/icons/slack.svg',
      },
      { name: 'Custom API', type: 'CUSTOM', status: 'INACTIVE', iconUrl: null },
    ];

    for (const integration of integrations) {
      const integrationId = generateId('integ');
      await this.db.run(
        `INSERT INTO integration (id, projectId, organizationId, name, type, status, iconUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          integrationId,
          projectId,
          organizationId,
          integration.name,
          integration.type,
          integration.status,
          integration.iconUrl,
        ]
      );

      // Add connections for active integrations
      if (integration.status === 'ACTIVE') {
        const connectionId = generateId('conn');
        await this.db.run(
          `INSERT INTO integration_connection (id, integrationId, name, status, lastSyncAt)
           VALUES (?, ?, ?, ?, ?)`,
          [
            connectionId,
            integrationId,
            `${integration.name} Production`,
            'CONNECTED',
            new Date(Date.now() - Math.random() * 86400000).toISOString(),
          ]
        );

        // Add sync configs for Salesforce
        if (integration.name === 'Salesforce') {
          const syncs = [
            {
              name: 'Contact Sync',
              source: 'contacts',
              target: 'crm_contacts',
              frequency: 'HOURLY',
            },
            {
              name: 'Deal Sync',
              source: 'opportunities',
              target: 'crm_deals',
              frequency: 'REALTIME',
            },
          ];

          for (const sync of syncs) {
            const syncId = generateId('sync');
            await this.db.run(
              `INSERT INTO integration_sync_config (id, connectionId, name, sourceEntity, targetEntity, frequency, status, recordsSynced)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                syncId,
                connectionId,
                sync.name,
                sync.source,
                sync.target,
                sync.frequency,
                'ACTIVE',
                Math.floor(Math.random() * 10000),
              ]
            );

            // Add field mappings
            const mappings = [
              { source: 'id', target: 'external_id' },
              { source: 'name', target: 'name' },
              { source: 'email', target: 'email_address' },
            ];

            for (const mapping of mappings) {
              await this.db.run(
                `INSERT INTO integration_field_mapping (id, syncConfigId, sourceField, targetField)
                 VALUES (?, ?, ?, ?)`,
                [generateId('fmap'), syncId, mapping.source, mapping.target]
              );
            }
          }
        }
      }
    }

    console.log(
      `[runtime-local] Integration Hub seeded for project: ${projectId}`
    );
  }

  private async seedAnalyticsDashboard(projectId: string): Promise<void> {
    // Check if already seeded
    const existing = await this.db.exec(
      `SELECT COUNT(*) as count FROM analytics_dashboard WHERE projectId = ?`,
      [projectId]
    );
    if ((existing[0]?.count as number) > 0) return;

    const organizationId = generateId('org');

    // Create queries first
    const queries = [
      {
        name: 'Daily Active Users',
        type: 'METRIC',
        definition: { metric: 'dau', aggregation: 'count', interval: 'day' },
      },
      {
        name: 'Revenue by Product',
        type: 'AGGREGATION',
        definition: {
          dimension: 'product',
          metric: 'revenue',
          aggregation: 'sum',
        },
      },
      {
        name: 'User Signups Over Time',
        type: 'SQL',
        definition: {},
        sql: 'SELECT DATE(created_at) as date, COUNT(*) as signups FROM users GROUP BY DATE(created_at)',
      },
      {
        name: 'Top Countries',
        type: 'AGGREGATION',
        definition: {
          dimension: 'country',
          metric: 'users',
          aggregation: 'count',
          limit: 10,
        },
      },
    ];

    const queryIds: string[] = [];
    for (const query of queries) {
      const queryId = generateId('query');
      queryIds.push(queryId);
      await this.db.run(
        `INSERT INTO analytics_query (id, projectId, organizationId, name, type, definition, sql, cacheTtlSeconds, isShared)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          queryId,
          projectId,
          organizationId,
          query.name,
          query.type,
          JSON.stringify(query.definition),
          query.sql ?? null,
          300,
          1,
        ]
      );
    }

    // Create dashboards
    const dashboards = [
      {
        name: 'Executive Overview',
        slug: 'executive-overview',
        description: 'High-level KPIs for leadership',
        status: 'PUBLISHED',
        refreshInterval: 'FIFTEEN_MINUTES',
        isPublic: true,
      },
      {
        name: 'Product Analytics',
        slug: 'product-analytics',
        description: 'Deep dive into product metrics',
        status: 'PUBLISHED',
        refreshInterval: 'HOUR',
        isPublic: false,
      },
      {
        name: 'Marketing Dashboard',
        slug: 'marketing-dashboard',
        description: 'Campaign performance and attribution',
        status: 'DRAFT',
        refreshInterval: 'NONE',
        isPublic: false,
      },
    ];

    for (const dashboard of dashboards) {
      const dashboardId = generateId('dash');
      const shareToken = dashboard.isPublic ? generateId('share') : null;
      await this.db.run(
        `INSERT INTO analytics_dashboard (id, projectId, organizationId, name, slug, description, status, refreshInterval, isPublic, shareToken)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dashboardId,
          projectId,
          organizationId,
          dashboard.name,
          dashboard.slug,
          dashboard.description,
          dashboard.status,
          dashboard.refreshInterval,
          dashboard.isPublic ? 1 : 0,
          shareToken,
        ]
      );

      // Add widgets for published dashboards
      if (
        dashboard.status === 'PUBLISHED' &&
        dashboard.name === 'Executive Overview'
      ) {
        const widgets = [
          {
            name: 'Daily Active Users',
            type: 'METRIC',
            gridX: 0,
            gridY: 0,
            gridWidth: 3,
            gridHeight: 2,
            queryId: queryIds[0],
          },
          {
            name: 'Revenue Trend',
            type: 'LINE_CHART',
            gridX: 3,
            gridY: 0,
            gridWidth: 6,
            gridHeight: 4,
            queryId: queryIds[1],
          },
          {
            name: 'User Growth',
            type: 'AREA_CHART',
            gridX: 0,
            gridY: 2,
            gridWidth: 3,
            gridHeight: 4,
            queryId: queryIds[2],
          },
          {
            name: 'Top Countries',
            type: 'BAR_CHART',
            gridX: 9,
            gridY: 0,
            gridWidth: 3,
            gridHeight: 4,
            queryId: queryIds[3],
          },
        ];

        for (const widget of widgets) {
          await this.db.run(
            `INSERT INTO analytics_widget (id, dashboardId, name, type, gridX, gridY, gridWidth, gridHeight, queryId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              generateId('widget'),
              dashboardId,
              widget.name,
              widget.type,
              widget.gridX,
              widget.gridY,
              widget.gridWidth,
              widget.gridHeight,
              widget.queryId,
            ]
          );
        }
      }
    }

    console.log(
      `[runtime-local] Analytics Dashboard seeded for project: ${projectId}`
    );
  }
}
