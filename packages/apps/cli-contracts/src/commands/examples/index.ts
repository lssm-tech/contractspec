import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  getExample,
  listExamples,
  searchExamples,
  validateExamples,
} from '@lssm/module.contractspec-examples';

interface WorkspaceExampleFolderCheck {
  exampleDir: string;
  packageName?: string;
  errors: string[];
}

export const examplesCommand = new Command('examples')
  .description('Browse, inspect, and validate ContractSpec examples')
  .addCommand(
    new Command('list')
      .description('List examples')
      .option('--json', 'Output JSON', false)
      .option('-q, --query <query>', 'Filter by query')
      .action((options) => {
        const items = options.query
          ? searchExamples(String(options.query))
          : [...listExamples()];
        if (options.json) {
          console.log(JSON.stringify(items, null, 2));
          return;
        }
        for (const ex of items) {
          console.log(
            `${chalk.cyan(ex.id)}  ${ex.title}  ${chalk.gray(ex.kind)}`
          );
        }
      })
  )
  .addCommand(
    new Command('show')
      .description('Show a single example manifest')
      .argument('<id>', 'Example id')
      .option('--json', 'Output JSON', true)
      .action((id: string) => {
        const ex = getExample(id);
        if (!ex) {
          console.error(chalk.red(`❌ Example not found: ${id}`));
          process.exitCode = 1;
          return;
        }

        console.log(JSON.stringify(ex, null, 2));
      })
  )
  .addCommand(
    new Command('init')
      .description(
        'Write a small workspace stub for an example (manifest + README)'
      )
      .argument('<id>', 'Example id')
      .option(
        '-o, --out-dir <dir>',
        'Output directory (default: ./.contractspec/examples/<id>)'
      )
      .action(async (id: string, options) => {
        const ex = getExample(id);
        if (!ex) {
          console.error(chalk.red(`❌ Example not found: ${id}`));
          process.exitCode = 1;
          return;
        }

        const base = process.cwd();
        const outDir = options.outDir
          ? path.resolve(base, String(options.outDir))
          : path.resolve(base, '.contractspec', 'examples', ex.id);

        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(
          path.join(outDir, 'example.json'),
          JSON.stringify(ex, null, 2),
          'utf8'
        );
        await fs.writeFile(
          path.join(outDir, 'README.md'),
          [
            `# ${ex.title}`,
            '',
            ex.summary,
            '',
            `- id: \`${ex.id}\``,
            `- package: \`${ex.entrypoints.packageName}\``,
            '',
            'This folder is a lightweight workspace stub that references an example manifest.',
          ].join('\n'),
          'utf8'
        );

        console.log(chalk.green(`✅ Initialized ${ex.id} at ${outDir}`));
      })
  )
  .addCommand(
    new Command('validate')
      .description(
        'Validate that example manifests are well-formed and workspace example packages have required exports/docblocks'
      )
      .option(
        '--repo-root <dir>',
        'Repository root (default: current working directory)'
      )
      .action(async (options) => {
        const examples = [...listExamples()];
        const validation = validateExamples(examples);
        if (!validation.ok) {
          console.error(chalk.red('❌ Example manifest validation failed'));
          for (const err of validation.errors) {
            console.error(
              chalk.red(`- ${err.exampleId ?? 'unknown'}: ${err.message}`) +
                (err.path ? chalk.gray(` (${err.path})`) : '')
            );
          }
          process.exitCode = 1;
          return;
        }

        const repoRoot = path.resolve(
          process.cwd(),
          String(options.repoRoot ?? '.')
        );
        const checks = await validateWorkspaceExamplesFolder(
          repoRoot,
          examples
        );
        const failures = checks.filter((c) => c.errors.length > 0);

        if (failures.length) {
          console.error(
            chalk.red(
              `❌ Workspace example package validation failed (${failures.length})`
            )
          );
          for (const f of failures) {
            console.error(chalk.red(`\n${f.exampleDir}`));
            for (const e of f.errors) {
              console.error(chalk.red(`  - ${e}`));
            }
          }
          process.exitCode = 1;
          return;
        }

        console.log(
          chalk.green(
            `✅ Examples valid (${examples.length} manifests, ${checks.length} folders)`
          )
        );
      })
  );

async function validateWorkspaceExamplesFolder(
  repoRoot: string,
  examples: ReturnType<typeof listExamples>
): Promise<WorkspaceExampleFolderCheck[]> {
  const dir = path.join(repoRoot, 'packages', 'examples');
  let entries: string[] = [];
  try {
    entries = (await fs.readdir(dir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [
      {
        exampleDir: dir,
        errors: [
          'Missing packages/examples folder (run from repo root or pass --repo-root)',
        ],
      },
    ];
  }

  const byPackageName = new Map<string, string>();
  for (const ex of examples)
    byPackageName.set(ex.entrypoints.packageName, ex.id);

  const results: WorkspaceExampleFolderCheck[] = [];
  for (const name of entries) {
    const exampleDir = path.join(dir, name);
    const errors: string[] = [];
    const pkgJsonPath = path.join(exampleDir, 'package.json');

    const pkg = await readJson<{
      name?: string;
      exports?: Record<string, string>;
    }>(pkgJsonPath);
    const packageName = pkg?.name;
    if (!packageName) errors.push('package.json missing "name"');
    if (packageName && !packageName.startsWith('@lssm/example.')) {
      errors.push(
        `package name must start with "@lssm/example." (got ${packageName})`
      );
    }

    const exportsMap = pkg?.exports ?? {};
    if (!exportsMap['./example'])
      errors.push('package.json must export "./example"');
    if (!exportsMap['./docs'])
      errors.push('package.json must export "./docs" (DocBlocks entry)');

    const srcExample = path.join(exampleDir, 'src', 'example.ts');
    if (!(await fileExists(srcExample))) errors.push('missing src/example.ts');

    const docsIndex = path.join(exampleDir, 'src', 'docs', 'index.ts');
    if (!(await fileExists(docsIndex)))
      errors.push('missing src/docs/index.ts');

    const docblocks = await globDocBlocks(path.join(exampleDir, 'src', 'docs'));
    if (docblocks.length === 0) errors.push('missing src/docs/*.docblock.ts');

    if (packageName && !byPackageName.has(packageName)) {
      errors.push(
        'not present in EXAMPLE_REGISTRY (manifest not wired into examples module)'
      );
    }

    results.push({ exampleDir, packageName, errors });
  }

  // Ensure every registry example maps to a workspace folder (excluding non-workspace/built-ins).
  const folderPackageNames = new Set(
    results.map((r) => r.packageName).filter(Boolean) as string[]
  );
  for (const ex of examples) {
    if (!ex.entrypoints.packageName.startsWith('@lssm/example.')) continue;
    if (!folderPackageNames.has(ex.entrypoints.packageName)) {
      results.push({
        exampleDir: dir,
        packageName: ex.entrypoints.packageName,
        errors: [
          `registry example "${ex.id}" points to missing workspace package ${ex.entrypoints.packageName}`,
        ],
      });
    }
  }

  return results;
}

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function globDocBlocks(docsDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(docsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith('.docblock.ts'))
      .map((e) => e.name);
  } catch {
    return [];
  }
}



