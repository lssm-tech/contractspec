/**
 * Runtime services for local (browser) sandbox environment.
 *
 * Uses lazy-loading for PGLite to avoid bundle bloat.
 */
import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';

import { LocalEventBus } from '../events/local-pubsub';
import { LocalGraphQLClient } from '../graphql/local-client';
import { LocalStorageService } from '../storage/indexeddb';

import { SANDBOX_MIGRATIONS } from '../database/migrations';

export type TemplateId = string;

export interface LocalRuntimeInitOptions {
  /**
   * Data directory for IndexedDB persistence (optional).
   * If omitted, uses in-memory database.
   */
  dataDir?: string;
}

export interface TemplateSeedOptions {
  templateId: TemplateId;
  projectId?: string;
}

const DEFAULT_PROJECT_ID = 'local-project' as const;

/**
 * Local runtime services for sandbox environment.
 *
 * Provides lazy-loaded database access via DatabasePort interface.
 */
export class LocalRuntimeServices {
  readonly storage = new LocalStorageService();
  readonly pubsub = new LocalEventBus();
  #initialized = false;

  private _db?: DatabasePort;

  /**
   * Get the database port (must be initialized first).
   */
  get db(): DatabasePort {
    if (!this._db) {
      throw new Error(
        'LocalRuntimeServices not initialized. Call init() first.'
      );
    }
    return this._db;
  }

  private _graphql?: LocalGraphQLClient;

  /**
   * Get the GraphQL client (must be initialized first).
   */
  get graphql(): LocalGraphQLClient {
    if (!this._graphql) {
      throw new Error(
        'LocalRuntimeServices not initialized. Call init() first.'
      );
    }
    return this._graphql;
  }

  /**
   * Initialize the runtime services.
   *
   * Lazy-loads PGLite adapter to avoid bundle bloat.
   */
  async init(options: LocalRuntimeInitOptions = {}): Promise<void> {
    if (this.#initialized) return;

    // Lazy-load PGLite adapter
    const { createPGLiteAdapter } =
      await import('@contractspec/lib.runtime-sandbox');
    this._db = await createPGLiteAdapter();
    await this._db.init({ dataDir: options.dataDir });

    // Run migrations
    await this._db.migrate(SANDBOX_MIGRATIONS);

    // Initialize storage
    await this.storage.init();

    // Initialize GraphQL client with the new database port
    this._graphql = new LocalGraphQLClient({
      db: this._db,
      storage: this.storage,
      pubsub: this.pubsub,
    });

    this.#initialized = true;
  }

  /**
   * Check if runtime is initialized.
   */
  isInitialized(): boolean {
    return this.#initialized;
  }

  /**
   * Seed the database with deterministic defaults for a template.
   *
   * - No randomness
   * - No wall-clock timestamps
   * - Unknown templates are a no-op (safe default)
   */
  async seedTemplate(options: TemplateSeedOptions): Promise<void> {
    if (!this.#initialized) {
      throw new Error('Call init() before seeding templates.');
    }

    const projectId = options.projectId ?? DEFAULT_PROJECT_ID;

    if (!this._db) {
      throw new Error('Database not initialized');
    }

    // Lazy-load seeders to avoid bundle bloat
    const { seedTemplate } = await import('./seeders');
    await seedTemplate({
      templateId: options.templateId,
      projectId,
      db: this._db,
    });
  }
}
