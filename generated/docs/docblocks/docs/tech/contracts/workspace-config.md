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

### CI Package Declaration Coverage

The `ci.packageDeclarations` section lets workspaces stage package-level contract declaration enforcement across the monorepo.

```ts
export interface ContractsrcConfig {
  ci?: {
    packageDeclarations?: {
      severity?: 'off' | 'warning' | 'error';
      requiredByKind?: {
        libs?: 'feature';
        modules?: 'feature';
        integrations?: 'integration';
        bundles?: 'module-bundle';
        apps?: 'app-config';
        appsRegistry?: 'app-config';
        examples?: 'example';
      };
      allowMissing?: string[];
    };
  };
}
```

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
    adoption?: {
      enabled?: boolean;
      catalog?: {
        indexPath?: string;
        overrideManifestPath?: string;
      };
      workspaceScan?: {
        include?: string[];
        exclude?: string[];
      };
      families?: {
        ui?: boolean;
        contracts?: boolean;
        integrations?: boolean;
        runtime?: boolean;
        sharedLibs?: boolean;
        solutions?: boolean;
      };
      thresholds?: {
        workspaceReuse?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        contractspecReuse?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        ambiguous?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        newExternalDependency?: 'permit' | 'rewrite' | 'require_review' | 'deny';
        newImplementation?: 'permit' | 'rewrite' | 'require_review' | 'deny';
      };
    };
  };
}
```

### Builder

The `builder` section configures preset-driven Builder onboarding without requiring live bootstrap during setup.

```ts
export interface ContractsrcConfig {
  builder?: {
    enabled?: boolean;
    runtimeMode?: 'managed' | 'local' | 'hybrid';
    bootstrapPreset?: 'managed_mvp' | 'local_daemon_mvp' | 'hybrid_mvp';
    api?: {
      baseUrl?: string;
      controlPlaneTokenEnvVar?: string;
    };
    localRuntime?: {
      runtimeId?: string;
      grantedTo?: string;
      providerIds?: string[];
    };
  };
}
```
