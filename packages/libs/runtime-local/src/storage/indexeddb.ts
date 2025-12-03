export interface LocalStorageOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
}

const DEFAULT_DB_NAME = 'contractspec-runtime';
const DEFAULT_STORE = 'kv';
const FALLBACK_STORE = new Map<string, unknown>();

export class LocalStorageService {
  private dbPromise?: Promise<IDBDatabase | null>;

  constructor(private readonly options: LocalStorageOptions = {}) {}

  async init(): Promise<void> {
    await this.getDb();
  }

  async get<TValue = unknown>(
    key: string,
    fallback?: TValue
  ): Promise<TValue | undefined> {
    const db = await this.getDb();
    if (!db) {
      return (FALLBACK_STORE.get(key) as TValue | undefined) ?? fallback;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        resolve((request.result as TValue | undefined) ?? fallback);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set<TValue = unknown>(key: string, value: TValue): Promise<void> {
    const db = await this.getDb();
    if (!db) {
      FALLBACK_STORE.set(key, value);
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDb();
    if (!db) {
      FALLBACK_STORE.delete(key);
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDb();
    if (!db) {
      FALLBACK_STORE.clear();
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private get storeName() {
    return this.options.storeName ?? DEFAULT_STORE;
  }

  private async getDb(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') {
      return null;
    }
    if (!this.dbPromise) {
      this.dbPromise = this.openDb();
    }
    return this.dbPromise;
  }

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        this.options.dbName ?? DEFAULT_DB_NAME,
        this.options.version ?? 1
      );
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }
}


