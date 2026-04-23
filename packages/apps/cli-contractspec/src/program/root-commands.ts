import type { Command } from 'commander';
import { actionDriftCommand } from '../commands/action-drift/index';
import { actionPrCommand } from '../commands/action-pr/index';
import { agentCommand } from '../commands/agent/index';
import { builderCommand } from '../commands/builder/index';
import { chatCommand } from '../commands/chat/index';
import { ciCommand } from '../commands/ci/index';
import { cicdCommand } from '../commands/cicd/index';
import { cleanCommand } from '../commands/clean/index';
import { createCompletionCommands } from '../commands/completion';
import { connectCommand } from '../commands/connect/index';
import { controlPlaneCommand } from '../commands/control-plane/index';
import { deleteCommand } from '../commands/delete/index';
import { depsCommand } from '../commands/deps/index';
import { diffCommand } from '../commands/diff/index';
import { createDocsCommand } from '../commands/docs/index';
import { doctorCommand } from '../commands/doctor/index';
import { examplesCommand } from '../commands/examples/index';
import { executionLanesCommand } from '../commands/execution-lanes/index';
import { extractCommand } from '../commands/extract/index';
import { fixCommand } from '../commands/fix/index';
import { gapCommand } from '../commands/gap/index';
import { generateCommand } from '../commands/generate/index';
import { harnessCommand } from '../commands/harness/index';
import { registerHookCommand } from '../commands/hook/index';
import { createImpactCommand } from '../commands/impact/index';
import { createImplCommand } from '../commands/impl/index';
import { importCommand } from '../commands/import/index';
import { initCommand } from '../commands/init/index';
import { integrityCommand } from '../commands/integrity/index';
import { listCommand } from '../commands/list/index';
import { llmCommand } from '../commands/llm/index';
import { onboardCommand } from '../commands/onboard/index';
import { openapiCommand } from '../commands/openapi/index';
import { pluginsCommand } from '../commands/plugins/index';
import { quickstartCommand } from '../commands/quickstart/index';
import { registryCommand } from '../commands/registry/index';
import { createReleaseCommand } from '../commands/release/index';
import { syncCommand } from '../commands/sync/index';
import { updateCommand } from '../commands/update/index';
import { upgradeCommand } from '../commands/upgrade/index';
import { createVersionCommand } from '../commands/version/index';
import { vibeCommand } from '../commands/vibe/index';
import { viewCommand } from '../commands/view/index';
import { watchCommand } from '../commands/watch/index';
import { workspaceCommand } from '../commands/workspace/index';
import {
	CATEGORY_AI,
	CATEGORY_DEVELOPMENT,
	CATEGORY_ECOSYSTEM,
	CATEGORY_ESSENTIALS,
	CATEGORY_INTEGRATION,
	CATEGORY_OPERATIONS,
	CATEGORY_OTHER,
	CATEGORY_TESTING,
	withCategory,
} from './categories';

export function registerRootCommands(
	program: Command,
	getProgram: () => Command
): void {
	const { internalCommand, publicCommand } =
		createCompletionCommands(getProgram);

	program.addCommand(withCategory(initCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(publicCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(createDocsCommand(), CATEGORY_OTHER));
	program.addCommand(withCategory(listCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(quickstartCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(workspaceCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(viewCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(onboardCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(generateCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(extractCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(gapCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(importCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(updateCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(deleteCommand, CATEGORY_ESSENTIALS));
	program.addCommand(withCategory(vibeCommand, CATEGORY_ESSENTIALS));

	program.addCommand(withCategory(watchCommand, CATEGORY_DEVELOPMENT));
	program.addCommand(withCategory(syncCommand, CATEGORY_DEVELOPMENT));
	program.addCommand(withCategory(cleanCommand, CATEGORY_DEVELOPMENT));
	program.addCommand(withCategory(depsCommand, CATEGORY_DEVELOPMENT));
	program.addCommand(withCategory(diffCommand, CATEGORY_DEVELOPMENT));
	program.addCommand(withCategory(createImplCommand(), CATEGORY_DEVELOPMENT));
	program.addCommand(withCategory(fixCommand, CATEGORY_DEVELOPMENT));

	program.addCommand(withCategory(integrityCommand, CATEGORY_TESTING));
	program.addCommand(withCategory(harnessCommand, CATEGORY_TESTING));
	program.addCommand(withCategory(doctorCommand, CATEGORY_TESTING));
	program.addCommand(withCategory(ciCommand, CATEGORY_TESTING));

	program.addCommand(withCategory(llmCommand, CATEGORY_AI));
	program.addCommand(withCategory(chatCommand, CATEGORY_AI));
	program.addCommand(withCategory(agentCommand, CATEGORY_AI));

	program.addCommand(withCategory(builderCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(createImpactCommand(), CATEGORY_OPERATIONS));
	program.addCommand(withCategory(connectCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(controlPlaneCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(executionLanesCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(cicdCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(createVersionCommand(), CATEGORY_OPERATIONS));
	program.addCommand(withCategory(createReleaseCommand(), CATEGORY_OPERATIONS));
	program.addCommand(withCategory(actionPrCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(actionDriftCommand, CATEGORY_OPERATIONS));
	program.addCommand(withCategory(upgradeCommand, CATEGORY_OPERATIONS));

	registerHookCommand(program);
	const hookCommand = program.commands.find(
		(command) => command.name() === 'hook'
	);
	if (hookCommand) {
		withCategory(hookCommand, CATEGORY_OPERATIONS);
	}

	program.addCommand(withCategory(registryCommand, CATEGORY_INTEGRATION));
	program.addCommand(withCategory(openapiCommand, CATEGORY_INTEGRATION));
	program.addCommand(withCategory(examplesCommand, CATEGORY_INTEGRATION));

	program.addCommand(withCategory(pluginsCommand, CATEGORY_ECOSYSTEM));
	program.addCommand(internalCommand, { hidden: true });
}
