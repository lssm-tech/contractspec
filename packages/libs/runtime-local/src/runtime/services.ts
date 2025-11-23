import { LocalDatabase } from '../database/sqlite-wasm';
import { LocalStorageService } from '../storage/indexeddb';
import { LocalGraphQLClient } from '../graphql/local-client';
import { LocalEventBus } from '../events/local-pubsub';
import { generateId } from '../utils/id';

export interface LocalRuntimeInitOptions {
  modulesPath?: string;
}

export interface TemplateSeedOptions {
  templateId: 'todos-app' | 'messaging-app' | 'recipe-app-i18n';
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
}


