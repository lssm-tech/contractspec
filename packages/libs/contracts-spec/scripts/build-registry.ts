import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContractRegistryManifestSchema } from '../src/contract-registry/schemas';
import type {
  ContractRegistryItem,
  ContractRegistryManifest,
} from '../src/contract-registry/types';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(pkgRoot, '../../..');

const studioTemplatesPath = path.resolve(
  repoRoot,
  'packages/bundles/library/src/templates/registry.ts'
);

function readTemplateIds(): string[] {
  if (fs.existsSync(studioTemplatesPath)) {
    const text = fs.readFileSync(studioTemplatesPath, 'utf8');
    const block = text.match(
      /export type TemplateId =([\s\S]*?)export type TemplateCategory/
    );
    if (block?.[1]) {
      const ids = Array.from(block[1].matchAll(/\|\s*'([^']+)'/g))
        .map((m) => m[1])
        .filter(Boolean);
      if (ids.length > 0) {
        return Array.from(new Set(ids)).sort((a, b) => a.localeCompare(b));
      }
    }
  }

  const fallbackDir = path.join(pkgRoot, 'registry/items/template');
  if (!fs.existsSync(fallbackDir)) return [];
  return fs
    .readdirSync(fallbackDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''))
    .sort((a, b) => a.localeCompare(b));
}

function writeJson(absPath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function main(): void {
  const templateIds = readTemplateIds();

  for (const id of templateIds) {
    const itemPath = path.join(
      pkgRoot,
      'registry/items/template',
      `${id}.json`
    );
    writeJson(itemPath, {
      id,
      source: 'contractspec-studio',
      kind: 'template',
    });
  }

  const items: ContractRegistryItem[] = templateIds.map((id) => ({
    key: id,
    type: 'contractspec:template',
    version: '1.0.0',
    title: id,
    description: 'Template metadata published from ContractSpec Studio.',
    meta: {
      stability: 'stable',
      owners: [],
      tags: ['template', 'studio'],
    },
    files: [
      {
        path: `registry/items/template/${id}.json`,
        type: 'contractspec:template-metadata',
      },
    ],
  }));

  const manifest: ContractRegistryManifest = {
    $schema: 'https://lssm.tech/schema/contractspec-registry.json',
    name: 'contractspec',
    homepage: 'https://lssm.tech',
    items,
  };
  ContractRegistryManifestSchema.parse(manifest);

  const outPath = path.join(pkgRoot, 'registry/registry.json');
  writeJson(outPath, manifest);

  console.log(
    `registry:build wrote ${path.relative(pkgRoot, outPath)} with ${items.length} items`
  );
}

main();
