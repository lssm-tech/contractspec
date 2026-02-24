---
name: extract-to-bundle
description: 'Extract logic from apps into reusable bundles or libs'
targets: ['*']
claudecode:
  allowed-tools:
    - 'Bash'
    - 'Read'
    - 'Write'
    - 'Edit'
    - 'Glob'
    - 'Grep'
---

# Extract to Bundle Skill

This skill guides the extraction of business logic from `packages/apps/` (or misplaced locations) into reusable `packages/bundles/` or `packages/libs/`, ensuring the code becomes multi-app ready with proper logging and analytics.

## Usage

Invoke when:

- Business logic is detected in `packages/apps/` (flagged by `/audit-health` or `post-edit-checks` hook)
- A utility or service needs to be shared across multiple apps
- Code duplication is found across packages
- Refactoring from monolithic app code to modular bundle structure

## Process

### Step 1: Analyze Source

Read the source file(s) and identify:

- **What to extract**: Functions, classes, hooks, types, constants
- **Current consumers**: Who imports/uses this code (search for references)
- **Dependencies**: What the code imports (internal and external packages)
- **Side effects**: I/O, database calls, API requests, state mutations

```
Analysis:
- Source: packages/apps/web-application/src/lib/projectService.ts
- Exports: createProject, updateProject, deleteProject, ProjectService class
- Consumers: 3 files in packages/apps/web-application/src/app/
- Dependencies: @contractspec/lib.contracts, prisma, zod
- Side effects: Database writes, external API calls
```

### Step 2: Determine Target Location

Use the package-architecture heuristics to decide where the code should live:

| Code type                         | Target                                                 | Example                  |
| --------------------------------- | ------------------------------------------------------ | ------------------------ |
| Business logic (domain-specific)  | `packages/bundles/<bundle>/src/modules/<domain>/`      | Project CRUD operations  |
| Business UI components            | `packages/bundles/<bundle>/src/presentation/<domain>/` | ProjectCard, ProjectForm |
| Pure utilities (no business deps) | `packages/libs/utils-typescript/src/`                  | formatCurrency, slugify  |
| Shared types/schemas              | `packages/libs/contracts-*/src/`                       | ProjectSchema, UserType  |
| Infrastructure adapters           | `packages/bundles/<bundle>/src/infrastructure/`        | PrismaProjectRepo        |
| Reusable hooks                    | `packages/bundles/<bundle>/src/presentation/<domain>/` | useProjectData           |

Ask the user to confirm the target location before proceeding.

### Step 3: Prepare the Target

1. Check if the target directory exists; create if needed
2. Check if an `index.ts` barrel file exists in the target module
3. Determine the new file name following conventions:
   - Services: `<feature>.service.ts`
   - Types: `types.ts`
   - Hooks: `use<Feature>.ts`
   - Components: `<Feature>.tsx`
   - Utilities: `<name>.util.ts`

### Step 4: Extract and Enhance

Move the code to the new location and enhance it:

1. **Copy the logic** to the target file with proper structure
2. **Add observability** if missing:
   - Import structured logger
   - Add `logger.info` at operation start/end
   - Add `logger.error` in catch blocks
   - Add `analytics.track` for significant operations
3. **Add JSDoc** if missing:
   - Function descriptions
   - Parameter documentation
   - Return type documentation
   - Error documentation
4. **Add types** if missing:
   - Explicit input/output types
   - Proper error types
5. **Update barrel exports** in the target module's `index.ts`

### Step 5: Update Consumers

For each consumer of the original code:

1. **Update imports** to point to the new location:

```typescript
// Before
import { createProject } from '@/lib/projectService';

// After
import { createProject } from '@contractspec/bundle.studio/modules/project';
```

2. **Add backward-compatible re-export** at the original location (with deprecation):

```typescript
// packages/apps/web-application/src/lib/projectService.ts

/**
 * @deprecated Import from @contractspec/bundle.studio/modules/project instead.
 * This re-export will be removed in the next major version.
 */
export {
  createProject,
  updateProject,
  deleteProject,
} from '@contractspec/bundle.studio/modules/project';
```

### Step 6: Add/Update Tests

1. Move or create tests at the new location:
   - `<feature>.test.ts` next to the service file
   - Include logging/analytics mock assertions
2. Ensure existing tests still pass (imports may need updating)
3. If tests don't exist, create basic coverage:
   - Happy path
   - Error handling
   - Logging verification

### Step 7: Verify

Run the following checks in order:

```bash
# 1. Type check
turbo build:types

# 2. Lint
turbo lint

# 3. Tests
turbo test

# 4. Build
turbo build
```

Also verify:

- [ ] No circular dependencies introduced
- [ ] No upward dependency violations (bundle not importing from app)
- [ ] All consumers still compile
- [ ] File sizes within limits at new location
- [ ] Observability instrumentation present

## Example: Extracting a Service

### Before (in apps/)

```
packages/apps/web-application/src/lib/
└── projectService.ts (180 lines, mixed concerns)
```

### After (in bundles/)

```
packages/bundles/contractspec-studio/src/modules/project/
├── index.ts              # Barrel exports
├── types.ts              # ProjectInput, ProjectOutput types
├── project.service.ts    # Business logic with logging + analytics
└── project.test.ts       # Tests with observability assertions

packages/apps/web-application/src/lib/
└── projectService.ts     # Re-export with @deprecated JSDoc
```

## Checklist Before Completion

- [ ] Code extracted to correct architectural layer
- [ ] Observability added (logger + analytics)
- [ ] JSDoc added to public exports
- [ ] Types are explicit (no `any`)
- [ ] Barrel exports updated
- [ ] All consumers updated
- [ ] Deprecated re-export at original location
- [ ] Tests exist and pass at new location
- [ ] TypeScript compiles
- [ ] Lint passes
- [ ] File sizes within limits
- [ ] No circular dependencies

## Output

After extraction, report:

- **Moved**: Source -> Target paths
- **Enhanced**: What was added (logging, analytics, types, docs)
- **Consumers updated**: List of files with changed imports
- **Deprecated**: Re-export location and removal timeline
- **Tests**: Status and coverage
- **Next steps**: Any remaining cleanup or follow-up tasks
