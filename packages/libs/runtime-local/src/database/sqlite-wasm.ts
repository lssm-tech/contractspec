import initSqlJs, {
  type Database,
  type SqlJsStatic,
} from 'sql.js';

export type LocalDbValue =
  | string
  | number
  | boolean
  | null
  | Uint8Array
  | undefined;

export type LocalRow = Record<string, LocalDbValue>;

export interface LocalDatabaseInitOptions {
  modulesPath?: string;
  seed?: Uint8Array;
  migrations?: string[];
}

const DEFAULT_MIGRATIONS: string[] = [
  // Tasks
  `
  CREATE TABLE IF NOT EXISTS template_task_category (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_task (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    categoryId TEXT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'MEDIUM',
    dueDate TEXT,
    tags TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  // Messaging
  `
  CREATE TABLE IF NOT EXISTS template_conversation (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT,
    isGroup INTEGER DEFAULT 0,
    avatarUrl TEXT,
    lastMessageId TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_conversation_participant (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    projectId TEXT NOT NULL,
    userId TEXT NOT NULL,
    displayName TEXT,
    role TEXT,
    joinedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    lastReadAt TEXT
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_message (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    projectId TEXT NOT NULL,
    senderId TEXT NOT NULL,
    senderName TEXT,
    content TEXT NOT NULL,
    attachments TEXT,
    status TEXT DEFAULT 'SENT',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  // Recipes
  `
  CREATE TABLE IF NOT EXISTS template_recipe_category (
    id TEXT PRIMARY KEY,
    nameEn TEXT NOT NULL,
    nameFr TEXT NOT NULL,
    icon TEXT
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_recipe (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    categoryId TEXT,
    slugEn TEXT NOT NULL,
    slugFr TEXT NOT NULL,
    nameEn TEXT NOT NULL,
    nameFr TEXT NOT NULL,
    descriptionEn TEXT,
    descriptionFr TEXT,
    heroImageUrl TEXT,
    prepTimeMinutes INTEGER,
    cookTimeMinutes INTEGER,
    servings INTEGER,
    isFavorite INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_recipe_ingredient (
    id TEXT PRIMARY KEY,
    recipeId TEXT NOT NULL,
    nameEn TEXT NOT NULL,
    nameFr TEXT NOT NULL,
    quantity TEXT NOT NULL,
    ordering INTEGER DEFAULT 0
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_recipe_instruction (
    id TEXT PRIMARY KEY,
    recipeId TEXT NOT NULL,
    contentEn TEXT NOT NULL,
    contentFr TEXT NOT NULL,
    ordering INTEGER DEFAULT 0
  );
`,
];

export class LocalDatabase {
  private SQL?: SqlJsStatic;
  private db?: Database;
  private initialized = false;

  async init(options: LocalDatabaseInitOptions = {}): Promise<void> {
    if (this.initialized) return;
    this.SQL = await initSqlJs({
      locateFile: (file) =>
        `${options.modulesPath ?? '/sql-wasm'}/${file}`,
    });
    this.db = options.seed
      ? new this.SQL.Database(options.seed)
      : new this.SQL.Database();
    this.initialized = true;
    await this.runMigrations(options.migrations ?? []);
  }

  async exec<T extends LocalRow = LocalRow>(
    sql: string,
    params: LocalDbValue[] = []
  ): Promise<T[]> {
    const database = this.ensureDb();
    const statement = database.prepare(sql);
    try {
      statement.bind(params.map((value) => this.normalizeValue(value)));
      const rows: T[] = [];
      while (statement.step()) {
        rows.push(statement.getAsObject() as T);
      }
      return rows;
    } finally {
      statement.free();
    }
  }

  async run(sql: string, params: LocalDbValue[] = []): Promise<void> {
    const database = this.ensureDb();
    const statement = database.prepare(sql);
    try {
      statement.bind(params.map((value) => this.normalizeValue(value)));
      statement.step();
    } finally {
      statement.free();
    }
  }

  async transaction<T>(callback: (db: Database) => T): Promise<T> {
    const database = this.ensureDb();
    database.run('BEGIN TRANSACTION');
    try {
      const result = callback(database);
      database.run('COMMIT');
      return result;
    } catch (error) {
      database.run('ROLLBACK');
      throw error;
    }
  }

  export(): Uint8Array {
    const database = this.ensureDb();
    return database.export();
  }

  private async runMigrations(extraMigrations: string[]): Promise<void> {
    const database = this.ensureDb();
    for (const statement of [...DEFAULT_MIGRATIONS, ...extraMigrations]) {
      database.run(statement);
    }
  }

  private normalizeValue(value: LocalDbValue): LocalDbValue {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value ?? null;
  }

  private ensureDb(): Database {
    if (!this.db) {
      throw new Error(
        'LocalDatabase not initialized. Call `await init()` before using it.'
      );
    }
    return this.db;
  }
}

