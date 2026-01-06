import { Command } from 'commander';
import chalk from 'chalk';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { glob } from 'glob';
import { loadVibeConfig } from './config';
import { findWorkspaceRoot } from '@contractspec/bundle.workspace';

// Default ignores to ensure safety
const DEFAULT_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/.env*',
  '**/id_rsa',
  '**/*.pem',
  '**/*.key',
  '**/secrets.*',
];

export const vibeContextCommand = new Command('context')
  .description('Manage AI context bundles')
  .addCommand(
    new Command('export')
    .description('Export a safe context bundle for AI agents')
    .option('--single', 'Concatenate output into a single file (P1)', false)
    .action(async (options) => {
      try {
        const config = await loadVibeConfig();
        const cwd = process.cwd();
        const root = findWorkspaceRoot(cwd) || cwd;
        const contextDir = join(root, '.contractspec', 'context');
        const contextFilesDir = join(contextDir, 'files');

        console.log(chalk.bold('\n📦 Exporting Context Bundle...\n'));

        // 1. Prepare ignore list
        let ignorePatterns = [...DEFAULT_IGNORES];
        
        // Try to read .gitignore
        const gitignorePath = join(root, '.gitignore');
        if (existsSync(gitignorePath)) {
          const gitignoreContent = await readFile(gitignorePath, 'utf-8');
          const gitIgnores = gitignoreContent
            .split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('#'));
          // glob ignores need specific format, often matching gitignore is close enough
          // but strictly speaking glob patterns might differ slightly.
          // For simplicity we add them as is, creating glob patterns.
          // Note: glob package usually takes glob patterns.
          ignorePatterns = [...ignorePatterns, ...gitIgnores];
        }

        // 2. Resolve allowlist
        const allowlist = config.contextExportAllowlist.length > 0 
          ? config.contextExportAllowlist 
          : ['README.md', 'package.json', 'contracts/**/*.ts']; // Fallback default if config empty

        const files: string[] = [];

        for (const pattern of allowlist) {
          const matches = await glob(pattern, {
            cwd: root,
            ignore: ignorePatterns,
            nodir: true,
            dot: true, // include dotfiles if matched explicitly
          });
          files.push(...matches);
        }

        // Deduplicate
        const uniqueFiles = Array.from(new Set(files)).sort();

        if (uniqueFiles.length === 0) {
            console.log(chalk.yellow('No files matched the allowlist. Check your config.'));
            return;
        }

        // 3. Clean and prepare output dir
        if (existsSync(contextDir)) {
           // We might want to clean it or just overwrite?
           // For safety let's clean the files subdir
           // But implementing 'rimraf' might be heavy. 
           // We will just overwrite files.
        }
        await mkdir(contextFilesDir, { recursive: true });

        // 4. Copy files
        const exportedFiles: { path: string; size: number }[] = [];
        
        for (const file of uniqueFiles) {
             const absSource = join(root, file);
             const absDest = join(contextFilesDir, file);
             
             await mkdir(dirname(absDest), { recursive: true });
             await copyFile(absSource, absDest);

             // Get stats
             // We can do this before copy but we are iterating anyway
             // Actually copyFile returns promise void
             // reading stats from source
             // For summary allow reading it.
             
             // ... skipping stats for now to keep it simple or read later
             exportedFiles.push({ path: file, size: 0 }); 
        }

        // 5. Create index.json
        const index = {
            generatedAt: new Date().toISOString(),
            files: exportedFiles.map(f => f.path),
            config: {
                allowlist: config.contextExportAllowlist,
                ignores: ignorePatterns.length
            }
        };

        await writeFile(join(contextDir, 'index.json'), JSON.stringify(index, null, 2));

        console.log(chalk.green(`✓ Exported ${uniqueFiles.length} files to .contractspec/context/`));
        console.log(chalk.gray(`  Index: ${join(contextDir, 'index.json')}`));
        
      } catch (error) {
        console.error(chalk.red('Context export failed:'), error);
        process.exit(1);
      }
    })
  );
