import { dirname, sep } from 'path';
import type { SpecScanResult } from '@contractspec/module.workspace';
import type { WorkspaceAdapters } from '../../ports/logger';

export interface ModuleDefinition {
  type: 'app-config' | 'example' | 'feature';
  key: string;
  dirPath: string;
}

export class ModuleResolver {
  private modules: ModuleDefinition[] = [];
  private initialized = false;

  constructor(private adapters: WorkspaceAdapters) {}

  /**
   * Initialize resolver by scanning for module definitions from a list of specs.
   * This is lightweight - it just indexes the specs passed to it.
   */
  public initialize(specs: SpecScanResult[]): void {
    this.modules = [];

    for (const spec of specs) {
      // Identify module definitions based on spec type
      let type: ModuleDefinition['type'] | undefined;

      if (spec.specType === 'app-config') {
        type = 'app-config';
      } else if (spec.specType === 'example') {
        type = 'example';
      } else if (spec.specType === 'feature') {
        type = 'feature';
      }

      if (type && spec.key) {
        // Store absolute directory path for the module
        // We assume spec.filePath is absolute (as per scan logic)
        const dirPath = dirname(spec.filePath);
        this.modules.push({
          type,
          key: spec.key,
          dirPath,
        });
      }
    }
    this.initialized = true;
  }

  /**
   * Resolve the owning module for a given file path.
   * Priority: AppConfig > Example > Feature
   */
  public resolve(filePath: string): ModuleDefinition | undefined {
    if (!this.initialized) {
      throw new Error('ModuleResolver must be initialized before use');
    }

    const fileDir = dirname(filePath);

    // Find all modules that contain this file
    const candidates = this.modules.filter((mod) => {
      // Check if fileDir starts with module dirPath
      // Ensure we match directory boundaries (add trailing separator if needed for prefix check)
      const modDirWithSep = mod.dirPath.endsWith(sep)
        ? mod.dirPath
        : mod.dirPath + sep;
      const fileDirWithSep = fileDir.endsWith(sep) ? fileDir : fileDir + sep;

      return (
        fileDirWithSep.startsWith(modDirWithSep) || fileDir === mod.dirPath
      );
    });

    if (candidates.length === 0) {
      return undefined;
    }

    // Apply priority: AppConfig > Example > Feature
    // If multiple of same type, pick the deepest one (longest path)?
    // The requirement says "Parent Priority". Usually "closest parent" is desired,
    // but the conflict might be:
    // /apps/myapp (AppConfig)
    //   /src/features/myfeat (Feature)
    //     /src/ops/op.ts
    //
    // Ancestry: [AppConfig (/apps/myapp), Feature (/apps/myapp/src/features/myfeat)]
    // Requirement priority: AppConfig > Example > Feature.
    // So if both exist in ancestry, we pick AppConfig (even if Feature is closer).

    // Sort candidates by priority type
    candidates.sort((a, b) => {
      const priority = { 'app-config': 3, example: 2, feature: 1 };
      const pA = priority[a.type];
      const pB = priority[b.type];
      if (pA !== pB) {
        return pB - pA; // Descending priority (3 > 2 > 1)
      }
      // Same type? Pick closest (longest path)
      return b.dirPath.length - a.dirPath.length;
    });

    return candidates[0];
  }
}
