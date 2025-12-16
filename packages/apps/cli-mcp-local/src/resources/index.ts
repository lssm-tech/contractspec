import type { ResourceRegistry } from '@lssm/lib.contracts';
import type { WorkspaceAdapters } from '../server';
import { featureListResource } from './feature-list';
import { specInventoryResource } from './spec-inventory';
import { workspaceConfigResource } from './workspace-config';

export function registerMcpLocalResources(reg: ResourceRegistry, adapters: WorkspaceAdapters): void {
  reg.register(specInventoryResource(adapters));
  reg.register(featureListResource(adapters));
  reg.register(workspaceConfigResource(adapters));
}


