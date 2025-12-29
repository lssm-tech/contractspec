import { defineFeature } from '@contractspec/lib.contracts';
import { initOperation } from '../operations/init.operation';
import { validateOperation } from '../operations/validate.operation';
import { testOperation } from '../operations/test.operation';

export const cliFeature = defineFeature({
  meta: {
    key: 'workspace-cli',
    title: 'ContractSpec Workspace CLI',
    description: 'Core CLI operations for managing ContractSpec workspaces',
    version: '1.0.0',
    stability: 'stable',
    tags: ['cli', 'core'],
    owners: ['@lssm/core'],
  },
  operations: [initOperation.meta, validateOperation.meta, testOperation.meta],
});
