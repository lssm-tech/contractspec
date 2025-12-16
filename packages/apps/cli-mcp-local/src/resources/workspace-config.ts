import { defineResourceTemplate } from '@lssm/lib.contracts';
import { loadWorkspaceConfig } from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';
import z from 'zod';

export function workspaceConfigResource(adapters: WorkspaceAdapters) {
  return defineResourceTemplate({
    meta: {
      uriTemplate: 'config://workspace',
      title: 'Workspace Config',
      description: 'Resolved workspace configuration (.contractsrc.json)',
      mimeType: 'application/json',
      tags: ['contractspec', 'config'],
    },
    input: z.object({}),
    resolve: async () => {
      const cfg = await loadWorkspaceConfig(adapters.fs);
      return {
        uri: 'config://workspace',
        mimeType: 'application/json',
        data: JSON.stringify(cfg, null, 2),
      };
    },
  });
}
