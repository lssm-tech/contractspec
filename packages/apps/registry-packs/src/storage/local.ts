import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import type { PackStorage } from './types.js';

const DEFAULT_STORAGE_DIR = './storage/packs';

/**
 * Local filesystem storage for pack tarballs.
 */
export class LocalStorage implements PackStorage {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir ?? DEFAULT_STORAGE_DIR;
    if (!existsSync(this.baseDir)) {
      mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async put(packName: string, version: string, data: Buffer): Promise<string> {
    const filepath = this.path(packName, version);
    mkdirSync(dirname(filepath), { recursive: true });
    writeFileSync(filepath, data);
    return `/packs/${packName}/versions/${version}/download`;
  }

  async get(packName: string, version: string): Promise<Buffer | null> {
    const filepath = this.path(packName, version);
    if (!existsSync(filepath)) return null;
    return readFileSync(filepath);
  }

  async delete(packName: string, version: string): Promise<void> {
    const filepath = this.path(packName, version);
    if (existsSync(filepath)) {
      rmSync(filepath);
    }
  }

  async exists(packName: string, version: string): Promise<boolean> {
    return existsSync(this.path(packName, version));
  }

  private path(packName: string, version: string): string {
    return join(this.baseDir, packName, `${version}.tgz`);
  }
}
