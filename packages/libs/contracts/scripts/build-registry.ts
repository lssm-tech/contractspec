import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type RegistryFile = { path: string; type: string };
type RegistryItem = {
  name: string;
  type:
    | 'contractspec:operation'
    | 'contractspec:event'
    | 'contractspec:presentation'
    | 'contractspec:form'
    | 'contractspec:feature'
    | 'contractspec:workflow'
    | 'contractspec:template'
    | 'contractspec:integration'
    | 'contractspec:data-view';
  version: number;
  title: string;
  description: string;
  meta: { stability: 'stable' | 'beta' | 'experimental' | 'deprecated' | 'idea' | 'in_creation'; owners: string[]; tags: string[] };
  files: RegistryFile[];
};

type RegistryManifest = {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(scriptDir, '..'); // packages/libs/contracts
const repoRoot = path.resolve(pkgRoot, '../../..');

const studioTemplatesPath = path.resolve(
  repoRoot,
  'packages/bundles/contractspec-studio/src/templates/registry.ts'
);

function readTemplateIds(): string[] {
  if (!fs.existsSync(studioTemplatesPath)) return [];
  const text = fs.readFileSync(studioTemplatesPath, 'utf8');
  const block = text.match(/export type TemplateId =([\s\S]*?)export type TemplateCategory/);
  if (!block?.[1]) return [];
  const ids = Array.from(block[1].matchAll(/\|\s*'([^']+)'/g))
    .map((m) => m[1])
    .filter(Boolean);
  return Array.from(new Set(ids)).sort((a, b) => a.localeCompare(b));
}

function writeJson(absPath: string, value: unknown) {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function main() {
  const templateIds = readTemplateIds();

  // Write per-template metadata files (served and inlined by registry-server).
  for (const id of templateIds) {
    const p = path.join(pkgRoot, 'registry/items/template', `${id}.json`);
    writeJson(p, {
      id,
      source: 'contractspec-studio',
      kind: 'template',
    });
  }

  const items: RegistryItem[] = templateIds.map((id) => ({
    name: id,
    type: 'contractspec:template',
    version: 1,
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

  const manifest: RegistryManifest = {
    $schema: 'https://lssm.dev/schema/contractspec-registry.json',
    name: 'contractspec',
    homepage: 'https://lssm.dev',
    items,
  };

  const outPath = path.join(pkgRoot, 'registry/registry.json');
  writeJson(outPath, manifest);

  // eslint-disable-next-line no-console
  console.log(`registry:build wrote ${path.relative(pkgRoot, outPath)} with ${items.length} items`);
}

main();


