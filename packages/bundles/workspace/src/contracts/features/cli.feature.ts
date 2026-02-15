import { defineFeature } from '@contractspec/lib.contracts-spec';

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
  operations: [
    { key: 'init', version: '1.0.0' },
    { key: 'validate', version: '1.0.0' },
    { key: 'test', version: '1.0.0' },
  ],
});
