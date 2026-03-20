import {
	createNodeAdapters,
	generateArtifacts,
} from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import path from 'path';

export const generateCommand = new Command('generate')
	.description('Rebuild derived artifacts from canonical contracts')
	.action(async () => {
		try {
			const adapters = createNodeAdapters({ silent: true });
			const cwd = process.cwd();
			const contractsDir = path.join(cwd, 'contracts');
			const generatedDir = path.join(cwd, 'generated');

			console.log(chalk.bold.blue('\n🏭 ContractSpec Generator\n'));

			// Check if contracts directory exists (Phase 0 check)
			if (!(await adapters.fs.exists(contractsDir))) {
				console.warn(
					chalk.yellow(
						`⚠️  'contracts' directory not found at ${contractsDir}.\n   Using current directory for search, but conventionally contracts should be in 'contracts/'.`
					)
				);
			}

			console.log(chalk.cyan(`🔍 Scaning for specs...`));

			const result = await generateArtifacts(
				adapters,
				contractsDir,
				generatedDir,
				cwd
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

			// Future: OpenAPI, SDKs, etc.

			console.log(chalk.green('\n✅ Generation complete!'));
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
