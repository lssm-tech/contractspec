import {
	createNodeAdapters,
	generateArtifacts,
} from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfig } from '../../utils/config';

export const generateCommand = new Command('generate')
	.description('Generate docs and derived artifacts from authored targets')
	.action(async () => {
		try {
			const config = await loadConfig();
			const adapters = createNodeAdapters({ config, silent: true });
			const cwd = process.cwd();

			console.log(chalk.bold.blue('\n🏭 ContractSpec Generator\n'));

			console.log(chalk.cyan(`🔍 Scaning for specs...`));

			const result = await generateArtifacts(adapters, cwd, 'generated', cwd, {
				config,
				includeRuntimeTests: true,
			});

			if (result.specsCount === 0) {
				console.log(chalk.yellow('⚠️  No specs found to generate from.'));
				return;
			}

			console.log(chalk.gray(`   Found ${result.specsCount} specs.`));
			console.log(chalk.cyan(`\n📝 Generating materialized artifacts...`));

			console.log(
				chalk.green(
					`   Generated ${result.docsCount} docs and ${result.materializedCount} additional artifacts`
				)
			);

			console.log(chalk.green('\n✅ Generation complete!'));
		} catch (error) {
			console.error(
				chalk.red('\n❌ Error:'),
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	});
