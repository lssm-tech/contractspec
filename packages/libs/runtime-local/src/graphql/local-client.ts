import {
  ApolloClient,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  GraphQLScalarType,
  Kind,
  type GraphQLResolveInfo,
} from 'graphql';

import { LocalDatabase, type LocalRow } from '../database/sqlite-wasm';
import { LocalStorageService } from '../storage/indexeddb';
import { LocalEventBus } from '../events/local-pubsub';
import { generateId } from '../utils/id';

const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum MessageStatus {
    SENT
    DELIVERED
    READ
  }

  enum RecipeLocale {
    EN
    FR
  }

  type TaskCategory {
    id: ID!
    projectId: ID!
    name: String!
    color: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Task {
    id: ID!
    projectId: ID!
    categoryId: ID
    title: String!
    description: String
    completed: Boolean!
    priority: TaskPriority!
    dueDate: DateTime
    tags: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    category: TaskCategory
  }

  input CreateTaskInput {
    projectId: ID!
    categoryId: ID
    title: String!
    description: String
    priority: TaskPriority = MEDIUM
    dueDate: DateTime
    tags: [String!]
  }

  input UpdateTaskInput {
    categoryId: ID
    title: String
    description: String
    priority: TaskPriority
    dueDate: DateTime
    tags: [String!]
  }

  type ConversationParticipant {
    id: ID!
    conversationId: ID!
    projectId: ID!
    userId: String!
    displayName: String
    role: String
    joinedAt: DateTime!
    lastReadAt: DateTime
  }

  input ConversationParticipantInput {
    userId: String!
    displayName: String
    role: String
  }

  type Message {
    id: ID!
    conversationId: ID!
    projectId: ID!
    senderId: String!
    senderName: String
    content: String!
    attachments: [String!]!
    status: MessageStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input SendMessageInput {
    conversationId: ID!
    projectId: ID!
    senderId: String!
    senderName: String
    content: String!
  }

  input CreateConversationInput {
    projectId: ID!
    name: String
    isGroup: Boolean = false
    avatarUrl: String
    participants: [ConversationParticipantInput!]!
  }

  type Conversation {
    id: ID!
    projectId: ID!
    name: String
    isGroup: Boolean!
    avatarUrl: String
    lastMessageId: ID
    updatedAt: DateTime!
    participants: [ConversationParticipant!]!
    messages(limit: Int = 50): [Message!]!
  }

  type RecipeCategory {
    id: ID!
    nameEn: String!
    nameFr: String!
    icon: String
  }

  type RecipeIngredient {
    id: ID!
    name: String!
    quantity: String!
    ordering: Int!
  }

  type RecipeInstruction {
    id: ID!
    content: String!
    ordering: Int!
  }

  type Recipe {
    id: ID!
    projectId: ID!
    slugEn: String!
    slugFr: String!
    name: String!
    description: String
    heroImageUrl: String
    prepTimeMinutes: Int
    cookTimeMinutes: Int
    servings: Int
    isFavorite: Boolean!
    locale: RecipeLocale!
    category: RecipeCategory
    ingredients: [RecipeIngredient!]!
    instructions: [RecipeInstruction!]!
  }

  type Query {
    taskCategories(projectId: ID!): [TaskCategory!]!
    tasks(projectId: ID!): [Task!]!
    conversations(projectId: ID!): [Conversation!]!
    messages(conversationId: ID!, limit: Int = 50): [Message!]!
    recipes(projectId: ID!, locale: RecipeLocale = EN): [Recipe!]!
    recipe(id: ID!, locale: RecipeLocale = EN): Recipe
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    toggleTask(id: ID!, completed: Boolean!): Task!
    deleteTask(id: ID!): Boolean!
    createConversation(input: CreateConversationInput!): Conversation!
    sendMessage(input: SendMessageInput!): Message!
    setMessagesRead(conversationId: ID!, userId: String!): Boolean!
    favoriteRecipe(id: ID!, isFavorite: Boolean!): Recipe!
  }
`;

interface ResolverContext {
  db: LocalDatabase;
  storage: LocalStorageService;
  pubsub: LocalEventBus;
}

type ResolverParent = Record<string, unknown>;

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  parseValue(value: unknown) {
    return value ? new Date(value as string).toISOString() : null;
  },
  serialize(value: unknown) {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return new Date(value as string).toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value).toISOString();
    }
    return null;
  },
});

export interface LocalGraphQLClientOptions {
  db: LocalDatabase;
  storage: LocalStorageService;
  pubsub?: LocalEventBus;
}

export class LocalGraphQLClient {
  readonly apollo: ApolloClient<NormalizedCacheObject>;

  constructor(private readonly options: LocalGraphQLClientOptions) {
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: this.createResolvers(),
    });

    this.apollo = new ApolloClient({
      cache: new InMemoryCache({ canonizeResults: false }),
      link: new SchemaLink<ResolverContext>({
        schema,
        context: () => ({
          db: this.options.db,
          storage: this.options.storage,
          pubsub: this.options.pubsub ?? new LocalEventBus(),
        }),
      }),
      devtools: {
        enabled: typeof window !== 'undefined',
      },
    });
  }

  private createResolvers() {
    return {
      DateTime: DateTimeScalar,
      Query: {
        taskCategories: async (
          _: ResolverParent,
          args: { projectId: string },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_task_category WHERE projectId = ? ORDER BY name ASC`,
            [args.projectId]
          );
          return rows.map(mapTaskCategory);
        },
        tasks: async (
          _: ResolverParent,
          args: { projectId: string },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_task WHERE projectId = ? ORDER BY createdAt DESC`,
            [args.projectId]
          );
          return rows.map(mapTask);
        },
        conversations: async (
          _: ResolverParent,
          args: { projectId: string },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_conversation WHERE projectId = ? ORDER BY updatedAt DESC`,
            [args.projectId]
          );
          return rows.map(mapConversation);
        },
        messages: async (
          _: ResolverParent,
          args: { conversationId: string; limit: number },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_message WHERE conversationId = ? ORDER BY createdAt DESC LIMIT ?`,
            [args.conversationId, args.limit]
          );
          return rows.map(mapMessage);
        },
        recipes: async (
          _: ResolverParent,
          args: { projectId: string; locale: 'EN' | 'FR' },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_recipe WHERE projectId = ? ORDER BY nameEn ASC`,
            [args.projectId]
          );
          return rows.map((row) => mapRecipe(row, args.locale));
        },
        recipe: async (
          _: ResolverParent,
          args: { id: string; locale: 'EN' | 'FR' },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_recipe WHERE id = ? LIMIT 1`,
            [args.id]
          );
          if (!rows.length) return null;
          return mapRecipe(rows[0], args.locale);
        },
      },
      Mutation: {
        createTask: async (
          _: ResolverParent,
          args: { input: Record<string, unknown> },
          ctx: ResolverContext
        ) => {
          const id = generateId('task');
          const now = new Date().toISOString();
          const tags = JSON.stringify(args.input.tags ?? []);
          await ctx.db.run(
            `INSERT INTO template_task (id, projectId, categoryId, title, description, completed, priority, dueDate, tags, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              args.input.projectId as string,
              (args.input.categoryId as string | undefined) ?? null,
              args.input.title as string,
              (args.input.description as string | undefined) ?? null,
              0,
              args.input.priority ?? 'MEDIUM',
              (args.input.dueDate as string | undefined) ?? null,
              tags,
              now,
              now,
            ]
          );
          const [row] = await ctx.db.exec(
            `SELECT * FROM template_task WHERE id = ? LIMIT 1`,
            [id]
          );
          return mapTask(row);
        },
        updateTask: async (
          _: ResolverParent,
          args: { id: string; input: Record<string, unknown> },
          ctx: ResolverContext
        ) => {
          const now = new Date().toISOString();
          await ctx.db.run(
            `UPDATE template_task
             SET categoryId = coalesce(?, categoryId),
                 title = coalesce(?, title),
                 description = coalesce(?, description),
                 priority = coalesce(?, priority),
                 dueDate = coalesce(?, dueDate),
                 tags = coalesce(?, tags),
                 updatedAt = ?
             WHERE id = ?`,
            [
              args.input.categoryId ?? null,
              args.input.title ?? null,
              args.input.description ?? null,
              args.input.priority ?? null,
              args.input.dueDate ?? null,
              args.input.tags ? JSON.stringify(args.input.tags) : null,
              now,
              args.id,
            ]
          );
          const [row] = await ctx.db.exec(
            `SELECT * FROM template_task WHERE id = ? LIMIT 1`,
            [args.id]
          );
          return mapTask(row);
        },
        toggleTask: async (
          _: ResolverParent,
          args: { id: string; completed: boolean },
          ctx: ResolverContext
        ) => {
          const now = new Date().toISOString();
          await ctx.db.run(
            `UPDATE template_task SET completed = ?, updatedAt = ? WHERE id = ?`,
            [args.completed ? 1 : 0, now, args.id]
          );
          const [row] = await ctx.db.exec(
            `SELECT * FROM template_task WHERE id = ? LIMIT 1`,
            [args.id]
          );
          return mapTask(row);
        },
        deleteTask: async (
          _: ResolverParent,
          args: { id: string },
          ctx: ResolverContext
        ) => {
          await ctx.db.run(
            `DELETE FROM template_task WHERE id = ?`,
            [args.id]
          );
          return true;
        },
        createConversation: async (
          _: ResolverParent,
          args: { input: Record<string, unknown> },
          ctx: ResolverContext
        ) => {
          const id = generateId('conversation');
          const now = new Date().toISOString();
          await ctx.db.run(
            `INSERT INTO template_conversation (id, projectId, name, isGroup, avatarUrl, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              id,
              args.input.projectId as string,
              (args.input.name as string | undefined) ?? null,
              (args.input.isGroup as boolean | undefined) ? 1 : 0,
              (args.input.avatarUrl as string | undefined) ?? null,
              now,
            ]
          );

          const participants =
            (args.input.participants as Record<string, string>[]) ?? [];
          for (const participant of participants) {
            await ctx.db.run(
              `INSERT INTO template_conversation_participant (id, conversationId, projectId, userId, displayName, role, joinedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                generateId('participant'),
                id,
                args.input.projectId as string,
                participant.userId,
                participant.displayName ?? null,
                participant.role ?? null,
                now,
              ]
            );
          }

          const [row] = await ctx.db.exec(
            `SELECT * FROM template_conversation WHERE id = ? LIMIT 1`,
            [id]
          );
          return mapConversation(row);
        },
        sendMessage: async (
          _: ResolverParent,
          args: { input: Record<string, unknown> },
          ctx: ResolverContext
        ) => {
          const id = generateId('message');
          const now = new Date().toISOString();
          await ctx.db.run(
            `INSERT INTO template_message (id, conversationId, projectId, senderId, senderName, content, attachments, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              args.input.conversationId as string,
              args.input.projectId as string,
              args.input.senderId as string,
              (args.input.senderName as string | undefined) ?? null,
              args.input.content as string,
              JSON.stringify([]),
              'SENT',
              now,
              now,
            ]
          );
          await ctx.db.run(
            `UPDATE template_conversation SET lastMessageId = ?, updatedAt = ? WHERE id = ?`,
            [id, now, args.input.conversationId]
          );
          const [row] = await ctx.db.exec(
            `SELECT * FROM template_message WHERE id = ?`,
            [id]
          );
          const message = mapMessage(row);
          ctx.pubsub.emit('message:new', message);
          return message;
        },
        setMessagesRead: async (
          _: ResolverParent,
          args: { conversationId: string; userId: string },
          ctx: ResolverContext
        ) => {
          const now = new Date().toISOString();
          await ctx.db.run(
            `UPDATE template_conversation_participant
             SET lastReadAt = ?
             WHERE conversationId = ? AND userId = ?`,
            [now, args.conversationId, args.userId]
          );
          return true;
        },
        favoriteRecipe: async (
          _: ResolverParent,
          args: { id: string; isFavorite: boolean },
          ctx: ResolverContext
        ) => {
          const now = new Date().toISOString();
          await ctx.db.run(
            `UPDATE template_recipe SET isFavorite = ?, updatedAt = ? WHERE id = ?`,
            [args.isFavorite ? 1 : 0, now, args.id]
          );
          const [row] = await ctx.db.exec(
            `SELECT * FROM template_recipe WHERE id = ? LIMIT 1`,
            [args.id]
          );
          const locale: 'EN' | 'FR' = 'EN';
          return mapRecipe(row, locale);
        },
      },
      Task: {
        category: async (parent: LocalRow, _: unknown, ctx: ResolverContext) => {
          if (!parent.categoryId) return null;
          const rows = await ctx.db.exec(
            `SELECT * FROM template_task_category WHERE id = ? LIMIT 1`,
            [parent.categoryId]
          );
          if (!rows.length) return null;
          return mapTaskCategory(rows[0]);
        },
      },
      Conversation: {
        participants: async (
          parent: LocalRow,
          _: unknown,
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_conversation_participant WHERE conversationId = ? ORDER BY joinedAt ASC`,
            [parent.id]
          );
          return rows.map(mapParticipant);
        },
        messages: async (
          parent: LocalRow,
          args: { limit: number },
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_message WHERE conversationId = ? ORDER BY createdAt DESC LIMIT ?`,
            [parent.id, args.limit]
          );
          return rows.map(mapMessage);
        },
      },
      Recipe: {
        category: async (
          parent: LocalRow & { categoryId?: string | null },
          _: unknown,
          ctx: ResolverContext
        ) => {
          if (!parent.categoryId) return null;
          const rows = await ctx.db.exec(
            `SELECT * FROM template_recipe_category WHERE id = ? LIMIT 1`,
            [parent.categoryId]
          );
          if (!rows.length) return null;
          return mapRecipeCategory(rows[0]);
        },
        ingredients: async (
          parent: LocalRow & { locale: 'EN' | 'FR' },
          _: unknown,
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_recipe_ingredient WHERE recipeId = ? ORDER BY ordering ASC`,
            [parent.id]
          );
          return rows.map((row) => mapRecipeIngredient(row, parent.locale));
        },
        instructions: async (
          parent: LocalRow & { locale: 'EN' | 'FR' },
          _: unknown,
          ctx: ResolverContext
        ) => {
          const rows = await ctx.db.exec(
            `SELECT * FROM template_recipe_instruction WHERE recipeId = ? ORDER BY ordering ASC`,
            [parent.id]
          );
          return rows.map((row) => mapRecipeInstruction(row, parent.locale));
        },
      },
    };
  }
}

function mapTaskCategory(row: LocalRow) {
  return {
    id: row.id,
    projectId: row.projectId,
    name: row.name,
    color: row.color,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapTask(row: LocalRow) {
  return {
    id: row.id,
    projectId: row.projectId,
    categoryId: row.categoryId,
    title: row.title,
    description: row.description,
    completed: Boolean(row.completed),
    priority: row.priority ?? 'MEDIUM',
    dueDate: row.dueDate,
    tags: parseTags(row.tags),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function parseTags(value: LocalRow['tags']): string[] {
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function mapConversation(row: LocalRow) {
  return {
    id: row.id,
    projectId: row.projectId,
    name: row.name,
    isGroup: Boolean(row.isGroup),
    avatarUrl: row.avatarUrl,
    lastMessageId: row.lastMessageId,
    updatedAt: row.updatedAt,
  };
}

function mapParticipant(row: LocalRow) {
  return {
    id: row.id,
    conversationId: row.conversationId,
    projectId: row.projectId,
    userId: row.userId,
    displayName: row.displayName,
    role: row.role,
    joinedAt: row.joinedAt,
    lastReadAt: row.lastReadAt,
  };
}

function mapMessage(row: LocalRow) {
  return {
    id: row.id,
    conversationId: row.conversationId,
    projectId: row.projectId,
    senderId: row.senderId,
    senderName: row.senderName,
    content: row.content,
    attachments: [],
    status: row.status ?? 'SENT',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapRecipe(row: LocalRow, locale: 'EN' | 'FR') {
  return {
    id: row.id,
    projectId: row.projectId,
    slugEn: row.slugEn,
    slugFr: row.slugFr,
    name: locale === 'FR' ? row.nameFr : row.nameEn,
    description: locale === 'FR' ? row.descriptionFr : row.descriptionEn,
    heroImageUrl: row.heroImageUrl,
    prepTimeMinutes: row.prepTimeMinutes ?? null,
    cookTimeMinutes: row.cookTimeMinutes ?? null,
    servings: row.servings ?? null,
    isFavorite: Boolean(row.isFavorite),
    locale,
    categoryId: row.categoryId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapRecipeCategory(row: LocalRow) {
  return {
    id: row.id,
    nameEn: row.nameEn,
    nameFr: row.nameFr,
    icon: row.icon,
  };
}

function mapRecipeIngredient(row: LocalRow, locale: 'EN' | 'FR') {
  return {
    id: row.id,
    name: locale === 'FR' ? row.nameFr : row.nameEn,
    quantity: row.quantity,
    ordering: row.ordering ?? 0,
  };
}

function mapRecipeInstruction(row: LocalRow, locale: 'EN' | 'FR') {
  return {
    id: row.id,
    content: locale === 'FR' ? row.contentFr : row.contentEn,
    ordering: row.ordering ?? 0,
  };
}

