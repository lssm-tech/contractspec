import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '../../docs/registry';

export const tech_contracts_capabilities_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.capabilities',
    title: 'CapabilitySpec Overview',
    summary:
      'Capability specs define what a module provides (operations, events, presentations) and requires (dependencies). They enable bidirectional linking, inheritance, runtime enforcement, and automated validation.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/capabilities',
    tags: ['tech', 'contracts', 'capabilities'],
    body: `# CapabilitySpec Overview

## Purpose

Capabilities are **module interfaces** that define:
1. What operations, events, and presentations a module exposes (\`provides\`)
2. What other capabilities it depends on (\`requires\`)
3. Inheritance hierarchies via \`extends\`

They enable:
- **Bidirectional linking**: Specs reference capabilities, capabilities list their specs
- **Dependency validation**: Features can't install without satisfying requirements
- **Runtime enforcement**: Check capabilities before executing operations
- **Inheritance**: Build capability hierarchies with shared requirements

## Schema

\`\`\`ts
export interface CapabilitySpec {
  meta: CapabilityMeta;              // ownership metadata + { key, version, kind }
  extends?: CapabilityRef;           // NEW: inherit from parent capability
  provides?: CapabilitySurfaceRef[]; // surfaces this capability exposes
  requires?: CapabilityRequirement[];// capabilities that must exist
}
\`\`\`

### Bidirectional Linking

Operations, events, and presentations can now declare their capability:

\`\`\`ts
// In OperationSpec
{
  meta: { key: 'payments.charge.create', ... },
  capability: { key: 'payments', version: '1.0.0' }, // Links to capability
  io: { ... }
}

// In CapabilitySpec
{
  meta: { key: 'payments', version: '1.0.0', ... },
  provides: [
    { surface: 'operation', key: 'payments.charge.create' }
  ]
}
\`\`\`

Validation ensures both sides match via \`validateCapabilityConsistency()\`.

## Registry Query Methods

The \`CapabilityRegistry\` now provides rich query capabilities:

\`\`\`ts
// Forward lookups: Capability → Specs
registry.getOperationsFor('payments');      // ['payments.charge.create', ...]
registry.getEventsFor('payments');          // ['payments.charge.succeeded', ...]
registry.getPresentationsFor('payments');   // ['payments.dashboard', ...]

// Reverse lookups: Spec → Capabilities
registry.getCapabilitiesForOperation('payments.charge.create');
registry.getCapabilitiesForEvent('payments.charge.succeeded');
registry.getCapabilitiesForPresentation('payments.dashboard');

// Inheritance
registry.getAncestors('payments.stripe');           // Parent chain
registry.getEffectiveRequirements('payments.stripe'); // Includes inherited
registry.getEffectiveSurfaces('payments.stripe');     // Includes inherited
\`\`\`

## Inheritance

Capabilities can extend other capabilities:

\`\`\`ts
// Base capability
defineCapability({
  meta: { key: 'payments.base', version: '1.0.0', ... },
  requires: [{ key: 'auth', version: '1.0.0' }],
  provides: [{ surface: 'operation', key: 'payments.list' }]
});

// Child capability inherits requirements
defineCapability({
  meta: { key: 'payments.stripe', version: '1.0.0', ... },
  extends: { key: 'payments.base', version: '1.0.0' },
  requires: [{ key: 'encryption', version: '1.0.0' }], // Added
  provides: [{ surface: 'operation', key: 'payments.stripe.charge' }]
});

// getEffectiveRequirements('payments.stripe') returns:
// [{ key: 'auth', ... }, { key: 'encryption', ... }]
\`\`\`

## Runtime Enforcement

Use \`CapabilityContext\` for opt-in runtime checks:

\`\`\`ts
import { createCapabilityContext, assertCapabilityForOperation } from '@contractspec/lib.contracts';

// Create context from user's enabled capabilities
const ctx = createCapabilityContext(user.capabilities);

// Check capability
if (ctx.hasCapability('payments')) {
  // User can access payments features
}

// Assert capability (throws if missing)
ctx.requireCapability('payments');

// Guard an operation
assertCapabilityForOperation(ctx, paymentOperation);

// Filter operations by enabled capabilities
const allowedOps = filterOperationsByCapability(ctx, allOperations);
\`\`\`

## Validation

Validate bidirectional consistency between capabilities and specs:

\`\`\`ts
import { validateCapabilityConsistency, findOrphanSpecs } from '@contractspec/lib.contracts';

const result = validateCapabilityConsistency({
  capabilities: capabilityRegistry,
  operations: operationRegistry,
  events: eventRegistry,
  presentations: presentationRegistry,
});

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Find specs without capability assignment (informational)
const orphans = findOrphanSpecs({ capabilities, operations });
\`\`\`

## Feature Integration

During \`installFeature()\`:
1. \`provides\` capabilities must exist in the registry
2. \`requires\` must be satisfied by registered capabilities or local \`provides\`
3. Referenced operations/events/presentations must exist

## Authoring Guidelines

1. **Register capabilities first** before referencing them in features
2. **Use bidirectional linking** - set \`capability\` on specs and list them in \`provides\`
3. **Version consciously** - bump versions on breaking changes
4. **Document dependencies** with \`reason\` strings
5. **Use inheritance** for capability families with shared requirements
6. **Validate during CI** with \`validateCapabilityConsistency()\`

## Error Handling

\`\`\`ts
import { CapabilityMissingError } from '@contractspec/lib.contracts';

try {
  ctx.requireCapability('premium-features');
} catch (err) {
  if (err instanceof CapabilityMissingError) {
    console.log('Missing:', err.capabilityKey);
    console.log('Required version:', err.requiredVersion);
  }
}
\`\`\`

## API Reference

### Types
- \`CapabilitySpec\` - Capability definition
- \`CapabilityRef\` - Reference to a capability (key + version)
- \`CapabilitySurfaceRef\` - Reference to a provided surface
- \`CapabilityRequirement\` - Dependency requirement
- \`CapabilityContext\` - Runtime capability context
- \`CapabilityValidationResult\` - Validation result

### Functions
- \`defineCapability(spec)\` - Define a capability spec
- \`createCapabilityContext(caps)\` - Create runtime context
- \`validateCapabilityConsistency(deps)\` - Validate bidirectional links
- \`findOrphanSpecs(deps)\` - Find specs without capability assignment
- \`assertCapabilityForOperation/Event/Presentation(ctx, spec)\` - Guards
- \`filterOperationsByCapability(ctx, ops)\` - Filter by enabled capabilities
`,
  },
];
registerDocBlocks(tech_contracts_capabilities_DocBlocks);
