import { Command } from 'commander';
import chalk from 'chalk';
import { mkdir, copyFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, basename } from 'node:path';
import { existsSync } from 'node:fs';
import { findWorkspaceRoot } from '@contractspec/bundle.workspace';

export const vibePackCommand = new Command('pack')
  .description('Manage Vibe packs')
  .addCommand(
    new Command('install')
      .description('Install a vibe pack (local path or registry:name)')
      .argument('<path>', 'Path to pack directory or registry:name')
      .option('--registry-url <url>', 'Override registry URL')
      .action(async (packPath, options) => {
        try {
           const cwd = process.cwd();
           const root = findWorkspaceRoot(cwd) || cwd;
           
           if (packPath.startsWith('registry:')) {
               const packName = packPath.replace('registry:', '');
               console.log(chalk.bold(`\n📦 Installing Pack '${packName}' from Registry...\n`));
               
               // Mock registry fetch for P1 as we don't have a real pack registry yet
               // In real impl:
               // 1. resolveRegistryUrl(options.registryUrl)
               // 2. client.getJson(`/packs/${packName}`)
               // 3. Download tarball and extract to temp dir
               // 4. Install from temp dir
               
               console.log(chalk.yellow('ℹ️  Registry pack install is a simulation for P1 (no backend).'));
               console.log(chalk.gray(`   Would fetch ${packName} from ${options.registryUrl || 'default registry'}`));
               
               // To test this feature effectively without backend, we could check if a local "mock" registry exists or just return success
               // For now, prompt user that this is experimental
               return;
           }

           const absPackPath = resolve(cwd, packPath);
           if (!existsSync(absPackPath)) {
               console.error(chalk.red(`Pack path not found: ${absPackPath}`));
               process.exit(1);
           }
           
           console.log(chalk.bold(`\n📦 Installing Pack from ${absPackPath}...\n`));

           // Install Workflows
           const workflowsSrc = join(absPackPath, 'workflows');
           if (existsSync(workflowsSrc)) {
               const workflowsDest = join(root, '.contractspec', 'vibe', 'workflows');
               await mkdir(workflowsDest, { recursive: true });
               
               const files = await readdir(workflowsSrc);
               let count = 0;
               for (const file of files) {
                   if (file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml')) {
                       await copyFile(join(workflowsSrc, file), join(workflowsDest, file));
                       console.log(chalk.green(`   ✓ Installed workflow: ${file}`));
                       count++;
                   }
               }
               
               if (count === 0) {
                   console.log(chalk.yellow('   No workflows found in pack/workflows.'));
               }
           } else {
               console.log(chalk.yellow('   No workflows directory in pack.'));
           }

           // Install Templates (P0 stub)
           const templatesSrc = join(absPackPath, 'templates');
           if (existsSync(templatesSrc)) {
               const templatesDest = join(root, '.contractspec', 'vibe', 'templates');
               await mkdir(templatesDest, { recursive: true });
               
               // Recursive copy? For minimal P0, shallow copy or just skip complex logic
               // I'll stick to shallow to be safe for now, or just notify user.
               const files = await readdir(templatesSrc);
               for (const file of files) {
                   const srcFile = join(templatesSrc, file);
                   const destFile = join(templatesDest, file);
                   const stats = await stat(srcFile);
                   if (stats.isFile()) {
                       await copyFile(srcFile, destFile);
                       console.log(chalk.green(`   ✓ Installed template: ${file}`));
                   }
               }
           }

           console.log(chalk.bold.green('\n✅ Pack installed successfully!'));

        } catch (error) {
           console.error(chalk.red('\n❌ Error:'), error);
           process.exit(1);
        }
      })
  );
