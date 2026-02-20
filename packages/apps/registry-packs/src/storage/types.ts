/**
 * Storage interface for pack tarballs.
 * Phase 1: local filesystem. Phase 2+: S3-compatible.
 */
export interface PackStorage {
  /** Store a tarball, returning its URL/path. */
  put(packName: string, version: string, data: Buffer): Promise<string>;

  /** Retrieve a tarball as a Buffer. */
  get(packName: string, version: string): Promise<Buffer | null>;

  /** Delete a tarball. */
  delete(packName: string, version: string): Promise<void>;

  /** Check if a tarball exists. */
  exists(packName: string, version: string): Promise<boolean>;
}
