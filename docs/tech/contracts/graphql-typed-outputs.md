# GraphQL Typed Outputs for Contracts

## Overview

Improved `@lssm/lib.contracts` to automatically generate proper GraphQL object types from `SchemaModel` outputs instead of defaulting to `JSON` scalar types.

## Problem

Previously, when GraphQL operations were defined using contracts with `SchemaModel` outputs, the GraphQL schema would default to returning `JSON` scalar types. This meant:

- GraphQL clients couldn't query specific fields
- No type safety for operation outputs
- Codegen would fail with "must have a selection of subfields" errors

## Solution

### 1. Auto-Type Registration in `graphql-pothos.ts`

**File**: `packages/lssm/libs/contracts/src/server/graphql-pothos.ts`

**Changes**:

- Scan all contract specs and collect their `SchemaModel` outputs
- Automatically register GraphQL object types for each `SchemaModel`
- Map field types from SchemaModel to proper GraphQL scalar types
- Update `resolveGraphQLTypeName` to check for `SchemaModel` names before defaulting to `JSON`

**Key Code**:

```typescript
// Build a map of output types we need to register
const outputTypeCache = new Map<string, AnySchemaModel>();
for (const spec of reg.listSpecs()) {
  const out = spec.io.output as AnySchemaModel | ResourceRefDescriptor<boolean>;
  if (out && 'getZod' in out && typeof out.getZod === 'function') {
    const model = out as AnySchemaModel;
    const typeName = model.config?.name ?? 'UnknownOutput';
    if (!outputTypeCache.has(typeName)) {
      outputTypeCache.set(typeName, model);
    }
  }
}

// Register all output types as GraphQL object types
for (const [typeName, model] of outputTypeCache.entries()) {
  builder.objectType(typeName, {
    fields: (t) => {
      // Map each field from SchemaModel to GraphQL field
      // ...
    },
  });
}
```

### 2. Fix Contract Definitions

**File**: `packages/hcircle/libs/contracts-coliving/src/interactions/onboarding/org/contracts.ts`

**Changes**:

- Changed `GetOrgOnboardingDraftSpec` from `defineCommand` to `defineQuery` (read-only operation)
- Added `defineQuery` import

**Before**:

```typescript
export const GetOrgOnboardingDraftSpec = defineCommand({
  // ...
});
```

**After**:

```typescript
export const GetOrgOnboardingDraftSpec = defineQuery({
  // ...
});
```

### 3. Update All GraphQL Queries

Updated all GraphQL operation calls to select proper subfields based on the output type:

#### Output Types and Their Fields

1. **`CreateOrgOutput`**:
   - `organizationId: ID!`
   - `orgType: String!`

2. **`CompleteUserOnboardingOutput`**:
   - `success: Boolean!`
   - `userId: ID!`

3. **`CompleteOrgOnboardingOutput`**:
   - `success: Boolean!`
   - `organizationId: ID!`
   - `orgType: String!`

4. **`OnboardingDraft`** (from resource_ref):
   - `id: ID!`
   - `organizationId: ID!`
   - `data: JSON!`
   - `createdAt: DateTime!`
   - `updatedAt: DateTime!`

5. **`GetOnboardingDraftOutput`**:
   - `id: ID`
   - `organizationId: ID`
   - `data: JSON`
   - `createdAt: DateTime`
   - `updatedAt: DateTime`

6. **`DeleteOnboardingDraftOutput`**:
   - `ok: Boolean!` _(note: not `success`)_

#### Files Updated

1. `/packages/hcircle/apps/mobile-coliving/src/app/onboarding-org-select.tsx`
2. `/packages/hcircle/apps/mobile-coliving/src/app/onboarding-org.tsx`
3. `/packages/hcircle/apps/mobile-coliving/src/app/onboarding-user.tsx`
4. `/packages/hcircle/apps/web-coliving/src/app/onboarding/user/page.tsx`
5. `/packages/hcircle/apps/web-coliving/src/components/onboarding/OnboardingFlow.tsx`
6. `/packages/hcircle/apps/web-coliving/src/components/onboarding/OrgSelectionFlow.tsx`

**Example Before**:

```graphql
mutation CreateOrg($orgType: String!, $name: String!, $slug: String!) {
  createOrganization(input: { orgType: $orgType, name: $name, slug: $slug })
}
```

**Example After**:

```graphql
mutation CreateOrg($orgType: String!, $name: String!, $slug: String!) {
  createOrganization(input: { orgType: $orgType, name: $name, slug: $slug }) {
    organizationId
    orgType
  }
}
```

## Benefits

1. **Type Safety**: Full type safety for GraphQL operation outputs
2. **Auto-Generated Types**: No need to manually specify `returns` in contract transport config
3. **Better DX**: GraphQL clients can now query specific fields and benefit from autocomplete
4. **Consistency**: All `SchemaModel` outputs are automatically typed in GraphQL
5. **Backward Compatible**: Operations with explicit `returns` config still work as before

## Testing

All GraphQL codegen now passes:

```bash
cd packages/hcircle/libs/gql-client-coliving
bun graphql-codegen --config codegen.ts  # ✅ Success
```

## Migration Guide for Other Verticals

To apply this to other verticals (e.g., Artisanos, Strit):

1. **No code changes needed** - the improved `graphql-pothos.ts` automatically handles all `SchemaModel` outputs
2. **Update GraphQL queries** - Add field selections to queries that previously returned `JSON`
3. **Fix query/command mismatches** - Ensure read-only operations use `defineQuery` instead of `defineCommand`

## Future Improvements

1. Add support for nested `SchemaModel` references (currently only supports scalar fields)
2. Add support for array fields of SchemaModels
3. Consider auto-generating field selections based on the output type to reduce boilerplate

## Related Documentation

- [Contracts README](../../packages/lssm/libs/contracts/README.md)
- [Onboarding System](./hcircle/IMPLEMENTATION_COMPLETE.md)
- [GraphQL Architecture](./graphql/architecture.md)
