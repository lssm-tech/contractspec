import { defineResourceTemplate } from '@lssm/lib.contracts';
import { analyzeIntegrity } from '@lssm/bundle.contractspec-workspace';
import type { WorkspaceAdapters } from '../server';
import z from 'zod';

export function specInventoryResource(adapters: WorkspaceAdapters) {
  return defineResourceTemplate({
    meta: {
      uriTemplate: 'spec://inventory',
      title: 'Spec Inventory',
      description: 'Complete inventory of all contract specs in the workspace',
      mimeType: 'application/json',
      tags: ['contractspec', 'inventory'],
    },
    input: z.object({}),
    resolve: async () => {
      const result = await analyzeIntegrity(adapters, {});
      const inventory = {
        operations: Array.from(result.inventory.operations.values()),
        events: Array.from(result.inventory.events.values()),
        presentations: Array.from(result.inventory.presentations.values()),
        capabilities: Array.from(result.inventory.capabilities.values()),
        workflows: Array.from(result.inventory.workflows.values()),
        dataViews: Array.from(result.inventory.dataViews.values()),
        forms: Array.from(result.inventory.forms.values()),
        migrations: Array.from(result.inventory.migrations.values()),
        experiments: Array.from(result.inventory.experiments.values()),
        integrations: Array.from(result.inventory.integrations.values()),
        knowledge: Array.from(result.inventory.knowledge.values()),
        telemetry: Array.from(result.inventory.telemetry.values()),
        appConfigs: Array.from(result.inventory.appConfigs.values()),
        policies: Array.from(result.inventory.policies.values()),
        testSpecs: Array.from(result.inventory.testSpecs.values()),
      };

      return {
        uri: 'spec://inventory',
        mimeType: 'application/json',
        data: JSON.stringify(inventory, null, 2),
      };
    },
  });
}


