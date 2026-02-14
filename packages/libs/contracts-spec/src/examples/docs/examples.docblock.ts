import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../docs/registry';

export const tech_contracts_examples_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.examples',
    title: 'Example Specifications',
    summary:
      'ExampleSpec defines complete, demonstrable ContractSpec applications.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/examples',
    tags: ['tech', 'contracts', 'examples', 'templates'],
    body: `## Example Specifications

ExampleSpec is a contract for defining complete, demonstrable ContractSpec applications. Examples integrate with AppBlueprintSpec and FeatureModuleSpec to provide a full application specification.

### Overview

An \`ExampleSpec\` captures:
- **Metadata** (via \`ExampleMeta\` extending \`OwnerShipMeta\`): key, version, title, description, ownership, tags, stability
- **Example-specific fields**: kind, visibility, summary
- **Surfaces**: where the example can be used (templates, sandbox, studio, MCP)
- **Entrypoints**: package exports mapping
- **Blueprint**: optional AppBlueprintSpec or reference
- **Features**: optional FeatureModuleSpec array or references

### Usage

\`\`\`typescript
import type { ExampleSpec } from '@contractspec/lib.contracts-spec';
import { ExampleRegistry, validateExample } from '@contractspec/lib.contracts-spec';

const example: ExampleSpec = {
  meta: {
    key: 'saas-boilerplate',
    version: '1.0.0',
    title: 'SaaS Boilerplate',
    description: 'Multi-tenant SaaS foundation with billing and RBAC.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@saas-team'],
    tags: ['saas', 'multi-tenant', 'billing'],
    summary: 'Complete SaaS starter.',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'specs', 'builder'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
  entrypoints: {
    packageName: '@contractspec/example.saas-boilerplate',
    feature: './saas-boilerplate.feature',
    contracts: './contracts',
  },
  features: [SaasBoilerplateFeature],
};
\`\`\`

### ExampleRegistry

Use \`ExampleRegistry\` to manage examples:

\`\`\`typescript
const registry = new ExampleRegistry();
registry.register(example);

// Query examples
registry.listByKind('template');
registry.listByVisibility('public');
registry.listBySurface('studio');
registry.listInstallable();
registry.search('billing');
\`\`\`

### ExampleMeta

\`ExampleMeta\` extends \`OwnerShipMeta\` with example-specific fields:

| Field | Type | Description |
|-------|------|-------------|
| key | string | Unique identifier |
| version | number | Spec version |
| title | string? | Human-readable title |
| description | string | Technical description |
| kind | ExampleKind | template, workflow, integration, etc. |
| visibility | ExampleVisibility | public, internal, experimental |
| stability | Stability | idea, experimental, beta, stable, deprecated |
| owners | string[] | Owner identifiers |
| tags | string[] | Discovery tags |
| summary | string? | Marketing summary |

### ExampleKind

| Kind | Use Case |
|------|----------|
| template | Full application template |
| workflow | Workflow automation example |
| integration | Integration showcase |
| knowledge | Knowledge base example |
| blueprint | App blueprint example |
| ui | UI component showcase |
| script | CLI/script example |
| library | Library/SDK example |

### Surfaces

| Surface | Purpose |
|---------|---------|
| templates | Available as new project template |
| sandbox | Interactive playground support |
| studio | ContractSpec Studio support |
| mcp | Model Context Protocol support |

### Validation

\`\`\`typescript
import { validateExample, validateExamples } from '@contractspec/lib.contracts-spec';

const result = validateExample(example);
if (!result.valid) {
  console.error(result.errors);
}

// Batch validation with duplicate detection
const batchResult = validateExamples([example1, example2]);
\`\`\`

### Integration with Blueprints and Features

Examples can reference or embed blueprints and features:

\`\`\`typescript
const example: ExampleSpec = {
  // ... meta, surfaces, entrypoints
  
  // Inline blueprint
  blueprint: myAppBlueprint,
  
  // Or reference by pointer
  blueprint: { key: 'core.app', version: '1.0.0' },
  
  // Inline features
  features: [MyFeature],
  
  // Or reference
  features: [{ key: 'my-feature' }],
};
\`\`\`

### Related

- [App Configuration](file:///docs/tech/contracts/app-config) - AppBlueprintSpec
- [Features](file:///docs/tech/contracts/features) - FeatureModuleSpec
`,
  },
];

registerDocBlocks(tech_contracts_examples_DocBlocks);
