import {
  loadWorkspaceConfig,
  type Stability,
} from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../../server';
import {
  extensionFor,
  normalizeStability,
  normalizeType,
} from './specs-create-normalize';
import { generateSpecCode } from './specs-create-codegen';
import { resolveOutputPath } from './specs-create-paths';

export async function createSpecFile(
  adapters: WorkspaceAdapters,
  args: {
    type: string;
    name: string;
    version?: number;
    description?: string;
    outputDir?: string;
    kind?: string;
    key?: string;
    domain?: string;
    owners?: string[];
    tags?: string[];
    stability?: string;
    overwrite?: boolean;
    dryRun?: boolean;
  }
): Promise<{ filePath: string; wrote: boolean; code: string }> {
  const type = normalizeType(args.type);
  const version = args.version ?? 1;
  const stability: Stability = normalizeStability(args.stability);
  const owners = args.owners ?? ['@team'];
  const tags = args.tags ?? [];
  const domain = args.domain ?? 'general';
  const description = args.description ?? `${args.name} ${type}`;
  const opKind = args.kind === 'query' ? 'query' : 'command';

  const code = generateSpecCode({
    type,
    name: args.name,
    version,
    description,
    stability,
    owners,
    tags,
    domain,
    opKind,
    featureKey: args.key,
  });

  const cfg = await loadWorkspaceConfig(adapters.fs);
  const filePath = resolveOutputPath({
    fs: adapters.fs,
    outputDirOverride: args.outputDir,
    workspaceOutputDir: cfg.outputDir,
    conventions: cfg.conventions as Record<string, string>,
    specType: type,
    opKind,
    specName: args.name,
    extension: extensionFor(type),
  });

  const exists = await adapters.fs.exists(filePath);
  if (exists && !(args.overwrite ?? false)) {
    return { filePath, wrote: false, code };
  }

  if (!(args.dryRun ?? false)) {
    await adapters.fs.writeFile(filePath, code);
    return { filePath, wrote: true, code };
  }

  return { filePath, wrote: false, code };
}
