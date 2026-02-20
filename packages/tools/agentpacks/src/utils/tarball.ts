import { execSync } from 'child_process';
import { readFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { createHash } from 'crypto';
import { tmpdir } from 'os';

/**
 * Create a tarball from a pack directory.
 * Returns the tarball as an ArrayBuffer.
 */
export async function createTarball(packDir: string): Promise<ArrayBuffer> {
  const absDir = resolve(packDir);
  const tmpFile = join(tmpdir(), `agentpacks-${Date.now()}.tgz`);

  try {
    // Use tar to create the archive
    execSync(`tar -czf "${tmpFile}" -C "${absDir}" .`, {
      stdio: 'pipe',
    });

    const buffer = readFileSync(tmpFile);
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  } finally {
    // Clean up temp file
    if (existsSync(tmpFile)) {
      rmSync(tmpFile);
    }
  }
}

/**
 * Extract a tarball to a directory.
 */
export async function extractTarball(
  data: ArrayBuffer,
  targetDir: string
): Promise<void> {
  mkdirSync(targetDir, { recursive: true });

  const tmpFile = join(tmpdir(), `agentpacks-${Date.now()}.tgz`);

  try {
    const buffer = Buffer.from(data);
    const { writeFileSync } = await import('fs');
    writeFileSync(tmpFile, buffer);

    execSync(`tar -xzf "${tmpFile}" -C "${targetDir}"`, {
      stdio: 'pipe',
    });
  } finally {
    if (existsSync(tmpFile)) {
      rmSync(tmpFile);
    }
  }
}

/**
 * Compute SHA-256 integrity hash for an ArrayBuffer.
 */
export function computeTarballIntegrity(data: ArrayBuffer): string {
  const hash = createHash('sha256').update(Buffer.from(data)).digest('hex');
  return `sha256-${hash}`;
}
