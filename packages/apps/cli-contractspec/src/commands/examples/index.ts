import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  getExample,
  listExamples,
  searchExamples,
} from '@contractspec/module.examples';
import { validateExamples } from '@contractspec/lib.contracts-spec/examples/validation';

interface WorkspaceExampleFolderCheck {
  exampleDir: string;
  packageName?: string;
  errors: string[];
}

interface MaintainedWorkspaceExample {
  directory: string;
  packageName: string;
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
            `${chalk.cyan(ex.meta.key)}  ${ex.meta.title}  ${chalk.gray(ex.meta.kind)}`
          );
        }
      })
  )
  .addCommand(
    new Command('show')
      .description('Show a single example manifest')
      .argument('<key>', 'Example key')
      .option('--json', 'Output JSON', true)
      .action((key: string) => {
        const example = getExample(key);
        if (!example) {
          console.error(chalk.red(`❌ Example not found: ${key}`));
          process.exitCode = 1;
          return;
        }

        console.log(JSON.stringify(example, null, 2));
      })
  )
  .addCommand(
    new Command('init')
      .description(
        'Write a small workspace stub for an example (manifest + README)'
      )
      .argument('<key>', 'Example key')
      .option(
        '-o, --out-dir <dir>',
        'Output directory (default: ./.contractspec/examples/<key>)'
      )
      .action(async (key: string, options) => {
        const example = getExample(key);
        if (!example) {
          console.error(chalk.red(`❌ Example not found: ${key}`));
          process.exitCode = 1;
          return;
        }

        const base = process.cwd();
        const outDir = options.outDir
          ? path.resolve(base, String(options.outDir))
          : path.resolve(base, '.contractspec', 'examples', example.meta.key);

        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(
          path.join(outDir, 'example.json'),
          JSON.stringify(example, null, 2),
          'utf8'
        );
        await fs.writeFile(
          path.join(outDir, 'README.md'),
          [
            `# ${example.meta.title}`,
            '',
            example.meta.summary,
            '',
            `- id: \`${example.meta.key}\``,
            `- package: \`${example.entrypoints.packageName}\``,
            '',
            'This folder is a lightweight workspace stub that references an example manifest.',
          ].join('\n'),
          'utf8'
        );

        console.log(
          chalk.green(`✅ Initialized ${example.meta.key} at ${outDir}`)
        );
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
              chalk.red(`- ${err.exampleKey ?? 'unknown'}: ${err.message}`) +
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
        const registryErrors = await validateGeneratedRegistry(repoRoot);

        if (failures.length || registryErrors.length) {
          console.error(
            chalk.red(
              `❌ Workspace example package validation failed (${failures.length + registryErrors.length})`
            )
          );
          for (const f of failures) {
            console.error(chalk.red(`\n${f.exampleDir}`));
            for (const e of f.errors) {
              console.error(chalk.red(`  - ${e}`));
            }
          }
          if (registryErrors.length) {
            console.error(
              chalk.red(
                `\n${path.join(repoRoot, 'packages', 'modules', 'examples')}`
              )
            );
            for (const error of registryErrors) {
              console.error(chalk.red(`  - ${error}`));
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
    byPackageName.set(ex.entrypoints.packageName, ex.meta.key);

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
    if (packageName && !packageName.startsWith('@contractspec/example.')) {
      errors.push(
        `package name must start with "@contractspec/example." (got ${packageName})`
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
    if (!ex.entrypoints.packageName.startsWith('@contractspec/example.'))
      continue;
    if (!folderPackageNames.has(ex.entrypoints.packageName)) {
      results.push({
        exampleDir: dir,
        packageName: ex.entrypoints.packageName,
        errors: [
          `registry example "${ex.meta.key}" points to missing workspace package ${ex.entrypoints.packageName}`,
        ],
      });
    }
  }

  return results;
}

async function validateGeneratedRegistry(repoRoot: string): Promise<string[]> {
  const maintainedExamples =
    await discoverMaintainedWorkspaceExamples(repoRoot);
  const expectedRegistry = renderBuiltinsFile(maintainedExamples);
  const builtinsPath = path.join(
    repoRoot,
    'packages',
    'modules',
    'examples',
    'src',
    'builtins.ts'
  );
  const builtins = await fs.readFile(builtinsPath, 'utf8').catch(() => null);

  const errors: string[] = [];

  if (builtins !== expectedRegistry) {
    errors.push(
      'generated builtins.ts is out of date (run `bun scripts/generate-example-registry.ts --write`)'
    );
  }

  const moduleExamplesPackageJson = path.join(
    repoRoot,
    'packages',
    'modules',
    'examples',
    'package.json'
  );
  const modulePackage = await readJson<{
    dependencies?: Record<string, string>;
  }>(moduleExamplesPackageJson);
  const dependencies = modulePackage?.dependencies ?? {};

  for (const example of maintainedExamples) {
    if (!dependencies[example.packageName]) {
      errors.push(
        `packages/modules/examples/package.json is missing dependency ${example.packageName}`
      );
    }
  }

  return errors;
}

async function discoverMaintainedWorkspaceExamples(
  repoRoot: string
): Promise<MaintainedWorkspaceExample[]> {
  const dir = path.join(repoRoot, 'packages', 'examples');
  const entries = await fs
    .readdir(dir, { withFileTypes: true })
    .catch(() => []);
  const results: MaintainedWorkspaceExample[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pkgJsonPath = path.join(dir, entry.name, 'package.json');
    const pkg = await readJson<{
      name?: string;
      exports?: Record<string, string>;
    }>(pkgJsonPath);

    if (!pkg?.name?.startsWith('@contractspec/example.')) continue;
    if (!pkg.exports?.['./example']) continue;
    if (!pkg.exports?.['./docs']) continue;

    results.push({
      directory: entry.name,
      packageName: pkg.name,
    });
  }

  return results.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

function renderBuiltinsFile(examples: MaintainedWorkspaceExample[]): string {
  const lines: string[] = [
    'import type { ExampleSpec } from "@contractspec/lib.contracts-spec/examples/types";',
    '',
    '// Generated by scripts/generate-example-registry.ts. Do not edit manually.',
  ];

  for (const example of examples) {
    lines.push(
      `import ${toIdentifier(example.directory)} from "${example.packageName}/example";`
    );
  }

  lines.push('', 'export const EXAMPLE_REGISTRY: readonly ExampleSpec[] = [');

  for (const example of examples) {
    lines.push(`  ${toIdentifier(example.directory)},`);
  }

  lines.push('];', '');
  return lines.join('\n');
}

function toIdentifier(value: string): string {
  const raw = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.slice(0, 1).toUpperCase() + segment.slice(1))
    .join('');

  return /^[0-9]/.test(raw) ? `Example${raw}` : raw;
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
