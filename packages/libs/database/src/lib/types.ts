export interface ImportLockEntry {
  moduleName: string;
  version: string;
  sourcePath: string;
  sha256: string;
}

export interface ImportLock {
  updatedAt: string;
  entries: ImportLockEntry[];
}
