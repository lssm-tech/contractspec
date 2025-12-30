import { Command } from 'commander';
import { exportCommand } from './export';
import { importCommand } from './import';
import { syncCommand } from './sync';
import { validateCommand } from './validate';

/**
 * OpenAPI command group for import, export, sync, and validate operations.
 */
export const openapiCommand = new Command('openapi')
  .description('OpenAPI operations: import, export, sync, validate')
  .addCommand(exportCommand)
  .addCommand(importCommand)
  .addCommand(syncCommand)
  .addCommand(validateCommand);
