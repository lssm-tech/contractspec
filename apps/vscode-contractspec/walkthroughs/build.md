# Building from Specs

ContractSpec generates implementation code from your specifications, creating handler skeletons, components, and test files.

## Building from Current Spec

With a spec file open:

1. Run `ContractSpec: Build/Scaffold from Current Spec`
   - Command Palette
   - Editor title bar **🔨** icon
   - Right-click context menu

2. Select what to generate:
   - **Handler** — Implementation skeleton for operations
   - **Component** — React component for presentations
   - **Test** — Test file with basic structure
   - **All** — Generate everything

3. Choose overwrite behavior:
   - **Skip existing** — Don't overwrite existing files (safe)
   - **Overwrite** — Replace existing files (use with caution)

## What Gets Generated

### For Operation Specs (Commands/Queries)

Generated handler file: `src/handlers/{name}.handler.ts`

```typescript
/**
 * Generated handler for user.signup
 * 
 * DO NOT EDIT: This file is generated from the spec.
 * If you need to make changes, update the spec and regenerate.
 */

import { UserSignupSpec } from '../contracts/user-signup.contracts';

export async function userSignupHandler(
  input: typeof UserSignupSpec.io.input
): Promise<typeof UserSignupSpec.io.output> {
  // TODO: Implement user.signup logic
  
  // Validate input
  // Execute business logic
  // Return output
  
  throw new Error('Not implemented');
}
```

### For Presentation Specs

Generated component file: `src/components/{Name}.tsx`

```typescript
/**
 * Generated component for user-profile-card
 * 
 * DO NOT EDIT: This file is generated from the spec.
 * If you need to make changes, update the spec and regenerate.
 */

import React from 'react';

interface UserProfileCardProps {
  // Props from spec
}

export const UserProfileCard: React.FC<UserProfileCardProps> = (props) => {
  // TODO: Implement component
  
  return (
    <div>
      {/* Component markup */}
    </div>
  );
};
```

## Build Results View

Generated files appear in the **Build Results** sidebar view:
- ✅ Success/failure status
- 📁 Output file paths
- 🔄 Quick actions to rebuild
- 👁️ Click to open generated file

## Sync All Specs

To regenerate your entire codebase:

1. Run `ContractSpec: Sync All Specs`
2. Optionally validate before building
3. Watch progress in the notification
4. Review results in Build Results view

This is useful after:
- Updating multiple specs
- Pulling changes from git
- Switching branches

## Safe Regeneration

ContractSpec ensures safe regeneration:

- **Deterministic output** — Same spec = same code
- **Spec-first** — Specs are the source of truth
- **Standard tech** — Generated code is readable TypeScript
- **Ejectable** — You own the generated code

## Watch Mode

For continuous development:

1. Enable watch mode with `ContractSpec: Toggle Watch Mode`
2. Choose action on change:
   - Validate only
   - Build only
   - Both

3. Specs auto-rebuild when changed
4. Status bar shows watch mode active
5. Toggle off when done

## Next Steps

- 🔍 **Explore specs** in the Specs Explorer sidebar
- 🔗 **Analyze dependencies** to understand relationships
- 🧹 **Clean generated files** when needed
- 📤 **Export to OpenAPI** for API documentation

Happy building! 🚀

