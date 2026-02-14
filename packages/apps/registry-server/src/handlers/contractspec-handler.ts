import path from 'node:path';
import type { Logger } from '@contractspec/lib.logger';
import {
  ContractRegistryItemTypeSchema,
  ContractRegistryManifestSchema,
} from '@contractspec/lib.contracts-spec/contract-registry/schemas';
import {
  type ContractRegistryItem,
  type ContractRegistryItemType,
  type ContractRegistryManifest,
} from '@contractspec/lib.contracts-spec/contract-registry/types';
import { readJsonFile, readTextFile } from '../utils/fs';
import { fromRepoRoot } from '../utils/paths';

function stripJsonSuffix(nameOrNameJson: string): string {
  return nameOrNameJson.endsWith('.json')
    ? nameOrNameJson.slice(0, -'.json'.length)
    : nameOrNameJson;
}

export function getContractSpecRegistryPaths() {
  const manifestPath = fromRepoRoot(
    'packages/libs/contracts-spec/registry/registry.json'
  );
  const contractsRoot = fromRepoRoot('packages/libs/contracts-spec');
  return { manifestPath, contractsRoot };
}

export async function readContractSpecManifest(
  logger: Logger
): Promise<ContractRegistryManifest> {
  const { manifestPath } = getContractSpecRegistryPaths();
  const raw = await readJsonFile<unknown>(manifestPath);
  const parsed = ContractRegistryManifestSchema.parse(raw);
  logger.info('contractspec.registry.manifest_loaded', {
    itemCount: parsed.items.length,
  });
  return parsed;
}

function normalizeType(typeSegment: string): ContractRegistryItemType {
  const candidate = `contractspec:${typeSegment}` as const;
  return ContractRegistryItemTypeSchema.parse(candidate);
}

export async function buildContractSpecItemJson(
  typeSegment: string,
  nameOrNameJson: string,
  logger: Logger
): Promise<ContractRegistryItem> {
  const type = normalizeType(typeSegment);
  const name = stripJsonSuffix(nameOrNameJson);

  const manifest = await readContractSpecManifest(logger);
  const item = manifest.items.find((i) => i.type === type && i.name === name);
  if (!item) {
    throw new Error(`ContractSpec registry item not found: ${type}/${name}`);
  }

  const { contractsRoot } = getContractSpecRegistryPaths();
  const files = await Promise.all(
    item.files.map(async (f) => {
      const abs = path.join(contractsRoot, f.path);
      const content = await readTextFile(abs);
      return { ...f, content };
    })
  );

  logger.info('contractspec.registry.item_built', {
    type,
    name,
    fileCount: files.length,
  });

  return { ...item, files };
}
