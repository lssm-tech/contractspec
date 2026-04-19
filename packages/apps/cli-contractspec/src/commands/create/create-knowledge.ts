import chalk from 'chalk';
import { generateKnowledgeSpaceSpec } from '../../templates/knowledge.template';
import type { KnowledgeSpaceSpecData } from '../../types';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { knowledgeWizard } from './wizards/knowledge';
import { writeSpecFile } from './write-spec-file';

export async function createKnowledgeSpec(
	options: CreateOptions,
	config: Config
): Promise<void> {
	const specData: KnowledgeSpaceSpecData = await knowledgeWizard();
	const code = generateKnowledgeSpaceSpec(specData);

	await writeSpecFile({
		specName: specData.name,
		specType: 'knowledge',
		code,
		spinnerText: 'Writing knowledge space spec...',
		options,
		config,
	});

	console.log(chalk.cyan('\n✨ Next steps:'));

	console.log(
		chalk.gray(
			'  1. Register the knowledge space spec in your knowledge registry.'
		)
	);

	console.log(
		chalk.gray(
			'  2. Configure KnowledgeSourceConfig entries and TenantAppConfig bindings.'
		)
	);
}
