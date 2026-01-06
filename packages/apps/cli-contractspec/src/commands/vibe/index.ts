import { Command } from 'commander';
import { vibeInitCommand } from './init';
import { vibeContextCommand } from './context';
import { vibeRunCommand } from './run';
import { vibePackCommand } from './pack';

export const vibeCommand = new Command('vibe')
  .alias('flow')
  .description('Guided workflows for ContractSpec (Vibe Coding)')
  .addCommand(vibeInitCommand)
  .addCommand(vibeRunCommand)
  .addCommand(vibeContextCommand)
  .addCommand(vibePackCommand);



