import { Command } from 'commander';
import { vibeContextCommand } from './context';
import { vibeInitCommand } from './init';
import { vibePackCommand } from './pack';
import { vibeRunCommand } from './run';

export const vibeCommand = new Command('vibe')
	.alias('flow')
	.description('Guided workflows for ContractSpec (Vibe Coding)')
	.addCommand(vibeInitCommand)
	.addCommand(vibeRunCommand)
	.addCommand(vibeContextCommand)
	.addCommand(vibePackCommand);
