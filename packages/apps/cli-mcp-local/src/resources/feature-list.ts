import { defineResourceTemplate } from '@lssm/lib.contracts';
import { analyzeIntegrity } from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';
import z from 'zod';

export function featureListResource(adapters: WorkspaceAdapters) {
  return defineResourceTemplate({
    meta: {
      uriTemplate: 'feature://list',
      title: 'Feature List',
      description: 'List of all features and their linked specs',
      mimeType: 'application/json',
      tags: ['contractspec', 'features'],
    },
    input: z.object({}),
    resolve: async () => {
      const result = await analyzeIntegrity(adapters, {});
      return {
        uri: 'feature://list',
        mimeType: 'application/json',
        data: JSON.stringify(result.features, null, 2),
      };
    },
  });
}


