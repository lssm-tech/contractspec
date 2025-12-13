import { Command } from 'commander';
import { registryAddCommand } from './add';
import { registryListCommand } from './list';
import { registrySearchCommand } from './search';

export const registryCommand = new Command('registry')
  .description('Interact with the ContractSpec registry')
  .addCommand(registryAddCommand)
  .addCommand(registryListCommand)
  .addCommand(registrySearchCommand);


