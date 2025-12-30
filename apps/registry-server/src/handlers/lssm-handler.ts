import path from 'node:path';
import type { Logger } from '@contractspec/lib.logger';
import { readJsonFile, readTextFile } from '../utils/fs';
import { fromRepoRoot } from '../utils/paths';

interface ShadcnRegistryManifest {
  $schema?: string;
  name: string;
  homepage?: string;
  items: {
    name: string;
    type: string;
    title?: string;
    description: string;
    files: { path: string; type: string; target?: string }[];
    dependencies?: string[];
    registryDependencies?: string[];
  }[];
}

export type ShadcnRegistryItemJson = ShadcnRegistryManifest['items'][number] & {
  files: {
    path: string;
    type: string;
    target?: string;
    content: string;
  }[];
};

function stripJsonSuffix(nameOrNameJson: string): string {
  return nameOrNameJson.endsWith('.json')
    ? nameOrNameJson.slice(0, -'.json'.length)
    : nameOrNameJson;
}

export function getLssmRegistryPaths() {
  const manifestPath = fromRepoRoot(
    'packages/libs/design-system/registry/registry.json'
  );
  const designSystemRoot = fromRepoRoot('packages/libs/design-system');
  return { manifestPath, designSystemRoot };
}

export async function readLssmManifest(): Promise<ShadcnRegistryManifest> {
  const { manifestPath } = getLssmRegistryPaths();
  return await readJsonFile<ShadcnRegistryManifest>(manifestPath);
}

export async function buildLssmItemJson(
  nameOrNameJson: string,
  logger: Logger
): Promise<ShadcnRegistryItemJson> {
  const name = stripJsonSuffix(nameOrNameJson);
  const manifest = await readLssmManifest();
  const item = manifest.items.find((i) => i.name === name);
  if (!item) {
    throw new Error(`LSSM registry item not found: ${name}`);
  }

  const { designSystemRoot } = getLssmRegistryPaths();
  const files = await Promise.all(
    item.files.map(async (f) => {
      const abs = path.join(designSystemRoot, f.path);
      const content = await readTextFile(abs);
      return { ...f, content };
    })
  );

  logger.info('lssm.registry.item_built', {
    name: item.name,
    fileCount: files.length,
  });

  return {
    ...item,
    files,
  };
}

export async function buildLssmManifestJson(
  logger: Logger
): Promise<ShadcnRegistryManifest> {
  const manifest = await readLssmManifest();
  logger.info('lssm.registry.manifest_loaded', {
    itemCount: manifest.items.length,
  });

  return manifest;
}
