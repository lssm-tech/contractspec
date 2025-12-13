import fs from 'node:fs';
import path from 'node:path';

type RegistryFile = { path: string; type: string; target?: string };
type RegistryItem = {
  name: string;
  type: 'registry:block';
  title: string;
  description: string;
  files: RegistryFile[];
};
type RegistryManifest = {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
};

const pkgRoot = path.resolve(process.cwd(), 'packages/libs/design-system');

function rel(absPath: string): string {
  return path.relative(pkgRoot, absPath).split(path.sep).join('/');
}

function listFiles(dirRel: string, exts: string[] = ['.ts', '.tsx']): string[] {
  const base = path.join(pkgRoot, dirRel);
  if (!fs.existsSync(base)) return [];
  const out: string[] = [];
  const stack: string[] = [base];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur) break;
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const p = path.join(cur, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (!exts.includes(ext)) continue;
        if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx'))
          continue;
        out.push(p);
      }
    }
  }
  out.sort((a, b) => rel(a).localeCompare(rel(b)));
  return out;
}

function fileType(absPath: string): RegistryFile['type'] {
  const r = rel(absPath);
  if (r.includes('/hooks/')) return 'registry:hook';
  if (r.includes('/components/')) return r.endsWith('.tsx') ? 'registry:component' : 'registry:lib';
  return 'registry:lib';
}

function addBlock(
  items: RegistryItem[],
  name: string,
  title: string,
  description: string,
  filesAbs: string[]
) {
  items.push({
    name,
    type: 'registry:block',
    title,
    description,
    files: filesAbs.map((p) => ({ path: rel(p), type: fileType(p) })),
  });
}

function main() {
  const items: RegistryItem[] = [];

  addBlock(
    items,
    'lssm-atoms',
    'LSSM Atoms',
    'LSSM design-system atomic components (Button, Input, etc.).',
    listFiles('src/components/atoms')
  );
  addBlock(
    items,
    'lssm-molecules',
    'LSSM Molecules',
    'LSSM design-system composed components (Nav, Command Palette, etc.).',
    listFiles('src/components/molecules')
  );
  addBlock(
    items,
    'lssm-organisms',
    'LSSM Organisms',
    'LSSM design-system higher-level components (Layouts, Headers, etc.).',
    listFiles('src/components/organisms')
  );
  addBlock(
    items,
    'lssm-forms',
    'LSSM Forms',
    'LSSM design-system form components and layouts.',
    listFiles('src/components/forms')
  );
  addBlock(
    items,
    'lssm-data-views',
    'LSSM Data Views',
    'LSSM design-system data-view components (lists, tables, renderers).',
    listFiles('src/components/data-view')
  );
  addBlock(
    items,
    'lssm-legal',
    'LSSM Legal',
    'LSSM design-system legal pages/templates (Terms, Privacy, etc.).',
    listFiles('src/components/legal')
  );
  addBlock(
    items,
    'lssm-marketing',
    'LSSM Marketing',
    'LSSM design-system marketing sections/components.',
    listFiles('src/components/marketing')
  );
  addBlock(
    items,
    'lssm-templates',
    'LSSM Templates',
    'LSSM design-system templates (page-level compositions).',
    listFiles('src/components/templates')
  );
  addBlock(
    items,
    'lssm-core',
    'LSSM Core',
    'LSSM design-system core utilities, hooks, theme, platform adapters, and exports.',
    [
      ...listFiles('src/hooks'),
      ...listFiles('src/lib'),
      ...listFiles('src/platform'),
      ...listFiles('src/renderers'),
      ...listFiles('src/theme'),
      ...listFiles('src/types', ['.ts', '.tsx', '.d.ts']),
      path.join(pkgRoot, 'src/index.ts'),
    ]
  );

  const manifest: RegistryManifest = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'lssm',
    homepage: 'https://lssm.dev',
    items,
  };

  const outDir = path.join(pkgRoot, 'registry');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'registry.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`registry:build wrote ${rel(outPath)} with ${items.length} items`);
}

main();


