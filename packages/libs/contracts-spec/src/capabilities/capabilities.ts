import { compareVersions } from 'compare-versions';
import type { OwnerShipMeta } from '../ownership';
import type { VersionedSpecRef } from '../versioning';

/** Classification of capability types. */
import type { DocBlock } from '../docs/types';
export type CapabilityKind = 'api' | 'event' | 'data' | 'ui' | 'integration';

/** Surfaces where capabilities can be exposed or consumed. */
export type CapabilitySurface =
	| 'operation'
	| 'event'
	| 'workflow'
	| 'presentation'
	| 'resource';

/**
 * Reference to a capability on a specific surface.
 * Extends VersionedSpecRef with surface and description context.
 */
export interface CapabilitySurfaceRef {
	/** The surface type where this capability is exposed. */
	surface: CapabilitySurface;
	/** Unique key identifying the spec on that surface (e.g., operation key). */
	key: string;
	/** Semantic version of the spec on that surface. */
	version?: string;
	/** Optional description of what this capability provides. */
	description?: string;
}

/** Metadata for a capability spec, extending ownership with kind. */
export interface CapabilityMeta extends OwnerShipMeta {
	/** The kind/category of this capability. */
	kind: CapabilityKind;
}

/**
 * Requirement for a capability dependency.
 * Used to declare what capabilities a spec needs.
 */
export interface CapabilityRequirement {
	/** Unique key of the required capability. */
	key: string;
	/** Optional specific version required. */
	version?: string;
	/** Optional kind filter for the requirement. */
	kind?: CapabilityKind;
	/** If true, the requirement is optional and won't block if missing. */
	optional?: boolean;
	/** Human-readable reason why this capability is required. */
	reason?: string;
}

/**
 * Reference to a capability spec.
 * Uses key and version to identify a specific capability.
 */
export type CapabilityRef = VersionedSpecRef;

export interface CapabilitySpec {
	meta: CapabilityMeta;
	/** Capabilities this capability extends (inherits requirements from). */
	extends?: CapabilityRef;
	/** Surfaces (operations, events, presentations, etc.) this capability provides. */
	provides?: CapabilitySurfaceRef[];
	/** Capabilities that must be present for this capability to function. */
	requires?: CapabilityRequirement[];
}

const capKey = (key: string, version: string) => `${key}.v${version}`;

export class CapabilityRegistry {
	private readonly items = new Map<string, CapabilitySpec>();
	/** Reverse index: surface key -> capability key (built lazily) */
	private surfaceIndex: Map<string, Set<string>> | null = null;

	register(spec: CapabilitySpec): this {
		const key = capKey(spec.meta.key, spec.meta.version);
		if (this.items.has(key)) throw new Error(`Duplicate capability ${key}`);
		this.items.set(key, spec);
		// Invalidate reverse index on registration
		this.surfaceIndex = null;
		return this;
	}

	list(): CapabilitySpec[] {
		return [...this.items.values()];
	}

	get(key: string, version?: string): CapabilitySpec | undefined {
		if (version != null) return this.items.get(capKey(key, version));
		let candidate: CapabilitySpec | undefined;
		for (const spec of this.items.values()) {
			if (spec.meta.key !== key) continue;
			if (
				!candidate ||
				compareVersions(spec.meta.version, candidate.meta.version) > 0
			) {
				candidate = spec;
			}
		}
		return candidate;
	}

	satisfies(
		requirement: CapabilityRequirement,
		additional?: CapabilityRef[] | undefined
	): boolean {
		if (requirement.optional) return true;
		if (additional?.some((ref) => matchesRequirement(ref, requirement)))
			return true;
		const spec = requirement.version
			? this.get(requirement.key, requirement.version)
			: this.get(requirement.key);
		if (!spec) return false;
		if (requirement.kind && spec.meta.kind !== requirement.kind) return false;
		if (
			requirement.version != null &&
			spec.meta.version !== requirement.version
		)
			return false;
		return true;
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Query Methods: Surface to Capability lookups
	// ─────────────────────────────────────────────────────────────────────────────

	/** Build reverse index from surface specs to capabilities. */
	private buildSurfaceIndex(): Map<string, Set<string>> {
		if (this.surfaceIndex) return this.surfaceIndex;
		this.surfaceIndex = new Map();
		for (const spec of this.items.values()) {
			const capabilityKey = capKey(spec.meta.key, spec.meta.version);
			for (const surface of spec.provides ?? []) {
				const surfaceKey = `${surface.surface}:${surface.key}`;
				if (!this.surfaceIndex.has(surfaceKey)) {
					this.surfaceIndex.set(surfaceKey, new Set());
				}
				this.surfaceIndex.get(surfaceKey)?.add(capabilityKey);
			}
		}
		return this.surfaceIndex;
	}

	/** Get all operation keys provided by a capability. */
	getOperationsFor(capabilityKey: string, version?: string): string[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];
		return (
			spec.provides
				?.filter((s) => s.surface === 'operation')
				.map((s) => s.key) ?? []
		);
	}

	/** Get all event keys provided by a capability. */
	getEventsFor(capabilityKey: string, version?: string): string[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];
		return (
			spec.provides?.filter((s) => s.surface === 'event').map((s) => s.key) ??
			[]
		);
	}

	/** Get all presentation keys provided by a capability. */
	getPresentationsFor(capabilityKey: string, version?: string): string[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];
		return (
			spec.provides
				?.filter((s) => s.surface === 'presentation')
				.map((s) => s.key) ?? []
		);
	}

	/** Get all workflow keys provided by a capability. */
	getWorkflowsFor(capabilityKey: string, version?: string): string[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];
		return (
			spec.provides
				?.filter((s) => s.surface === 'workflow')
				.map((s) => s.key) ?? []
		);
	}

	/** Get all resource keys provided by a capability. */
	getResourcesFor(capabilityKey: string, version?: string): string[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];
		return (
			spec.provides
				?.filter((s) => s.surface === 'resource')
				.map((s) => s.key) ?? []
		);
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Query Methods: Capability to Surface lookups (reverse)
	// ─────────────────────────────────────────────────────────────────────────────

	/** Get capability refs that provide a specific operation. */
	getCapabilitiesForOperation(operationKey: string): CapabilityRef[] {
		const index = this.buildSurfaceIndex();
		const capKeys = index.get(`operation:${operationKey}`);
		if (!capKeys) return [];
		return [...capKeys].map((k) => {
			const spec = this.items.get(k);
			return { key: spec?.meta.key ?? '', version: spec?.meta.version ?? '' };
		});
	}

	/** Get capability refs that provide a specific event. */
	getCapabilitiesForEvent(eventKey: string): CapabilityRef[] {
		const index = this.buildSurfaceIndex();
		const capKeys = index.get(`event:${eventKey}`);
		if (!capKeys) return [];
		return [...capKeys].map((k) => {
			const spec = this.items.get(k);
			return { key: spec?.meta.key ?? '', version: spec?.meta.version ?? '' };
		});
	}

	/** Get capability refs that provide a specific presentation. */
	getCapabilitiesForPresentation(presentationKey: string): CapabilityRef[] {
		const index = this.buildSurfaceIndex();
		const capKeys = index.get(`presentation:${presentationKey}`);
		if (!capKeys) return [];
		return [...capKeys].map((k) => {
			const spec = this.items.get(k);
			return { key: spec?.meta.key ?? '', version: spec?.meta.version ?? '' };
		});
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Inheritance Methods
	// ─────────────────────────────────────────────────────────────────────────────

	/** Get the ancestor chain for a capability (from immediate parent to root). */
	getAncestors(capabilityKey: string, version?: string): CapabilitySpec[] {
		const ancestors: CapabilitySpec[] = [];
		const visited = new Set<string>();
		let current = this.get(capabilityKey, version);

		while (current?.extends) {
			const parentKey = capKey(current.extends.key, current.extends.version);
			if (visited.has(parentKey)) {
				// Circular inheritance detected, break
				break;
			}
			visited.add(parentKey);
			const parent = this.get(current.extends.key, current.extends.version);
			if (!parent) break;
			ancestors.push(parent);
			current = parent;
		}

		return ancestors;
	}

	/**
	 * Get effective requirements for a capability, including inherited ones.
	 * Requirements from ancestors are included, with child requirements taking
	 * precedence over parent requirements for the same key.
	 */
	getEffectiveRequirements(
		capabilityKey: string,
		version?: string
	): CapabilityRequirement[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];

		const ancestors = this.getAncestors(capabilityKey, version);
		const requirementMap = new Map<string, CapabilityRequirement>();

		// Start from root ancestor (reverse order)
		for (const ancestor of [...ancestors].reverse()) {
			for (const req of ancestor.requires ?? []) {
				requirementMap.set(req.key, req);
			}
		}

		// Add/override with own requirements
		for (const req of spec.requires ?? []) {
			requirementMap.set(req.key, req);
		}

		return [...requirementMap.values()];
	}

	/**
	 * Get all surfaces provided by a capability, including inherited ones.
	 */
	getEffectiveSurfaces(
		capabilityKey: string,
		version?: string
	): CapabilitySurfaceRef[] {
		const spec = this.get(capabilityKey, version);
		if (!spec) return [];

		const ancestors = this.getAncestors(capabilityKey, version);
		const surfaces: CapabilitySurfaceRef[] = [];

		// Collect from ancestors first (root to immediate parent)
		for (const ancestor of [...ancestors].reverse()) {
			surfaces.push(...(ancestor.provides ?? []));
		}

		// Add own surfaces
		surfaces.push(...(spec.provides ?? []));

		return surfaces;
	}
}

function matchesRequirement(
	ref: CapabilityRef,
	requirement: CapabilityRequirement
) {
	if (ref.key !== requirement.key) return false;
	if (requirement.version != null && ref.version !== requirement.version)
		return false;
	return true;
}

export function capabilityKey(spec: CapabilitySpec) {
	return capKey(spec.meta.key, spec.meta.version);
}

export function defineCapability(spec: CapabilitySpec): CapabilitySpec {
	return spec;
}

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
