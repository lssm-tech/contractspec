import type { Owner, Stability, Tag } from '../ownership';

export type ContractRegistryItemType =
  | 'contractspec:operation'
  | 'contractspec:event'
  | 'contractspec:presentation'
  | 'contractspec:form'
  | 'contractspec:feature'
  | 'contractspec:workflow'
  | 'contractspec:template'
  | 'contractspec:integration'
  | 'contractspec:data-view';

export type JsonSchema = unknown;

export interface ContractRegistryFile {
  /** Path relative to the registry project root */
  path: string;
  /**
   * File classification (kept open-ended to remain ejectable and compatible
   * with multiple consumers).
   *
   * Examples: 'registry:component', 'contractspec:spec', 'registry:lib'
   */
  type: string;
  /** Optional inline content (if serving without file hosting) */
  content?: string;
}

export interface ContractRegistryItem {
  name: string;
  type: ContractRegistryItemType;
  version: number;
  title: string;
  description: string;
  meta: {
    stability: Stability;
    owners: Owner[];
    tags: Tag[];
  };
  dependencies?: string[];
  registryDependencies?: string[];
  files: ContractRegistryFile[];
  schema?: {
    input?: JsonSchema;
    output?: JsonSchema;
  };
}

export interface ContractRegistryManifest {
  /** Optional JSON-schema reference for tooling */
  $schema?: string;
  name: string;
  homepage?: string;
  items: ContractRegistryItem[];
}


