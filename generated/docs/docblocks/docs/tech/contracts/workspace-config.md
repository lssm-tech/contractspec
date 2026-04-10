## Workspace Configuration (.contractsrc)

ContractSpec uses a hierarchical configuration system anchored by `.contractsrc.json` files. Configuration loader supports standard rc-file discovery (cosmiconfig).

### Schema Formats

The `schemaFormat` option controls the output format of schema generation commands (like `contractspec openapi import`).

Supported formats:
- `contractspec` (default): Generates standard `defineSchemaModel` code.
- `zod`: Generates raw Zod schemas using `z.object({...})`.
- `json-schema`: Generates JSON Schema definitions.
- `graphql`: Generates GraphQL SDL type definitions.

### Config Interface

```ts
export interface ContractsrcConfig {
  // ... existing fields ...
  schemaFormat?: 'contractspec' | 'zod' | 'json-schema' | 'graphql';
}
```

Defined in `@contractspec/lib.contracts-spec/workspace-config`.

### Connect

The `connect` section configures ContractSpec Connect as a codebase-aligned adapter layer inside the existing CLI and runtime stack.

```ts
export interface ContractsrcConfig {
  connect?: {
    enabled?: boolean;
    adapters?: {
      cursor?: { enabled?: boolean; mode?: 'plugin' | 'rule' | 'wrapper' };
      codex?: { enabled?: boolean; mode?: 'plugin' | 'rule' | 'wrapper' };
      'claude-code'?: { enabled?: boolean; mode?: 'plugin' | 'rule' | 'wrapper' };
    };
    storage?: {
      root?: string;
      contextPack?: string;
      planPacket?: string;
      patchVerdict?: string;
      auditFile?: string;
      reviewPacketsDir?: string;
    };
    policy?: {
      protectedPaths?: string[];
      immutablePaths?: string[];
      generatedPaths?: string[];
      smokeChecks?: string[];
      reviewThresholds?: {
        protectedPathWrite?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        unknownImpact?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        contractDrift?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        breakingChange?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        destructiveCommand?: 'permit' | 'rewrite' | 'require_review' | 'deny';
      };
    };
    commands?: {
      allow?: string[];
      review?: string[];
      deny?: string[];
    };
    canonPacks?: Array<{ ref: string; readOnly?: boolean }>;
    studio?: { enabled?: boolean; mode?: 'off' | 'review-bridge'; endpoint?: string; queue?: string };
  };
}
```
