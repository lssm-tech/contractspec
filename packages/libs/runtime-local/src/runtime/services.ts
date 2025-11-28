import { LocalDatabase } from '../database/sqlite-wasm';
import { LocalStorageService } from '../storage/indexeddb';
import { LocalGraphQLClient } from '../graphql/local-client';
import { LocalEventBus } from '../events/local-pubsub';
import { generateId } from '../utils/id';

export interface LocalRuntimeInitOptions {
  modulesPath?: string;
}

export interface TemplateSeedOptions {
  templateId:
    | 'todos-app'
    | 'messaging-app'
    | 'recipe-app-i18n'
    | 'saas-boilerplate'
    | 'crm-pipeline'
    | 'agent-console';
  projectId?: string;
}

const DEFAULT_PROJECT_ID = 'local-project';

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
      default:
        throw new Error(`Unknown template ${options.templateId}`);
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
}
