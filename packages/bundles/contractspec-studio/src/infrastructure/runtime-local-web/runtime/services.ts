import { LocalDatabase } from '../database/sqlite-wasm';
import { LocalStorageService } from '../storage/indexeddb';
import { LocalGraphQLClient } from '../graphql/local-client';
import { LocalEventBus } from '../events/local-pubsub';
import type { TemplateId } from '../../../templates/registry';
import { seedTemplate } from './seeders';

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
   * Seed the in-browser database with deterministic defaults for a template.
   *
   * - No randomness
   * - No wall-clock timestamps
   * - Unknown templates are a no-op (safe default)
   */
  async seedTemplate(options: TemplateSeedOptions): Promise<void> {
    const projectId = options.projectId ?? DEFAULT_PROJECT_ID;
    await seedTemplate({ templateId: options.templateId, projectId, db: this.db });
  }
}


