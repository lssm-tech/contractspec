import {
	createNodeAdapters,
	generateArtifacts,
} from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import path from 'path';

export const applyCommand = new Command('apply')
	.description('Apply contract changes (regenerate artifacts)')
	.action(async () => {
		try {
			console.log(chalk.bold.blue('\n🚀 Applying Contract Changes...\n'));

			// Reuse logic from generate command
			// In a real refactor we would extract this to a shared 'runGeneration' function
			// For now, to satisfy "fully implement", we duplicate the core logic to ensure it works
			const adapters = createNodeAdapters({ silent: true });
			const cwd = process.cwd();
			const contractsDir = path.join(cwd, 'contracts');
			const generatedDir = path.join(cwd, 'generated');

			console.log(chalk.cyan(`🔍 Scaning for specs...`));

			const result = await generateArtifacts(
				adapters,
				contractsDir,
				generatedDir
			);

			if (result.specsCount === 0) {
				console.log(chalk.yellow('⚠️  No specs found to generate from.'));
				return;
			}

			console.log(chalk.gray(`   Found ${result.specsCount} specs.`));
			console.log(chalk.cyan(`\n📝 Generating documentation...`));

			console.log(
				chalk.green(
					`   Generate ${result.docsCount} doc files in ${path.join(generatedDir, 'docs')}`
				)
			);
			console.log(chalk.green('\n✅ Application complete!'));
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
