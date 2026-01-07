/**
 * Pack installation service.
 *
 * Install vibe packs from local paths or registry.
 */

import { mkdir, copyFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { findWorkspaceRoot } from '../../adapters/workspace';

export interface PackInstallResult {
  success: boolean;
  workflowsInstalled: number;
  templatesInstalled: number;
  error?: string;
}

/**
 * Install a vibe pack from a local path.
 */
export async function installPack(
  packPath: string,
  cwd?: string
): Promise<PackInstallResult> {
  const workingDir = cwd ?? process.cwd();
  const root = findWorkspaceRoot(workingDir) ?? workingDir;

  // Handle registry packs (future)
  if (packPath.startsWith('registry:')) {
    return {
      success: false,
      workflowsInstalled: 0,
      templatesInstalled: 0,
      error: 'Registry pack install not yet implemented. Use local path.',
    };
  }

  const absPackPath = resolve(workingDir, packPath);
  if (!existsSync(absPackPath)) {
    return {
      success: false,
      workflowsInstalled: 0,
      templatesInstalled: 0,
      error: `Pack path not found: ${absPackPath}`,
    };
  }

  let workflowsCount = 0;
  let templatesCount = 0;

  // Install workflows
  const workflowsSrc = join(absPackPath, 'workflows');
  if (existsSync(workflowsSrc)) {
    const workflowsDest = join(root, '.contractspec', 'vibe', 'workflows');
    await mkdir(workflowsDest, { recursive: true });

    const files = await readdir(workflowsSrc);
    for (const file of files) {
      if (
        file.endsWith('.json') ||
        file.endsWith('.yaml') ||
        file.endsWith('.yml')
      ) {
        await copyFile(join(workflowsSrc, file), join(workflowsDest, file));
        workflowsCount++;
      }
    }
  }

  // Install templates
  const templatesSrc = join(absPackPath, 'templates');
  if (existsSync(templatesSrc)) {
    const templatesDest = join(root, '.contractspec', 'vibe', 'templates');
    await mkdir(templatesDest, { recursive: true });

    const files = await readdir(templatesSrc);
    for (const file of files) {
      const srcFile = join(templatesSrc, file);
      const destFile = join(templatesDest, file);
      const stats = await stat(srcFile);
      if (stats.isFile()) {
        await copyFile(srcFile, destFile);
        templatesCount++;
      }
    }
  }

  return {
    success: true,
    workflowsInstalled: workflowsCount,
    templatesInstalled: templatesCount,
  };
}
