import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { type ImportLock, type ImportLockEntry } from '../lib/types.js';

function sha256(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function stripDatasourceAndGenerators(schema: string): string {
  // naive strip: remove blocks beginning with 'datasource ' or 'generator '
  return schema
    .replace(/datasource\s+\w+\s*\{[\s\S]*?\}/g, '')
    .replace(/generator\s+\w+\s*\{[\s\S]*?\}/g, '')
    .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runImport(argv: any) {
  const target = (argv.target as string) || process.cwd();
  const modulesArg = (argv.modules as string) || '';
  async function loadModulesFromMergerConfig(): Promise<string[] | null> {
    const candidates = [
      path.join(target, 'prisma-merger.config.ts'),
      path.join(target, 'prisma-merger.config.mts'),
      path.join(target, 'prisma-merger.config.js'),
      path.join(target, 'prisma-merger.config.mjs'),
      path.join(target, 'prisma-merger.config.cjs'),
      path.join(target, 'prisma-merger.config.json'),
    ];
    for (const file of candidates) {
      if (!fs.existsSync(file)) continue;
      if (file.endsWith('.json')) {
        const json = JSON.parse(fs.readFileSync(file, 'utf8')) as {
          modules?: string[];
        };
        if (Array.isArray(json.modules) && json.modules.length > 0)
          return json.modules;
      } else if (file.endsWith('.ts') || file.endsWith('.mts')) {
        // Parse TS config without executing it
        const raw = fs.readFileSync(file, 'utf8');
        const match = raw.match(/modules\s*:\s*\[([\s\S]*?)\]/m);
        if (Array.isArray(match) && typeof match[1] === 'string') {
          const arr: string = match[1] || '';
          const mods: string[] = [];
          const re = /['"]([^'"]+)['"]/g;
          let m: RegExpExecArray | null;
          while ((m = re.exec(arr))) {
            const val = m[1] ?? '';
            if (val) mods.push(val);
          }
          if (mods.length > 0) return mods;
        }
      } else {
        const mod = await import(pathToFileURL(file).href);
        const cfg = mod.default || mod;
        if (Array.isArray(cfg.modules) && cfg.modules.length > 0)
          return cfg.modules as string[];
      }
    }
    return null;
  }

  let modules: string[] = modulesArg
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (modules.length === 0) {
    const fromCfg = await loadModulesFromMergerConfig();
    if (fromCfg) modules = fromCfg;
  }
  if (modules.length === 0) {
    console.error(
      'No modules specified. Provide --modules or define prisma-merger.config.ts { modules: [...] }'
    );
    process.exit(1);
  }

  const importedDir = path.join(target, 'prisma', 'schema', 'imported');
  fs.mkdirSync(importedDir, { recursive: true });

  const entries: ImportLockEntry[] = [];

  for (const mod of modules) {
    const pkgPath = require.resolve(path.join(mod, 'package.json'));
    const modRoot = path.dirname(pkgPath);
    const schemaPath = path.join(modRoot, 'prisma', 'schema.prisma');
    if (!fs.existsSync(schemaPath)) {
      console.error(`Module ${mod} missing prisma/schema.prisma`);
      process.exit(1);
    }
    const raw = fs.readFileSync(schemaPath, 'utf8');
    const stripped = stripDatasourceAndGenerators(raw);
    const outDir = path.join(
      importedDir,
      path.basename(mod).replace(/^@/, '').replace(/\//g, '_')
    );
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'models.prisma');
    fs.writeFileSync(outFile, stripped, 'utf8');

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    entries.push({
      moduleName: mod,
      version: pkg.version || '0.0.0',
      sourcePath: schemaPath,
      sha256: sha256(raw),
    });
  }

  const lock: ImportLock = { updatedAt: new Date().toISOString(), entries };
  fs.writeFileSync(
    path.join(importedDir, 'imported.lock.json'),
    JSON.stringify(lock, null, 2)
  );
  console.log(`Imported ${entries.length} modules into ${importedDir}`);
}
